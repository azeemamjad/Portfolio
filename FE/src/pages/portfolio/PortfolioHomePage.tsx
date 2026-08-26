import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Github, Linkedin, Mail } from 'lucide-react';
import type { Portfolio } from '../../types';
import TimelineSection from '../../components/sections/TimelineSection';
import FeaturedProjectsSection from '../../components/sections/FeaturedProjectsSection';
import SkillsMarquee from '../../components/common/SkillsMarquee';
import TiltProfileImage from '../../components/common/TiltProfileImage';

interface PortfolioHomePageProps {
  portfolio: Portfolio;
}

const PortfolioHomePage: React.FC<PortfolioHomePageProps> = ({ portfolio }) => {
  const { username, name, tagline, profile_image, about, projects, skills, achievements } = portfolio;
  const displayName = name || username;

  const featuredProjects = projects.filter((p) => p.is_featured);

  const socialLinks = [
    { href: about?.github_url, label: 'GitHub', icon: Github },
    { href: about?.linkedin_url, label: 'LinkedIn', icon: Linkedin },
    { href: about?.email ? `mailto:${about.email}` : '', label: 'Email', icon: Mail },
  ].filter((link) => Boolean(link.href));

  return (
    <div>
      <section className="pb-24 md:pb-32 pt-16 md:pt-24 relative overflow-hidden">
        <div className="container-custom w-full">
          <div
            className={`grid grid-cols-1 gap-12 lg:gap-16 items-center ${
              profile_image ? 'lg:grid-cols-12' : 'max-w-3xl'
            }`}
          >
            <div className={profile_image ? 'lg:col-span-7 order-2 lg:order-1' : ''}>
              <p className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.16em] text-content-muted mb-6">
                <span className="inline-block w-6 h-px bg-content-muted/40" aria-hidden />
                Software engineer
              </p>

              <h1 className="heading-primary text-content mb-5">
                {displayName}
              </h1>

              {tagline && (
                <p className="text-lg md:text-xl text-content-muted mb-6 max-w-xl font-normal leading-relaxed">
                  {tagline}
                </p>
              )}

              {about?.bio && (
                <p className="text-base text-content-muted mb-10 max-w-xl leading-relaxed">
                  {about.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <Link to={`/${username}/projects`} className="btn-primary">
                  View work
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {about?.resume_file && (
                  <a href={about.resume_file} download className="btn-outline">
                    <Download className="w-4 h-4" />
                    Resume
                  </a>
                )}

                <Link to={`/${username}/contact`} className="btn-secondary">
                  Contact
                </Link>
              </div>
            </div>

            {profile_image && (
              <div className="lg:col-span-5 flex justify-center lg:justify-end order-1 lg:order-2">
                <div className="w-full max-w-[17rem] md:max-w-[19rem]">
                  <TiltProfileImage src={profile_image} alt={displayName} />
                </div>
              </div>
            )}
          </div>

          {skills.length > 0 && (
            <SkillsMarquee skills={skills} className="mt-20 md:mt-24" />
          )}

          {(socialLinks.length > 0) && (
            <div className="mt-16 pt-8 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <p className="text-sm text-content-muted max-w-md">
                Open to freelance, full-time roles, and selected collaborations.
              </p>
              <div className="flex flex-wrap items-center gap-5">
                {socialLinks.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={label === 'Email' ? undefined : '_blank'}
                    rel={label === 'Email' ? undefined : 'noopener noreferrer'}
                    className="inline-flex items-center gap-2 text-sm text-content-muted hover:text-content transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <TimelineSection achievements={achievements} />

      <FeaturedProjectsSection projects={featuredProjects} username={username} />
    </div>
  );
};

export default PortfolioHomePage;
