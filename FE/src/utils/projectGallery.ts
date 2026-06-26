import type { Project } from '../types';

export interface GallerySlide {
  id: number;
  src: string;
  caption?: string;
}

export function getProjectFallbackImage(project: Project): string {
  const seed = encodeURIComponent(project.slug || `${project.id}-${project.title}`);
  return `https://picsum.photos/seed/${seed}/1200/800`;
}

export function getProjectGallerySlides(project: Project): GallerySlide[] {
  const fromGallery = [...(project.images ?? [])]
    .sort((a, b) => a.order - b.order)
    .map((img) => ({
      id: img.id,
      src: img.image,
      caption: img.caption || undefined,
    }));

  if (fromGallery.length > 0) return fromGallery;

  const legacy: GallerySlide[] = [];
  if (project.image) {
    legacy.push({ id: 0, src: project.image });
  }
  if (project.thumbnail && project.thumbnail !== project.image) {
    legacy.push({ id: -1, src: project.thumbnail });
  }
  if (legacy.length > 0) return legacy;

  const base = project.slug || `${project.id}-${project.title}`;
  return Array.from({ length: 4 }, (_, i) => ({
    id: -10 - i,
    src: `https://picsum.photos/seed/${encodeURIComponent(`${base}-${i}`)}/1200/800`,
    caption: i === 0 ? undefined : `Screenshot ${i + 1}`,
  }));
}

export function getProjectThumbnailSrc(project: Project): string {
  if (project.thumbnail) return project.thumbnail;
  if (project.image) return project.image;
  const firstGallery = [...(project.images ?? [])].sort((a, b) => a.order - b.order)[0];
  if (firstGallery?.image) return firstGallery.image;
  return getProjectFallbackImage(project);
}

export function getProjectCoverSrc(project: Project): string {
  const slides = getProjectGallerySlides(project);
  return slides[0]?.src ?? getProjectFallbackImage(project);
}
