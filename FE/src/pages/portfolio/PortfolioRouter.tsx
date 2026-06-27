import React, { useEffect, useState } from 'react';
import { Routes, Route, useParams, useLocation } from 'react-router-dom';
import { portfolioAPI } from '../../services/api';
import type { Portfolio } from '../../types';
import {
  cachePortfolioThemes,
  readCachedPortfolioTheme,
  type PortfolioNavigationState,
} from '../../utils/portfolioThemeCache';

// Layout
import PortfolioLayout from '../../components/layouts/PortfolioLayout';
import { PortfolioAccentProvider } from '../../contexts/PortfolioAccentContext';

// Pages
import PortfolioHomePage from './PortfolioHomePage';
import AboutPage from './AboutPage';
import ProjectsPage from './ProjectsPage';
import SkillsPage from './SkillsPage';
import AchievementsPage from './AchievementsPage';
import ContactPage from './ContactPage';
import BlogPage from './BlogPage';
import BlogPostPage from './BlogPostPage';
import ProjectDetailPage from './ProjectDetailPage';

// Common
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

const PortfolioRouter: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const location = useLocation();
  const navState = location.state as PortfolioNavigationState | null;
  const prefetchThemeColor = navState?.themeColor ?? readCachedPortfolioTheme(username);
  const fromCompany = navState?.fromCompany === true;
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!username) {
        setError('Username is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await portfolioAPI.getPortfolio(username);
        setPortfolio(data);
        cachePortfolioThemes([{ username: data.username, themeColor: data.theme_color }]);
        
        // Update document title
        document.title = `${data.name || data.username} : Portfolio`;
        
        // Update theme color meta tag if available
        if (data.theme_color) {
          let metaThemeColor = document.querySelector('meta[name="theme-color"]');
          if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.setAttribute('name', 'theme-color');
            document.head.appendChild(metaThemeColor);
          }
          metaThemeColor.setAttribute('content', data.theme_color);
        }
      } catch (err: any) {
        console.error('Error fetching portfolio:', err);
        if (err.response?.status === 404) {
          setError(`Portfolio not found for username: ${username}`);
        } else {
          setError('Failed to load portfolio. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [username]);

  if (loading) {
    const loadingVariant = prefetchThemeColor
      ? 'default'
      : fromCompany
        ? 'company'
        : 'neutral';

    return (
      <Loading
        label="Loading portfolio..."
        themeColor={prefetchThemeColor}
        variant={loadingVariant}
      />
    );
  }

  if (error || !portfolio) {
    return <ErrorMessage message={error || 'Portfolio not found'} />;
  }

  return (
    <PortfolioAccentProvider themeColor={portfolio.theme_color}>
      <PortfolioLayout username={portfolio.username} name={portfolio.name} profileImage={portfolio.profile_image}>
        <Routes>
          <Route path="/" element={<PortfolioHomePage portfolio={portfolio} />} />
          <Route path="/about" element={<AboutPage about={portfolio.about} username={portfolio.username} />} />
          <Route path="/projects" element={<ProjectsPage projects={portfolio.projects} username={portfolio.username} />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/skills" element={<SkillsPage skills={portfolio.skills} />} />
          <Route path="/achievements" element={<AchievementsPage achievements={portfolio.achievements} />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route
            path="/contact"
            element={
              <ContactPage
                username={portfolio.username}
                about={portfolio.about}
              />
            }
          />
        </Routes>
      </PortfolioLayout>
    </PortfolioAccentProvider>
  );
};

export default PortfolioRouter;
