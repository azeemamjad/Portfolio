import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Github, Eye } from 'lucide-react';
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
      alt={`${project.title} preview`}
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

/**
 * Project listing with permanently visible actions (UX-05): Live/Source/Demo
 * links never depend on hover, and every action has a project-specific
 * accessible name.
 */
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
                aria-pressed={filter === f}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  filter === f
                    ? 'bg-accent text-accent-fg shadow-lg shadow-accent/20'
                    : 'bg-surface text-content-muted border border-line hover:border-accent/50'
                }`}
              >
                {f === 'all' ? 'All Projects' : 'Featured'}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filtered.map((project, index) => (
            <Card
              key={project.id}
              className="group animate-fade-in-up flex flex-col rounded-[1.75rem] bg-white/70 dark:bg-[rgba(20,20,23,0.7)] backdrop-blur-xl backdrop-saturate-150 border-[var(--glass-border)] shadow-[var(--glass-shadow)] hover:-translate-y-1 hover:border-accent/40 hover:shadow-[var(--glass-shadow-elevated)]"
              style={{ animationDelay: `${index * 0.08}s` }}
              hover
            >
              <div className="relative overflow-hidden rounded-t-[1.75rem] aspect-video bg-surface-muted">
                <ProjectCardImage project={project} />
                {project.is_featured && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-accent text-accent-fg text-xs font-semibold shadow-lg">
                    Featured
                  </div>
                )}
              </div>

              <div className="flex flex-col flex-1 p-6">
                <h3 className="text-xl font-semibold tracking-tight text-content mb-2 leading-tight">
                  <Link
                    to={`/${username}/projects/${project.slug}`}
                    className="hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded"
                    aria-label={`View ${project.title}`}
                  >
                    {project.title}
                  </Link>
                </h3>
                <p className="text-sm text-content-muted mb-4 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {project.technologies_list && project.technologies_list.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
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

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-3 mt-auto border-t border-line/60">
                  <Link
                    to={`/${username}/projects/${project.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded px-0.5 py-0.5"
                    aria-label={`View ${project.title} details`}
                  >
                    Details
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden />
                  </Link>

                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-content-muted hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded px-0.5 py-0.5"
                      aria-label={`Open ${project.title} live site (opens in a new tab)`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden />
                      Live site
                    </a>
                  )}

                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-content-muted hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded px-0.5 py-0.5"
                      aria-label={`View ${project.title} source code (opens in a new tab)`}
                    >
                      <Github className="w-3.5 h-3.5" aria-hidden />
                      Source
                    </a>
                  )}

                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-content-muted hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded px-0.5 py-0.5"
                      aria-label={`View ${project.title} demo (opens in a new tab)`}
                    >
                      <Eye className="w-3.5 h-3.5" aria-hidden />
                      Demo
                    </a>
                  )}
                </div>
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
