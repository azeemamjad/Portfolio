import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// jsdom lacks several browser APIs used by layout and page components.

if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated API
      removeListener: vi.fn(), // deprecated API
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
  root = null;
  rootMargin = '';
  thresholds = [];
}
if (!('IntersectionObserver' in window)) {
  (window as unknown as { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver =
    IntersectionObserverStub as unknown as typeof IntersectionObserver;
}

window.scrollTo = window.scrollTo || (() => {});

afterEach(() => {
  cleanup();
});
