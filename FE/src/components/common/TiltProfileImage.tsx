import React, { useCallback, useRef, useState } from 'react';

interface TiltProfileImageProps {
  src: string;
  alt: string;
  className?: string;
}

const MAX_TILT = 12;

const TiltProfileImage: React.FC<TiltProfileImageProps> = ({ src, alt, className = '' }) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, scale: 1 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const resetTilt = useCallback(() => {
    setIsHovering(false);
    setTilt({ rotateX: 0, rotateY: 0, scale: 1 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const frame = frameRef.current;
    if (!frame) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const rect = frame.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    setIsHovering(true);
    setTilt({
      rotateX: (0.5 - y) * MAX_TILT,
      rotateY: (x - 0.5) * MAX_TILT,
      scale: 1.025,
    });
    setGlare({ x: x * 100, y: y * 100, opacity: 0.22 });
  }, []);

  return (
    <div
      ref={frameRef}
      className={`tilt-profile ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
    >
      <div
        className="tilt-profile__inner"
        style={{
          transform: `perspective(900px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(${tilt.scale}, ${tilt.scale}, ${tilt.scale})`,
          transition: isHovering
            ? 'transform 0.12s ease-out'
            : 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="relative rounded-2xl bg-surface p-2 shadow-xl border border-line">
          <div className="rounded-xl overflow-hidden aspect-[4/5] ring-1 ring-accent/25 relative">
            <img src={src} alt={alt} className="w-full h-full object-cover object-top" />
            <div
              className="tilt-profile__glare"
              style={{
                background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent 55%)`,
                opacity: glare.opacity > 0 ? 1 : 0,
              }}
              aria-hidden
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TiltProfileImage;
