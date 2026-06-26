import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  Eye,
  Github,
  Layers,
  Link2,
  Star,
  Trophy,
} from 'lucide-react';
import { portfolioAPI } from '../../services/api';
import type { CaseStudy, Project, Testimonial } from '../../types';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import ProjectImageGallery from '../../components/common/ProjectImageGallery';
import TechMarquee from '../../components/common/TechMarquee';
import { getProjectGallerySlides } from '../../utils/projectGallery';

function formatLongDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

function formatDateRange(start: string | null, end: string | null) {
  if (!start) return null;
  const startLabel = formatLongDate(start);
  const endLabel = end ? formatLongDate(end) : 'Present';
  return `${startLabel} – ${endLabel}`;
}

function formatUpdated(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

const CASE_STUDY_SECTIONS: { key: keyof CaseStudy; label: string; eyebrow: string }[] = [
  { key: 'challenge', label: 'The challenge', eyebrow: 'Problem' },
  { key: 'solution', label: 'The solution', eyebrow: 'Approach' },
  { key: 'process', label: 'Process & methodology', eyebrow: 'How' },
  { key: 'results', label: 'Results & impact', eyebrow: 'Impact' },
  { key: 'lessons_learned', label: 'Lessons learned', eyebrow: 'Takeaways' },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="project-detail__stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-content-muted/30'}`}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <blockquote className="about-glass-card project-detail__testimonial">
      <div className="flex items-start gap-3 mb-3">
        {testimonial.client_image ? (
          <img
            src={testimonial.client_image}
            alt={testimonial.client_name}
            className="project-detail__testimonial-avatar"
          />
        ) : (
          <div className="project-detail__testimonial-avatar project-detail__testimonial-avatar--fallback">
            {testimonial.client_name.charAt(0)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-content text-sm">{testimonial.client_name}</p>
          <p className="text-xs text-content-muted mt-0.5">
            {[testimonial.client_role, testimonial.client_company].filter(Boolean).join(' · ')}
          </p>
          {testimonial.rating > 0 && <StarRating rating={testimonial.rating} />}
        </div>
        {testimonial.date && (
          <time className="text-xs text-content-muted shrink-0">
            {formatLongDate(testimonial.date)}
          </time>
        )}
      </div>
      <p className="about-glass-card__body italic">&ldquo;{testimonial.content}&rdquo;</p>
    </blockquote>
  );
}

function ContentSection({
  eyebrow,
  title,
  children,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <section className="about-glass-card project-detail__section">
      <div className="about-glass-card__shine" aria-hidden />
      <div className="about-glass-card__head">
        {Icon && (
          <div className="about-glass-card__icon">
            <Icon className="w-4 h-4 text-accent" />
          </div>
        )}
        <div>
          <p className="about-glass-card__eyebrow">{eyebrow}</p>
          <h2 className="about-glass-card__label">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}

const ProjectDetailPage: React.FC = () => {
  const { username, slug } = useParams<{ username: string; slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [username, slug]);

  useEffect(() => {
    if (!username || !slug) return;
    const fetchProject = async () => {
      try {
        setLoading(true);
        const data = await portfolioAPI.getProject(username, slug);
        setProject(data);
        document.title = `${data.title} — ${username}`;
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } })?.response?.status;
        setError(status === 404 ? 'Project not found.' : 'Failed to load this project.');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [username, slug]);

  const gallerySlides = useMemo(
    () => (project ? getProjectGallerySlides(project) : []),
    [project],
  );

  if (loading) return <Loading label="Loading project..." />;
  if (error || !project || !username) {
    return <ErrorMessage title="Project Not Found" message={error || 'Project not found'} />;
  }

  const dateRange = formatDateRange(project.start_date, project.end_date);
  const caseStudy = project.case_study;
  const hasCaseStudy = caseStudy && CASE_STUDY_SECTIONS.some(({ key }) => caseStudy[key]);
  const showDetailed =
    project.detailed_description &&
    project.detailed_description.trim() !== project.description.trim();

  const links = [
    { href: project.live_url, label: 'Live site', icon: ExternalLink },
    { href: project.github_url, label: 'Source code', icon: Github },
    { href: project.demo_url, label: 'Demo', icon: Eye },
  ].filter((l) => Boolean(l.href));

  return (
    <div className="project-detail page-content-section">
      <div className="container-custom project-detail__container">
        <Link to={`/${username}/projects`} className="project-detail__back">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        <div className="project-detail__hero">
          <section className="project-detail__gallery-col" aria-label="Project screenshots">
            <ProjectImageGallery slides={gallerySlides} title={project.title} />
          </section>

          <div className="project-detail__content-col">
            <header className="project-detail__meta">
              <div className="flex flex-wrap items-center gap-2">
                {project.is_featured && (
                  <span className="project-detail__badge">
                    <Star className="w-3 h-3 fill-current" />
                    Featured
                  </span>
                )}
                {dateRange && (
                  <span className="project-detail__meta-pill">
                    <Calendar className="w-3.5 h-3.5" />
                    {dateRange}
                  </span>
                )}
              </div>
              {project.updated_at && (
                <p className="project-detail__updated">
                  <Clock className="w-3.5 h-3.5" />
                  Updated {formatUpdated(project.updated_at)}
                </p>
              )}
            </header>

            <section className="project-detail__heading">
              <h1 className="project-detail__title">{project.title}</h1>
            </section>

            <section className="project-detail__description">
              <p className="project-detail__summary">{project.description}</p>
            </section>
          </div>
        </div>

        {(project.technologies_list?.length > 0 || links.length > 0) && (
          <div className="project-detail__below-hero">
            {project.technologies_list?.length > 0 && (
              <section className="project-detail__tech" aria-label="Technologies">
                <TechMarquee technologies={project.technologies_list} />
              </section>
            )}

            {links.length > 0 && (
              <nav className="project-detail__links" aria-label="Project links">
                {links.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-detail__action"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </a>
                ))}
              </nav>
            )}
          </div>
        )}

        <div className="project-detail__body">
          {showDetailed && (
            <ContentSection eyebrow="Deep dive" title="Project overview" icon={Layers}>
              <p className="about-glass-card__body whitespace-pre-line">{project.detailed_description}</p>
            </ContentSection>
          )}

          {project.outcome && (
            <ContentSection eyebrow="Results" title="Outcome" icon={Trophy}>
              <p className="about-glass-card__body whitespace-pre-line">{project.outcome}</p>
            </ContentSection>
          )}

          {hasCaseStudy && (
            <div className="project-detail__case-study">
              <div className="project-detail__case-study-header">
                <p className="about-glass-card__eyebrow">Case study</p>
                <h2 className="text-xl font-bold text-content">How it was built</h2>
              </div>
              <div className="project-detail__case-study-grid">
                {CASE_STUDY_SECTIONS.map(({ key, label, eyebrow }) =>
                  caseStudy![key] ? (
                    <section key={key} className="about-glass-card project-detail__case-card">
                      <p className="about-glass-card__eyebrow">{eyebrow}</p>
                      <h3 className="text-base font-bold text-content mb-2">{label}</h3>
                      <p className="about-glass-card__body whitespace-pre-line">{caseStudy![key]}</p>
                    </section>
                  ) : null,
                )}
              </div>
            </div>
          )}

          {project.testimonials?.length > 0 && (
            <div className="project-detail__testimonials">
              <div className="project-detail__case-study-header">
                <p className="about-glass-card__eyebrow">Feedback</p>
                <h2 className="text-xl font-bold text-content">Client testimonials</h2>
              </div>
              <div className="flex flex-col gap-4">
                {project.testimonials.map((t) => (
                  <TestimonialCard key={t.id} testimonial={t} />
                ))}
              </div>
            </div>
          )}

          <section className="about-glass-card project-detail__facts">
            <p className="about-glass-card__eyebrow mb-3">At a glance</p>
            <dl className="project-detail__facts-grid">
              {dateRange && (
                <div className="project-detail__fact">
                  <dt>Timeline</dt>
                  <dd>{dateRange}</dd>
                </div>
              )}
              {project.technologies_list?.length > 0 && (
                <div className="project-detail__fact">
                  <dt>Stack</dt>
                  <dd>{project.technologies_list.length} technologies</dd>
                </div>
              )}
              {links.length > 0 && (
                <div className="project-detail__fact">
                  <dt>Links</dt>
                  <dd className="flex flex-wrap gap-2">
                    {links.map(({ href, label }) => (
                      <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="project-detail__fact-link">
                        <Link2 className="w-3 h-3" />
                        {label}
                      </a>
                    ))}
                  </dd>
                </div>
              )}
              <div className="project-detail__fact">
                <dt>Status</dt>
                <dd>{project.is_featured ? 'Featured project' : 'Portfolio project'}</dd>
              </div>
            </dl>
          </section>

          <Link to={`/${username}/projects`} className="project-detail__action project-detail__action--back">
            <ArrowLeft className="w-4 h-4" />
            All projects
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
