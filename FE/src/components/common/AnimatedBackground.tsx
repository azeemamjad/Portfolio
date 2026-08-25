import React, { useEffect, useRef } from 'react';
import { hexToRgba } from '../../utils/color';

interface AnimatedBackgroundProps {
  useAccent?: boolean;
  accentHex?: string;
}

function readAccentHex(): string {
  const portfolioEl = document.querySelector('.portfolio-theme');
  if (portfolioEl) {
    const portfolioAccent = getComputedStyle(portfolioEl).getPropertyValue('--accent').trim();
    if (portfolioAccent) return portfolioAccent;
  }
  const companyEl = document.querySelector('.company-theme');
  if (companyEl) {
    const companyAccent = getComputedStyle(companyEl).getPropertyValue('--accent').trim();
    if (companyAccent) return companyAccent;
  }
  const value = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  return value || '#f97316';
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  useAccent = false,
  accentHex,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const orbs = Array.from({ length: 2 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      radius: 280 + Math.random() * 180,
      colorIndex: i,
    }));

    const isDarkMode = () => document.documentElement.classList.contains('dark');

    const getPalette = () => {
      const accent = accentHex ?? (useAccent ? readAccentHex() : '#6366f1');
      const darkAlphas = [0.08, 0.05];
      const lightAlphas = [0.035, 0.025];
      const alphas = isDarkMode() ? darkAlphas : lightAlphas;
      return alphas.map((a) => hexToRgba(accent, a));
    };

    let animationFrameId: number;

    const animate = () => {
      const colors = getPalette();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < -orb.radius) orb.x = canvas.width + orb.radius;
        if (orb.x > canvas.width + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius) orb.y = canvas.height + orb.radius;
        if (orb.y > canvas.height + orb.radius) orb.y = -orb.radius;

        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        gradient.addColorStop(0, colors[orb.colorIndex % colors.length]);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const observer = new MutationObserver(() => {
      /* palette refresh on theme / accent change */
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [useAccent, accentHex]);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden" aria-hidden>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg/40" />
    </div>
  );
};

export default AnimatedBackground;
