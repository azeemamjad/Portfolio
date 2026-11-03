import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FeaturedProjectsSection from '../components/sections/FeaturedProjectsSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import type { Project } from '../types';

const withBothLinks: Project = {
  id: 1,
  title: 'OreWire',
  slug: 'orewire',
  description: 'Mining and resource intelligence platform.',
  detailed_description: '',
  image: null,
  thumbnail: null,
  technologies: 'Node.js, React',
  technologies_list: ['Node.js', 'React'],
  live_url: 'https://orewire.com/',
  github_url: 'https://github.com/azeemamjad/Orewire',
  demo_url: '',
  outcome: '',
  is_featured: true,
  order: 1,
  start_date: null,
  end_date: null,
  images: [],
  testimonials: [],
  created_at: '2026-02-17T00:00:00Z',
  updated_at: '2026-02-17T00:00:00Z',
};

const sourceOnly: Project = {
  ...withBothLinks,
  id: 2,
  title: 'Fuel Route Planner API',
  slug: 'fuel-route-planner-api',
  live_url: '',
  github_url: 'https://github.com/azeemamjad/spotter-backend-fuel-assessment',
  is_featured: false,
};

const username = 'azeem-amjad';

describe('project card actions (UX-05)', () => {
  it('featured grid exposes case study, live and source actions without hover', () => {
    render(
      <MemoryRouter initialEntries={[`/${username}`]}>
        <FeaturedProjectsSection projects={[withBothLinks]} username={username} />
      </MemoryRouter>,
    );

    const caseStudy = screen.getByRole('link', { name: 'Read the OreWire case study' });
    expect(caseStudy.getAttribute('href')).toBe(`/${username}/projects/orewire`);

    const live = screen.getByRole('link', { name: /Open the OreWire live site/ });
    expect(live.getAttribute('href')).toBe('https://orewire.com/');
    expect(live.getAttribute('target')).toBe('_blank');
    expect(live.getAttribute('rel')).toContain('noopener');

    const source = screen.getByRole('link', { name: /View OreWire source code/ });
    expect(source.getAttribute('href')).toBe('https://github.com/azeemamjad/Orewire');
  });

  it('projects listing shows details plus project-specific live/source labels', () => {
    render(
      <MemoryRouter initialEntries={[`/${username}/projects`]}>
        <ProjectsSection projects={[withBothLinks, sourceOnly]} username={username} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'View OreWire' })).toBeTruthy();
    expect(screen.getByRole('link', { name: /Open OreWire live site/ })).toBeTruthy();
    expect(screen.getByRole('link', { name: /View Fuel Route Planner API source code/ })).toBeTruthy();
    // No misleading Live button when there is no live URL.
    expect(screen.queryByRole('link', { name: /Open Fuel Route Planner API live site/ })).toBeNull();
  });

  it('does not render an invisible hover-only action layer', () => {
    const { container } = render(
      <MemoryRouter initialEntries={[`/${username}`]}>
        <FeaturedProjectsSection projects={[withBothLinks]} username={username} />
      </MemoryRouter>,
    );

    // The old pattern was an absolutely-positioned overlay that only appeared
    // on hover; actions must now be regular in-flow links.
    const overlayLinks = container.querySelectorAll('a.absolute.inset-0');
    expect(overlayLinks.length).toBe(0);
  });
});
