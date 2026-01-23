import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { EnquiryModal } from '@/components/machines/EnquiryModal';
import { getMachine } from '@/lib/api';
import { normalizeImages } from '@/lib/images';

export default function MachineDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [machine, setMachine] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Determine type from URL path
    const isServices = location.pathname.startsWith('/services');
    const purpose = isServices ? 'Rental' : 'Sales';
    const backPath = isServices ? '/services' : '/sales';
    const backLabel = isServices ? 'Our Services' : 'Sales';

    useEffect(() => {
        const fetchMachine = async () => {
            setIsLoading(true);
            try {
                const data = await getMachine(id);
                if (data) {
                    setMachine(data);
                }
            } catch (error) {
                console.error('Error fetching machine:', error);
            }
            setIsLoading(false);
        };

        fetchMachine();
        window.scrollTo(0, 0);
    }, [id]);

    const nextImage = useCallback(() => {
        const images = normalizeImages(machine?.images || machine?.image);
        if (!images.length) return;
        setCurrentImageIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
        );
    }, [machine]);

    const prevImage = useCallback(() => {
        const images = normalizeImages(machine?.images || machine?.image);
        if (!images.length) return;
        setCurrentImageIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    }, [machine]);

    const handleWhatsAppEnquiry = () => {
        if (!machine) return;
        const message = encodeURIComponent(
            `Hi, I'm interested in the ${machine.title} (${machine.category}) - ${purpose}.\n\nDetails:\n- Model: ${machine.model}\n- Year: ${machine.year}\n- Hours: ${machine.hours?.toLocaleString()}\n- Condition: ${machine.condition}\n\nPlease provide more information.`
        );
        // Note: Using a placeholder number as per provided code, user may want to change this later
        window.open(`https://wa.me/919965564488?text=${message}`, '_blank');
    };

    if (isLoading) {
        return (
            <Layout>
                <section className="section-dark page-header">
                    <div className="container">
                        <div className="machine-detail-skeleton">
                            <div className="skeleton-image"></div>
                            <div className="skeleton-content">
                                <div className="skeleton-title"></div>
                                <div className="skeleton-text"></div>
                                <div className="skeleton-text short"></div>
                            </div>
                        </div>
                    </div>
                </section>
            </Layout>
        );
    }

    if (!machine) {
        return (
            <Layout>
                <section className="section-dark page-header">
                    <div className="container">
                        <h1 className="section-title">Machine Not Found</h1>
                        <p>The machine you're looking for doesn't exist or has been removed.</p>
                    </div>
                </section>
                <section className="section">
                    <div className="container" style={{ textAlign: 'center' }}>
                        <button onClick={() => navigate(backPath)} className="btn btn-primary">
                            Back to {backLabel}
                        </button>
                    </div>
                </section>
            </Layout>
        );
    }

    const images = normalizeImages(machine.images || machine.image);
    const hasMultipleImages = images.length > 1;

    return (
        <Layout>
            {/* Image Gallery Section */}
            <section className="machine-detail-gallery">
                <div className="gallery-container">
                    {images.length > 0 ? (
                        <div className="detail-image-slider">
                            <div className="detail-main-image">
                                <img
                                    src={images[currentImageIndex]}
                                    alt={`${machine.title} - Image ${currentImageIndex + 1}`}
                                />
                            </div>
                            {hasMultipleImages && (
                                <>
                                    <button className="detail-slider-nav prev" onClick={prevImage} aria-label="Previous image">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="24" height="24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                        </svg>
                                    </button>
                                    <button className="detail-slider-nav next" onClick={nextImage} aria-label="Next image">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="24" height="24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </button>
                                    <div className="detail-slider-counter">
                                        {currentImageIndex + 1} / {images.length}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="detail-no-image">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="64" height="64">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                            <p>No images available</p>
                        </div>
                    )}
                    {/* Thumbnail Strip */}
                    {hasMultipleImages && (
                        <div className="detail-thumbnails">
                            {images.map((img, index) => (
                                <button
                                    key={index}
                                    className={`detail-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                                    onClick={() => setCurrentImageIndex(index)}
                                    aria-label={`View image ${index + 1}`}
                                >
                                    <img src={img} alt={`${machine.title} thumbnail ${index + 1}`} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Machine Details Section */}
            <section className="machine-detail-content">
                <div className="container">
                    {/* Breadcrumb */}
                    <nav className="detail-breadcrumb">
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <Link to={backPath}>{backLabel}</Link>
                        <span>/</span>
                        <span>{machine.title}</span>
                    </nav>

                    <div className="detail-layout">
                        {/* Main Content */}
                        <div className="detail-main">
                            <div className="detail-header">
                                <div className="detail-badges">
                                    <span className="detail-badge category">{machine.category}</span>
                                    <span className={`detail-badge status ${machine.status === 'Available' ? 'available' : 'sold'}`}>
                                        {machine.status || 'Available'}
                                    </span>
                                    {purpose === 'Rental' && <span className="detail-badge rental">For Rent</span>}
                                    {purpose === 'Sales' && <span className="detail-badge sale">For Sale</span>}
                                </div>
                                <h1 className="detail-title">{machine.title}</h1>
                                <p className="detail-subtitle">{machine.model} • {machine.year} Model • {machine.hours?.toLocaleString()} Hours</p>
                            </div>

                            {/* Description */}
                            {machine.description && (
                                <div className="detail-section">
                                    <h2>About This Machine</h2>
                                    <p className="detail-description">{machine.description}</p>
                                </div>
                            )}

                            {/* Specifications Grid */}
                            <div className="detail-section">
                                <h2>Specifications</h2>
                                <div className="specs-grid">
                                    <div className="spec-card">
                                        <span className="spec-label">Model</span>
                                        <span className="spec-value">{machine.model}</span>
                                    </div>
                                    <div className="spec-card">
                                        <span className="spec-label">Year</span>
                                        <span className="spec-value">{machine.year}</span>
                                    </div>
                                    <div className="spec-card">
                                        <span className="spec-label">Operating Hours</span>
                                        <span className="spec-value">{machine.hours?.toLocaleString() || 'N/A'}</span>
                                    </div>
                                    <div className="spec-card">
                                        <span className="spec-label">Condition</span>
                                        <span className="spec-value">{machine.condition}</span>
                                    </div>
                                    {machine.specifications && Object.entries(machine.specifications).map(([key, value]) => (
                                        !['model', 'year', 'hours', 'condition'].includes(key.toLowerCase()) && (
                                            <div className="spec-card" key={key}>
                                                <span className="spec-label">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                                <span className="spec-value">{value}</span>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar CTA */}
                        <aside className="detail-sidebar">
                            <div className="cta-card">
                                <h3>Interested in this machine?</h3>
                                <p>Get in touch with us for more details, pricing, or to schedule an inspection.</p>

                                <button className="btn btn-primary btn-lg btn-block" onClick={() => setIsModalOpen(true)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="20" height="20">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                    </svg>
                                    Send Enquiry
                                </button>
                                <button className="btn btn-whatsapp btn-lg btn-block" onClick={handleWhatsAppEnquiry}>
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    Chat on WhatsApp
                                </button>
                                <Link to="/contact" className="btn btn-outline-dark btn-lg btn-block">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="20" height="20">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                    </svg>
                                    Call Now
                                </Link>
                            </div>

                            <button onClick={() => navigate(-1)} className="back-link">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="16" height="16">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                </svg>
                                Back to {backLabel}
                            </button>
                        </aside>
                    </div>
                </div>
            </section>

            {/* Mobile Sticky CTA */}
            <div className="mobile-sticky-cta">
                <button className="btn btn-primary btn-lg" onClick={() => setIsModalOpen(true)}>
                    Send Enquiry
                </button>
                <button className="btn btn-whatsapp btn-lg" onClick={handleWhatsAppEnquiry}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                </button>
            </div>

            {/* Enquiry Modal */}
            <EnquiryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                machine={machine}
                enquiryType={purpose}
            />
        </Layout>
    );
}
