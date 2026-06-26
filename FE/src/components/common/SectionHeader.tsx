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
  accent = 'user',
}) => {
  const labelClass =
    accent === 'brand'
      ? 'text-primary-600 dark:text-primary-400'
      : 'text-accent-600 dark:text-accent-400';

  return (
    <div className={`section-header ${className}`}>
      <span className={`section-label ${labelClass}`}>{label}</span>
      <h2 className="heading-secondary text-content">{title}</h2>
      <div className="section-underline" />
      {description && (
        <p className="text-content-muted mt-5 max-w-xl mx-auto text-base">{description}</p>
      )}
    </div>
  );
};

export default SectionHeader;
