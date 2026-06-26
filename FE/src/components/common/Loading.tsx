import React from 'react';
import AnimatedBackground from './AnimatedBackground';

interface LoadingProps {
  label?: string;
  variant?: 'default' | 'company';
}

const Loading: React.FC<LoadingProps> = ({ label = 'Loading...', variant = 'default' }) => {
  const isCompany = variant === 'company';

  return (
    <div className={`loading-screen${isCompany ? ' company-theme' : ''}`}>
      <AnimatedBackground useAccent={isCompany} />
      <div className="loading-screen__content" role="status" aria-live="polite" aria-busy="true">
        <div className="loading-screen__orb" aria-hidden>
          <span className="loading-screen__ring loading-screen__ring--outer" />
          <span className="loading-screen__ring loading-screen__ring--inner" />
          <span className="loading-screen__core" />
        </div>
        <p className="loading-screen__label">{label}</p>
      </div>
    </div>
  );
};

export default Loading;
