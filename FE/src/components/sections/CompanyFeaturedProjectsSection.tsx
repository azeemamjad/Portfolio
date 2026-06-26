import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, User } from 'lucide-react';
import type { FeaturedDeveloper, Project } from '../../types';
import { getProjectThumbnailSrc } from '../../utils/projectGallery';
import SectionHeader from '../common/SectionHeader';

export interface CompanyFeaturedProject {
  project: Project;
  developer: {
    username: string;
    name?: string;
    profile_image: string | null;
  };
}

export function buildCompanyFeaturedProjects(developers: FeaturedDeveloper[]): CompanyFeaturedProject[] {
  return developers.flatMap((dev) =>
    (dev.portfolio.featured_projects ?? []).map((project) => ({
      project,
      developer: {
        username: dev.portfolio.username,
        name: dev.portfolio.name,
        profile_image: dev.portfolio.profile_image,
      },
    })),
  );
}

function ProjectVisual({ project }: { project: Project }) {
  const [failed, setFailed] = React.useState(false);
  const src = getProjectThumbnailSrc(project);

  return (
    <div className="company-project-card__visual">
      {!failed ? (
        <img
          src={src}
          alt={project.title}
          className="company-project-card__image"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="company-project-card__image-fallback">{project.title.charAt(0)}</div>
      )}
    </div>
  );
}

interface CompanyFeaturedProjectsSectionProps {
  items: CompanyFeaturedProject[];
}

const CompanyFeaturedProjectsSection: React.FC<CompanyFeaturedProjectsSectionProps> = ({ items }) => {
  if (items.length === 0) return null;

  return (
    <section id="projects" className="company-projects-section relative z-10 py-20 md:py-24 scroll-mt-28">
      <div className="container-custom">
        <SectionHeader
          label="Our Work"
          title="Featured Projects"
          description="Highlighted builds from our developers — real products shipped by the people behind our team."
          className="mb-10 md:mb-12"
        />

        <div className="company-projects-section__list">
          {items.map(({ project, developer }, index) => {
            const displayName = developer.name || developer.username;
            const techs = project.technologies_list?.slice(0, 5) ?? [];

            return (
              <article
                key={`${developer.username}-${project.id}`}
                className="company-project-card animate-fade-in-up"
                style={{ animationDelay: `${index * 0.07}s` }}
              >
                <div className="company-project-card__shine" aria-hidden />
                <ProjectVisual project={project} />

                <div className="company-project-card__body">
                  <Link
                    to={`/${developer.username}`}
                    className="company-project-card__developer"
                  >
                    {developer.profile_image ? (
                      <img
                        src={developer.profile_image}
                        alt={displayName}
                        className="company-project-card__developer-avatar"
                      />
                    ) : (
                      <span className="company-project-card__developer-avatar company-project-card__developer-avatar--fallback">
                        <User className="w-4 h-4" />
                      </span>
                    )}
                    <span className="company-project-card__developer-text">
                      <span className="company-project-card__developer-label">Developer</span>
                      <span className="company-project-card__developer-name">{displayName}</span>
                    </span>
                  </Link>

                  <h3 className="company-project-card__title">{project.title}</h3>
                  <p className="company-project-card__desc">{project.description}</p>

                  {techs.length > 0 && (
                    <div className="company-project-card__tags">
                      {techs.map((tech) => (
                        <span key={tech} className="company-project-card__tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="company-project-card__actions">
                    <Link
                      to={`/${developer.username}/projects/${project.slug}`}
                      className="company-project-card__cta"
                    >
                      View project
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="company-project-card__cta company-project-card__cta--ghost"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live site
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CompanyFeaturedProjectsSection;
