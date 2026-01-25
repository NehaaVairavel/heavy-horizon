import { useState, useEffect } from 'react';
import { getMachines, addMachine, deleteMachine, uploadImages } from '@/lib/api';
import { normalizeImages } from '@/lib/images';

const emptyMachine = {
  title: '',
  category: 'Backhoe Loader',
  type: 'Rental',
  model: '',
  year: new Date().getFullYear(),
  hours: 0,
  condition: 'Good Condition',
  images: [],
  status: 'Available'
};

export default function AdminMachines() {
  const [machines, setMachines] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyMachine);

  // Image States
  const [selectedFiles, setSelectedFiles] = useState([]); // File[]
  const [previewUrls, setPreviewUrls] = useState([]);     // string[] (blob URLs)

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchMachines();
    return () => {
      // Cleanup preview URLs on unmount to prevent memory leaks
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const fetchMachines = async () => {
    setIsLoading(true);
    try {
      const data = await getMachines();
      setMachines(data);
    } catch (error) {
      console.error("Failed to fetch machines", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);

    // Validate limit (Max 10 images)
    if (previewUrls.length + files.length > 10) {
      setMessage({ type: 'error', text: 'Maximum 10 images allowed' });
      return;
    }

    // Generate previews
    const newPreviews = files.map(file => {
      const url = URL.createObjectURL(file);
      console.log(`DEBUG: Created preview URL for ${file.name}: ${url}`);
      return url;
    });

    // Update state
    setSelectedFiles(prev => [...prev, ...files]);
    setPreviewUrls(prev => [...prev, ...newPreviews]);
    console.log("DEBUG: Current previewUrls:", [...previewUrls, ...newPreviews]);

    // Clear error if any
    setMessage({ type: '', text: '' });
  };

  const removeImage = (index) => {
    // Revoke object URL
    const urlToRemove = previewUrls[index];
    if (urlToRemove) URL.revokeObjectURL(urlToRemove);

    // Remove from both arrays
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      let uploadedImages = [];

      // 1. Upload new files if any
      if (selectedFiles.length > 0) {
        setUploading(true);
        const uploadedUrls = await uploadImages(selectedFiles);
        if (Array.isArray(uploadedUrls)) {
          uploadedImages = uploadedUrls;
        } else if (uploadedUrls && uploadedUrls.images) {
          // Fallback for different API response structure if any
          uploadedImages = uploadedUrls.images;
        }
        setUploading(false);
      }

      // 2. Prepare payload
      // Note: In "Add Machine", we usually don't have existing images in formData.images
      // But if we did (edit mode), we would merge them here.
      const payload = {
        ...formData,
        images: uploadedImages, // Array of string URLs
        year: Number(formData.year) || 0,
        hours: Number(formData.hours) || 0,
      };

      console.log("DEBUG: Posting machine payload:", payload);
      await addMachine(payload);

      setMessage({ type: 'success', text: 'Machine added successfully' });
      handleReset();
      await fetchMachines();

    } catch (error) {
      console.error("Error adding machine:", error);
      setMessage({
        type: 'error',
        text: error.response?.data?.error || error.message || "Failed to add machine"
      });
      setUploading(false);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    // Cleanup previews
    previewUrls.forEach(url => URL.revokeObjectURL(url));

    setFormData(emptyMachine);
    setSelectedFiles([]);
    setPreviewUrls([]);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this machine?')) return;

    try {
      await deleteMachine(id);
      setMessage({ type: 'success', text: 'Machine deleted successfully' });
      fetchMachines();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete machine' });
    }
  };

  // Helper to get a stable thumbnail for table
  // Robustly normalize images from any legacy format
  const getThumbnail = (machine) => {
    const normalizedImages = normalizeImages(machine?.images || machine?.image);
    console.log(`DEBUG: AdminMachines [${machine?.title}] normalizedImages:`, normalizedImages);
    return normalizedImages.length > 0 ? normalizedImages[0] : 'https://via.placeholder.com/60x40?text=No+Image';
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Machines</h1>
        <button className="btn-admin-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Machine'}
        </button>
      </div>

      {message.text && (
        <div className={`admin-message ${message.type}`}>
          {message.text}
          <button onClick={() => setMessage({ type: '', text: '' })}>×</button>
        </div>
      )}

      {/* Add Machine Form */}
      {showForm && (
        <div className="admin-form-container">
          <h2>Add New Machine</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-row">
              <div className="admin-form-group">
                <label>Machine Brand *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., JCB 3DX"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Model *</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={e => setFormData({ ...formData, model: e.target.value })}
                  placeholder="e.g., 3DX"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="admin-form-group">
                <label>Category *</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Backhoe Loader">Backhoe Loader</option>
                  <option value="Excavator">Excavator</option>
                  <option value="Backhoe Loader with Breaker">Backhoe Loader with Breaker</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label>Purpose (Type) *</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="Rental">Rental (Services)</option>
                  <option value="Sales">Sales</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="admin-form-group">
                <label>Year *</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  min="2000"
                  max={new Date().getFullYear()}
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Hours *</label>
                <input
                  type="number"
                  value={formData.hours}
                  onChange={e => setFormData({ ...formData, hours: parseInt(e.target.value) })}
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="admin-form-group">
                <label>Condition (Add each point on a new line) *</label>
                <textarea
                  value={formData.condition}
                  onChange={e => setFormData({ ...formData, condition: e.target.value })}
                  placeholder="• Engine condition&#10;• Hydraulic system&#10;• Overall performance"
                  rows={4}
                  required
                  style={{ resize: 'vertical', minHeight: '100px' }}
                />
              </div>
              <div className="admin-form-group">
                <label>Status *</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Available">Available</option>
                  <option value="Sold">Sold</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>
            </div>

            <div className="admin-form-group">
              <label>Images ({previewUrls.length}/10)</label>
              <div className="image-upload-area">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  disabled={uploading || previewUrls.length >= 10}
                />
                {uploading && <span className="upload-status">Uploading to Cloudinary...</span>}
              </div>

              <div className="image-preview-grid">
                {previewUrls.map((url, index) => (
                  <div key={index} className="image-preview">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      style={{ objectFit: 'cover' }}
                    />
                    <button type="button" onClick={() => removeImage(index)}>×</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-admin-secondary" onClick={handleReset}>
                Cancel
              </button>
              <button type="submit" className="btn-admin-primary" disabled={saving || uploading}>
                {saving || uploading ? 'Processing...' : 'Add Machine'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Machines Table */}
      {isLoading ? (
        <div className="admin-loading">Loading...</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Purpose (Type)</th>
                <th>Year</th>
                <th>Hours</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {machines.map((machine, index) => (
                <tr key={machine._id || index}>
                  <td>
                    <img
                      src={getThumbnail(machine)}
                      alt={machine.title}
                      className="table-thumbnail"
                    />
                  </td>
                  <td>{machine.title}</td>
                  <td>{machine.category}</td>
                  <td>
                    <span className={`badge badge-${(machine.type || machine.purpose || '').toLowerCase()}`}>
                      {machine.type || machine.purpose}
                    </span>
                  </td>
                  <td>{machine.year}</td>
                  <td>{machine.hours.toLocaleString()}</td>
                  <td>
                    <span className={`badge badge-${machine.status.toLowerCase()}`}>
                      {machine.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDelete(machine._id)}
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function getSampleMachines() {
  return [
    { title: 'JCB 3DX', category: 'Backhoe Loader', purpose: 'Rental', model: '3DX', year: 2020, hours: 5200, condition: 'Pure Earthwork Condition', images: ['https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400'], status: 'Available' },
    { title: 'CAT 320D', category: 'Excavator', purpose: 'Rental', model: '320D', year: 2019, hours: 7200, condition: 'Good Condition', images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400'], status: 'Available' },
    { title: 'JCB 3DX with Breaker', category: 'Backhoe Loader with Breaker', purpose: 'Rental', model: '3DX', year: 2020, hours: 5400, condition: 'Good Condition', images: ['https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=400'], status: 'Available' },
  ];
}
