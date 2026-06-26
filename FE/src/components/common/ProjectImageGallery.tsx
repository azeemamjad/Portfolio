import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import type { GallerySlide } from '../../utils/projectGallery';

const SWIPE_MS = 240;
const AUTO_MS = 4200;
const MAX_STACK_DEPTH = 3;

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
  const x = side * (42 + depth * 28);
  const y = depth * 8;
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

interface StackSlideProps {
  slide: GallerySlide;
  title: string;
  index: number;
  relativeIndex: number;
  isCenter: boolean;
  failed: boolean;
  onError: () => void;
}

function StackSlide({
  slide,
  title,
  index,
  relativeIndex,
  isCenter,
  failed,
  onError,
}: StackSlideProps) {
  const t = getStackTransform(relativeIndex);

  return (
    <article
      className={`featured-stack-card featured-stack-card--gallery${isCenter ? ' featured-stack-card--center' : ''}`}
      style={{
        zIndex: t.zIndex,
        opacity: t.opacity,
        pointerEvents: t.pointerEvents,
        transform: `translate(calc(-50% + ${t.x}px), ${t.y}px) scale(${t.scale}) rotate(${t.rotate}deg)`,
      }}
    >
      <div className="featured-stack-card__inner featured-stack-card__inner--gallery">
        <div className="featured-stack-card__media featured-stack-card__media--gallery">
          {!failed ? (
            <img
              src={slide.src}
              alt={slide.caption || `${title} screenshot ${index + 1}`}
              className="featured-stack-card__image"
              loading={index === 0 ? 'eager' : 'lazy'}
              onError={onError}
            />
          ) : (
            <div className="featured-stack-card__placeholder">
              <ImageIcon className="w-10 h-10 text-content-muted/45" />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

interface ProjectImageGalleryProps {
  slides: GallerySlide[];
  title: string;
}

const ProjectImageGallery: React.FC<ProjectImageGalleryProps> = ({ slides, title }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState<Set<number>>(new Set());
  const touchStartX = useRef<number | null>(null);
  const total = slides.length;

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (total <= 1 || paused) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const id = window.setInterval(goNext, AUTO_MS);
    return () => window.clearInterval(id);
  }, [goNext, total, paused]);

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

  if (total === 0) return null;

  return (
    <div
      className="featured-stack featured-stack--gallery"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{ '--featured-swipe-ms': `${SWIPE_MS}ms` } as React.CSSProperties}
    >
      <div className="featured-stack__stage featured-stack__stage--gallery" aria-live="polite">
        {slides.map((slide, index) => {
          const rel = getRelativeIndex(index, activeIndex, total);
          return (
            <StackSlide
              key={slide.id}
              slide={slide}
              title={title}
              index={index}
              relativeIndex={rel}
              isCenter={rel === 0}
              failed={failed.has(slide.id)}
              onError={() => setFailed((prev) => new Set(prev).add(slide.id))}
            />
          );
        })}
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            className="featured-stack__nav featured-stack__nav--gallery featured-stack__nav--prev"
            onClick={goPrev}
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="featured-stack__nav featured-stack__nav--gallery featured-stack__nav--next"
            onClick={goNext}
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {total > 1 && (
        <div className="project-gallery__thumbs" role="tablist" aria-label="Project screenshots">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={slide.caption || `Image ${index + 1}`}
              className={`project-gallery__thumb${index === activeIndex ? ' project-gallery__thumb--active' : ''}`}
              onClick={() => setActiveIndex(index)}
            >
              {!failed.has(slide.id) ? (
                <img src={slide.src} alt="" className="project-gallery__thumb-img" loading="lazy" />
              ) : (
                <div className="project-gallery__thumb-fallback" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectImageGallery;
