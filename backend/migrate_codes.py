import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection
client = MongoClient(os.getenv("MONGO_URI"))
db = client["heavyhorizon"]
machines_col = db["machines"]

PREFIX_MAP = {
    "Backhoe Loader": "BL",
    "Excavator": "EXE",
    "Backhoe Loader with Breaker": "BLB"
}

def migrate():
    print("Starting migration...")
    
    # 1. Clear machine codes if they don't match the new format logic
    # Actually, let's just re-generate all or fix the ones that need fixing.
    # To be safe, let's just ensure all machines have a code matching the map.
    
    # Track counters per prefix to ensure uniqueness
    counters = {prefix: 0 for prefix in PREFIX_MAP.values()}
    
    # Also handle legacy prefixes like 'EX'
    for machine in machines_col.find():
        category = machine.get("category")
        current_code = machine.get("machineCode")
        
        prefix = PREFIX_MAP.get(category)
        if not prefix:
            print(f"Skipping machine {machine.get('title')} - category '{category}' not in prefix map")
            continue
            
        # Determine if we should update
        needs_update = False
        if not current_code:
            needs_update = True
        elif current_code.startswith("EX-"):
            needs_update = True # Migrate EX-XXXX to EXE-XXXX
        elif not current_code.startswith(f"{prefix}-"):
            needs_update = True # Wrong prefix for category
            
        if needs_update:
            # Generate next number for this prefix
            # Find the highest existing for THIS PREFIX in the DB currently
            counters[prefix] += 1
            new_code = f"{prefix}-{counters[prefix]:04d}"
            
            # Ensure new_code isn't already taken (if we are doing partial migration)
            while machines_col.find_one({"machineCode": new_code}):
                counters[prefix] += 1
                new_code = f"{prefix}-{counters[prefix]:04d}"
                
            print(f"Updating '{machine.get('title')}' ({category}): {current_code} -> {new_code}")
            machines_col.update_one({"_id": machine["_id"]}, {"$set": {"machineCode": new_code}})
        else:
            # Sync our local counter with existing valid code
            try:
                num_part = int(current_code.split("-")[1])
                if num_part > counters[prefix]:
                    counters[prefix] = num_part
            except (IndexError, ValueError):
                pass

    print("Migration completed.")

if __name__ == "__main__":
    migrate()
