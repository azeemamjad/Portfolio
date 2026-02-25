import React, { useState } from 'react';
import { ExternalLink, Github, Eye, Layers } from 'lucide-react';
import type { Project } from '../../types';

interface ProjectsSectionProps {
  projects: Project[];
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [filter, setFilter] = useState<'all' | 'featured'>('all');

  if (projects.length === 0) return null;

  const hasFeatured = projects.some((p) => p.is_featured);
  const filtered = filter === 'featured' ? projects.filter((p) => p.is_featured) : projects;

  return (
    <section id="projects" className="section-padding bg-section-alt">
      <div className="container-custom">
        {/* Header */}
        <div className="section-header">
          <span className="section-label">Portfolio</span>
          <h2 className="heading-secondary text-gray-900 dark:text-white">Projects & Work</h2>
          <div className="section-underline" />
          <p className="text-gray-500 dark:text-gray-400 mt-5 max-w-xl mx-auto text-base">
            A selection of projects that showcase my skills and passion for building great software.
          </p>
        </div>

        {/* Filter */}
        {hasFeatured && (
          <div className="flex justify-center gap-2 mb-10">
            {(['all', 'featured'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  filter === f
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500'
                }`}
              >
                {f === 'all' ? 'All Projects' : '⭐ Featured'}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filtered.map((project, index) => (
            <div
              key={project.id}
              className="card group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {/* Image with overlay */}
              <div className="relative overflow-hidden aspect-video bg-gray-100 dark:bg-gray-800">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Layers className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                  </div>
                )}

                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Hover links */}
                <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-3
                                opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0
                                transition-all duration-300">
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 backdrop-blur-sm
                                  text-white text-xs font-semibold hover:bg-white/25 transition-colors"
                       onClick={e => e.stopPropagation()}>
                      <ExternalLink className="w-3 h-3" /> Live
                    </a>
                  )}
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 backdrop-blur-sm
                                  text-white text-xs font-semibold hover:bg-white/25 transition-colors"
                       onClick={e => e.stopPropagation()}>
                      <Github className="w-3 h-3" /> Code
                    </a>
                  )}
                  {project.demo_url && (
                    <a href={project.demo_url} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 backdrop-blur-sm
                                  text-white text-xs font-semibold hover:bg-white/25 transition-colors"
                       onClick={e => e.stopPropagation()}>
                      <Eye className="w-3 h-3" /> Demo
                    </a>
                  )}
                </div>

                {project.is_featured && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg
                                  bg-primary-600 text-white text-xs font-bold shadow-lg">
                    ⭐ Featured
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2
                               group-hover:text-primary-600 dark:group-hover:text-primary-400
                               transition-colors duration-200 leading-tight">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech tags */}
                {project.technologies_list && project.technologies_list.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies_list.slice(0, 4).map((tech, i) => (
                      <span key={i}
                            className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-700/80
                                       text-gray-600 dark:text-gray-300 text-xs font-medium">
                        {tech}
                      </span>
                    ))}
                    {project.technologies_list.length > 4 && (
                      <span className="px-2.5 py-1 rounded-lg bg-primary-50 dark:bg-primary-950/40
                                       text-primary-600 dark:text-primary-400 text-xs font-medium">
                        +{project.technologies_list.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 dark:text-gray-500 py-16">No projects found.</p>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
