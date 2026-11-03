import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Mail, MapPin } from 'lucide-react';
import type { Portfolio } from '../../types';
import FeaturedProjectsSection from '../../components/sections/FeaturedProjectsSection';
import ExperienceSection from '../../components/sections/ExperienceSection';
import SkillsMarquee from '../../components/common/SkillsMarquee';
import TiltProfileImage from '../../components/common/TiltProfileImage';
import { buildTitle, roleFromTagline, useRouteMetadata } from '../../utils/routeMetadata';

interface PortfolioHomePageProps {
  portfolio: Portfolio;
}

const PortfolioHomePage: React.FC<PortfolioHomePageProps> = ({ portfolio }) => {
  const { username, name, tagline, profile_image, about, projects, skills, achievements } = portfolio;
  const displayName = name || username;
  const role = roleFromTagline(tagline);

  const featuredProjects = projects.filter((p) => p.is_featured);

  const socialLinks = [
    { href: about?.github_url, label: 'GitHub' },
    { href: about?.linkedin_url, label: 'LinkedIn' },
  ].filter((link) => Boolean(link.href));

  const canonicalPath = `/${username}`;

  const personJsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: displayName,
    url: canonicalPath,
    ...(role ? { jobTitle: role } : {}),
    ...(profile_image ? { image: profile_image } : {}),
    ...(about?.location
      ? { address: { '@type': 'PostalAddress', addressLocality: about.location } }
      : {}),
    ...(socialLinks.length > 0 ? { sameAs: socialLinks.map((l) => l.href) } : {}),
  };

  useRouteMetadata({
    title: buildTitle(null, displayName, role),
    description: about?.bio || tagline || undefined,
    path: canonicalPath,
    image: profile_image,
    type: 'profile',
    jsonLd: personJsonLd,
  });

  return (
    <div>
      <section className="pb-16 md:pb-24 pt-8 md:pt-16 relative overflow-hidden">
        <div className="container-custom w-full">
          <div
            className={`grid grid-cols-1 gap-10 lg:gap-16 items-center ${
              profile_image ? 'lg:grid-cols-12' : 'max-w-3xl'
            }`}
          >
            <div className={profile_image ? 'lg:col-span-7' : ''}>
              <p className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.16em] text-content-muted mb-4 md:mb-6">
                <span className="inline-block w-6 h-px bg-content-muted/40" aria-hidden />
                {role || 'Software engineer'}
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.06] text-content mb-5 md:mb-7">
                {displayName}
              </h1>

              {tagline && (
                <p className="text-lg md:text-2xl text-content-muted mb-4 max-w-xl font-normal leading-snug">
                  {tagline}
                </p>
              )}

              {(about?.location || about?.email) && (
                <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm md:text-base text-content-muted mb-6 md:mb-8">
                  {about?.location && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-accent" aria-hidden />
                      {about.location}
                    </span>
                  )}
                  <span>Open to selected roles, freelance projects and collaborations.</span>
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 md:gap-4">
                <Link
                  to={`/${username}/projects`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-[16px] md:px-7 md:py-3.5 md:text-[17px] font-semibold text-accent-fg transition-all duration-200 hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                >
                  View work
                  <ArrowRight className="h-[18px] w-[18px]" aria-hidden />
                </Link>

                {about?.resume_file && (
                  <a
                    href={about.resume_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-surface px-6 py-3 text-[16px] md:px-7 md:py-3.5 md:text-[17px] font-medium text-content transition-colors duration-200 hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  >
                    <Download className="h-[18px] w-[18px]" aria-hidden />
                    Resume (PDF)
                  </a>
                )}

                {about?.email && (
                  <a
                    href={`mailto:${about.email}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-transparent px-5 py-3 text-[15px] md:px-6 md:py-3.5 md:text-[16px] font-medium text-content-muted transition-colors duration-200 hover:border-content hover:text-content focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  >
                    <Mail className="h-4 w-4" aria-hidden />
                    Email me
                  </a>
                )}
              </div>
            </div>

            {profile_image && (
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="w-full max-w-[11rem] sm:max-w-[14rem] md:max-w-[16rem] lg:max-w-[19rem]">
                  <TiltProfileImage src={profile_image} alt={displayName} />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <FeaturedProjectsSection projects={featuredProjects} username={username} />

      {skills.length > 0 && (
        <SkillsMarquee skills={skills} className="mt-16 md:mt-20 mb-4 md:mb-6" />
      )}

      <ExperienceSection
        records={achievements}
        username={username}
        variant="summary"
        showHeader
        className="py-16 md:py-24"
      />

      {(about?.email || socialLinks.length > 0) && (
        <section className="py-14 md:py-20 bg-section-alt" aria-label="Contact">
          <div className="container-custom">
            <div className="max-w-2xl">
              <p className="section-label">
                <span className="section-label__rule" aria-hidden />
                Contact
              </p>
              <h2 className="heading-secondary text-content">
                Have a project in mind?
              </h2>
              <p className="text-content-muted mt-3 max-w-xl text-base md:text-lg leading-relaxed">
                I&apos;m open to full-time roles, freelance projects and selected
                collaborations. Send a message or email directly.
              </p>
              <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-6">
                <Link
                  to={`/${username}/contact`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-[16px] font-semibold text-accent-fg transition-all duration-200 hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                >
                  <Mail className="h-[18px] w-[18px]" aria-hidden />
                  Get in touch
                </Link>
                {about?.email && (
                  <a
                    href={`mailto:${about.email}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-content-muted hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-full px-2 py-1"
                  >
                    {about.email}
                  </a>
                )}
                {socialLinks.map(({ href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-content-muted hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-full px-2 py-1"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default PortfolioHomePage;
