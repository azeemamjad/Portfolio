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
        <div className="max-w-3xl mx-auto text-center">
          <span className="section-label text-accent-600 dark:text-accent-400">{label}</span>
          <h1 className="page-hero__title text-content">
            {title}{' '}
            {highlight && <span className="text-gradient">{highlight}</span>}
          </h1>
          {description && (
            <p className="page-hero__desc text-content-muted max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PageHero;
