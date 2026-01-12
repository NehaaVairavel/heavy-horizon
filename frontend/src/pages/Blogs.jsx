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
            <div className="blog-grid">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ textAlign: 'center', padding: '100px 20px' }}>
              <h2 className="section-title">Coming <span>Soon</span></h2>
              <p style={{ color: 'var(--muted-foreground)', maxWidth: '500px', margin: '0 auto' }}>
                Our blog series is being prepared. Stay tuned for industry insights and updates.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
