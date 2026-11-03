import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import PortfolioLayout from '../components/layouts/PortfolioLayout';
import { ThemeProvider } from '../contexts/ThemeContext';

function renderLayout() {
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={['/azeem-amjad']}>
        <PortfolioLayout
          username="azeem-amjad"
          name="Azeem Amjad"
          profileImage={null}
          resumeUrl="https://example.com/resume.pdf"
          email="azeem@example.com"
          githubUrl="https://github.com/azeemamjad/"
          linkedinUrl="https://www.linkedin.com/in/azeem-amjad/"
        >
          <p>Page content</p>
        </PortfolioLayout>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

describe('mobile navigation drawer (UX-06)', () => {
  it('opens as an accessible dialog and moves focus inside', async () => {
    const user = userEvent.setup();
    renderLayout();

    const trigger = screen.getByRole('button', { name: 'Open navigation menu' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-controls')).toBe('portfolio-mobile-nav');

    await user.click(trigger);

    const dialog = screen.getByRole('dialog', { name: 'Menu' });
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Close menu');
  });

  it('closes on Escape and restores focus to the menu trigger', async () => {
    const user = userEvent.setup();
    renderLayout();

    const trigger = screen.getByRole('button', { name: 'Open navigation menu' });
    await user.click(trigger);
    expect(screen.getByRole('dialog')).toBeTruthy();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('contains Tab within the drawer', () => {
    renderLayout();

    userEvent.setup(); // ensures simulated browser environment is active
    fireEvent.click(screen.getByRole('button', { name: 'Open navigation menu' }));
    const dialog = screen.getByRole('dialog');

    const focusables = Array.from(
      dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
    ).filter((el) => el.getAttribute('tabindex') !== '-1');
    expect(focusables.length).toBeGreaterThan(1);

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    // Tab from the last element wraps to the first.
    last.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(first);

    // Shift+Tab from the first element wraps to the last.
    first.focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(last);
  });

  it('marks background content inert while open', async () => {
    const user = userEvent.setup();
    renderLayout();

    await user.click(screen.getByRole('button', { name: 'Open navigation menu' }));
    expect(document.querySelector('main')?.getAttribute('inert')).not.toBeNull();

    await user.keyboard('{Escape}');
    expect(document.querySelector('main')?.getAttribute('inert')).toBeNull();
  });
});
