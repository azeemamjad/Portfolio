import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Code, Brain, Globe, ArrowRight, Mail, Phone, MapPin,
  Linkedin, Github, Twitter, Star, Award, ChevronLeft, ChevronRight, User
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
        console.log('Developers loaded:', developersData.length, developersData);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to load company data');
        console.error('Error fetching company data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (developers.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === developers.length - 1 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [developers.length]);

  if (loading) {
    return <Loading />;
  }

  if (error || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <ErrorMessage message={error || 'Company profile not found'} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Header */}
      <header className="relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {company.logo && (
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-10 h-10 object-contain"
                />
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {company.name}
                </h1>
                {company.tagline && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {company.tagline}
                  </p>
                )}
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              {company.name}
            </h1>
            {company.tagline && (
              <p className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 mb-8">
                {company.tagline}
              </p>
            )}
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              {company.description}
            </p>

            {/* Services */}
            {company.services_list && company.services_list.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {company.services_list.map((service, index) => (
                  <div
                    key={index}
                    className="px-6 py-3 bg-primary-100 dark:bg-primary-900/30 rounded-full 
                               text-primary-700 dark:text-primary-300 font-medium"
                  >
                    {service}
                  </div>
                ))}
              </div>
            )}

            {/* CTA Buttons */}
            {company.email && (
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href={`mailto:${company.email}`}
                  className="btn-primary flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Contact Us
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Our Team / Developers Carousel Section */}
      <section className="relative z-10 py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <User className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                Our Team
              </h2>
              <User className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Meet our talented developers and team members
            </p>
          </div>

          {developers.length > 0 ? (
            <>
            {/* Carousel Container */}
            <div className="relative max-w-6xl mx-auto">
              {/* Carousel Wrapper */}
              <div 
                className="overflow-hidden rounded-2xl relative" 
                style={{ width: '100%' }}
              >
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentSlide * 100}%)`,
                  }}
                >
                  {developers.map((featured, index) => {
                    const portfolio = featured.portfolio;
                    return (
                      <div
                        key={featured.id}
                        className="px-4"
                        style={{ 
                          width: '100%',
                          minWidth: '100%',
                          flexShrink: 0,
                          minHeight: '400px',
                        }}
                      >
                        <div className="card p-8 max-w-2xl mx-auto" style={{ minHeight: '400px' }}>
                          <Link to={`/${portfolio.username}`} className="block">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                              {/* Profile Image */}
                              <div className="flex-shrink-0 relative">
                                {portfolio.profile_image ? (
                                  <img
                                    src={portfolio.profile_image}
                                    alt={portfolio.username}
                                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover 
                                             border-4 border-primary-200 dark:border-primary-800 
                                             shadow-lg"
                                  />
                                ) : (
                                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br 
                                                from-primary-400 to-purple-500 flex items-center justify-center 
                                                text-white text-4xl md:text-5xl font-bold 
                                                border-4 border-primary-200 dark:border-primary-800 shadow-lg">
                                    {portfolio.username.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                {featured.display_order <= 3 && (
                                  <div className="absolute -top-2 -right-2 bg-yellow-400 dark:bg-yellow-500 
                                               rounded-full p-2 shadow-lg">
                                    <Award className="w-5 h-5 text-yellow-900" />
                                  </div>
                                )}
                              </div>

                              {/* Content */}
                              <div className="flex-1 text-center md:text-left">
                                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                                  {portfolio.name || portfolio.username}
                                </h3>
                                
                                {/* Role/Title */}
                                <div className="mb-4">
                                  <span className="inline-block px-4 py-1.5 bg-primary-100 dark:bg-primary-900/30 
                                                 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
                                    Developer
                                  </span>
                                </div>

                                {/* Tagline */}
                                {portfolio.tagline && (
                                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                                    {portfolio.tagline}
                                  </p>
                                )}

                                {/* Skills Preview */}
                                {portfolio.skills && portfolio.skills.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mb-6 justify-center md:justify-start">
                                    {portfolio.skills.slice(0, 3).map((skill, idx) => (
                                      <span
                                        key={idx}
                                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 
                                                 text-gray-700 dark:text-gray-300 rounded-md text-sm"
                                      >
                                        {skill.name}
                                      </span>
                                    ))}
                                    {portfolio.skills.length > 3 && (
                                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 
                                                       text-gray-700 dark:text-gray-300 rounded-md text-sm">
                                        +{portfolio.skills.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                )}

                                {/* View Profile Button */}
                                <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 
                                              font-medium justify-center md:justify-start group">
                                  <span>View Portfolio</span>
                                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Buttons */}
              {developers.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentSlide((prev) =>
                        prev === 0 ? developers.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 
                             w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg 
                             flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 
                             transition-colors duration-200 z-10 border border-gray-200 dark:border-gray-700"
                    aria-label="Previous developer"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentSlide((prev) =>
                        prev === developers.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 
                             w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg 
                             flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 
                             transition-colors duration-200 z-10 border border-gray-200 dark:border-gray-700"
                    aria-label="Next developer"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  </button>
                </>
              )}

              {/* Dots Indicator */}
              {developers.length > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {developers.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? 'bg-primary-600 dark:bg-primary-400 w-8'
                          : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No team members to display yet.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Get In Touch
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                We'd love to hear from you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {company.email && (
                <div className="card p-6 text-center">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full 
                                flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
                  <a
                    href={`mailto:${company.email}`}
                    className="text-primary-600 dark:text-primary-400 hover:underline break-all"
                  >
                    {company.email}
                  </a>
                </div>
              )}

              {company.phone && (
                <div className="card p-6 text-center">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full 
                                flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Phone</h3>
                  <a
                    href={`tel:${company.phone}`}
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    {company.phone}
                  </a>
                </div>
              )}

              {company.address && (
                <div className="card p-6 text-center">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full 
                                flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Location</h3>
                  <p className="text-gray-600 dark:text-gray-400">{company.address}</p>
                </div>
              )}
            </div>

            {/* Social Links */}
            {(company.linkedin_url || company.github_url || company.twitter_url) && (
              <div className="flex justify-center gap-4 mt-8">
                {company.linkedin_url && (
                  <a
                    href={company.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full 
                             flex items-center justify-center text-primary-600 dark:text-primary-400 
                             hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors duration-200"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {company.github_url && (
                  <a
                    href={company.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full 
                             flex items-center justify-center text-primary-600 dark:text-primary-400 
                             hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors duration-200"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {company.twitter_url && (
                  <a
                    href={company.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full 
                             flex items-center justify-center text-primary-600 dark:text-primary-400 
                             hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors duration-200"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 dark:bg-black text-gray-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CompanyHomePage;
