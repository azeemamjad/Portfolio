import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Boxes,
  ChevronLeft,
  ChevronRight,
  Code2,
  Github,
  Layers,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Twitter,
  Users,
} from 'lucide-react';
import { companyAPI } from '../services/api';
import type { CompanyProfile, FeaturedDeveloper } from '../types';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import AnimatedBackground from '../components/common/AnimatedBackground';
import SectionHeader from '../components/common/SectionHeader';
import CompanyNavbar from '../components/layouts/CompanyNavbar';
import CompanyFeaturedProjectsSection, {
  buildCompanyFeaturedProjects,
} from '../components/sections/CompanyFeaturedProjectsSection';
import { cachePortfolioThemes } from '../utils/portfolioThemeCache';

const CompanyHomePage: React.FC = () => {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [developers, setDevelopers] = useState<FeaturedDeveloper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [companyData, developersData] = await Promise.all([
          companyAPI.getCompanyProfile(),
          companyAPI.getFeaturedDevelopers(),
        ]);
        setCompany(companyData);
        setDevelopers(developersData);
        document.title = `${companyData.name} — Home`;
        setError(null);
      } catch (err: unknown) {
        const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
        setError(detail || 'Failed to load company data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (developers.length === 0) return;
    cachePortfolioThemes(
      developers.map((d) => ({
        username: d.portfolio.username,
        themeColor: d.portfolio.theme_color,
      })),
    );
  }, [developers]);

  useEffect(() => {
    if (developers.length <= 1 || paused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === developers.length - 1 ? 0 : prev + 1));
    }, 5200);
    return () => clearInterval(interval);
  }, [developers.length, paused]);

  const featuredProjects = useMemo(
    () => buildCompanyFeaturedProjects(developers),
    [developers],
  );

  const prevSlide = () => setCurrentSlide((p) => (p === 0 ? developers.length - 1 : p - 1));
  const nextSlide = () => setCurrentSlide((p) => (p === developers.length - 1 ? 0 : p + 1));

  if (loading) return <Loading label="Loading company..." variant="company" />;
  if (error || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <ErrorMessage message={error || 'Company profile not found'} />
      </div>
    );
  }

  return (
    <div className="company-theme min-h-screen bg-bg text-content relative overflow-x-hidden">
      <AnimatedBackground useAccent />

      <CompanyNavbar
        name={company.name}
        logo={company.logo}
        tagline={company.tagline}
        email={company.email}
      />

      {/* Hero */}
      <section id="home" className="relative z-10 pt-40 md:pt-48 pb-24 md:pb-32 scroll-mt-28">
        {/* Apple-style radial glow behind the hero */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-32 z-0 h-[38rem]"
          style={{
            background:
              'radial-gradient(56rem 32rem at 50% 0%, color-mix(in oklch, var(--accent) 15%, transparent), transparent 64%)',
          }}
        />

        <div className="container-custom relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-12 lg:gap-16">
            <div className="lg:col-span-7 animate-fade-in-up">
            <p className="section-label mb-6">
              <span className="section-label__rule" aria-hidden />
              {company.tagline || 'Software studio'}
            </p>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] text-content mb-6">
              {company.name}
            </h1>

            <p className="text-xl md:text-2xl text-content-muted max-w-2xl mb-12 leading-relaxed">
              {company.description}
            </p>

            {company.services_list?.length > 0 && (
              <div className="flex flex-wrap gap-2.5 mb-14">
                {company.services_list.map((service) => (
                  <span
                    key={service}
                    className="company-hero-chip transition-colors duration-150 hover:border-content/30 hover:text-content"
                  >
                    {service}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4">
              {company.email && (
                <a
                  href={`mailto:${company.email}`}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-[17px] font-semibold text-accent-fg transition-all duration-200 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                >
                  Start a project
                  <ArrowRight className="w-[18px] h-[18px]" />
                </a>
              )}
              {developers.length > 0 && (
                <a
                  href="#developers"
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-transparent px-7 py-3.5 text-[17px] font-medium text-content transition-colors duration-200 hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-line focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                >
                  Meet the team
                </a>
              )}
            </div>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end animate-fade-in-up [animation-delay:150ms]">
              <HeroShowcaseCard company={company} developers={developers} />
            </div>
          </div>
        </div>
      </section>

      {/* Featured projects from developers */}
      <CompanyFeaturedProjectsSection items={featuredProjects} />

      {/* Developers */}
      <section id="developers" className="company-team-section relative z-10 py-24 md:py-28 scroll-mt-28">
        <div className="container-custom">
          <SectionHeader
            label="The People"
            title="Our Developers"
            description="Meet the developers behind our work — each with their own portfolio of projects and skills."
            className="mb-10 md:mb-12"
          />

          {developers.length > 0 ? (
            <div
              className="company-team-carousel"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div className="company-team-carousel__viewport overflow-hidden rounded-[1.75rem]">
                <div
                  className="company-team-carousel__track flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {developers.map((featured) => {
                    const p = featured.portfolio;
                    const displayName = p.name || p.username;

                    return (
                      <div key={featured.id} className="company-team-carousel__slide w-full min-w-full flex-shrink-0 px-1">
                        <Link
                          to={`/${p.username}`}
                          state={{ themeColor: p.theme_color, fromCompany: true }}
                          className="block group"
                        >
                          <article className="about-glass-card company-dev-card rounded-[1.75rem]">
                            <div className="about-glass-card__shine" aria-hidden />
                            <div className="company-dev-card__inner p-7 md:p-9">
                              <div className="company-dev-card__avatar-wrap">
                                {p.profile_image ? (
                                  <img
                                    src={p.profile_image}
                                    alt={displayName}
                                    className="company-dev-card__avatar"
                                  />
                                ) : (
                                  <div className="company-dev-card__avatar company-dev-card__avatar--fallback">
                                    {p.username.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                {featured.display_order <= 3 && (
                                  <span className="company-dev-card__badge" aria-label="Top developer">
                                    <Award className="w-3.5 h-3.5" />
                                  </span>
                                )}
                              </div>

                              <div className="company-dev-card__content">
                                <p className="about-glass-card__eyebrow">Developer</p>
                                <h3 className="company-dev-card__name text-3xl md:text-4xl font-semibold tracking-tight leading-[1.1]">{displayName}</h3>

                                {p.tagline && (
                                  <p className="company-dev-card__tagline">{p.tagline}</p>
                                )}

                                {p.skills?.length > 0 && (
                                  <div className="company-dev-card__skills">
                                    {p.skills.slice(0, 5).map((skill) => (
                                      <span key={skill.name} className="company-dev-card__skill">
                                        {skill.icon && <span>{skill.icon}</span>}
                                        {skill.name}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                <span className="company-dev-card__link">
                                  View portfolio
                                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </span>
                              </div>
                            </div>
                          </article>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>

              {developers.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevSlide}
                    className="company-team-carousel__nav company-team-carousel__nav--prev"
                    aria-label="Previous developer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    className="company-team-carousel__nav company-team-carousel__nav--next"
                    aria-label="Next developer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <div className="company-team-carousel__dots">
                    {developers.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCurrentSlide(i)}
                        aria-label={`Developer ${i + 1}`}
                        className={`company-team-carousel__dot${i === currentSlide ? ' company-team-carousel__dot--active' : ''}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <p className="text-center text-content-muted py-12">No developers featured yet.</p>
          )}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="relative z-10 py-24 md:py-28 scroll-mt-28">
        <div className="container-custom">
          <SectionHeader
            label="Reach Out"
            title="Get In Touch"
            description="Have a project in mind? We'd love to hear from you."
            className="mb-10 md:mb-12"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {company.email && (
              <a href={`mailto:${company.email}`} className="about-glass-card company-contact-card group rounded-[1.75rem] p-8">
                <div className="about-glass-card__shine" aria-hidden />
                <div className="about-glass-card__icon mx-auto mb-4">
                  <Mail className="w-4 h-4 text-accent" />
                </div>
                <p className="about-glass-card__eyebrow text-center">Email</p>
                <p className="text-sm font-semibold text-accent text-center break-all mt-1">{company.email}</p>
              </a>
            )}
            {company.phone && (
              <a href={`tel:${company.phone}`} className="about-glass-card company-contact-card group rounded-[1.75rem] p-8">
                <div className="about-glass-card__shine" aria-hidden />
                <div className="about-glass-card__icon mx-auto mb-4">
                  <Phone className="w-4 h-4 text-accent" />
                </div>
                <p className="about-glass-card__eyebrow text-center">Phone</p>
                <p className="text-sm font-semibold text-content text-center mt-1">{company.phone}</p>
              </a>
            )}
            {company.address && (
              <div className="about-glass-card company-contact-card rounded-[1.75rem] p-8">
                <div className="about-glass-card__shine" aria-hidden />
                <div className="about-glass-card__icon mx-auto mb-4">
                  <MapPin className="w-4 h-4 text-accent" />
                </div>
                <p className="about-glass-card__eyebrow text-center">Location</p>
                <p className="text-sm font-semibold text-content text-center mt-1">{company.address}</p>
              </div>
            )}
          </div>

          {(company.linkedin_url || company.github_url || company.twitter_url) && (
            <div className="flex justify-center gap-3 mt-12">
              {[
                { url: company.linkedin_url, icon: Linkedin, label: 'LinkedIn' },
                { url: company.github_url, icon: Github, label: 'GitHub' },
                { url: company.twitter_url, icon: Twitter, label: 'Twitter' },
              ]
                .filter((s) => s.url)
                .map(({ url, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="navbar-glass-btn navbar-glass-btn--icon hover:-translate-y-0.5"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
            </div>
          )}
        </div>
      </section>

      <footer className="relative z-10 glass-header py-8">
        <div className="container-custom text-center">
          <p className="text-sm text-content-muted">
            © {new Date().getFullYear()}{' '}
            <span className="font-semibold text-content">{company.name}</span>. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

interface HeroShowcaseCardProps {
  company: CompanyProfile;
  developers: FeaturedDeveloper[];
}

/**
 * Apple-style hero showcase card: availability pill, live stats and a featured
 * developer spotlight — fills the right side of the company hero.
 */
const HeroShowcaseCard: React.FC<HeroShowcaseCardProps> = ({ company, developers }) => {
  const totalProjects = useMemo(
    () => developers.reduce((acc, d) => acc + (d.portfolio.featured_projects?.length ?? 0), 0),
    [developers],
  );
  const totalSkills = useMemo(
    () => new Set(developers.flatMap((d) => d.portfolio.skills.map((s) => s.name))).size,
    [developers],
  );

  const stats: { icon: React.ComponentType<{ className?: string }>; label: string; value: number }[] = [
    { icon: Users, label: 'Developers', value: developers.length },
    ...(totalProjects > 0 ? [{ icon: Boxes, label: 'Projects', value: totalProjects }] : []),
    { icon: Code2, label: 'Skills', value: totalSkills },
    { icon: Layers, label: 'Services', value: company.services_list?.length ?? 0 },
  ];

  const lead = developers[0];
  const wideIndex = stats.length % 2 !== 0 ? stats.length - 1 : -1;

  return (
    <div className="relative w-full max-w-md lg:max-w-none">
      {/* Accent glow behind the card */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full blur-3xl"
        style={{ background: 'color-mix(in oklch, var(--accent) 26%, transparent)' }}
      />

      <div className="relative overflow-hidden rounded-[2rem] border border-[var(--glass-border-strong)] bg-white/70 dark:bg-[rgba(20,20,23,0.72)] backdrop-blur-2xl backdrop-saturate-150 shadow-[var(--glass-shadow-elevated)] p-7 md:p-8">
        {/* Top gradient wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-28"
          style={{
            background:
              'linear-gradient(180deg, color-mix(in oklch, var(--accent) 14%, transparent), transparent)',
          }}
        />

        {/* Availability */}
        <div className="relative flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" aria-hidden />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" aria-hidden />
          </span>
          <p className="text-[13px] font-semibold tracking-tight text-content">
            Available for new projects
          </p>
          <Sparkles className="ml-auto h-4 w-4 text-accent" aria-hidden />
        </div>

        {/* Stats */}
        <dl className="relative mt-6 grid grid-cols-2 gap-3">
          {stats.map(({ icon: Icon, label, value }, i) => {
            const wide = i === wideIndex;
            return (
              <div
                key={label}
                className={`rounded-2xl border border-[color-mix(in_oklch,var(--text)_8%,transparent)] bg-[color-mix(in_oklch,var(--text)_3%,transparent)] p-4 ${
                  wide ? 'col-span-2 flex items-center gap-4' : ''
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_oklch,var(--accent)_28%,transparent)] bg-[color-mix(in_oklch,var(--accent)_12%,transparent)] ${
                    wide ? 'h-11 w-11 rounded-2xl' : ''
                  }`}
                >
                  <Icon className="h-4 w-4 text-accent" aria-hidden />
                </div>
                <div className={wide ? 'flex items-baseline gap-3' : 'mt-3'}>
                  <dd className="text-3xl font-semibold tracking-tight tabular-nums text-content">
                    {value}
                  </dd>
                  <dt
                    className={`text-[11px] font-semibold uppercase tracking-wider text-content-muted ${
                      wide ? '' : 'mt-1'
                    }`}
                  >
                    {label}
                  </dt>
                </div>
              </div>
            );
          })}
        </dl>

        {/* Featured developer spotlight */}
        {lead && (
          <>
            <div className="relative my-6 h-px bg-[color-mix(in_oklch,var(--text)_8%,transparent)]" />
            <Link
              to={`/${lead.portfolio.username}`}
              state={{ themeColor: lead.portfolio.theme_color, fromCompany: true }}
              className="group relative flex items-center gap-3 -m-2 rounded-2xl p-2 transition-colors duration-200 hover:bg-[color-mix(in_oklch,var(--accent)_7%,transparent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {lead.portfolio.profile_image ? (
                <img
                  src={lead.portfolio.profile_image}
                  alt={lead.portfolio.name || lead.portfolio.username}
                  className="h-12 w-12 rounded-2xl object-cover ring-1 ring-line"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-base font-bold text-accent-fg">
                  {(lead.portfolio.name || lead.portfolio.username).charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-content-muted">
                  Featured developer
                </p>
                <p className="truncate text-sm font-semibold text-content transition-colors group-hover:text-accent">
                  {lead.portfolio.name || lead.portfolio.username}
                </p>
              </div>
              <ArrowUpRight
                className="ml-auto h-5 w-5 shrink-0 text-content-muted transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                aria-hidden
              />
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default CompanyHomePage;
