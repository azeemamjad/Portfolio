import React, { useState } from 'react';
import { ExternalLink, Github, Eye } from 'lucide-react';
import type { Project } from '../../types';

interface ProjectsPageProps {
  projects: Project[];
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ projects }) => {
  const [filter, setFilter] = useState<'all' | 'featured'>('all');

  if (projects.length === 0) {
    return (
      <div className="section-padding pt-32">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-primary text-neutral-900">Projects</h1>
            <p className="text-neutral-500 mt-4">No projects available yet.</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredProjects = filter === 'featured'
    ? projects.filter(p => p.is_featured)
    : projects;

  return (
    <div>
      {/* Header */}
      <section className="section-padding pt-32 bg-black/5">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <span className="section-label">Work</span>
            <h1 className="heading-primary text-neutral-900">
              My{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-500">
                Projects
              </span>
            </h1>
            <p className="text-neutral-500 mt-4 max-w-2xl mx-auto text-lg leading-relaxed">
              A collection of my work showcasing various technologies and solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="section-padding pt-12">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-10">
              {[
                { value: 'all',      label: `All Projects (${projects.length})` },
                ...(projects.some(p => p.is_featured)
                  ? [{ value: 'featured', label: `Featured (${projects.filter(p => p.is_featured).length})` }]
                  : []),
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setFilter(value as 'all' | 'featured')}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filter === value
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'bg-white text-neutral-600 border border-neutral-200 hover:border-orange-400 hover:text-orange-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Projects grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div key={project.id} className="card group">
                  {project.image && (
                    <div className="relative overflow-hidden aspect-video">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {project.is_featured && (
                        <div className="absolute top-3 right-3 px-2.5 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                          Featured
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-neutral-900 mb-2 group-hover:text-orange-600 transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-neutral-500 text-sm mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {project.technologies_list && project.technologies_list.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies_list.slice(0, 5).map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 bg-neutral-200 text-neutral-700 text-xs font-medium rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies_list.length > 5 && (
                          <span className="px-2.5 py-1 bg-neutral-200 text-neutral-600 text-xs font-medium rounded-full">
                            +{project.technologies_list.length - 5}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-4 pt-4 border-t border-neutral-200">
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Live
                        </a>
                      )}
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-800 transition-colors"
                        >
                          <Github className="w-3.5 h-3.5" />
                          Code
                        </a>
                      )}
                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-800 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-16">
                <p className="text-neutral-500">No projects found.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;
