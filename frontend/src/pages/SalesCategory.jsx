import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { MachineCard } from '@/components/machines/MachineCard';
import { EnquiryModal } from '@/components/machines/EnquiryModal';
import { getMachines } from '@/lib/api';

const categoryInfo = {
  'backhoe-loaders': {
    title: 'Backhoe Loaders',
    category: 'Backhoe Loader',
    description: 'Quality backhoe loaders available for purchase.',
  },
  'excavators': {
    title: 'Excavators',
    category: 'Excavator',
    description: 'Premium excavators for sale with inspection reports.',
  },
  'backhoe-breakers': {
    title: 'Backhoe Loaders with Breakers',
    category: 'Backhoe Loader with Breaker',
    description: 'Backhoe loaders with hydraulic breakers for specialized work.',
  },
};

export default function SalesCategory() {
  const { category } = useParams();
  const [machines, setMachines] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const info = category ? categoryInfo[category] : null;

  useEffect(() => {
    const fetchMachines = async () => {
      if (!info) return;

      setIsLoading(true);
      try {
        // Pass null for type to fetch all, then filter client-side for backward compatibility
        const data = await getMachines(null, info.category);
        const filtered = data.filter(m => (m.type === 'Sales' || m.purpose === 'Sales'));
        setMachines(filtered);
      } catch (error) {
        console.error("Failed to fetch machines", error);
        setMachines([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMachines();
  }, [category, info]);

  const handleEnquiry = (machine) => {
    setSelectedMachine(machine);
    setIsModalOpen(true);
  };

  if (!info) {
    return (
      <Layout>
        <section className="section-dark page-header">
          <div className="container">
            <h1 className="section-title">Category Not Found</h1>
          </div>
        </section>
        <section className="section">
          <div className="container" style={{ textAlign: 'center' }}>
            <p>The requested category does not exist.</p>
            <Link to="/sales" className="btn btn-primary" style={{ marginTop: 24 }}>
              Back to Sales
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Page Header */}
      <section className="section-dark page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/sales">Sales</Link>
            <span>/</span>
            <span>{info.title}</span>
          </div>
          <span className="section-label">For Sale</span>
          <h1 className="section-title">{info.title.split(' ')[0]} <span>{info.title.split(' ').slice(1).join(' ') || 'For Sale'}</span></h1>
          <p>{info.description}</p>
        </div>
      </section>

      {/* Content */}
      <section className="section">
        <div className="container">
          {isLoading ? (
            <div className="loading">
              <div className="loading-spinner" />
            </div>
          ) : machines.length > 0 ? (
            <div className="grid-3">
              {machines.map((machine) => (
                <MachineCard
                  key={machine.title}
                  machine={machine}
                  onEnquiry={handleEnquiry}
                  showStatus
                />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontSize: '1.125rem', color: 'var(--muted-foreground)', marginBottom: 24 }}>
                No machines available in this category at the moment.
              </p>
              <Link to="/contact" className="btn btn-primary">
                Contact Us for Availability
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMachine(null);
        }}
        machine={selectedMachine}
        enquiryType="Sales"
      />
    </Layout>
  );
}
