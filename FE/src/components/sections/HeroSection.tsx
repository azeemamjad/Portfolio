import React from 'react';
import { ArrowDown, Download, Mail, Github, Linkedin, Globe } from 'lucide-react';
import type { Portfolio } from '../../types';

interface HeroSectionProps {
  portfolio: Portfolio;
}

const HeroSection: React.FC<HeroSectionProps> = ({ portfolio }) => {
  const { username, name, tagline, profile_image, about } = portfolio;
  const displayName = name || username;

  const scrollToSection = (hash: string) => {
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const socialLinks = [
    { icon: Github, url: about?.github_url, label: 'GitHub' },
    { icon: Linkedin, url: about?.linkedin_url, label: 'LinkedIn' },
    { icon: Globe, url: about?.website_url, label: 'Website' },
  ].filter((l) => l.url);

  return (
    <section className="min-h-screen flex items-center justify-center section-padding pt-28 md:pt-32 relative">
      <div className="container-custom w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — Text content */}
          <div className="order-2 lg:order-1 space-y-7 animate-fade-in-up">
            {/* Greeting pill */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                          bg-primary-50 dark:bg-primary-950/50
                          border border-primary-200 dark:border-primary-800/60
                          text-primary-600 dark:text-primary-400 text-sm font-semibold
                          animate-fade-in"
            >
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              Available for work
            </div>

            {/* Name */}
            <div>
              <p className="text-base md:text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                Hi, I'm
              </p>
              <h1 className="heading-primary text-gray-900 dark:text-white">
                <span className="text-gradient-primary">{displayName}</span>
              </h1>
            </div>

            {/* Tagline */}
            {tagline && (
              <p className="text-xl md:text-2xl font-semibold text-gray-600 dark:text-gray-300 leading-snug">
                {tagline}
              </p>
            )}

            {/* Bio */}
            {about?.bio && (
              <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg">
                {about.bio.length > 180 ? `${about.bio.substring(0, 180)}…` : about.bio}
              </p>
            )}

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                onClick={() => scrollToSection('#contact')}
                className="btn-primary flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Get in Touch
              </button>

              {about?.resume_file && (
                <a
                  href={about.resume_file}
                  download
                  className="btn-outline flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Resume
                </a>
              )}
            </div>

            {/* Social links */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3 pt-1">
                {socialLinks.map(({ icon: Icon, url, label }) => (
                  <a
                    key={label}
                    href={url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-10 h-10 rounded-xl flex items-center justify-center
                               bg-gray-100 dark:bg-gray-800
                               hover:bg-primary-600 dark:hover:bg-primary-600
                               text-gray-600 dark:text-gray-400 hover:text-white
                               border border-gray-200 dark:border-gray-700
                               transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Right — Profile image */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end animate-fade-in">
            <div className="relative">
              {/* Glow rings */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 blur-3xl opacity-20 dark:opacity-30 animate-glow-pulse scale-110" />
              <div className="absolute inset-0 rounded-full border-2 border-primary-500/20 dark:border-primary-400/20 scale-[1.12] animate-spin-slow" />

              {profile_image ? (
                <img
                  src={profile_image}
                  alt={displayName}
                  className="relative w-52 h-52 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full object-cover
                             ring-4 ring-white dark:ring-gray-900
                             shadow-2xl shadow-primary-500/20 dark:shadow-primary-500/30
                             animate-float"
                />
              ) : (
                <div className="relative w-52 h-52 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full
                                bg-gradient-to-br from-primary-500 via-purple-500 to-pink-500
                                flex items-center justify-center
                                text-white text-7xl font-black
                                ring-4 ring-white dark:ring-gray-900
                                shadow-2xl shadow-primary-500/25
                                animate-float">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Floating badges */}
              <div className="absolute -bottom-3 -left-4 px-4 py-2 rounded-xl
                              bg-white dark:bg-gray-800 shadow-lg
                              border border-gray-100 dark:border-gray-700
                              text-sm font-semibold text-gray-800 dark:text-gray-200
                              animate-float" style={{ animationDelay: '1s' }}>
                💼 Open to hire
              </div>
              <div className="absolute -top-3 -right-4 px-4 py-2 rounded-xl
                              bg-primary-600 shadow-lg shadow-primary-500/30
                              text-sm font-semibold text-white
                              animate-float" style={{ animationDelay: '2s' }}>
                ✨ Full Stack
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-20">
          <button
            onClick={() => scrollToSection('#about')}
            className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500
                       hover:text-primary-500 dark:hover:text-primary-400
                       transition-colors duration-200 group"
            aria-label="Scroll down"
          >
            <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
            <ArrowDown className="w-5 h-5 animate-bounce-gentle group-hover:text-primary-500" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
