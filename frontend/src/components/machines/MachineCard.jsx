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

      <div className="card-body" style={{ padding: isSales ? '16px' : '20px' }}>
        <div className="card-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: isSales ? '12px' : '16px',
          overflow: 'visible'
        }}>
          <h3 className="card-title" style={{
            marginBottom: 0,
            fontSize: isSales ? '1.1rem' : '1.25rem',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            color: '#111827'
          }}>
            {machine.title}
          </h3>
          <span className="machine-code">
            {machine.machineCode || 'N/A'}
          </span>
        </div>

        <div className="card-specs-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: isSales ? '12px 16px' : '16px 24px',
          marginBottom: isSales ? '16px' : '20px',
          padding: '4px 0'
        }}>
          <div className="spec-item">
            <span className="label">MODEL</span>
            <span className="value" style={{ fontSize: isSales ? '14px' : '15px' }}>{machine.model || 'N/A'}</span>
          </div>
          <div className="spec-item">
            <span className="label">YEAR</span>
            <span className="value" style={{ fontSize: isSales ? '14px' : '15px' }}>{machine.year || 'N/A'}</span>
          </div>
          <div className="spec-item">
            <span className="label">HOURS</span>
            <span className="value" style={{ fontSize: isSales ? '14px' : '15px' }}>{machine.hours?.toLocaleString() || 'N/A'}</span>
          </div>
          <div className="spec-item">
            <span className="label">LOCATION</span>
            <span className="value" style={{ fontSize: isSales ? '14px' : '15px' }}>{machine.location || 'Not specified'}</span>
          </div>
        </div>

        {/* Local styles for the card to ensure high priority and exact match */}
        <style dangerouslySetInnerHTML={{
          __html: `
          .machine-code {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 6px 12px;
            font-size: 13px;
            font-weight: 600;
            background-color: #111827; /* dark charcoal */
            color: #f97316; /* brand orange */
            border-radius: 6px;
            border: 1px solid #f97316;
            white-space: nowrap;
            opacity: 1;
            visibility: visible;
          }

          .spec-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .spec-item .label {
            font-size: 12px;
            color: #6b7280; /* muted gray */
            text-transform: uppercase;
          }

          .spec-item .value {
            font-size: 15px;
            font-weight: 600;
            color: #111827; /* dark text */
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          @media (max-width: 768px) {
            .machine-code {
              font-size: 12px;
              padding: 4px 10px;
            }

            .spec-item {
              display: block;
            }
            
            .card-header {
              flex-wrap: wrap;
              gap: 8px;
            }
          }
        `}} />

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
              window.scrollTo({ top: 0, behavior: 'smooth' });
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
