import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { getParts } from '@/lib/api';
import { EnquiryModal } from '@/components/machines/EnquiryModal';

export default function SpareParts() {
  const [parts, setParts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPart, setSelectedPart] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    setIsLoading(true);
    try {
      const data = await getParts();
      setParts(data);
    } catch (error) {
      console.error("Failed to fetch parts", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnquiry = (part) => {
    setSelectedPart(part);
    setIsModalOpen(true);
  };

  return (
    <Layout>
      {/* Page Header */}
      <section className="section-dark page-header">
        <div className="container">
          <span className="section-label">Quality Used Parts</span>
          <h1 className="section-title">Used <span>Parts</span></h1>
          <p>
            Quality used parts for construction machines to keep your equipment running smoothly.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {isLoading ? (
            <div className="loading">
              <div className="loading-spinner" />
            </div>
          ) : parts.length > 0 ? (
            <div className="grid-3">
              {parts.map((part) => (
                <div key={part._id} className="card">
                  <div className="card-image">
                    {part.images && part.images.length > 0 ? (
                      <img src={part.images[0]} alt={part.name} loading="lazy" />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--muted-foreground)' }}>
                        No image
                      </div>
                    )}
                    <span className="card-badge">Used Part</span>
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">{part.name}</h3>
                    <div className="card-specs">
                      <div className="spec-item">
                        <label>Compatibility</label>
                        <span>{part.compatibility}</span>
                      </div>
                      <div className="spec-item">
                        <label>Condition</label>
                        <span>{part.condition}</span>
                      </div>
                    </div>
                    <button className="btn btn-primary btn-block" onClick={() => handleEnquiry(part)}>
                      Send Enquiry
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="coming-soon">
              <div className="coming-soon-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                </svg>
              </div>
              <h2 className="section-title" style={{ marginBottom: '16px' }}>
                Coming <span>Soon</span>
              </h2>
              <p style={{
                color: 'var(--muted-foreground)',
                fontSize: '1.125rem',
                maxWidth: '500px',
                margin: '0 auto',
                lineHeight: '1.7'
              }}>
                Our used parts catalog is under preparation. Stay tuned.
              </p>
            </div>
          )}
        </div>
      </section>

      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPart(null);
        }}
        machine={selectedPart}
        enquiryType="Part"
      />
    </Layout>
  );
}
