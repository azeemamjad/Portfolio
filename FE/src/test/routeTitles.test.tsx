import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { portfolioAPI } from '../services/api';
import type { Project } from '../types';
import ProjectDetailPage from '../pages/portfolio/ProjectDetailPage';
import ContactPage from '../pages/portfolio/ContactPage';
import { setRouteMetadata } from '../utils/routeMetadata';

vi.mock('../services/api', () => ({
  portfolioAPI: {
    getProject: vi.fn(),
    getBlogPosts: vi.fn().mockResolvedValue({ results: [], count: 0 }),
    sendContactMessage: vi.fn(),
  },
}));

const project: Project = {
  id: 1,
  title: 'PropertyClosets',
  slug: 'propertyclosets',
  description: 'A property-inspection application.',
  detailed_description: 'A property-inspection application.',
  image: null,
  thumbnail: null,
  technologies: 'React',
  technologies_list: ['React'],
  live_url: 'https://propertyclosets.com/',
  github_url: '',
  demo_url: '',
  outcome: '',
  is_featured: true,
  order: 1,
  start_date: null,
  end_date: null,
  images: [],
  testimonials: [],
  created_at: '2026-06-26T00:00:00Z',
  updated_at: '2026-06-26T00:00:00Z',
};

describe('route title lifecycle (UX-04 regression)', () => {
  beforeEach(() => {
    vi.mocked(portfolioAPI.getProject).mockResolvedValue(project);
    document.title = 'Seed title';
  });

  it('project detail replaces the title once data loads', async () => {
    render(
      <MemoryRouter initialEntries={['/azeem-amjad/projects/propertyclosets']}>
        <Routes>
          <Route
            path="/:username/projects/:slug"
            element={
              <ProjectDetailPage username="azeem-amjad" displayName="Azeem Amjad" />
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(document.title).toBe('PropertyClosets — Azeem Amjad');
    });
  });

  it('navigating from a project to Contact replaces the project title', async () => {
    // Simulate the project page having run (as it would before navigation).
    render(
      <MemoryRouter initialEntries={['/azeem-amjad/projects/propertyclosets']}>
        <Routes>
          <Route
            path="/:username/projects/:slug"
            element={
              <ProjectDetailPage username="azeem-amjad" displayName="Azeem Amjad" />
            }
          />
        </Routes>
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(document.title).toBe('PropertyClosets — Azeem Amjad');
    });

    // Unmount the project view, then mount Contact (client navigation).
    const { unmount } = render(
      <MemoryRouter initialEntries={['/azeem-amjad/contact']}>
        <Routes>
          <Route
            path="/:username/contact"
            element={
              <ContactPage
                username="azeem-amjad"
                displayName="Azeem Amjad"
                tagline="Full-Stack Software Engineer | Python, React & Node.js"
              />
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(document.title).toBe('Contact — Azeem Amjad, Full-Stack Software Engineer');
    });
    expect(document.title).not.toContain('PropertyClosets');
    unmount();
  });

  it('contact page composes a role-aware title from the tagline', () => {
    setRouteMetadata({ title: 'reset' });
    render(
      <MemoryRouter initialEntries={['/azeem-amjad/contact']}>
        <Routes>
          <Route
            path="/:username/contact"
            element={
              <ContactPage
                username="azeem-amjad"
                displayName="Azeem Amjad"
                tagline="Full-Stack Software Engineer | Python, React & Node.js"
              />
            }
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(document.title).toBe(
      'Contact — Azeem Amjad, Full-Stack Software Engineer',
    );
  });
});
