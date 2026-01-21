import { Layout } from '@/components/layout/Layout';
import { EquipmentCard } from '@/components/EquipmentCard';

const salesCategories = [
  {
    title: 'Backhoe Loaders',
    description: 'Powerful and versatile machines ideal for excavation, loading, trenching, and earthwork operations.',
    path: '/sales/backhoe-loaders',
    imageKey: 'backhoe-loaders',
  },
  {
    title: 'Excavators',
    description: 'Heavy-duty excavators suitable for large-scale digging, demolition, and infrastructure projects.',
    path: '/sales/excavators',
    imageKey: 'excavators',
  },
  {
    title: 'Backhoe Loaders with Breakers',
    description: 'Backhoe loaders equipped with hydraulic breakers for rock breaking and hard surface demolition.',
    path: '/sales/backhoe-breakers',
    imageKey: 'backhoe-breakers',
  },
];

export default function Sales() {
  return (
    <Layout>
      {/* Page Header */}
      <section className="section-dark page-header" style={{ textAlign: 'center' }}>
        <div className="container">
          <span className="section-label" style={{ background: 'rgba(224, 122, 24, 0.2)', marginBottom: '16px' }}>Equipment Sales</span>
          <h1 className="section-title">Buy Quality <span>Equipment</span></h1>
          <p style={{ margin: '20px auto 0', maxWidth: '700px', color: 'rgba(255, 255, 255, 0.7)' }}>
            Own premium construction equipment. Our machines are well-maintained
            and ready for years of reliable performance.
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
            {salesCategories.map((category, index) => (
              <EquipmentCard
                key={index}
                title={category.title}
                description={category.description}
                path={category.path}
                buttonText="View Machines"
                imageKey={category.imageKey}
              />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
