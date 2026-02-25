import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Mail, Phone, MapPin,
  Linkedin, Github, Twitter, Award,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { companyAPI } from '../services/api';
import type { CompanyProfile, FeaturedDeveloper } from '../types';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import AnimatedBackground from '../components/common/AnimatedBackground';
import ThemeToggle from '../components/common/ThemeToggle';

const CompanyHomePage: React.FC = () => {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [developers, setDevelopers] = useState<FeaturedDeveloper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

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
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to load company data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (developers.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === developers.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [developers.length]);

  const prevSlide = () => setCurrentSlide((p) => (p === 0 ? developers.length - 1 : p - 1));
  const nextSlide = () => setCurrentSlide((p) => (p === developers.length - 1 ? 0 : p + 1));

  if (loading) return <Loading />;
  if (error || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <ErrorMessage message={error || 'Company profile not found'} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 relative overflow-x-hidden">
      <AnimatedBackground />

      {/* ───── Header ───── */}
      <header className="relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/60 sticky top-0">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-3">
              {company.logo && (
                <img src={company.logo} alt={company.name} className="w-9 h-9 object-contain rounded-lg" />
              )}
              <div>
                <p className="text-base font-bold text-gray-900 dark:text-white tracking-tight leading-none">
                  {company.name}
                </p>
                {company.tagline && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 hidden sm:block">
                    {company.tagline}
                  </p>
                )}
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ───── Hero ───── */}
      <section className="relative z-10 py-28 md:py-36">
        <div className="container-custom text-center">
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            {/* Label pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8
                            bg-primary-50 dark:bg-primary-950/50
                            border border-primary-200 dark:border-primary-800/60
                            text-primary-600 dark:text-primary-400 text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              {company.tagline || 'We build great software'}
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.05]">
              <span className="text-gradient-primary">{company.name}</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              {company.description}
            </p>

            {/* Service chips */}
            {company.services_list && company.services_list.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {company.services_list.map((s, i) => (
                  <span key={i}
                        className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800
                                   border border-gray-200 dark:border-gray-700
                                   text-gray-700 dark:text-gray-300 text-sm font-medium
                                   shadow-sm">
                    {s}
                  </span>
                ))}
              </div>
            )}

            {/* CTA */}
            {company.email && (
              <a href={`mailto:${company.email}`}
                 className="btn-primary inline-flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Contact Us
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ───── Team / Developers ───── */}
      <section className="relative z-10 py-24 bg-gray-50 dark:bg-gray-800/40">
        <div className="container-custom">
          <div className="section-header">
            <span className="section-label">The People</span>
            <h2 className="heading-secondary text-gray-900 dark:text-white">Our Team</h2>
            <div className="section-underline" />
            <p className="text-gray-500 dark:text-gray-400 mt-5 max-w-xl mx-auto">
              Meet the talented developers powering our work.
            </p>
          </div>

          {developers.length > 0 ? (
            <div className="relative max-w-3xl mx-auto">
              {/* Carousel */}
              <div className="overflow-hidden rounded-3xl">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {developers.map((featured) => {
                    const p = featured.portfolio;
                    return (
                      <div key={featured.id} className="w-full min-w-full flex-shrink-0 px-2">
                        <Link to={`/${p.username}`} className="block">
                          <div className="card p-8 md:p-10 group hover:-translate-y-1">
                            <div className="flex flex-col sm:flex-row items-center gap-8">
                              {/* Avatar */}
                              <div className="relative flex-shrink-0">
                                {p.profile_image ? (
                                  <img
                                    src={p.profile_image} alt={p.username}
                                    className="w-28 h-28 md:w-36 md:h-36 rounded-2xl object-cover
                                               ring-4 ring-primary-500/20 group-hover:ring-primary-500/40
                                               transition-all duration-300"
                                  />
                                ) : (
                                  <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl
                                                  bg-gradient-to-br from-primary-500 to-purple-600
                                                  flex items-center justify-center
                                                  text-white text-5xl font-black">
                                    {p.username.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                {featured.display_order <= 3 && (
                                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full
                                                  bg-yellow-400 flex items-center justify-center shadow-lg">
                                    <Award className="w-4 h-4 text-yellow-900" />
                                  </div>
                                )}
                              </div>

                              {/* Info */}
                              <div className="flex-1 text-center sm:text-left">
                                <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                                  {p.name || p.username}
                                </h3>

                                <span className="inline-block px-3 py-1 rounded-lg
                                                 bg-primary-100 dark:bg-primary-950/50
                                                 text-primary-700 dark:text-primary-400
                                                 text-sm font-semibold mb-4">
                                  Developer
                                </span>

                                {p.tagline && (
                                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-5 leading-relaxed">
                                    {p.tagline}
                                  </p>
                                )}

                                {p.skills && p.skills.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mb-5 justify-center sm:justify-start">
                                    {p.skills.slice(0, 4).map((s, i) => (
                                      <span key={i} className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-700
                                                                text-gray-600 dark:text-gray-300 text-xs font-medium">
                                        {s.name}
                                      </span>
                                    ))}
                                    {p.skills.length > 4 && (
                                      <span className="px-2.5 py-1 rounded-lg bg-primary-50 dark:bg-primary-950/40
                                                        text-primary-600 dark:text-primary-400 text-xs font-medium">
                                        +{p.skills.length - 4}
                                      </span>
                                    )}
                                  </div>
                                )}

                                <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400
                                                font-semibold text-sm group-hover:gap-3 transition-all justify-center sm:justify-start">
                                  <span>View Portfolio</span>
                                  <ArrowRight className="w-4 h-4" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Controls */}
              {developers.length > 1 && (
                <>
                  <button onClick={prevSlide}
                          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 md:-translate-x-14
                                     w-11 h-11 rounded-xl bg-white dark:bg-gray-800
                                     border border-gray-200 dark:border-gray-700
                                     flex items-center justify-center shadow-lg
                                     hover:bg-primary-600 hover:text-white hover:border-primary-600
                                     text-gray-600 dark:text-gray-400
                                     transition-all duration-200 z-10"
                          aria-label="Previous">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={nextSlide}
                          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 md:translate-x-14
                                     w-11 h-11 rounded-xl bg-white dark:bg-gray-800
                                     border border-gray-200 dark:border-gray-700
                                     flex items-center justify-center shadow-lg
                                     hover:bg-primary-600 hover:text-white hover:border-primary-600
                                     text-gray-600 dark:text-gray-400
                                     transition-all duration-200 z-10"
                          aria-label="Next">
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Dots */}
                  <div className="flex justify-center gap-2 mt-7">
                    {developers.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentSlide(i)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          i === currentSlide
                            ? 'bg-primary-600 dark:bg-primary-400 w-7'
                            : 'bg-gray-300 dark:bg-gray-600 w-2 hover:bg-gray-400 dark:hover:bg-gray-500'
                        }`}
                        aria-label={`Slide ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-400 dark:text-gray-500 py-12">No team members yet.</p>
          )}
        </div>
      </section>

      {/* ───── Contact ───── */}
      <section className="relative z-10 py-24">
        <div className="container-custom">
          <div className="section-header">
            <span className="section-label">Reach Out</span>
            <h2 className="heading-secondary text-gray-900 dark:text-white">Get In Touch</h2>
            <div className="section-underline" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {company.email && (
              <a href={`mailto:${company.email}`}
                 className="card p-7 text-center group hover:-translate-y-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-100 to-purple-100
                                dark:from-primary-950/50 dark:to-purple-950/50
                                flex items-center justify-center mx-auto mb-4
                                group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Email</p>
                <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 break-all">{company.email}</p>
              </a>
            )}
            {company.phone && (
              <a href={`tel:${company.phone}`}
                 className="card p-7 text-center group hover:-translate-y-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-100 to-purple-100
                                dark:from-primary-950/50 dark:to-purple-950/50
                                flex items-center justify-center mx-auto mb-4
                                group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Phone</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{company.phone}</p>
              </a>
            )}
            {company.address && (
              <div className="card p-7 text-center group hover:-translate-y-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-100 to-purple-100
                                dark:from-primary-950/50 dark:to-purple-950/50
                                flex items-center justify-center mx-auto mb-4
                                group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Location</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{company.address}</p>
              </div>
            )}
          </div>

          {/* Social */}
          {(company.linkedin_url || company.github_url || company.twitter_url) && (
            <div className="flex justify-center gap-4 mt-10">
              {[
                { url: company.linkedin_url, icon: Linkedin, label: 'LinkedIn' },
                { url: company.github_url,   icon: Github,   label: 'GitHub' },
                { url: company.twitter_url,  icon: Twitter,  label: 'Twitter' },
              ].filter(s => s.url).map(({ url, icon: Icon, label }) => (
                <a key={label} href={url!} target="_blank" rel="noopener noreferrer" aria-label={label}
                   className="w-11 h-11 rounded-xl flex items-center justify-center
                              bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                              text-gray-500 dark:text-gray-400
                              hover:bg-primary-600 hover:text-white hover:border-primary-600
                              transition-all duration-200 hover:-translate-y-0.5 shadow-sm">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="relative z-10 border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="container-custom text-center">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()}{' '}
            <span className="font-semibold text-gray-600 dark:text-gray-400">{company.name}</span>.
            All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CompanyHomePage;
