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
    description: 'Versatile machines for digging, loading, and material handling on construction sites.',
  },
  'excavators': {
    title: 'Excavators',
    category: 'Excavator',
    description: 'Powerful excavators for heavy-duty digging, trenching, and earthmoving projects.',
  },
  'backhoe-breakers': {
    title: 'Backhoe Loaders with Breakers',
    category: 'Backhoe Loader with Breaker',
    description: 'Backhoe loaders equipped with hydraulic breakers for rock breaking and hard surface demolition.',
    image: 'https://res.cloudinary.com/dgchj39y2/image/upload/v1737471649/heavy_horizon/categories/backhoe-breaker-category.jpg',
  },
};

// Sample data for UI preview
const sampleMachines = [
  { title: 'JCB 3DX', category: 'Backhoe Loader', purpose: 'Rental', model: '3DX', year: 2020, hours: 5200, condition: 'Pure Earthwork Condition', images: ['https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800'], status: 'Available' },
  { title: 'JCB 2DX', category: 'Backhoe Loader', purpose: 'Rental', model: '2DX', year: 2019, hours: 6100, condition: 'Good Condition', images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'], status: 'Available' },
  { title: 'CAT 424B', category: 'Backhoe Loader', purpose: 'Rental', model: '424B', year: 2018, hours: 6800, condition: 'Good Condition', images: ['https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800'], status: 'Available' },
  { title: 'CASE 770EX', category: 'Backhoe Loader', purpose: 'Rental', model: '770EX', year: 2021, hours: 4500, condition: 'Pure Earthwork Condition', images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'], status: 'Available' },
  { title: 'JCB 3DX Plus', category: 'Backhoe Loader', purpose: 'Rental', model: '3DX Plus', year: 2022, hours: 3800, condition: 'Good Condition', images: ['https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800'], status: 'Available' },
  { title: 'CAT 320D', category: 'Excavator', purpose: 'Rental', model: '320D', year: 2019, hours: 7200, condition: 'Good Condition', images: ['https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800'], status: 'Available' },
  { title: 'Hyundai R210', category: 'Excavator', purpose: 'Rental', model: 'R210', year: 2020, hours: 6500, condition: 'Pure Earthwork Condition', images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'], status: 'Available' },
  { title: 'Volvo EC210', category: 'Excavator', purpose: 'Rental', model: 'EC210', year: 2021, hours: 4800, condition: 'Good Condition', images: ['https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800'], status: 'Available' },
  { title: 'Tata Hitachi EX200', category: 'Excavator', purpose: 'Rental', model: 'EX200', year: 2018, hours: 8100, condition: 'Good Condition', images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'], status: 'Available' },
  { title: 'Komatsu PC210', category: 'Excavator', purpose: 'Rental', model: 'PC210', year: 2019, hours: 7000, condition: 'Pure Earthwork Condition', images: ['https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800'], status: 'Available' },
  { title: 'JCB 3DX with Hydraulic Breaker', category: 'Backhoe Loader with Breaker', purpose: 'Rental', model: '3DX Breaker', year: 2020, hours: 5400, condition: 'Good Condition', images: ['https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800'], status: 'Available' },
  { title: 'CASE 770EX Breaker Model', category: 'Backhoe Loader with Breaker', purpose: 'Rental', model: '770EX Breaker', year: 2019, hours: 6200, condition: 'Good Condition', images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'], status: 'Available' },
  { title: 'CAT 424B with Rock Breaker', category: 'Backhoe Loader with Breaker', purpose: 'Rental', model: '424B Rock', year: 2018, hours: 7000, condition: 'Good Condition', images: ['https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800'], status: 'Available' },
  { title: 'JCB 3DX EcoX with Breaker', category: 'Backhoe Loader with Breaker', purpose: 'Rental', model: '3DX EcoX', year: 2021, hours: 4600, condition: 'Pure Earthwork Condition', images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'], status: 'Available' },
  { title: 'JCB 3DX Super with Breaker', category: 'Backhoe Loader with Breaker', purpose: 'Rental', model: '3DX Super', year: 2022, hours: 3900, condition: 'Good Condition', images: ['https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800'], status: 'Available' },
];

export default function ServiceCategory() {
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
      const data = await getMachines('Rental', info.category);
      if (data.length > 0) {
        setMachines(data);
      } else {
        // Use sample data filtered by category
        const filtered = sampleMachines.filter(m => m.category === info.category);
        setMachines(filtered);
      }
      setIsLoading(false);
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
            <Link to="/services" className="btn btn-primary" style={{ marginTop: 24 }}>
              Back to Services
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Page Header */}
      <section
        className="section-dark page-header"
        style={info.image ? {
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${info.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      >
        <div className="container">
          <div className="breadcrumb">
            <Link to="/services">Our Services</Link>
            <span>/</span>
            <span>{info.title}</span>
          </div>
          <span className="section-label">Rental Equipment</span>
          <h1 className="section-title">{info.title.split(' ')[0]} <span>{info.title.split(' ').slice(1).join(' ') || info.title}</span></h1>
          <p>{info.description}</p>
          <div className="results-count-label">
            {machines.length > 0 ? (
              <>
                <span>{machines.length}</span> {machines.length === 1 ? 'machine' : 'machines'} available
              </>
            ) : (
              "No machines available in this category"
            )}
          </div>
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
        enquiryType="Rental"
      />
    </Layout>
  );
}
