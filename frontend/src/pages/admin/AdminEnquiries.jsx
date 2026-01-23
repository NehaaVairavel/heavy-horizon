import { useState, useEffect } from 'react';
import { getEnquiries } from '@/lib/api';

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    setIsLoading(true);
    try {
      const data = await getEnquiries();
      setEnquiries(data);
    } catch (error) {
      console.error("Failed to fetch enquiries", error);
    } finally {
      setIsLoading(false);
    }
  };

  const safeEnquiries = enquiries || [];
  const filteredEnquiries = filter === 'all'
    ? safeEnquiries
    : safeEnquiries.filter(e => (e.type || 'contact').toLowerCase() === filter);

  const openWhatsApp = (mobile) => {
    if (!mobile) return;
    window.open(`https://wa.me/${mobile.replace(/[^0-9]/g, '')}`, '_blank');
  };

  const formatDate = (enquiry) => {
    let date;
    if (enquiry.createdAt) {
      date = new Date(enquiry.createdAt);
    } else if (enquiry._id && enquiry._id.length >= 8) {
      date = new Date(parseInt(enquiry._id.substring(0, 8), 16) * 1000);
    } else {
      return 'N/A';
    }

    const d = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const t = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase();
    return `${d} • ${t}`;
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Enquiries</h1>
        <div className="filter-tabs">
          {['all', 'rental', 'sales', 'parts', 'contact'].map(tab => (
            <button
              key={tab}
              className={`filter-tab ${filter === tab ? 'active' : ''}`}
              onClick={() => setFilter(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="admin-loading">Loading...</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Name</th>
                <th>Item</th>
                <th>Message</th>
                <th>Mobile</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnquiries.map((enquiry, idx) => (
                <tr key={enquiry._id || idx}>
                  <td>
                    <span className={`badge badge-${(enquiry.type || 'contact').toLowerCase()}`}>
                      {enquiry.type || 'Contact'}
                    </span>
                  </td>
                  <td>{enquiry.name || '-'}</td>
                  <td>{enquiry.machine || enquiry.part || '-'}</td>
                  <td>{enquiry.message ? enquiry.message.substring(0, 50) : '-'}</td>
                  <td>{enquiry.mobile}</td>
                  <td>{formatDate(enquiry)}</td>
                  <td>
                    <button className="btn-icon whatsapp" onClick={() => openWhatsApp(enquiry.mobile)} title="Chat on WhatsApp">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
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
