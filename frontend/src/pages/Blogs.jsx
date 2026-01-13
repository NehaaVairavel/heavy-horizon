import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { getBlogs } from '@/lib/api';
import { BlogCard } from '@/components/BlogCard';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const data = await getBlogs();
        setBlogs(data);
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <Layout>
      {/* Page Header */}
      <section className="section-dark page-header">
        <div className="container">
          <span className="section-label">Industry Insights</span>
          <h1 className="section-title">Our <span>Blogs</span></h1>
          <p>
            Stay updated with the latest news, tips, and insights from the construction equipment industry.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="section">
        <div className="container">
          {isLoading ? (
            <div className="loading">
              <div className="loading-spinner" />
            </div>
          ) : (blogs && blogs.length > 0) ? (
            <div className="grid-3">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '100px 20px' }}>
              <div className="coming-soon-icon" style={{ marginBottom: '24px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </div>
              <h2 className="section-title">Coming <span>Soon</span></h2>
              <p style={{ color: 'var(--muted-foreground)', maxWidth: '500px', margin: '16px auto 0', fontSize: '1.125rem' }}>
                Our blog series is being prepared. Stay tuned for industry insights and updates.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
