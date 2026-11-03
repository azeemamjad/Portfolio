import React, { useEffect, useState } from 'react';
import { Routes, Route, useParams, useLocation } from 'react-router-dom';
import { portfolioAPI } from '../../services/api';
import type { Portfolio } from '../../types';
import {
  cachePortfolioThemes,
  readCachedPortfolioTheme,
  type PortfolioNavigationState,
} from '../../utils/portfolioThemeCache';
import { useRouteMetadata } from '../../utils/routeMetadata';

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

        // Update theme color meta tag if available.
        // Route titles/descriptions are owned by each page via useRouteMetadata.
        if (data.theme_color) {
          let metaThemeColor = document.querySelector('meta[name="theme-color"]');
          if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.setAttribute('name', 'theme-color');
            document.head.appendChild(metaThemeColor);
          }
          metaThemeColor.setAttribute('content', data.theme_color);
        }
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } })?.response?.status;
        console.error('Error fetching portfolio:', err);
        if (status === 404) {
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

  useRouteMetadata({
    title: error ? `Portfolio not found — ${username ?? ''}`.trim() : 'Portfolio',
    path: username ? `/${username}` : '/',
  });

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

  const displayName = portfolio.name || portfolio.username;
  const about = portfolio.about;

  return (
    <PortfolioAccentProvider themeColor={portfolio.theme_color}>
      <PortfolioLayout
        username={portfolio.username}
        name={displayName}
        profileImage={portfolio.profile_image}
        resumeUrl={about?.resume_file || null}
        email={about?.email || ''}
        githubUrl={about?.github_url || ''}
        linkedinUrl={about?.linkedin_url || ''}
      >
        <Routes>
          <Route path="/" element={<PortfolioHomePage portfolio={portfolio} />} />
          <Route path="/about" element={<AboutPage about={about} username={portfolio.username} achievements={portfolio.achievements} displayName={displayName} tagline={portfolio.tagline} />} />
          <Route path="/projects" element={<ProjectsPage projects={portfolio.projects} username={portfolio.username} displayName={displayName} tagline={portfolio.tagline} />} />
          <Route
            path="/projects/:slug"
            element={
              <ProjectDetailPage
                username={portfolio.username}
                displayName={displayName}
                profileImage={portfolio.profile_image}
              />
            }
          />
          <Route path="/skills" element={<SkillsPage skills={portfolio.skills} username={portfolio.username} displayName={displayName} tagline={portfolio.tagline} />} />
          <Route path="/achievements" element={<AchievementsPage achievements={portfolio.achievements} username={portfolio.username} displayName={displayName} tagline={portfolio.tagline} />} />
          <Route path="/blog" element={<BlogPage username={portfolio.username} displayName={displayName} tagline={portfolio.tagline} />} />
          <Route path="/blog/:slug" element={<BlogPostPage username={portfolio.username} displayName={displayName} tagline={portfolio.tagline} />} />
          <Route
            path="/contact"
            element={
              <ContactPage
                username={portfolio.username}
                about={about}
                displayName={displayName}
                tagline={portfolio.tagline}
              />
            }
          />
        </Routes>
      </PortfolioLayout>
    </PortfolioAccentProvider>
  );
};

export default PortfolioRouter;
