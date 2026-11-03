import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  Download,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
  User,
} from 'lucide-react';
import type { About, Achievement } from '../../types';
import SectionHeader from '../common/SectionHeader';
import ExperienceSection from './ExperienceSection';

interface AboutSectionProps {
  about?: About;
  username?: string;
  achievements?: Achievement[];
  showHeader?: boolean;
}

function formatBlockContent(content: string) {
  const lines = content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const isList =
    lines.length > 1 &&
    lines.every((line) => /^[-•*]/.test(line) || /^\d+\./.test(line));

  if (isList) {
    return {
      type: 'list' as const,
      items: lines.map((line) => line.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '')),
    };
  }

  return { type: 'text' as const, text: content };
}

function BlockBody({ content }: { content: string }) {
  const formatted = formatBlockContent(content);

  if (formatted.type === 'list') {
    return (
      <ul className="about-glass-card__list">
        {formatted.items.map((item) => (
          <li key={item} className="about-glass-card__list-item">
            <span className="about-glass-card__bullet" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  return <p className="about-glass-card__body">{formatted.text}</p>;
}

/**
 * About layout (UX-12): short professional summary first, then career records,
 * then optional detailed story, values and contact information.
 */
const AboutSection: React.FC<AboutSectionProps> = ({
  about,
  username,
  achievements,
  showHeader = true,
}) => {
  if (!about) return null;

  const contactInfo = [
    { icon: MapPin, value: about.location, label: 'Location', href: null, external: false },
    { icon: Mail, value: about.email, label: 'Email', href: `mailto:${about.email}`, external: false },
    { icon: Phone, value: about.phone, label: 'Phone', href: `tel:${about.phone}`, external: false },
  ].filter((item) => item.value);

  const hasDetailedStory = Boolean(about.background || about.career_path);

  return (
    <section id="about" className="about-section page-content-section">
      <div className="container-custom about-section__container">
        {showHeader && (
          <SectionHeader
            className="!mb-8 md:!mb-10"
            label="Who I Am"
            title="About Me"
          />
        )}

        <div className="about-section__stack">
          {/* 1. Short professional summary */}
          {about.bio && (
            <article className="about-glass-card">
              <div className="about-glass-card__shine" aria-hidden />
              <div className="about-glass-card__head">
                <div className="about-glass-card__icon">
                  <User className="w-4 h-4 text-accent" aria-hidden />
                </div>
                <div>
                  <p className="about-glass-card__eyebrow">Profile</p>
                  <h3 className="about-glass-card__label font-semibold">Summary</h3>
                </div>
              </div>
              <BlockBody content={about.bio} />
            </article>
          )}

          {/* 2. Compact career records */}
          {achievements && achievements.length > 0 && (
            <ExperienceSection
              records={achievements}
              username={username}
              variant="summary"
              showHeader={false}
            />
          )}

          {/* 3. Detailed story, optional and collapsed by default */}
          {hasDetailedStory && (
            <details className="about-glass-card about-story-details">
              <div className="about-glass-card__shine" aria-hidden />
              <summary className="about-glass-card__head about-story-details__summary">
                <div className="about-glass-card__icon">
                  <Briefcase className="w-4 h-4 text-accent" aria-hidden />
                </div>
                <div>
                  <p className="about-glass-card__eyebrow">Background</p>
                  <h3 className="about-glass-card__label font-semibold">
                    More about my path
                    <span className="about-story-details__hint" aria-hidden>
                      Show / hide
                    </span>
                  </h3>
                </div>
              </summary>
              <div className="flex flex-col gap-5 mt-4">
                {about.background && <BlockBody content={about.background} />}
                {about.career_path && <BlockBody content={about.career_path} />}
              </div>
            </details>
          )}

          {/* 4. Values as short statements */}
          {about.values && (
            <article className="about-glass-card">
              <div className="about-glass-card__shine" aria-hidden />
              <div className="about-glass-card__head">
                <div className="about-glass-card__icon">
                  <Sparkles className="w-4 h-4 text-accent" aria-hidden />
                </div>
                <div>
                  <p className="about-glass-card__eyebrow">How I work</p>
                  <h3 className="about-glass-card__label font-semibold">Values</h3>
                </div>
              </div>
              <BlockBody content={about.values} />
            </article>
          )}

          {/* 5. Connect */}
          {(contactInfo.length > 0 || about.resume_file) && (
            <article className="about-glass-card about-glass-card--contact">
              <div className="about-glass-card__shine" aria-hidden />
              <div className="about-glass-card__head">
                <div className="about-glass-card__icon">
                  <MessageCircle className="w-4 h-4 text-accent" aria-hidden />
                </div>
                <div>
                  <p className="about-glass-card__eyebrow">Reach out</p>
                  <h3 className="about-glass-card__label font-semibold">Connect with me</h3>
                </div>
              </div>

              <div className="about-contact-grid">
                {contactInfo.map((item) => {
                  const Icon = item.icon;
                  const inner = (
                    <>
                      <div className="about-contact-chip__icon">
                        <Icon className="w-4 h-4 text-accent" aria-hidden />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="about-contact-chip__meta">{item.label}</p>
                        <p className="about-contact-chip__value">{item.value}</p>
                      </div>
                    </>
                  );

                  return item.href ? (
                    <a key={item.label} href={item.href} className="about-contact-chip">
                      {inner}
                    </a>
                  ) : (
                    <div key={item.label} className="about-contact-chip about-contact-chip--static">
                      {inner}
                    </div>
                  );
                })}

                {about.resume_file && (
                  <a
                    href={about.resume_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about-contact-chip"
                  >
                    <div className="about-contact-chip__icon">
                      <Download className="w-4 h-4 text-accent" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="about-contact-chip__meta">Resume</p>
                      <p className="about-contact-chip__value">Open resume (PDF)</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-content-muted shrink-0 opacity-70" aria-hidden />
                  </a>
                )}
              </div>

              {username && (
                <Link
                  to={`/${username}/contact`}
                  className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full text-sm font-semibold text-accent bg-[color-mix(in_oklch,var(--accent)_12%,transparent)] border border-[color-mix(in_oklch,var(--accent)_28%,transparent)] transition-colors hover:bg-[color-mix(in_oklch,var(--accent)_18%,transparent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                >
                  Start a conversation
                  <ArrowRight className="w-4 h-4" aria-hidden />
                </Link>
              )}
            </article>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
