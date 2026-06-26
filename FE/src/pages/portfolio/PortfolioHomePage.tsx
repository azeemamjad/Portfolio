import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Github, Linkedin, Mail } from 'lucide-react';
import type { Portfolio } from '../../types';
import TimelineSection from '../../components/sections/TimelineSection';
import FeaturedProjectsSection from '../../components/sections/FeaturedProjectsSection';
import SkillsMarquee from '../../components/common/SkillsMarquee';

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
      <section className="pb-16 md:pb-20 pt-3 md:pt-4 relative overflow-hidden flex flex-col justify-start">
        <div className="container-custom w-full">
          {skills.length > 0 && (
            <SkillsMarquee skills={skills} className="mt-[30px] mb-10 md:mb-12" />
          )}

          <div
            className={`grid grid-cols-1 gap-10 lg:gap-14 items-center ${
              profile_image ? 'lg:grid-cols-12' : 'max-w-4xl mx-auto'
            }`}
          >
            {profile_image && (
              <div className="lg:col-span-5 flex justify-center lg:justify-end order-1">
                <div className="relative w-full max-w-[16rem] sm:max-w-[17rem] md:max-w-xs">
                  <div
                    className="absolute -top-2 -left-2 h-10 w-10 border-t-2 border-l-2 border-accent rounded-tl-xl"
                    aria-hidden
                  />
                  <div
                    className="absolute -bottom-2 -right-2 h-10 w-10 border-b-2 border-r-2 border-accent rounded-br-xl"
                    aria-hidden
                  />
                  <div className="relative rounded-2xl bg-surface p-2 shadow-xl border border-line">
                    <div className="rounded-xl overflow-hidden aspect-[4/5] ring-1 ring-accent/25">
                      <img
                        src={profile_image}
                        alt={displayName}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div
              className={`order-2 text-center ${
                profile_image ? 'lg:col-span-7 lg:text-left' : ''
              }`}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 bg-accent-50 dark:bg-accent/15 border border-accent/25 text-accent-600 dark:text-accent-400 text-sm font-semibold">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                Available for work
              </div>

              <h1 className="heading-primary text-content lg:text-5xl xl:text-6xl">
                Hi, I'm <span className="text-gradient">{displayName}</span>
              </h1>

              {tagline && (
                <p className="text-xl md:text-2xl text-content-muted mb-8 max-w-2xl mx-auto lg:mx-0 font-medium">
                  {tagline}
                </p>
              )}

              {about?.bio && (
                <p className="text-lg text-content-muted mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  {about.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link to={`/${username}/about`} className="btn-primary">
                  Learn More About Me
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {about?.resume_file && (
                  <a href={about.resume_file} download className="btn-outline">
                    <Download className="w-4 h-4" />
                    Download Resume
                  </a>
                )}

                <Link to={`/${username}/contact`} className="btn-secondary">
                  <Mail className="w-4 h-4" />
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 md:mt-12 max-w-5xl mx-auto rounded-2xl border border-line bg-surface p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <p className="font-bold text-content text-lg">Let's build something together</p>
              <p className="text-sm text-content-muted mt-1">
                Open to freelance, full-time roles, and interesting collaborations.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={label === 'Email' ? undefined : '_blank'}
                  rel={label === 'Email' ? undefined : 'noopener noreferrer'}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-line bg-surface-muted text-sm font-medium text-content hover:border-accent hover:text-accent transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </a>
              ))}
              <Link to={`/${username}/contact`} className="btn-primary text-sm py-2">
                Hire Me
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <TimelineSection achievements={achievements} />

      <FeaturedProjectsSection projects={featuredProjects} username={username} />
    </div>
  );
};

export default PortfolioHomePage;
