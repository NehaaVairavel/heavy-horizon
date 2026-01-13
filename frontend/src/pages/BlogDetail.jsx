import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { getBlog, getBlogs } from '@/lib/api';

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const nextImage = (e) => {
    if (e) e.stopPropagation();
    const imagesCount = (blog?.images?.length || (blog?.featured_image ? 1 : 0));
    setCurrentImageIndex((prev) =>
      prev === imagesCount - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e) => {
    if (e) e.stopPropagation();
    const imagesCount = (blog?.images?.length || (blog?.featured_image ? 1 : 0));
    setCurrentImageIndex((prev) =>
      prev === 0 ? imagesCount - 1 : prev - 1
    );
  };

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
          <div className="container" style={{ paddingTop: '120px' }}>
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
        <div className="section" style={{ paddingTop: '120px' }}>
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

  const images = blog.images && Array.isArray(blog.images) && blog.images.length > 0
    ? blog.images
    : (blog.featured_image ? [blog.featured_image] : []);

  return (
    <Layout>
      {/* Back Navigation */}
      <section style={{ paddingTop: '120px', paddingBottom: '20px' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <Link to="/blogs" className="btn-link" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--primary)',
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '0.95rem'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Blogs
          </Link>
        </div>
      </section>

      {/* Hero Image slider section */}
      <section style={{ paddingBottom: '40px' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div className="card card-image" style={{
            width: '100%',
            height: '450px',
            overflow: 'hidden',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-lg)',
            backgroundColor: 'var(--muted)',
            position: 'relative',
            border: 'none'
          }}>
            {images.length > 0 ? (
              <div className="image-slider">
                <img
                  src={images[currentImageIndex]?.secure_url || images[currentImageIndex] || ''}
                  alt={`${blog.title || 'Blog'} - Image ${currentImageIndex + 1}`}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />

                {images.length > 1 && (
                  <>
                    <button className="slider-nav prev" onClick={prevImage} aria-label="Previous image">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="16" height="16">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                    </button>
                    <button className="slider-nav next" onClick={nextImage} aria-label="Next image">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="16" height="16">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>

                    <div className="slider-dots">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          className={`slider-dot ${index === currentImageIndex ? 'active' : ''}`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCurrentImageIndex(index);
                          }}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--muted-foreground)', backgroundColor: 'var(--muted)', gap: '12px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
                <span>No image available</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Blog Content Card */}
      <section style={{ paddingBottom: '80px' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <article className="card" style={{
            padding: '40px',
            backgroundColor: 'var(--card)',
            boxShadow: 'var(--shadow-md)',
            borderRadius: '16px'
          }}>
            <header style={{ marginBottom: '32px' }}>
              <span style={{
                display: 'block',
                fontSize: '0.875rem',
                color: 'var(--muted-foreground)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '12px',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600
              }}>
                {getBlogDate(blog)}
              </span>
              <h1 style={{
                fontSize: '2.5rem',
                marginBottom: '24px',
                lineHeight: '1.2',
                color: 'var(--foreground)'
              }}>
                {blog.title}
              </h1>
              <div style={{
                width: '60px',
                height: '4px',
                backgroundColor: 'var(--primary)',
                borderRadius: '2px'
              }} />
            </header>

            <div
              className="blog-body"
              style={{
                fontSize: '1.1rem',
                lineHeight: '1.8',
                color: 'var(--secondary-light)',
                marginBottom: '40px'
              }}
              dangerouslySetInnerHTML={{
                __html: (blog.content || '')
                  .replace(/\n/g, '<br/>')
                  .replace(/## (.*)/g, '<h2 style="font-size: 1.75rem; margin-top: 32px; margin-bottom: 16px; color: var(--foreground);">$1</h2>')
                  .replace(/### (.*)/g, '<h3 style="font-size: 1.5rem; margin-top: 24px; margin-bottom: 12px; color: var(--foreground);">$1</h3>')
              }}
            />

            {/* Image Gallery */}
            {blog.images && blog.images.length > 1 && (
              <div style={{ marginTop: '40px', marginBottom: '40px', paddingTop: '40px', borderTop: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '24px', fontFamily: 'var(--font-heading)' }}>Image Gallery</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                  {blog.images.slice(1).map((img, index) => (
                    <div key={index} style={{
                      aspectRatio: '16/10',
                      overflow: 'hidden',
                      borderRadius: '12px',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      <img src={img.secure_url || img} alt={`Gallery ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Section */}
            <div style={{
              marginTop: '60px',
              padding: '40px',
              backgroundColor: 'var(--background)',
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid var(--border)'
            }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Interested in Our Equipment?</h3>
              <p style={{ color: 'var(--muted-foreground)', marginBottom: '24px', maxWidth: '600px', margin: '0 auto 24px' }}>
                Contact Heavy Horizon today for quality construction equipment rental and sales in Chennai.
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/services" className="btn btn-primary">View Rentals</Link>
                <Link to="/contact" className="btn btn-outline-dark">Contact Us</Link>
              </div>
            </div>
          </article>

          {/* Related Blogs Section */}
          {relatedBlogs.length > 0 && (
            <div style={{ marginTop: '80px' }}>
              <div className="section-header" style={{ textAlign: 'left', marginBottom: '32px' }}>
                <span className="section-label">More Insights</span>
                <h2 className="section-title" style={{ fontSize: '2rem' }}>Related <span>Articles</span></h2>
              </div>
              <div className="grid-2">
                {relatedBlogs.map((relatedBlog) => {
                  const rImg = relatedBlog.featured_image || (relatedBlog.images && relatedBlog.images[0]);
                  const rImgUrl = rImg?.secure_url || rImg;

                  return (
                    <Link key={relatedBlog._id} to={`/blogs/${relatedBlog._id}`} className="card" style={{ textDecoration: 'none' }}>
                      <div className="card-image" style={{ height: '200px' }}>
                        <img src={rImgUrl} alt={relatedBlog.title} />
                      </div>
                      <div className="card-body">
                        <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                          {getBlogDate(relatedBlog)}
                        </span>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0' }}>{relatedBlog.title}</h3>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
