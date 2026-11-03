import { describe, expect, it } from 'vitest';
import { setRouteMetadata } from '../utils/routeMetadata';

const ORIGIN = window.location.origin;

function meta(selector: string): HTMLMetaElement | null {
  return document.head.querySelector<HTMLMetaElement>(selector);
}

describe('setRouteMetadata', () => {
  it('sets title, description, canonical and social tags', () => {
    setRouteMetadata({
      title: 'OreWire — Azeem Amjad',
      description: 'Mining intelligence platform case study.',
      path: '/azeem-amjad/projects/orewire',
      image: 'https://example.com/orewire.png',
    });

    expect(document.title).toBe('OreWire — Azeem Amjad');
    expect(meta('meta[name="description"]')?.getAttribute('content')).toBe(
      'Mining intelligence platform case study.',
    );
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      `${ORIGIN}/azeem-amjad/projects/orewire`,
    );
    expect(meta('meta[property="og:title"]')?.getAttribute('content')).toBe('OreWire — Azeem Amjad');
    expect(meta('meta[property="og:image"]')?.getAttribute('content')).toBe(
      'https://example.com/orewire.png',
    );
    expect(meta('meta[name="twitter:card"]')?.getAttribute('content')).toBe(
      'summary_large_image',
    );
  });

  it('replaces — never accumulates — tags on navigation (UX-04)', () => {
    setRouteMetadata({
      title: 'OreWire — Azeem Amjad',
      description: 'Project description.',
      path: '/azeem-amjad/projects/orewire',
      image: 'https://example.com/orewire.png',
    });

    setRouteMetadata({
      title: 'Contact Azeem Amjad — Software Engineering',
      description: 'Get in touch.',
      path: '/azeem-amjad/contact',
      image: null,
    });

    expect(document.title).toBe('Contact Azeem Amjad — Software Engineering');
    expect(document.head.querySelectorAll('meta[property="og:title"]')).toHaveLength(1);
    expect(meta('meta[property="og:title"]')?.getAttribute('content')).toBe(
      'Contact Azeem Amjad — Software Engineering',
    );
    expect(meta('meta[property="og:image"]')).toBeNull();
    expect(meta('meta[name="twitter:image"]')).toBeNull();
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      `${ORIGIN}/azeem-amjad/contact`,
    );
  });

  it('replaces the route JSON-LD script and removes it when absent', () => {
    const person = { '@context': 'https://schema.org', '@type': 'Person', name: 'Azeem Amjad' };
    setRouteMetadata({ title: 'Home', jsonLd: person });
    const selector = 'script[data-route-jsonld]';
    expect(document.head.querySelectorAll(selector)).toHaveLength(1);
    expect(JSON.parse(document.head.querySelector<HTMLScriptElement>(selector)!.textContent!)).toEqual(person);

    setRouteMetadata({ title: 'Home', jsonLd: { ...person, jobTitle: 'Engineer' } });
    expect(document.head.querySelectorAll(selector)).toHaveLength(1);
    expect(
      JSON.parse(document.head.querySelector<HTMLScriptElement>(selector)!.textContent!).jobTitle,
    ).toBe('Engineer');

    setRouteMetadata({ title: 'Other route' });
    expect(document.head.querySelectorAll(selector)).toHaveLength(0);
  });
});
