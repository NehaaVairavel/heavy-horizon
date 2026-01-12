import { useState } from 'react';
import { Link } from 'react-router-dom';

export function BlogCard({ blog }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);

    if (!blog) return null;

    // Helper to safely get the date
    const getBlogDate = (blogObj) => {
        if (!blogObj) return 'Recent';
        let dateStr = blogObj.created_at;
        // Fallback to _id timestamp if created_at is missing/invalid
        if (!dateStr && blogObj._id) {
            try {
                const timestamp = parseInt(blogObj._id.substring(0, 8), 16) * 1000;
                if (!isNaN(timestamp)) {
                    dateStr = new Date(timestamp).toISOString();
                }
            } catch (e) {
                return 'Recent';
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

    // Ensure images array exists
    const images = blog.images && Array.isArray(blog.images) && blog.images.length > 0
        ? blog.images
        : (blog.featured_image ? [blog.featured_image] : []);

    const nextImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (images.length === 0) return;
        setCurrentImageIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (images.length === 0) return;
        setCurrentImageIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    const blogId = blog._id || '';

    return (
        <article className="blog-card">
            <div className="blog-image">
                {images.length > 0 ? (
                    <div className="image-slider">
                        <img
                            src={images[currentImageIndex] || ''}
                            alt={`${blog.title || 'Blog'} - Image ${currentImageIndex + 1}`}
                            loading="lazy"
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
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999', backgroundColor: '#f5f5f5' }}>
                        No image
                    </div>
                )}
            </div>
            <div className="blog-content" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <span className="blog-date" style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'block' }}>
                    {getBlogDate(blog)}
                </span>

                <h3 className="blog-title" style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '16px', lineHeight: '1.4' }}>
                    <Link to={`/blogs/${blogId}`} style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>
                        {blog.title || 'Untitled Blog'}
                    </Link>
                </h3>

                <div
                    className="blog-excerpt-container"
                    style={{
                        maxHeight: isExpanded ? '2000px' : '4.8em',
                        overflow: 'hidden',
                        transition: 'all 0.5s ease-in-out',
                        position: 'relative',
                        marginBottom: isExpanded ? '24px' : '12px'
                    }}
                >
                    <p style={{
                        margin: 0,
                        lineHeight: '1.6',
                        color: '#4b5563',
                        fontSize: '0.95rem',
                        display: isExpanded ? 'block' : '-webkit-box',
                        WebkitLineClamp: isExpanded ? 'unset' : 3,
                        WebkitBoxOrient: 'vertical',
                        whiteSpace: isExpanded ? 'pre-wrap' : 'normal'
                    }}>
                        {blog.content || 'Stay tuned for more updates and insights from Heavy Horizon.'}
                    </p>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
                    <button
                        onClick={(e) => { e.preventDefault(); setIsExpanded(!isExpanded); }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#f97316',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: 0,
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            fontFamily: 'inherit',
                            transition: 'opacity 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                    >
                        {isExpanded ? 'View Less' : 'View More'}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>

                    {blogId && (
                        <Link
                            to={`/blogs/${blogId}`}
                            style={{
                                color: '#374151',
                                textDecoration: 'none',
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                        >
                            Full Article
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                    )}
                </div>
            </div>
        </article>
    );
}
