import React from 'react';
import { ArrowDown, Download } from 'lucide-react';
import type { Portfolio } from '../../types';

interface HeroSectionProps {
  portfolio: Portfolio;
}

const HeroSection: React.FC<HeroSectionProps> = ({ portfolio }) => {
  const { username, name, tagline, profile_image, about } = portfolio;
  const displayName = name || username;

  const scrollToAbout = () => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center section-padding pt-32">
      <div className="container-custom">
        <div className="flex flex-col items-center text-center gap-8 animate-fade-in">
          {/* Profile Image */}
          {profile_image && (
            <div className="relative animate-slide-up">
              <div className="absolute inset-0 bg-primary-600 rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <img
                src={profile_image}
                alt={username}
                className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover 
                         border-4 border-white dark:border-gray-800 shadow-2xl"
              />
            </div>
          )}

          {/* Main Heading */}
          <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h1 className="heading-primary">
              Hi, I'm <span className="text-gradient">{displayName}</span>
            </h1>
            {tagline && (
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {tagline}
              </p>
            )}
          </div>

          {/* Short Bio */}
          {about?.bio && (
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed
                        animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {about.bio.length > 200 ? `${about.bio.substring(0, 200)}...` : about.bio}
            </p>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 animate-slide-up" 
               style={{ animationDelay: '0.3s' }}>
            <button
              onClick={() => {
                const contactSection = document.querySelector('#contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="btn-primary"
            >
              Get in Touch
            </button>
            
            {about?.resume_file && (
              <a
                href={about.resume_file}
                download
                className="btn-outline flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Resume
              </a>
            )}
          </div>

          {/* Scroll Indicator */}
          <button
            onClick={scrollToAbout}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce 
                     text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 
                     transition-colors duration-200"
            aria-label="Scroll down"
          >
            <ArrowDown className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
