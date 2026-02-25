import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { portfolioAPI } from '../services/api';
import type { Portfolio } from '../types';

// Components
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import AnimatedBackground from '../components/common/AnimatedBackground';
import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import SkillsSection from '../components/sections/SkillsSection';
import ServicesSection from '../components/sections/ServicesSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import AchievementsSection from '../components/sections/AchievementsSection';
import TimelineSection from '../components/sections/TimelineSection';
import ContactSection from '../components/sections/ContactSection';

const PortfolioPage: React.FC = () => {
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
    <div className="min-h-screen bg-white dark:bg-gray-900 relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10">
        <Header username={portfolio.username} profileImage={portfolio.profile_image} />
        
        <main>
          <HeroSection portfolio={portfolio} />
          <AboutSection about={portfolio.about} />
          <TimelineSection achievements={portfolio.achievements} />
          <ProjectsSection projects={portfolio.projects} />
          <SkillsSection skills={portfolio.skills} />
          <ServicesSection services={portfolio.services} />
          <TestimonialsSection testimonials={portfolio.testimonials} />
          <AchievementsSection achievements={portfolio.achievements} />
          <ContactSection username={portfolio.username} email={portfolio.about?.email} />
        </main>

        <Footer username={portfolio.username} about={portfolio.about} />
      </div>
    </div>
  );
};

export default PortfolioPage;
