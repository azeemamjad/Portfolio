import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, Eye } from 'lucide-react';
import type { Project } from '../../types';
import { getProjectFallbackImage, getProjectThumbnailSrc } from '../../utils/projectGallery';
import SectionHeader from '../common/SectionHeader';
import Card from '../common/Card';

function ProjectCardImage({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false);
  const src = failed ? getProjectFallbackImage(project) : getProjectThumbnailSrc(project);

  return (
    <img
      src={src}
      alt={project.title}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

interface ProjectsSectionProps {
  projects: Project[];
  username: string;
  showHeader?: boolean;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  username,
  showHeader = true,
}) => {
  const [filter, setFilter] = useState<'all' | 'featured'>('all');

  if (projects.length === 0) return null;

  const hasFeatured = projects.some((p) => p.is_featured);
  const filtered = filter === 'featured' ? projects.filter((p) => p.is_featured) : projects;

  return (
    <section id="projects" className={showHeader ? 'section-padding bg-section-alt' : 'page-content-section'}>
      <div className="container-custom projects-section__container">
        {showHeader && (
          <SectionHeader
            label="Portfolio"
            title="Projects & Work"
            description="A selection of projects that showcase my skills and passion for building great software."
          />
        )}

        {hasFeatured && (
          <div className="flex justify-center gap-2 mb-10">
            {(['all', 'featured'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  filter === f
                    ? 'bg-accent text-accent-fg shadow-lg shadow-accent/20'
                    : 'bg-surface text-content-muted border border-line hover:border-accent/50'
                }`}
              >
                {f === 'all' ? 'All Projects' : '⭐ Featured'}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filtered.map((project, index) => (
            <Card
              key={project.id}
              className="group animate-fade-in-up relative rounded-[1.75rem] bg-white/70 dark:bg-[rgba(20,20,23,0.7)] backdrop-blur-xl backdrop-saturate-150 border-[var(--glass-border)] shadow-[var(--glass-shadow)] hover:-translate-y-1 hover:border-accent/40 hover:shadow-[var(--glass-shadow-elevated)]"
              style={{ animationDelay: `${index * 0.08}s` }}
              hover
            >
              <Link
                to={`/${username}/projects/${project.slug}`}
                className="absolute inset-0 z-10 rounded-[1.75rem]"
                aria-label={`View ${project.title}`}
              />

              <div className="relative overflow-hidden rounded-t-[1.75rem] aspect-video bg-surface-muted pointer-events-none">
                <ProjectCardImage project={project} />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-auto z-20">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-semibold hover:bg-white/25 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3 h-3" /> Live
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-semibold hover:bg-white/25 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github className="w-3 h-3" /> Code
                    </a>
                  )}
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-semibold hover:bg-white/25 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Eye className="w-3 h-3" /> Demo
                    </a>
                  )}
                </div>

                {project.is_featured && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-accent text-accent-fg text-xs font-semibold shadow-lg">
                    ⭐ Featured
                  </div>
                )}
              </div>

              <div className="p-6 pointer-events-none">
                <h3 className="text-xl font-semibold tracking-tight text-content mb-2 group-hover:text-accent transition-colors leading-tight">
                  {project.title}
                </h3>
                <p className="text-sm text-content-muted mb-4 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {project.technologies_list && project.technologies_list.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies_list.slice(0, 4).map((tech) => (
                      <span key={tech} className="featured-stack-tag">
                        {tech}
                      </span>
                    ))}
                    {project.technologies_list.length > 4 && (
                      <span className="featured-stack-tag font-semibold text-accent bg-[color-mix(in_oklch,var(--accent)_12%,transparent)] border-[color-mix(in_oklch,var(--accent)_28%,transparent)]">
                        +{project.technologies_list.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-content-muted py-16">No projects found.</p>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
