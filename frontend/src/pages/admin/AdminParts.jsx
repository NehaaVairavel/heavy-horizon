import { useState, useEffect } from 'react';
import { getParts, addPart, deletePart, uploadImages } from '@/lib/api';

const emptyPart = { name: '', compatibility: '', condition: '', images: [] };

export default function AdminParts() {
  const [parts, setParts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyPart);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    setIsLoading(true);
    try {
      const data = await getParts();
      setParts(data);
    } catch (error) {
      console.error("Failed to fetch parts", error);
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
      setMessage({ type: 'error', text: error.message || 'Upload failed' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addPart(formData);
      setFormData(emptyPart);
      setShowForm(false);
      setMessage({ type: 'success', text: 'Part added successfully' });
      fetchParts();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to add part' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this part?')) return;
    try {
      await deletePart(id);
      setMessage({ type: 'success', text: 'Part deleted successfully' });
      fetchParts();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete part' });
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Used Parts</h1>
        <button className="btn-admin-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Part'}
        </button>
      </div>

      {message.text && (
        <div className={`admin-message ${message.type}`}>
          {message.text}
          <button onClick={() => setMessage({ type: '', text: '' })}>×</button>
        </div>
      )}

      {showForm && (
        <div className="admin-form-container">
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form-group">
              <label>Part Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Compatibility *</label>
              <input
                type="text"
                value={formData.compatibility}
                onChange={e => setFormData({ ...formData, compatibility: e.target.value })}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Condition *</label>
              <input
                type="text"
                value={formData.condition}
                onChange={e => setFormData({ ...formData, condition: e.target.value })}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Images</label>
              <input type="file" onChange={handleImageUpload} disabled={uploading} multiple />
              {uploading && <span>Uploading...</span>}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                {formData.images && formData.images.map((img, index) => (
                  <div key={index} className="image-preview" style={{ position: 'relative', display: 'inline-block' }}>
                    <img src={img.secure_url || img} alt={`Preview ${index + 1}`} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))}
                      style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--error)', color: 'white', borderRadius: '50%', border: 'none', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-admin-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Add Part'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Parts Table */}
      {isLoading ? (
        <div className="admin-loading">Loading...</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Compatibility</th>
                <th>Condition</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {parts.map(part => {
                const firstImage = part.images && part.images[0];
                const imageUrl = firstImage?.secure_url || firstImage || 'https://via.placeholder.com/40';

                return (
                  <tr key={part._id}>
                    <td>
                      <img
                        src={imageUrl}
                        alt={part.name}
                        style={{ width: '40px', height: '30px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    </td>
                    <td>{part.name}</td>
                    <td>{part.compatibility}</td>
                    <td>{part.condition}</td>
                    <td>
                      <button className="btn-icon delete" onClick={() => handleDelete(part._id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
