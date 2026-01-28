import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { EquipmentCard } from '@/components/EquipmentCard';
import { getMachines } from '@/lib/api';

const serviceCategories = [
  {
    title: 'Backhoe Loaders',
    category: 'Backhoe Loader',
    path: '/services/category/backhoe-loaders#machines-grid',
    imageKey: 'backhoe-loaders',
    description: 'Powerful and versatile machines ideal for excavation, loading, trenching, and earthwork operations.',
  },
  {
    title: 'Excavators',
    category: 'Excavator',
    path: '/services/category/excavators#machines-grid',
    imageKey: 'excavators',
    description: 'Heavy-duty excavators suitable for large-scale digging, demolition, and infrastructure projects.',
  },
  {
    title: 'Backhoe Loaders with Breakers',
    category: 'Backhoe Loader with Breaker',
    path: '/services/category/backhoe-breakers#machines-grid',
    imageKey: 'backhoe-breakers',
    description: 'Backhoe loaders equipped with hydraulic breakers for rock breaking and hard surface demolition.',
  },
];

export default function Services() {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const data = await getMachines();
        // Filter for Rental/Services purpose
        const rentalMachines = data.filter(m => m.purpose === 'Rental' || m.type === 'Rental');

        const newCounts = {};
        serviceCategories.forEach(cat => {
          newCounts[cat.category] = rentalMachines.filter(m => m.category === cat.category).length;
        });
        setCounts(newCounts);
      } catch (error) {
        console.error("Failed to fetch machine counts", error);
      }
    };

    fetchCounts();

    // Direct landing logic
    if (window.location.hash === '#machines-grid') {
      const machinesSection = document.getElementById('machines-grid');
      if (machinesSection) {
        setTimeout(() => {
          const navbarHeight = 90;
          const elementPosition = machinesSection.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPosition - navbarHeight,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }, [location.hash]);

  return (
    <Layout>
      {/* Page Header */}
      <section className="section-dark page-header" style={{ textAlign: 'center' }}>
        <div className="container">
          <span className="section-label" style={{ background: 'rgba(224, 122, 24, 0.2)', marginBottom: '16px' }}>Our Services</span>
          <h1 className="section-title">Equipment <span>Rental Services</span></h1>
          <p style={{ margin: '20px auto 0', maxWidth: '700px', color: 'rgba(255, 255, 255, 0.7)' }}>
            Choose from our range of well-maintained construction equipment available for rental.
            Flexible terms to suit your project needs in Chennai.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="section" id="machines-grid">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Choose Category</span>
            <h2 className="section-title">Select <span>Equipment Type</span></h2>
          </div>

          <div className="grid-3">
            {serviceCategories.map((category, index) => (
              <EquipmentCard
                key={index}
                title={category.title}
                description={category.description}
                path={category.path}
                buttonText="View Services"
                imageKey={category.imageKey}
              />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
