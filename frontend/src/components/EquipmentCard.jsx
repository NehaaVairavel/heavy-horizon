import { Link } from 'react-router-dom';
import jcbBackhoeImg from '@/assets/jcb-backhoe.jpg';
import hitachiExcavatorImg from '@/assets/hitachi-excavator.jpg';

// Image mapping for equipment categories
export const equipmentImages = {
  'backhoe-loaders': jcbBackhoeImg,
  'excavators': hitachiExcavatorImg,
  'backhoe-breakers': jcbBackhoeImg,
};

export function EquipmentCard({ title, description, path, buttonText, imageKey }) {
  const imageSrc = equipmentImages[imageKey] || jcbBackhoeImg;

  return (
    <Link to={path} className="card equipment-card">
      <div className="card-image">
        <img src={imageSrc} alt={`${title} equipment category`} loading="lazy" />
      </div>
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
        <span className="card-link">
          {buttonText}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
