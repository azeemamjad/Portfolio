import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  ImageIcon,
} from 'lucide-react';
import type { Project } from '../../types';
import { getProjectCoverSrc } from '../../utils/projectGallery';
import SectionHeader from '../common/SectionHeader';

interface FeaturedProjectsSectionProps {
  projects: Project[];
  username: string;
}

const SWIPE_MS = 240;
const AUTO_MS = 4200;
const MAX_STACK_DEPTH = 3;

function getProjectCoverSrcLocal(project: Project): string {
  return getProjectCoverSrc(project);
}

function ProjectCover({ project, title }: { project: Project; title: string }) {
  const [failed, setFailed] = useState(false);
  const src = getProjectCoverSrcLocal(project);

  if (failed) {
    return (
      <div className="featured-stack-card__placeholder" aria-hidden>
        <ImageIcon className="w-10 h-10 text-content-muted/45" />
        <span className="featured-stack-card__placeholder-label">{title}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title}
      className="featured-stack-card__image"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function getRelativeIndex(index: number, active: number, total: number) {
  let rel = index - active;
  const half = Math.floor(total / 2);
  if (rel > half) rel -= total;
  if (rel < -half) rel += total;
  return rel;
}

function getStackTransform(relativeIndex: number) {
  if (relativeIndex === 0) {
    return {
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      opacity: 1,
      zIndex: 40,
      pointerEvents: 'auto' as const,
    };
  }

  const depth = Math.abs(relativeIndex);
  if (depth > MAX_STACK_DEPTH) {
    const side = relativeIndex > 0 ? 1 : -1;
    return {
      x: side * 58,
      y: 14,
      scale: 0.78,
      rotate: side * 10,
      opacity: 0,
      zIndex: 0,
      pointerEvents: 'none' as const,
    };
  }

  const side = relativeIndex > 0 ? 1 : -1;
  const x = side * (52 + depth * 32);
  const y = depth * 10;
  const scale = 1 - depth * 0.07;
  const rotate = side * (3 + depth * 2.5);

  return {
    x,
    y,
    scale,
    rotate,
    opacity: depth === 1 ? 0.72 : depth === 2 ? 0.5 : 0.32,
    zIndex: 40 - depth,
    pointerEvents: 'none' as const,
  };
}

interface StackCardProps {
  project: Project;
  username: string;
  relativeIndex: number;
  isCenter: boolean;
}

function StackCard({ project, username, relativeIndex, isCenter }: StackCardProps) {
  const t = getStackTransform(relativeIndex);
  const techs = project.technologies_list?.slice(0, 2) ?? [];

  return (
    <article
      className={`featured-stack-card${isCenter ? ' featured-stack-card--center' : ''}`}
      style={{
        zIndex: t.zIndex,
        opacity: t.opacity,
        pointerEvents: t.pointerEvents,
        transform: `translate(calc(-50% + ${t.x}px), ${t.y}px) scale(${t.scale}) rotate(${t.rotate}deg)`,
      }}
    >
      <div className="featured-stack-card__inner">
        <div className="featured-stack-card__media">
          <ProjectCover project={project} title={project.title} />
        </div>

        {isCenter && (
          <div className="featured-stack-card__body">
            <h3 className="featured-stack-card__title font-semibold tracking-tight">{project.title}</h3>
            <p className="featured-stack-card__desc">{project.description}</p>

            {techs.length > 0 && (
              <div className="featured-stack-card__tags">
                {techs.map((tech) => (
                  <span key={tech} className="featured-stack-tag">
                    {tech}
                  </span>
                ))}
              </div>
            )}

            <div className="featured-stack-card__footer">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="featured-stack-card__icon-btn"
                  aria-label="Live site"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="featured-stack-card__icon-btn"
                  aria-label="Source code"
                >
                  <Github className="w-3.5 h-3.5" />
                </a>
              )}
              <Link to={`/${username}/projects/${project.slug}`} className="featured-stack-card__link">
                Details
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

const FeaturedProjectsSection: React.FC<FeaturedProjectsSectionProps> = ({
  projects,
  username,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const touchStartX = useRef<number | null>(null);
  const total = projects.length;

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (total <= 1 || reducedMotion || paused) return;
    const id = window.setInterval(goNext, AUTO_MS);
    return () => window.clearInterval(id);
  }, [goNext, total, reducedMotion, paused]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 48) {
      if (delta < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  };

  if (projects.length === 0) return null;

  return (
    <section className="featured-projects-section">
      <div className="container-custom">
        <div className="featured-projects-section__header">
          <SectionHeader
            className="mb-0 text-left [&_.section-underline]:mx-0"
            label="Portfolio"
            title="Featured Projects"
            description="Swipe through selected work — one highlight at a time."
          />
          <Link to={`/${username}/projects`} className="featured-projects-section__cta">
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div
          className="featured-stack"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          style={{ '--featured-swipe-ms': `${SWIPE_MS}ms` } as React.CSSProperties}
        >
          <div className="featured-stack__stage" aria-live="polite">
            {projects.map((project, index) => {
              const rel = getRelativeIndex(index, activeIndex, total);
              return (
                <StackCard
                  key={project.id}
                  project={project}
                  username={username}
                  relativeIndex={rel}
                  isCenter={rel === 0}
                />
              );
            })}
          </div>

          {total > 1 && (
            <>
              <button
                type="button"
                className="featured-stack__nav featured-stack__nav--prev"
                onClick={goPrev}
                aria-label="Previous project"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="featured-stack__nav featured-stack__nav--next"
                onClick={goNext}
                aria-label="Next project"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="featured-stack__dots" role="tablist" aria-label="Featured projects">
                {projects.map((project, index) => (
                  <button
                    key={project.id}
                    type="button"
                    role="tab"
                    aria-selected={index === activeIndex}
                    aria-label={project.title}
                    className={`featured-stack__dot${index === activeIndex ? ' featured-stack__dot--active' : ''}`}
                    onClick={() => setActiveIndex(index)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjectsSection;
