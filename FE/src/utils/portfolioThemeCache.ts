const KEY_PREFIX = 'portfolio-theme:';

export function cachePortfolioThemes(entries: Array<{ username: string; themeColor: string }>) {
  try {
    entries.forEach(({ username, themeColor }) => {
      if (username && themeColor) {
        sessionStorage.setItem(`${KEY_PREFIX}${username}`, themeColor);
      }
    });
  } catch {
    /* sessionStorage unavailable */
  }
}

export function readCachedPortfolioTheme(username?: string | null): string | null {
  if (!username) return null;
  try {
    return sessionStorage.getItem(`${KEY_PREFIX}${username}`);
  } catch {
    return null;
  }
}

export type PortfolioNavigationState = {
  themeColor?: string;
  fromCompany?: boolean;
};
