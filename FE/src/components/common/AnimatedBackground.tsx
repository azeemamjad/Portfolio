import React, { useEffect, useRef } from 'react';

const AnimatedBackground: React.FC = () => {
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

    const orbs: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      colorIndex: number;
    }> = [];

    const orbCount = 4;
    for (let i = 0; i < orbCount; i++) {
      orbs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: 250 + Math.random() * 350,
        colorIndex: i,
      });
    }

    const isDarkMode = () => document.documentElement.classList.contains('dark');

    // Dark mode: vivid colors; Light mode: subtle pastel tints
    const darkColors = [
      'rgba(99, 102, 241, 0.18)',   // indigo
      'rgba(168, 85, 247, 0.14)',   // purple
      'rgba(236, 72, 153, 0.10)',   // pink
      'rgba(59, 130, 246, 0.12)',   // blue
    ];
    const lightColors = [
      'rgba(99, 102, 241, 0.06)',
      'rgba(168, 85, 247, 0.05)',
      'rgba(236, 72, 153, 0.04)',
      'rgba(59, 130, 246, 0.05)',
    ];

    let animationFrameId: number;

    const animate = () => {
      const dark = isDarkMode();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < -orb.radius) orb.x = canvas.width + orb.radius;
        if (orb.x > canvas.width + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius) orb.y = canvas.height + orb.radius;
        if (orb.y > canvas.height + orb.radius) orb.y = -orb.radius;

        const color = dark ? darkColors[orb.colorIndex] : lightColors[orb.colorIndex];

        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Plus-sign SVG tile (indigo, will be tinted by opacity)
  const plusSvg = `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='15' y='9' width='2' height='14' rx='1' fill='%236366f1'/%3E%3Crect x='9' y='15' width='14' height='2' rx='1' fill='%236366f1'/%3E%3C/svg%3E")`;

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden">
      {/* Orb canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
      />
      {/* + pattern texture — subtle in light, slightly more visible in dark */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: plusSvg,
          backgroundSize: '32px 32px',
          opacity: 0.035,
          zIndex: 1,
        }}
      />
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          backgroundImage: plusSvg,
          backgroundSize: '32px 32px',
          opacity: 0.04,
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
