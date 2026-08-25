import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  ChevronLeft,
  ChevronRight,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
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
      <section id="home" className="relative z-10 py-24 md:py-32 scroll-mt-28">
        <div className="container-custom">
          <div className="max-w-3xl animate-fade-in-up">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-content-muted mb-5">
              {company.tagline || 'Software studio'}
            </p>

            <h1 className="heading-primary text-content">
              {company.name}
            </h1>

            <p className="text-lg md:text-xl text-content-muted mb-10 max-w-2xl leading-relaxed">
              {company.description}
            </p>

            {company.services_list?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10">
                {company.services_list.map((service) => (
                  <span key={service} className="company-hero-chip">
                    {service}
                  </span>
                ))}
              </div>
            )}

            {company.email && (
              <a href={`mailto:${company.email}`} className="btn-primary inline-flex items-center gap-2">
                Start a project
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Featured projects from developers */}
      <CompanyFeaturedProjectsSection items={featuredProjects} />

      {/* Developers */}
      <section id="developers" className="company-team-section relative z-10 py-20 md:py-24 scroll-mt-28">
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
              <div className="company-team-carousel__viewport overflow-hidden rounded-2xl">
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
                          <article className="about-glass-card company-dev-card">
                            <div className="about-glass-card__shine" aria-hidden />
                            <div className="company-dev-card__inner">
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
                                <h3 className="company-dev-card__name">{displayName}</h3>

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
      <section id="contact" className="relative z-10 py-20 md:py-24 scroll-mt-28">
        <div className="container-custom">
          <SectionHeader
            label="Reach Out"
            title="Get In Touch"
            description="Have a project in mind? We'd love to hear from you."
            className="mb-10 md:mb-12"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {company.email && (
              <a href={`mailto:${company.email}`} className="about-glass-card company-contact-card group">
                <div className="about-glass-card__shine" aria-hidden />
                <div className="about-glass-card__icon mx-auto mb-4">
                  <Mail className="w-4 h-4 text-accent" />
                </div>
                <p className="about-glass-card__eyebrow text-center">Email</p>
                <p className="text-sm font-semibold text-accent text-center break-all mt-1">{company.email}</p>
              </a>
            )}
            {company.phone && (
              <a href={`tel:${company.phone}`} className="about-glass-card company-contact-card group">
                <div className="about-glass-card__shine" aria-hidden />
                <div className="about-glass-card__icon mx-auto mb-4">
                  <Phone className="w-4 h-4 text-accent" />
                </div>
                <p className="about-glass-card__eyebrow text-center">Phone</p>
                <p className="text-sm font-semibold text-content text-center mt-1">{company.phone}</p>
              </a>
            )}
            {company.address && (
              <div className="about-glass-card company-contact-card">
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
            <div className="flex justify-center gap-3 mt-10">
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
                    className="navbar-glass-btn navbar-glass-btn--icon"
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

export default CompanyHomePage;
