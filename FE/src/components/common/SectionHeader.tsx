import React from 'react';

interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
  className?: string;
  accent?: 'brand' | 'user';
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  label,
  title,
  description,
  className = '',
}) => {
  return (
    <div className={`section-header ${className}`}>
      <span className="section-label">
        <span className="section-label__rule" aria-hidden />
        {label}
      </span>
      <h2 className="heading-secondary text-content">{title}</h2>
      {description && (
        <p className="text-content-muted mt-4 max-w-xl text-base leading-relaxed">{description}</p>
      )}
    </div>
  );
};

export default SectionHeader;
