import React, { useMemo } from 'react';
import AnimatedBackground from './AnimatedBackground';
import { buildAccentCssVars } from '../../utils/color';

interface LoadingProps {
  label?: string;
  variant?: 'default' | 'company' | 'neutral';
  themeColor?: string | null;
}

const Loading: React.FC<LoadingProps> = ({
  label = 'Loading...',
  variant = 'default',
  themeColor,
}) => {
  const isCompany = variant === 'company';
  const isNeutral = variant === 'neutral';
  const accentVars = useMemo(
    () => (themeColor && !isCompany && !isNeutral ? buildAccentCssVars(themeColor) : null),
    [themeColor, isCompany, isNeutral],
  );
  const useThemedAccent = isCompany || Boolean(accentVars) || isNeutral;
  const accentHex = accentVars?.['--accent'] ?? (isCompany ? '#3b82f6' : isNeutral ? '#94a3b8' : undefined);

  return (
    <div
      className={`loading-screen${isCompany ? ' company-theme' : ''}${accentVars ? ' portfolio-theme' : ''}${isNeutral ? ' loading-screen--neutral' : ''}`}
      style={accentVars ?? undefined}
    >
      <AnimatedBackground useAccent={useThemedAccent} accentHex={accentHex} />
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
