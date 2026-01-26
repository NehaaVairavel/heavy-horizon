import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardCounts, getEnquiries } from '@/lib/api';
import { formatEnquiryDate } from '@/lib/utils';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        const [countsData, enquiriesData] = await Promise.all([
          getDashboardCounts(),
          getEnquiries()
        ]);

        setStats(countsData);
        if (Array.isArray(enquiriesData)) {
          setRecentEnquiries(enquiriesData.slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <p>Welcome to Heavy Horizon Admin Panel</p>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-icon machines">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 4h6v6h-6zM4 14h6v6H4zM17 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M7 7m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-number">{hasError ? '--' : stats?.machines ?? 0}</span>
            <span className="stat-label">Machines</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon parts">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-number">{hasError ? '--' : stats?.parts ?? 0}</span>
            <span className="stat-label">Used Parts</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon blogs">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-number">{hasError ? '--' : stats?.blogs ?? 0}</span>
            <span className="stat-label">Blog Posts</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon enquiries">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-number">{hasError ? '--' : stats?.totalEnquiries ?? stats?.enquiries ?? 0}</span>
            <span className="stat-label">Enquiries</span>
          </div>
        </div>
      </div>

      {/* Recent Enquiries */}
      <div className="admin-section">
        <div className="admin-section-header">
          <h2>Recent Enquiries</h2>
          <Link to="/admin/enquiries" className="view-all-link">View All →</Link>
        </div>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Name</th>
                <th>Item</th>
                <th>Mobile</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {(recentEnquiries || []).map((enquiry, index) => {
                const formattedDate = formatEnquiryDate(enquiry);

                return (
                  <tr key={enquiry.id || index}>
                    <td><span className={`badge badge-${enquiry.type?.toLowerCase()}`}>{enquiry.type}</span></td>
                    <td>{enquiry.name || '-'}</td>
                    <td>{enquiry.machine || enquiry.part || 'N/A'}</td>
                    <td>{enquiry.mobile}</td>
                    <td>{formattedDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
