import { useState, useEffect } from 'react';
import { getMachines, addMachine, deleteMachine, uploadImages } from '@/lib/api';

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
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchMachines();
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

  const handleImageUpload = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);
    try {
      const result = await uploadImages(e.target.files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...result.images]
      }));
      setMessage({ type: 'success', text: 'Images uploaded successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Ensure numeric fields are numbers
      const payload = {
        ...formData,
        year: Number(formData.year) || 0,
        hours: Number(formData.hours) || 0,
      };

      await addMachine(payload);

      setMessage({ type: 'success', text: 'Machine added successfully' });
      setFormData(emptyMachine);
      setShowForm(false);

      // Refresh the list immediately
      await fetchMachines();
    } catch (error) {
      console.error("Error adding machine:", error);
      setMessage({
        type: 'error',
        text: error.response?.data?.error || error.message || "Failed to add machine"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this machine?')) return;

    try {
      await deleteMachine(id);
      setMessage({ type: 'success', text: 'Machine deleted successfully' });
      fetchMachines();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete machine' });
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
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
                <label>Machine Title *</label>
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
                <label>Condition *</label>
                <select
                  value={formData.condition}
                  onChange={e => setFormData({ ...formData, condition: e.target.value })}
                >
                  <option value="Pure Earthwork Condition">Pure Earthwork Condition</option>
                  <option value="Good Condition">Good Condition</option>
                </select>
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
              <label>Images (1-10)</label>
              <div className="image-upload-area">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploading || formData.images.length >= 10}
                />
                {uploading && <span className="upload-status">Uploading...</span>}
              </div>
              {formData.images.length > 0 && (
                <div className="image-preview-grid">
                  {formData.images.map((img, index) => (
                    <div key={index} className="image-preview">
                      <img src={img} alt={`Preview ${index + 1}`} />
                      <button type="button" onClick={() => removeImage(index)}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="button" className="btn-admin-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-admin-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Add Machine'}
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
                <th>Title</th>
                <th>Category</th>
                <th>Purpose (Type)</th>
                <th>Year</th>
                <th>Hours</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(machines || []).map((machine, index) => (
                <tr key={machine._id || index}>
                  <td>
                    <img
                      src={(machine.images && machine.images[0]) || 'https://via.placeholder.com/60x40'}
                      alt={machine.title}
                      className="table-thumbnail"
                    />
                  </td>
                  <td>{machine.title}</td>
                  <td>{machine.category}</td>
                  <td><span className={`badge badge-${(machine.type || machine.purpose || '').toLowerCase()}`}>{machine.type || machine.purpose}</span></td>
                  <td>{machine.year}</td>
                  <td>{machine.hours.toLocaleString()}</td>
                  <td><span className={`badge badge-${machine.status.toLowerCase()}`}>{machine.status}</span></td>
                  <td>
                    <button className="btn-icon delete" onClick={() => handleDelete(machine._id)} title="Delete">
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
