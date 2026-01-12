import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { getBlog, getBlogs } from '@/lib/api';

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await getBlog(id);
        setBlog(data);

        const allBlogs = await getBlogs();
        if (allBlogs && allBlogs.length > 0) {
          setRelatedBlogs(allBlogs.filter(b => b._id !== id).slice(0, 2));
        }
      } catch (error) {
        console.error("Failed to fetch blog", error);
        setBlog(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const getBlogDate = (blogObj) => {
    if (!blogObj) return '';
    let dateStr = blogObj.created_at;

    // Fallback to _id timestamp if _id exists and is valid
    if (!dateStr && blogObj._id && typeof blogObj._id === 'string' && blogObj._id.length >= 8) {
      try {
        const timestamp = parseInt(blogObj._id.substring(0, 8), 16) * 1000;
        if (!isNaN(timestamp)) {
          dateStr = new Date(timestamp).toISOString();
        }
      } catch (e) {
        console.error("Error parsing blog date from _id");
      }
    }

    if (!dateStr) return 'Recent';

    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return 'Recent';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="section">
          <div className="container">
            <div className="loading">
              <div className="loading-spinner" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!blog) {
    return (
      <Layout>
        <div className="section">
          <div className="container">
            <div className="not-found-content">
              <h1>Blog not found</h1>
              <Link to="/blogs" className="btn btn-primary">Back to Blogs</Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Blog Header */}
      <section className="blog-detail-header">
        <div className="container">
          <Link to="/blogs" className="back-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Blogs
          </Link>
          <span className="blog-detail-date">{getBlogDate(blog)}</span>
          <h1 className="blog-detail-title">{blog.title}</h1>
        </div>
      </section>

      {/* Featured Image */}
      <section className="blog-detail-image">
        <div className="container">
          <img src={blog.featured_image || (blog.images && blog.images[0])} alt={blog.title} />
        </div>
      </section>

      {/* Blog Content */}
      <section className="section blog-detail-content">
        <div className="container">
          <div className="blog-content-wrapper">
            <div className="blog-body" dangerouslySetInnerHTML={{ __html: (blog.content || '').replace(/\n/g, '<br/>').replace(/## (.*)/g, '<h2>$1</h2>').replace(/### (.*)/g, '<h3>$1</h3>') }} />

            {/* Image Gallery */}
            {blog.images && blog.images.length > 1 && (
              <div className="blog-gallery" style={{ marginTop: '30px', marginBottom: '30px' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Image Gallery</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
                  {blog.images.slice(1).map((img, index) => (
                    <img key={index} src={img} alt={`Gallery ${index}`} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="blog-cta">
              <h3>Interested in Our Equipment?</h3>
              <p>Contact Heavy Horizon today for quality construction equipment rental and sales in Chennai.</p>
              <div className="blog-cta-buttons">
                <Link to="/services" className="btn btn-primary">View Rentals</Link>
                <Link to="/contact" className="btn btn-outline">Contact Us</Link>
              </div>
            </div>
          </div>

          {/* Related Blogs */}
          {relatedBlogs.length > 0 && (
            <div className="related-blogs">
              <h2>Related Articles</h2>
              <div className="related-blogs-grid">
                {relatedBlogs.map((relatedBlog) => (
                  <Link key={relatedBlog._id} to={`/blogs/${relatedBlog._id}`} className="related-blog-card">
                    <div className="related-blog-image">
                      <img src={relatedBlog.featured_image} alt={relatedBlog.title} />
                    </div>
                    <div className="related-blog-content">
                      <span className="related-blog-date">{getBlogDate(relatedBlog)}</span>
                      <h3>{relatedBlog.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
