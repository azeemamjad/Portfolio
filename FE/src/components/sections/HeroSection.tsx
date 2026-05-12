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
    { icon: Github,   url: about?.github_url,   label: 'GitHub' },
    { icon: Linkedin, url: about?.linkedin_url,  label: 'LinkedIn' },
    { icon: Globe,    url: about?.website_url,   label: 'Website' },
  ].filter((l) => l.url);

  return (
    <section className="min-h-screen flex items-center justify-center section-padding pt-28 md:pt-32 relative">
      <div className="container-custom w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — Text content */}
          <div className="order-2 lg:order-1 space-y-7 animate-fade-in-up">
            {/* Greeting pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                            bg-amber-50 border border-amber-200
                            text-amber-700 text-sm font-semibold animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              Available for work
            </div>

            {/* Name */}
            <div>
              <p className="text-base md:text-lg font-medium text-amber-600 mb-2">
                Hi, I'm
              </p>
              <h1 className="heading-primary text-neutral-900">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-500">
                  {displayName}
                </span>
              </h1>
            </div>

            {/* Tagline */}
            {tagline && (
              <p className="text-xl md:text-2xl font-semibold text-neutral-700 leading-snug">
                {tagline}
              </p>
            )}

            {/* Bio */}
            {about?.bio && (
              <p className="text-base md:text-lg text-neutral-500 leading-relaxed max-w-lg">
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
                               bg-white/80 text-neutral-500 border border-neutral-200
                               hover:border-orange-400 hover:text-orange-600 hover:bg-white
                               transition-all duration-300 hover:-translate-y-1"
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
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 blur-3xl opacity-15 animate-glow-pulse scale-110" />
              <div className="absolute inset-0 rounded-full border-2 border-orange-400/20 scale-[1.12] animate-spin-slow" />

              {profile_image ? (
                <img
                  src={profile_image}
                  alt={displayName}
                  className="relative w-52 h-52 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full object-cover
                             ring-4 ring-white shadow-2xl shadow-orange-500/15 animate-float"
                />
              ) : (
                <div className="relative w-52 h-52 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full
                                bg-gradient-to-br from-orange-500 via-amber-500 to-red-500
                                flex items-center justify-center text-white text-7xl font-black
                                ring-4 ring-white shadow-2xl shadow-orange-500/20 animate-float">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Floating badges */}
              <div className="absolute -bottom-3 -left-4 px-4 py-2 rounded-xl
                              bg-white shadow-md border border-neutral-100
                              text-sm font-semibold text-neutral-800
                              animate-float" style={{ animationDelay: '1s' }}>
                💼 Open to hire
              </div>
              <div className="absolute -top-3 -right-4 px-4 py-2 rounded-xl
                              bg-orange-500 shadow-md
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
            className="flex flex-col items-center gap-2 text-neutral-400
                       hover:text-orange-600 transition-colors duration-200 group"
            aria-label="Scroll down"
          >
            <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
            <ArrowDown className="w-5 h-5 animate-bounce-gentle" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
