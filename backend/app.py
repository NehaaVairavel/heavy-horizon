from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader
import bcrypt, jwt, os
from datetime import datetime, timedelta, timezone
from functools import wraps
from bson import ObjectId

load_dotenv()

# Use absolute path for static files
base_dir = os.path.abspath(os.path.dirname(__file__))
static_folder = os.path.join(base_dir, 'dist')
print(f"DEBUG: Static folder is {static_folder}")

app = Flask(__name__, static_folder=static_folder, static_url_path='/')
CORS(app) # Simplified CORS for same-origin deployment


app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

# MongoDB
client = MongoClient(os.getenv("MONGO_URI"))
db = client["heavyhorizon"]

machines = db["machines"]
blogs = db["blogs"]
parts = db["parts"]
enquiries = db["enquiries"]
admins = db["admins"]

# Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

# ---------------- AUTH ----------------
def token_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            # If a browser navigates to a protected route directly (like /admin/enquiries)
            # serve the frontend so React Router can handle the login redirect UI
            if request.method == "GET" and "text/html" in request.headers.get("Accept", ""):
                return send_from_directory(app.static_folder, 'index.html')
            return jsonify({"error": "Token missing"}), 401
        try:
            token_val = token.split(" ")[1] if " " in token else token
            jwt.decode(token_val, app.config["SECRET_KEY"], algorithms=["HS256"])
        except:
            if request.method == "GET" and "text/html" in request.headers.get("Accept", ""):
                return send_from_directory(app.static_folder, 'index.html')
            return jsonify({"error": "Invalid token"}), 401
        return f(*args, **kwargs)
    return wrapper

# Create admin once
if not admins.find_one({"email": os.getenv("ADMIN_EMAIL")}):
    admins.insert_one({
        "email": os.getenv("ADMIN_EMAIL"),
        "password": bcrypt.hashpw(os.getenv("ADMIN_PASSWORD").encode(), bcrypt.gensalt())
    })

# ---------------- ADMIN LOGIN ----------------
@app.route("/admin/login", methods=["POST"])
def admin_login():
    data = request.json
    admin = admins.find_one({"email": data["email"]})
    if admin and bcrypt.checkpw(data["password"].encode(), admin["password"]):
        token = jwt.encode({
            "email": admin["email"],
            "exp": datetime.utcnow() + timedelta(hours=8)
        }, app.config["SECRET_KEY"], algorithm="HS256")
        return jsonify({"token": token})
    return jsonify({"error": "Invalid credentials"}), 401

# ---------------- IMAGE UPLOAD ----------------
@app.route("/admin/upload", methods=["POST"])
@token_required
def upload_images():
    files = request.files.getlist("images")
    urls = []
    for file in files:
        res = cloudinary.uploader.upload(file, folder="heavy_horizon")
        # Return only the URL as requested
        urls.append(res["secure_url"])
    return jsonify(urls)

# Helper for Cloudinary Cleanup
def delete_cloudinary_images(image_list):
    """
    Deletes images from Cloudinary based on an array of image URLs.
    Extracts public_id from URL if possible.
    """
    if not image_list or not isinstance(image_list, list):
        return

    for img_url in image_list:
        if isinstance(img_url, str) and "cloudinary.com" in img_url:
            try:
                # Extract public_id: https://res.cloudinary.com/cloud_name/image/upload/v12345/folder/public_id.jpg
                # This is a simplified extraction
                parts = img_url.split('/')
                filename = parts[-1].split('.')[0]
                # Assuming images are in 'heavy_horizon' folder
                public_id = f"heavy_horizon/{filename}"
                cloudinary.uploader.destroy(public_id)
                print(f"DEBUG: Deleted Cloudinary image {public_id}")
            except Exception as e:
                print(f"ERROR: Failed to delete Cloudinary image from URL {img_url}: {e}")

# ---------------- MACHINES ----------------
@app.route("/api/machines", methods=["GET"])
def get_machines():
    q = {}
    if request.args.get("type"):
        q["type"] = request.args.get("type")
    if request.args.get("category"):
        q["category"] = request.args.get("category")

    try:
        data = []
        for m in machines.find(q):
            m["_id"] = str(m["_id"])
            data.append(m)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/machines/<id>", methods=["GET"])
def get_machine(id):
    try:
        machine = machines.find_one({"_id": ObjectId(id)})
        if not machine:
            return jsonify({"error": "Machine not found"}), 404
        machine["_id"] = str(machine["_id"])
        return jsonify(machine)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/admin/machines", methods=["POST"])
@token_required
def add_machine():
    try:
        data = request.json
        print("Received add_machine request:", data)
        
        # Generate Machine Code
        category = data.get("category", "")
        prefix = ""
        if category == "Backhoe Loader":
            prefix = "BL"
        elif category == "Excavator":
            prefix = "EXE"
        elif category == "Backhoe Loader with Breaker":
            prefix = "BLB"
        
        if prefix:
            # Find the highest existing code for this prefix
            last_machine = machines.find_one(
                {"machineCode": {"$regex": f"^{prefix}-"}},
                sort=[("machineCode", -1)]
            )
            
            next_num = 1
            if last_machine and "machineCode" in last_machine:
                try:
                    last_code = last_machine["machineCode"]
                    last_num = int(last_code.split("-")[1])
                    next_num = last_num + 1
                except (IndexError, ValueError):
                    pass
            
            data["machineCode"] = f"{prefix}-{next_num:04d}"
        
        machines.insert_one(data)
        return jsonify({"message": "Machine added", "machineCode": data.get("machineCode")})
    except Exception as e:
        print("Error adding machine:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/admin/machines/<id>", methods=["PUT", "DELETE"])
@token_required
def update_delete_machine(id):
    if request.method == "PUT":
        data = request.json
        
        # Fetch current machine to reconcile images
        existing_machine = machines.find_one({"_id": ObjectId(id)})
        if not existing_machine:
            return jsonify({"error": "Machine not found"}), 404
            
        # Reconcile images (delete from Cloudinary if removed from list)
        old_images = existing_machine.get("images", [])
        new_images = data.get("images", [])
        removed_images = [img for img in old_images if img not in new_images]
        if removed_images:
            delete_cloudinary_images(removed_images)
            
        # Clean up the data object
        if "_id" in data:
            del data["_id"]
        if "machineCode" in data:
            del data["machineCode"]
            
        machines.update_one({"_id": ObjectId(id)}, {"$set": data})
        
        updated = machines.find_one({"_id": ObjectId(id)})
        updated["_id"] = str(updated["_id"])
        return jsonify(updated)
    
    # DELETE logic with Cloudinary cleanup
    machine = machines.find_one({"_id": ObjectId(id)})
    if machine:
        delete_cloudinary_images(machine.get("images", []))
    
    machines.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "Machine deleted"})

# ---------------- PARTS ----------------
@app.route("/api/parts", methods=["GET"])
def get_parts():
    try:
        return jsonify([{**p, "_id": str(p["_id"])} for p in parts.find()])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/admin/parts", methods=["POST"])
@token_required
def add_part():
    parts.insert_one(request.json)
    return jsonify({"message": "Part added"})

@app.route("/admin/parts/<id>", methods=["DELETE"])
@token_required
def delete_part(id):
    part = parts.find_one({"_id": ObjectId(id)})
    if part:
        delete_cloudinary_images(part.get("images", []))
    
    parts.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "Part deleted"})

# ---------------- BLOGS ----------------
@app.route("/api/blogs", methods=["GET"])
def get_blogs():
    try:
        return jsonify([{**b, "_id": str(b["_id"])} for b in blogs.find()])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/blogs/<id>", methods=["GET"])
def get_blog(id):
    try:
        blog = blogs.find_one({"_id": ObjectId(id)})
        if not blog:
            return jsonify({"error": "Blog not found"}), 404
        blog["_id"] = str(blog["_id"])
        return jsonify(blog)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/admin/blogs", methods=["POST"])
@token_required
def add_blog():
    blogs.insert_one(request.json)
    return jsonify({"message": "Blog added"})

@app.route("/admin/blogs/<id>", methods=["DELETE"])
@token_required
def delete_blog(id):
    blog = blogs.find_one({"_id": ObjectId(id)})
    if blog:
        # Collect all images including featured_image if different
        images_to_delete = blog.get("images", [])
        feat_img = blog.get("featured_image")
        if feat_img and feat_img not in images_to_delete:
            if isinstance(feat_img, dict):
                images_to_delete.append(feat_img)
            elif isinstance(feat_img, str):
                images_to_delete.append(feat_img)
                
        delete_cloudinary_images(images_to_delete)
        
    blogs.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "Blog deleted"})

# ---------------- ENQUIRIES ----------------
@app.route("/api/enquiries", methods=["POST"])
def enquiry():
    data = request.json
    
    # 1. Validation
    name = data.get("name", "").strip()
    mobile = data.get("mobile", "").strip()
    
    if not name or not mobile:
        return jsonify({"error": "Name and mobile are required"}), 400
        
    if not re.match(r'^\d{10}$', mobile):
        return jsonify({"error": "Mobile number must be exactly 10 digits"}), 400

    # Store as ISO string with IST offset for clarity
    import pytz
    ist = pytz.timezone('Asia/Kolkata')
    data["createdAt"] = datetime.now(ist).isoformat()
    data["is_viewed"] = False
    data["status"] = "new"
    
    enquiries.insert_one(data)
    return jsonify({"message": "Enquiry submitted successfully"})

@app.route("/admin/enquiries", methods=["GET"])
@token_required
def get_enquiries():
    # Sort by createdAt desc, fallback to _id if createdAt missing
    data = []
    for e in enquiries.find().sort([("createdAt", -1), ("_id", -1)]):
        e["_id"] = str(e["_id"])
        data.append(e)
    return jsonify(data)

@app.route("/admin/enquiries/mark-read", methods=["POST"])
@token_required
def mark_enquiries_read():
    try:
        enquiries.update_many({"is_viewed": False}, {"$set": {"is_viewed": True}})
        return jsonify({"message": "Enquiries marked as read"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------- DASHBOARD STATS ----------------
@app.route("/admin/dashboard/counts", methods=["GET"])
@token_required
def get_dashboard_counts():
    try:
        # Get counts (defaults to 0 if None, though count_documents returns int)
        m_count = machines.count_documents({})
        p_count = parts.count_documents({})
        b_count = blogs.count_documents({})
        # Count only unviewed enquiries for the notification badge
        unread_e_count = enquiries.count_documents({"is_viewed": False})
        total_e_count = enquiries.count_documents({})
        
        print(f"DEBUG: Dashboard Counts - Machines: {m_count}, Parts: {p_count}, Blogs: {b_count}, Unread: {unread_e_count}, Total Enquiries: {total_e_count}")
        
        return jsonify({
            "machines": m_count,
            "parts": p_count,
            "blogs": b_count,
            "unreadEnquiries": unread_e_count,
            "totalEnquiries": total_e_count
        })
    except Exception as e:
        print(f"Error fetching dashboard counts: {e}")
        return jsonify({"error": str(e)}), 500

# ---------------- SERVE FRONTEND ----------------
@app.route("/")
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.errorhandler(404)
@app.errorhandler(405)
def handle_routing_errors(e):
    # 1. If it's a browser navigation (GET) and not a direct file request (no dot in filename)
    # serve the React app index.html
    path = request.path
    if request.method == 'GET' and '.' not in path.split('/')[-1]:
        return send_from_directory(app.static_folder, 'index.html')
    
    # 2. For API routes or actual missing files, return appropriate error
    if path.startswith('/api/') or path.startswith('/admin/'):
        return jsonify({"error": str(e)}), e.code
        
    return "Not Found", 404

# ---------------- RUN ----------------
if __name__ == "__main__":
    # Disable reloader on Windows to prevent WinError 10038
    # Using port 5000 as requested
    app.run(debug=True, port=int(os.getenv("PORT", 5000)), use_reloader=False)
