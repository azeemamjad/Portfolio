import React, { useEffect, useState } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { portfolioAPI } from '../../services/api';
import type { Portfolio } from '../../types';

// Layout
import PortfolioLayout from '../../components/layouts/PortfolioLayout';

// Pages
import PortfolioHomePage from './PortfolioHomePage';
import AboutPage from './AboutPage';
import ProjectsPage from './ProjectsPage';
import SkillsPage from './SkillsPage';
import AchievementsPage from './AchievementsPage';
import ContactPage from './ContactPage';

// Common
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

const PortfolioRouter: React.FC = () => {
  const { username } = useParams<{ username: string }>();
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
        
        // Update document title
        document.title = `${data.username}'s Portfolio`;
        
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
    return <Loading />;
  }

  if (error || !portfolio) {
    return <ErrorMessage message={error || 'Portfolio not found'} />;
  }

  return (
    <PortfolioLayout username={portfolio.username} name={portfolio.name} profileImage={portfolio.profile_image}>
      <Routes>
        <Route path="/" element={<PortfolioHomePage portfolio={portfolio} />} />
        <Route path="/about" element={<AboutPage about={portfolio.about} />} />
        <Route path="/projects" element={<ProjectsPage projects={portfolio.projects} />} />
        <Route path="/skills" element={<SkillsPage skills={portfolio.skills} />} />
        <Route path="/achievements" element={<AchievementsPage achievements={portfolio.achievements} />} />
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
  );
};

export default PortfolioRouter;
