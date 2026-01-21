import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { EquipmentCard } from '@/components/EquipmentCard';
import heroImage from '@/assets/hero-construction.jpg';

const equipmentCategories = [
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

const features = [
  {
    title: 'Pure Earthwork Condition',
    description: 'All our equipment is maintained in pure earthwork condition, ensuring maximum performance and reliability.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  {
    title: 'Experienced Support Team',
    description: 'Our expert team provides technical support and guidance throughout your rental or purchase journey.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: 'On-Time Delivery',
    description: 'We ensure timely delivery and pickup of equipment across Chennai and surrounding areas.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Trusted by Contractors',
    description: 'Years of serving construction contractors in Chennai has built our reputation for reliability.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
];

export default function Index() {
  return (
    <Layout>
      {/* 1. Hero Section - Dark Theme as per Image 0 */}
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: `url(${heroImage})` }}>
          <div className="hero-overlay" style={{ background: 'linear-gradient(to right, rgba(28, 28, 28, 0.9) 0%, rgba(224, 122, 24, 0.3) 100%)' }} />
        </div>

        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
              TRUSTED EQUIPMENT PARTNER
            </div>

            <h1 className="hero-title">
              RELIABLE EARTHWORK & <br />
              <span>CONSTRUCTION</span> EQUIPMENT
            </h1>

            <p className="hero-description">
              Premium backhoe loaders and excavators for rent and sale.
              Well-maintained machines for all your earthwork and construction needs.
            </p>

            <p className="hero-location">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              Chennai, Tamil Nadu
            </p>

            <div className="hero-buttons">
              <Link to="/services" className="btn btn-primary btn-lg">
                OUR SERVICES
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link to="/contact" className="btn btn-outline btn-lg">
                CONTACT US
              </Link>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <span>SCROLL TO EXPLORE</span>
          <div className="scroll-mouse">
            <div className="scroll-dot" />
          </div>
        </div>
      </section>

      {/* 2. About Section - White Theme as per Image 1 */}
      <section className="section section-white">
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: '80px', gridTemplateColumns: '1fr 1.2fr' }}>
            <div className="about-content">
              <span className="section-label">ABOUT US</span>
              <h2 className="section-title">
                YOUR TRUSTED PARTNER IN <br />
                <span>HEAVY EQUIPMENT</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '20px', lineHeight: '1.7' }}>
                Heavy Horizon provides well-maintained backhoe loaders and excavators
                for rental and sale across Chennai and nearby regions. We focus on
                reliability, performance, and customer satisfaction.
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '32px', lineHeight: '1.7' }}>
                With years of experience in the construction equipment industry, we
                understand the demands of modern construction projects. Our fleet is
                regularly serviced and maintained to ensure peak performance on your job site.
              </p>
              <Link to="/contact" className="btn btn-outline-dark" style={{ padding: '12px 28px' }}>
                GET IN TOUCH
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="16" height="16">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            <div className="features-grid-alt">
              {features.map((feature, index) => (
                <div key={index} className="feature-card-detailed">
                  <div className="feature-icon" style={{ borderRadius: '10px', width: '40px', height: '40px', marginBottom: '16px' }}>
                    {feature.icon}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', marginBottom: '8px', textTransform: 'uppercase' }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', lineHeight: '1.5' }}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Our Equipment Section - White Theme as per Image 2 */}
      <section className="section section-muted">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="section-label" style={{ margin: '0 auto 16px' }}>OUR EQUIPMENT</span>
            <h2 className="section-title" style={{ fontSize: '3rem' }}>PREMIUM <span>MACHINERY</span></h2>
          </div>

          <div className="grid-3">
            {equipmentCategories.map((item, index) => (
              <EquipmentCard
                key={index}
                title={item.title}
                description={item.description}
                path={item.path}
                buttonText="VIEW MORE"
                imageKey={item.imageKey}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Why Choose Us - Dark Section as per Image 3 */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="section-label" style={{ margin: '0 auto 16px', background: 'rgba(255, 255, 255, 0.1)', color: 'var(--primary)' }}>WHY HEAVY HORIZON</span>
            <h2 className="section-title" style={{ color: 'var(--white)', fontSize: '3rem' }}>WHY <span>CHOOSE US</span></h2>
          </div>

          <div className="grid-3" style={{ textAlign: 'center', gap: '40px' }}>
            {features.slice(0, 3).map((feature, index) => (
              <div key={index} className="why-us-item">
                <div className="feature-icon" style={{ margin: '0 auto 24px', width: '64px', height: '64px', background: 'var(--primary)', color: 'var(--white)' }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '16px', textTransform: 'uppercase', color: 'var(--white)' }}>
                  {feature.title}
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1rem', lineHeight: '1.7', maxWidth: '300px', margin: '0 auto' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <Link to="/contact" className="btn btn-primary btn-lg" style={{ padding: '16px 40px' }}>
              GET STARTED TODAY
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
