import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
  User,
} from 'lucide-react';
import type { About } from '../../types';
import SectionHeader from '../common/SectionHeader';

interface AboutSectionProps {
  about?: About;
  username?: string;
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

const AboutSection: React.FC<AboutSectionProps> = ({
  about,
  username,
  showHeader = true,
}) => {
  if (!about) return null;

  const contactInfo = [
    { icon: MapPin, value: about.location, label: 'Location', href: null },
    { icon: Mail, value: about.email, label: 'Email', href: `mailto:${about.email}` },
    { icon: Phone, value: about.phone, label: 'Phone', href: `tel:${about.phone}` },
  ].filter((item) => item.value);

  const storyBlocks = [
    { title: 'My Story', content: about.bio, icon: User },
    { title: 'Background', content: about.background, icon: User },
    { title: 'Career Path', content: about.career_path, icon: Briefcase },
    { title: 'Values', content: about.values, icon: Sparkles },
  ].filter((b) => b.content);

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
          {storyBlocks.map((block) => {
            const Icon = block.icon;
            return (
              <article key={block.title} className="about-glass-card">
                <div className="about-glass-card__shine" aria-hidden />
                <div className="about-glass-card__head">
                  <div className="about-glass-card__icon">
                    <Icon className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="about-glass-card__eyebrow">Profile</p>
                    <h3 className="about-glass-card__label">{block.title}</h3>
                  </div>
                </div>
                <BlockBody content={block.content} />
              </article>
            );
          })}

          {contactInfo.length > 0 && (
            <article className="about-glass-card about-glass-card--contact">
              <div className="about-glass-card__shine" aria-hidden />
              <div className="about-glass-card__head">
                <div className="about-glass-card__icon">
                  <MessageCircle className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="about-glass-card__eyebrow">Reach out</p>
                  <h3 className="about-glass-card__label">Connect with me</h3>
                </div>
              </div>

              <div className="about-contact-grid">
                {contactInfo.map((item) => {
                  const Icon = item.icon;
                  const inner = (
                    <>
                      <div className="about-contact-chip__icon">
                        <Icon className="w-4 h-4 text-accent" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="about-contact-chip__meta">{item.label}</p>
                        <p className="about-contact-chip__value">{item.value}</p>
                      </div>
                      {item.href && (
                        <ExternalLink className="w-3.5 h-3.5 text-content-muted shrink-0 opacity-70" />
                      )}
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
              </div>
            </article>
          )}

          <article className="about-availability-card">
            <div className="about-availability-card__glow" aria-hidden />
            <div className="about-availability-card__inner">
              <p className="about-availability-card__eyebrow">Currently</p>
              <p className="about-availability-card__title">
                Open to exciting opportunities and collaborations
              </p>
              <div className="about-availability-card__status">
                <span className="about-availability-card__dot" aria-hidden />
                <span>Available for hire</span>
              </div>
              {username && (
                <Link to={`/${username}/contact`} className="about-availability-card__btn">
                  Start a conversation
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
