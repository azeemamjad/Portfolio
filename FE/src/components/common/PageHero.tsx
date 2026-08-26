import React from 'react';

interface PageHeroProps {
  label: string;
  title: string;
  highlight?: string;
  description?: string;
}

const PageHero: React.FC<PageHeroProps> = ({ label, title, highlight, description }) => {
  return (
    <section className="page-hero">
      <div className="container-custom">
        <div className="max-w-3xl">
          <span className="section-label text-accent-600 dark:text-accent-400">
            <span className="section-label__rule" aria-hidden />
            {label}
          </span>
          <h1 className="page-hero__title text-content">
            {title}
            {highlight ? ` ${highlight}` : ''}
          </h1>
          {description && (
            <p className="page-hero__desc text-content-muted max-w-2xl">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PageHero;
