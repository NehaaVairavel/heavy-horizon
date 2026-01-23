import { Link } from 'react-router-dom';
import jcbBackhoeImg from '@/assets/jcb-backhoe.jpg';
import hitachiExcavatorImg from '@/assets/hitachi-excavator.jpg';

// Image mapping for equipment categories
export const equipmentImages = {
  'backhoe-loaders': jcbBackhoeImg,
  'excavators': hitachiExcavatorImg,
  'backhoe-breakers': 'https://res.cloudinary.com/dgchj39y2/image/upload/v1737471649/heavy_horizon/categories/backhoe-breaker-category.jpg',
};

export function EquipmentCard({ title, description, path, buttonText, imageKey }) {
  const imageSrc = equipmentImages[imageKey] || jcbBackhoeImg;

  return (
    <Link to={path} className="card equipment-card">
      <div className="card-image">
        <img src={imageSrc} alt={`${title} equipment category`} loading="lazy" />
      </div>
      <div className="card-body">
        <h3 className="card-title" style={{ textTransform: 'uppercase' }}>{title}</h3>
        <p className="card-description" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
          {description}
        </p>
        <div style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {buttonText}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" width="14" height="14">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
