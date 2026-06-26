import React, { createContext, useContext, useMemo } from 'react';
import { buildAccentCssVars, parseThemeColor, type AccentCssVars } from '../utils/color';

interface PortfolioAccentContextValue {
  accentColor: string;
  accentVars: AccentCssVars;
}

const PortfolioAccentContext = createContext<PortfolioAccentContextValue | null>(null);

interface PortfolioAccentProviderProps {
  themeColor?: string | null;
  children: React.ReactNode;
}

export const PortfolioAccentProvider: React.FC<PortfolioAccentProviderProps> = ({
  themeColor,
  children,
}) => {
  const accentColor = parseThemeColor(themeColor);
  const accentVars = useMemo(() => buildAccentCssVars(accentColor), [accentColor]);

  return (
    <PortfolioAccentContext.Provider value={{ accentColor, accentVars }}>
      <div className="portfolio-theme min-h-full" style={accentVars as React.CSSProperties}>
        {children}
      </div>
    </PortfolioAccentContext.Provider>
  );
};

export function usePortfolioAccent() {
  return useContext(PortfolioAccentContext);
}
