import React from 'react';

interface TiltProfileImageProps {
  src: string;
  alt: string;
  className?: string;
}

const TiltProfileImage: React.FC<TiltProfileImageProps> = ({ src, alt, className = '' }) => {
  return (
    <div className={`tilt-profile ${className}`}>
      <div className="tilt-profile__inner">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-surface ring-1 ring-line shadow-[0_1px_2px_rgba(0,0,0,0.05),0_28px_56px_-24px_rgba(0,0,0,0.3)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_28px_56px_-24px_rgba(0,0,0,0.65)]">
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover object-top"
            loading="eager"
          />
          {/* Subtle accent glow wash — Apple-like depth without heavy shadows */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(200deg, color-mix(in oklch, var(--accent) 12%, transparent) 0%, transparent 42%)',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TiltProfileImage;
