import React, { useState } from 'react';
import { ExternalLink, Github, Eye, Filter } from 'lucide-react';
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
            <h1 className="heading-primary">Projects</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-4">No projects available yet.</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredProjects = filter === 'featured' 
    ? projects.filter(p => p.is_featured) 
    : projects;

  const categories = Array.from(
    new Set(projects.flatMap(p => p.technologies_list || []))
  ).sort();

  return (
    <div>
      {/* Header */}
      <section className="section-padding pt-32 bg-gray-50 dark:bg-gray-800/50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-primary">My Projects</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
              A collection of my work showcasing various technologies and solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="section-padding pt-8">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                      filter === 'all'
                        ? 'bg-primary-600 text-white shadow-lg'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    All Projects ({projects.length})
                  </button>
                  {projects.some(p => p.is_featured) && (
                    <button
                      onClick={() => setFilter('featured')}
                      className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                        filter === 'featured'
                          ? 'bg-primary-600 text-white shadow-lg'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      Featured ({projects.filter(p => p.is_featured).length})
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="card group hover:shadow-2xl transition-all duration-300"
                >
                  {/* Project Image */}
                  {project.image && (
                    <div className="relative overflow-hidden aspect-video">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {project.is_featured && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-primary-600 text-white text-xs font-bold rounded-full">
                          Featured
                        </div>
                      )}
                    </div>
                  )}

                  {/* Project Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {project.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    {project.technologies_list && project.technologies_list.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies_list.slice(0, 5).map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies_list.length > 5 && (
                          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
                            +{project.technologies_list.length - 5}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Links */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Live
                        </a>
                      )}
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        >
                          <Github className="w-4 h-4" />
                          Code
                        </a>
                      )}
                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">No projects found.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;
