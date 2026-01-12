import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <section className="section not-found">
        <div className="not-found-content">
          <div className="not-found-code">404</div>
          <h2 className="section-title" style={{ marginBottom: 16 }}>Page Not Found</h2>
          <p style={{ color: 'var(--muted-foreground)', marginBottom: 32, maxWidth: 400 }}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="btn btn-primary btn-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="16" height="16">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            Back to Home
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
