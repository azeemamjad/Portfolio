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
        <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-surface border border-line shadow-sm">
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover object-top"
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
};

export default TiltProfileImage;
