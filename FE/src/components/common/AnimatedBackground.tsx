import React, { useEffect, useState } from 'react';
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
  return value || '#635bff';
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  useAccent = false,
  accentHex,
}) => {
  const [accent, setAccent] = useState<string>(() => {
    if (typeof document === 'undefined') return accentHex ?? '#6366f1';
    if (accentHex) return accentHex;
    if (!useAccent) return '#6366f1';
    return readAccentHex();
  });

  useEffect(() => {
    if (!useAccent || accentHex) return;

    const observer = new MutationObserver(() => setAccent(readAccentHex()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    observer.observe(document.body, { childList: true, subtree: true });

    const raf = window.setTimeout(() => setAccent(readAccentHex()), 200);

    return () => {
      window.clearTimeout(raf);
      observer.disconnect();
    };
  }, [useAccent, accentHex]);

  const isDark =
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const baseAccent = accent || (useAccent ? '#635bff' : '#6366f1');
  const softAlpha = isDark ? 0.12 : 0.06;
  const softerAlpha = isDark ? 0.07 : 0.035;

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(60rem 60rem at 12% -10%, ${hexToRgba(baseAccent, softAlpha)}, transparent 60%),
            radial-gradient(50rem 50rem at 100% 8%, ${hexToRgba(baseAccent, softerAlpha)}, transparent 55%),
            radial-gradient(48rem 48rem at 50% 120%, ${hexToRgba(baseAccent, softerAlpha)}, transparent 60%)
          `,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg/60" />
    </div>
  );
};

export default AnimatedBackground;
