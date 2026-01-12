import { Layout } from '@/components/layout/Layout';
import { EquipmentCard } from '@/components/EquipmentCard';

const serviceCategories = [
  {
    title: 'Backhoe Loaders',
    description: 'Powerful and versatile machines ideal for excavation, loading, trenching, and earthwork operations.',
    path: '/services/backhoe-loaders',
    imageKey: 'backhoe-loaders',
  },
  {
    title: 'Excavators',
    description: 'Heavy-duty excavators suitable for large-scale digging, demolition, and infrastructure projects.',
    path: '/services/excavators',
    imageKey: 'excavators',
  },
  {
    title: 'Backhoe Loaders with Breakers',
    description: 'Backhoe loaders equipped with hydraulic breakers for rock breaking and hard surface demolition.',
    path: '/services/backhoe-breakers',
    imageKey: 'backhoe-breakers',
  },
];

export default function Services() {
  return (
    <Layout>
      {/* Page Header */}
      <section className="section-dark page-header">
        <div className="container">
          <span className="section-label">Our Services</span>
          <h1 className="section-title">Equipment <span>Rental Services</span></h1>
          <p>
            Choose from our range of well-maintained construction equipment available for rental. 
            Flexible terms to suit your project needs in Chennai.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
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
