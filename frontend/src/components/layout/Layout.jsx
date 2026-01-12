import { useLocation, useNavigationType } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import '../../styles/main.css';

export function Layout({ children }) {
  const location = useLocation();
  const navigationType = useNavigationType();
  
  // Determine animation class based on navigation type
  const getAnimationClass = () => {
    switch (navigationType) {
      case 'PUSH':
        return 'page-slide-in';
      case 'POP':
        return 'page-slide-back';
      default:
        return 'page-fade-in';
    }
  };

  return (
    <div className="app">
      <Header />
      <main key={location.pathname} className={getAnimationClass()}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
