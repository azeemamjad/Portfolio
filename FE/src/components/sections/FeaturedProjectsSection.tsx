import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Github, ImageIcon } from 'lucide-react';
import type { Project } from '../../types';
import { getProjectCoverSrc } from '../../utils/projectGallery';
import SectionHeader from '../common/SectionHeader';
import Card from '../common/Card';

interface FeaturedProjectsSectionProps {
  projects: Project[];
  username: string;
}

function ProjectCover({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false);
  const src = getProjectCoverSrc(project);

  if (failed) {
    return (
      <div className="featured-stack-card__placeholder" aria-hidden>
        <ImageIcon className="w-10 h-10 text-content-muted/45" />
        <span className="featured-stack-card__placeholder-label">{project.title}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`${project.title} preview`}
      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

/**
 * Static grid of featured work (UX-07): all projects are discoverable at once —
 * no automatic rotation, and the action links are always visible (UX-05).
 */
const FeaturedProjectsSection: React.FC<FeaturedProjectsSectionProps> = ({
  projects,
  username,
}) => {
  if (projects.length === 0) return null;

  return (
    <section className="featured-projects-section pt-16 md:pt-24 pb-16 md:pb-20">
      <div className="container-custom">
        <div className="featured-projects-section__header">
          <SectionHeader
            className="mb-0 text-left [&_.section-underline]:mx-0"
            label="Portfolio"
            title="Selected Work"
            description="A few projects that show how I design, build and ship software."
          />
          <Link to={`/${username}/projects`} className="featured-projects-section__cta">
            View all projects
            <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="group flex flex-col overflow-hidden rounded-[1.75rem] bg-white/70 dark:bg-[rgba(20,20,23,0.7)] backdrop-blur-xl backdrop-saturate-150 border-[var(--glass-border)] shadow-[var(--glass-shadow)] hover:-translate-y-1 hover:border-accent/40 hover:shadow-[var(--glass-shadow-elevated)]"
              hover
            >
              <div className="relative overflow-hidden rounded-t-[1.75rem] aspect-video bg-surface-muted">
                <ProjectCover project={project} />
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
                    aria-label={`View the ${project.title} case study`}
                  >
                    {project.title}
                  </Link>
                </h3>

                <p className="text-sm text-content-muted mb-4 line-clamp-3 leading-relaxed">
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
                    aria-label={`Read the ${project.title} case study`}
                  >
                    Read case study
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden />
                  </Link>

                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-content-muted hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded px-0.5 py-0.5"
                      aria-label={`Open the ${project.title} live site (opens in a new tab)`}
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
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjectsSection;
