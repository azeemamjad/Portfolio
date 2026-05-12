import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Mail } from 'lucide-react';
import type { Portfolio } from '../../types';
import TimelineSection from '../../components/sections/TimelineSection';

interface PortfolioHomePageProps {
  portfolio: Portfolio;
}

const PortfolioHomePage: React.FC<PortfolioHomePageProps> = ({ portfolio }) => {
  const { username, name, tagline, profile_image, about, projects, skills, achievements } = portfolio;
  const displayName = name || username;

  const featuredProjects = projects.filter(p => p.is_featured).slice(0, 3);
  const featuredSkills = skills.slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="section-padding pt-32">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            {profile_image && (
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-400 rounded-full blur-2xl opacity-20 animate-pulse" />
                  <img
                    src={profile_image}
                    alt={username}
                    className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-xl"
                  />
                </div>
              </div>
            )}

            <h1 className="heading-primary text-neutral-900">
              Hi, I'm <span className="text-gradient">{displayName}</span>
            </h1>

            {tagline && (
              <p className="text-2xl md:text-3xl text-neutral-600 mb-8 max-w-2xl mx-auto">
                {tagline}
              </p>
            )}

            {about?.bio && (
              <p className="text-lg text-neutral-500 mb-8 max-w-3xl mx-auto leading-relaxed">
                {about.bio}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to={`/${username}/about`} className="btn-primary flex items-center gap-2">
                Learn More About Me
                <ArrowRight className="w-4 h-4" />
              </Link>

              {about?.resume_file && (
                <a href={about.resume_file} download className="btn-outline flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Resume
                </a>
              )}

              <Link to={`/${username}/contact`} className="btn-secondary flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="section-padding bg-black/5">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { value: projects.length,     label: 'Projects' },
              { value: skills.length,       label: 'Skills' },
              { value: achievements.length, label: 'Achievements' },
              { value: about?.location ? '📍' : '🌍', label: about?.location || 'Remote' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">{value}</div>
                <div className="text-neutral-500 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <TimelineSection achievements={achievements} />

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="section-padding">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="heading-secondary text-neutral-900">Featured Projects</h2>
                <p className="text-neutral-500 mt-1">Some of my best work</p>
              </div>
              <Link
                to={`/${username}/projects`}
                className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-2 text-sm transition-colors"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/${username}/projects`}
                  className="card group"
                >
                  {project.image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-neutral-900 mb-2 group-hover:text-orange-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-neutral-500 text-sm line-clamp-2">{project.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Skills Preview */}
      {featuredSkills.length > 0 && (
        <section className="section-padding bg-black/5">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="heading-secondary text-neutral-900">Core Skills</h2>
                <p className="text-neutral-500 mt-1">Technologies I work with</p>
              </div>
              <Link
                to={`/${username}/skills`}
                className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-2 text-sm transition-colors"
              >
                View All Skills <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {featuredSkills.map((skill, index) => (
                <div key={index} className="card p-6 text-center group">
                  {skill.icon && <div className="text-4xl mb-3">{skill.icon}</div>}
                  <div className="font-semibold text-neutral-800 text-sm">{skill.name}</div>
                  <div className="text-xs text-neutral-400 mt-1 capitalize">{skill.proficiency}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default PortfolioHomePage;
