import { useEffect } from 'react';

/**
 * Centralized route metadata owner.
 *
 * Every public page calls `useRouteMetadata` so the document title, meta
 * description, canonical URL, Open Graph and Twitter tags are replaced — not
 * accumulated — on every navigation, including direct entry and Back/Forward.
 * This fixes the stale-title leak where navigating from a project detail page
 * to Contact kept the project title.
 */

const SITE_URL = (import.meta.env.VITE_SITE_URL || window.location.origin)
  .trim()
  .replace(/\/+$/, '');

export interface RouteMetadata {
  /** Full document title for this route. */
  title: string;
  description?: string;
  /** Canonical path beginning with "/", e.g. `/${username}/projects`. */
  path?: string;
  /** Absolute or media-relative social/OG image URL. */
  image?: string | null;
  type?: 'website' | 'profile' | 'article';
  /** JSON-LD object describing visible page content (e.g. schema.org Person). */
  jsonLd?: Record<string, unknown> | null;
}

function upsertTag(
  selector: string,
  create: () => HTMLElement,
  value: string | null | undefined,
  attribute: 'content' | 'href',
): void {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!value) {
    // Remove stale values from a previous route instead of leaving them behind.
    el?.remove();
    return;
  }
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attribute, value);
}

function setMeta(name: string, value: string | null | undefined): void {
  upsertTag(
    `meta[name="${name}"]`,
    () => {
      const el = document.createElement('meta');
      el.setAttribute('name', name);
      return el;
    },
    value,
    'content',
  );
}

function setProperty(property: string, value: string | null | undefined): void {
  upsertTag(
    `meta[property="${property}"]`,
    () => {
      const el = document.createElement('meta');
      el.setAttribute('property', property);
      return el;
    },
    value,
    'content',
  );
}

function setCanonical(path: string | null | undefined): void {
  const href = path ? `${SITE_URL}${path === '/' ? '' : path}` : null;
  upsertTag(
    'link[rel="canonical"]',
    () => {
      const el = document.createElement('link');
      el.setAttribute('rel', 'canonical');
      return el;
    },
    href,
    'href',
  );
}

export function setRouteMetadata({
  title,
  description,
  path,
  image,
  type = 'website',
  jsonLd,
}: RouteMetadata): void {
  document.title = title;

  setMeta('description', description);

  setCanonical(path);

  setProperty('og:title', title);
  setProperty('og:description', description);
  setProperty('og:type', type);
  setProperty('og:url', path ? `${SITE_URL}${path === '/' ? '' : path}` : SITE_URL);
  setProperty('og:image', image || null);

  setMeta('twitter:card', image ? 'summary_large_image' : null);
  setMeta('twitter:title', title);
  setMeta('twitter:description', description);
  setMeta('twitter:image', image || null);

  const JSONLD_SELECTOR = 'script[data-route-jsonld]';
  const existingScript = document.head.querySelector<HTMLScriptElement>(JSONLD_SELECTOR);
  if (jsonLd) {
    const payload = JSON.stringify(jsonLd);
    if (existingScript?.textContent === payload) return;
    existingScript?.remove();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.routeJsonld = 'true';
    script.textContent = payload;
    document.head.appendChild(script);
  } else {
    existingScript?.remove();
  }
}

/**
 * React hook wrapper. Accepts the same fields as `setRouteMetadata`; values
 * are applied (and replaced) whenever they change. The `jsonLd` object is
 * serialized for change detection, so callers may pass inline object literals.
 */
export function useRouteMetadata(metadata: RouteMetadata): void {
  const { title, description, path, image, type, jsonLd } = metadata;
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : '';

  useEffect(() => {
    setRouteMetadata({
      title,
      description,
      path,
      image,
      type,
      jsonLd: jsonLdKey ? (JSON.parse(jsonLdKey) as Record<string, unknown>) : null,
    });
  }, [title, description, path, image, type, jsonLdKey]);
}

/** Compose route titles: null section gives "Name — Role", otherwise "Section — Name, Role". */
export function buildTitle(section: string | null, name: string, role?: string): string {
  if (!section) return role ? `${name} — ${role}` : name;
  return `${section} — ${name}${role ? `, ${role}` : ''}`;
}

/** First segment of a "|" separated tagline, e.g. "Full-Stack Software Engineer". */
export function roleFromTagline(tagline?: string): string | undefined {
  const role = tagline?.split('|')[0]?.trim();
  return role || undefined;
}
