import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { normalizeImages } from '@/lib/images';

export function MachineCard({ machine, onEnquiry }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isSales = location.pathname.startsWith('/sales');
  const detailPath = isSales
    ? `/sales/${machine._id}`
    : `/services/${machine._id}`;

  const handleCardClick = () => {
    navigate(detailPath);
  };

  const normalizedImages = normalizeImages(machine?.images || machine?.image);
  const hasImages = normalizedImages.length > 0;

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % normalizedImages.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + normalizedImages.length) % normalizedImages.length);
  };

  return (
    <div className="card card-clickable" onClick={handleCardClick}>
      <div className="card-image">
        {machine.category && (
          <span className="category-badge">{machine.category}</span>
        )}

        {hasImages ? (
          <>
            <img
              src={normalizedImages[currentImageIndex]}
              alt={machine.title}
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            {normalizedImages.length > 1 && (
              <>
                <button className="carousel-btn prev" onClick={prevImage} aria-label="Previous image">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                  </svg>
                </button>
                <button className="carousel-btn next" onClick={nextImage} aria-label="Next image">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                  </svg>
                </button>
                <div className="carousel-dots">
                  {normalizedImages.map((_, idx) => (
                    <span
                      key={idx}
                      className={`carousel-dot ${idx === currentImageIndex ? 'active' : ''}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="no-image-placeholder" style={{ height: '220px' }}>No Image</div>
        )}
      </div>

      <div className="card-body">
        <div className="card-header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 className="card-title" style={{ marginBottom: 0, fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}>{machine.title}</h3>
          {machine.machineCode && (
            <span className="machine-code-badge" style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              padding: '6px 12px',
              backgroundColor: '#1f2937', // Dark background
              border: '1.5px solid var(--primary)', // Orange border
              color: 'var(--primary)', // Orange text
              borderRadius: '6px',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.05em'
            }}>
              {machine.machineCode}
            </span>
          )}
        </div>

        <div className="card-specs-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px 24px',
          marginBottom: '20px',
          padding: '4px 0'
        }}>
          <div className="card-spec-item" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span className="card-spec-label" style={{ fontSize: '0.65rem', fontWeight: '600', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>MODEL</span>
            <span className="card-spec-value" style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--foreground)' }}>{machine.model || 'N/A'}</span>
          </div>
          <div className="card-spec-item" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span className="card-spec-label" style={{ fontSize: '0.65rem', fontWeight: '600', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>YEAR</span>
            <span className="card-spec-value" style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--foreground)' }}>{machine.year || 'N/A'}</span>
          </div>
          <div className="card-spec-item" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span className="card-spec-label" style={{ fontSize: '0.65rem', fontWeight: '600', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>HOURS</span>
            <span className="card-spec-value" style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--foreground)' }}>{machine.hours?.toLocaleString() || 'N/A'}</span>
          </div>
          <div className="card-spec-item" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span className="card-spec-label" style={{ fontSize: '0.65rem', fontWeight: '600', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>LOCATION</span>
            <span className="card-spec-value" style={{
              fontSize: '0.9rem',
              fontWeight: '600',
              color: 'var(--muted-foreground)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }} title={machine.location}>
              {machine.location || 'Not specified'}
            </span>
          </div>
        </div>

        <div className="card-actions">
          <button
            className="btn btn-outline-primary btn-block"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            VIEW DETAILS
          </button>
          <button
            className="btn btn-primary btn-block"
            onClick={(e) => {
              e.stopPropagation();
              onEnquiry(machine);
            }}
          >
            SEND ENQUIRY
          </button>
        </div>
      </div>
    </div>
  );
}
