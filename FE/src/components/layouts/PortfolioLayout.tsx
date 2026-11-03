import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Award, Briefcase, Download, Github, Home, Linkedin, Mail, Menu, MessageCircle, User, X,
} from 'lucide-react';
import { portfolioAPI } from '../../services/api';
import AnimatedBackground from '../common/AnimatedBackground';
import ThemeToggle from '../common/ThemeToggle';

interface PortfolioLayoutProps {
  username: string;
  name?: string;
  profileImage?: string | null;
  resumeUrl?: string | null;
  email?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  children: React.ReactNode;
}

const DRAWER_ID = 'portfolio-mobile-nav';

/** Per-page-load cache so the Blog item only renders when published posts exist. */
const blogAvailabilityCache = new Map<string, boolean>();

const PortfolioLayout: React.FC<PortfolioLayoutProps> = ({
  username,
  name,
  profileImage,
  resumeUrl,
  email,
  githubUrl,
  linkedinUrl,
  children,
}) => {
  const displayName = name || username;
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [blogHasPosts, setBlogHasPosts] = useState(() => blogAvailabilityCache.get(username) ?? false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerCloseRef = useRef<HTMLButtonElement>(null);
  const lastFocusedBeforeDrawer = useRef<HTMLElement | null>(null);

  const navItems = useMemo(() => {
    const items: { path: string; label: string; icon: typeof Home }[] = [
      { path: `/${username}`, label: 'Home', icon: Home },
      { path: `/${username}/projects`, label: 'Work', icon: Briefcase },
      { path: `/${username}/achievements`, label: 'Experience', icon: Award },
      { path: `/${username}/about`, label: 'About', icon: User },
    ];
    if (blogHasPosts) {
      items.push({ path: `/${username}/blog`, label: 'Blog', icon: MessageCircle });
    }
    items.push({ path: `/${username}/contact`, label: 'Contact', icon: MessageCircle });
    return items;
  }, [username, blogHasPosts]);

  const isActive = useCallback(
    (path: string) => {
      if (path === `/${username}`) return location.pathname === path;
      return location.pathname.startsWith(path);
    },
    [location.pathname, username],
  );

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  // Blog item appears only when published posts exist (UX-08). The result is
  // cached per page load so navigating between routes does not refetch.
  useEffect(() => {
    if (blogAvailabilityCache.has(username)) return;
    let cancelled = false;
    portfolioAPI
      .getBlogPosts(username, 1)
      .then((data) => {
        const hasPosts = data.count > 0;
        blogAvailabilityCache.set(username, hasPosts);
        if (!cancelled) setBlogHasPosts(hasPosts);
      })
      .catch(() => {
        blogAvailabilityCache.set(username, false);
      });
    return () => {
      cancelled = true;
    };
  }, [username]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock background scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  // Accessible dialog behavior: move focus in, trap Tab, close on Escape,
  // restore focus to the menu trigger (UX-06).
  useEffect(() => {
    if (!drawerOpen) return;

    lastFocusedBeforeDrawer.current = document.activeElement as HTMLElement | null;

    const focusables = () =>
      Array.from(
        drawerRef.current?.querySelectorAll<HTMLElement>(
          'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    // Focus the close button once the drawer is in the DOM.
    const focusTimer = window.setTimeout(() => drawerCloseRef.current?.focus(), 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setDrawerOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;

      const elements = focusables();
      if (elements.length === 0) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first || !drawerRef.current?.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', onKeyDown);
      // Restore focus to the menu trigger when the drawer closes.
      lastFocusedBeforeDrawer.current?.focus();
    };
  }, [drawerOpen]);

  useEffect(() => {
    const updateIndicator = () => {
      const activeIndex = navItems.findIndex((item) => isActive(item.path));
      if (activeIndex === -1) return;
      const el = linkRefs.current[activeIndex];
      const nav = navRef.current;
      if (el && nav) {
        const navRect = nav.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        setIndicator({ left: elRect.left - navRect.left, width: elRect.width });
      }
    };
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [location.pathname, username, isActive, navItems]);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const sections = document.querySelectorAll('.section-padding');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -30px 0px' },
    );
    sections.forEach((section) => {
      section.classList.remove('scroll-visible');
      section.classList.add('scroll-reveal');
      observer.observe(section);
    });
    return () => observer.disconnect();
  }, [location.pathname]);

  const resumeLink = resumeUrl ? (
    <a
      href={resumeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="navbar-glass-btn navbar-glass-btn--resume"
      aria-label={`Open ${displayName}'s resume (PDF, opens in a new tab)`}
    >
      <Download className="w-4 h-4" />
      <span className="hidden sm:inline">Resume</span>
    </a>
  ) : null;

  const contactLinks = [
    email ? { href: `mailto:${email}`, label: 'Email', icon: Mail, external: false } : null,
    githubUrl ? { href: githubUrl, label: 'GitHub', icon: Github, external: true } : null,
    linkedinUrl ? { href: linkedinUrl, label: 'LinkedIn', icon: Linkedin, external: true } : null,
    resumeUrl
      ? { href: resumeUrl, label: 'Resume (PDF)', icon: Download, external: true }
      : null,
  ].filter(Boolean) as { href: string; label: string; icon: typeof Mail; external: boolean }[];

  return (
    <div className="min-h-screen relative overflow-x-clip flex flex-col bg-bg text-content">
      <AnimatedBackground useAccent />

      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="navbar-shell" inert={drawerOpen || undefined}>
        <div className={`navbar-bar${scrolled ? ' navbar-bar--scrolled' : ''}`}>
          <Link to={`/${username}`} className="flex items-center gap-2.5 md:gap-3 group flex-shrink-0 min-w-0">
            <div className="relative flex-shrink-0">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={username}
                  className="navbar-brand__avatar"
                />
              ) : (
                <div className="navbar-brand__fallback">
                  {username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex flex-col leading-none min-w-0">
              <span className="text-sm font-medium text-content group-hover:text-accent transition-colors truncate">
                {displayName}
              </span>
              <span className="text-[11px] text-content-muted font-medium tracking-wide mt-0.5">
                Portfolio
              </span>
            </div>
          </Link>

          <nav ref={navRef} className="navbar-glass-nav" aria-label="Primary">
            <div
              className="navbar-glass-nav__indicator"
              style={{ left: indicator.left, width: indicator.width }}
              aria-hidden
            />
            {navItems.map((item, i) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  ref={(el) => { linkRefs.current[i] = el; }}
                  to={item.path}
                  className={`navbar-glass-nav__link ${
                    active ? 'navbar-glass-nav__link--active' : 'navbar-glass-nav__link--idle'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 flex-shrink-0">
            <ThemeToggle variant="glass" />
            {resumeLink}
            <Link
              to={`/${username}/contact`}
              className="navbar-glass-btn navbar-glass-btn--cta"
            >
              Contact
            </Link>
            <button
              type="button"
              ref={menuTriggerRef}
              className="navbar-glass-btn navbar-glass-btn--icon lg:hidden text-content"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
              aria-controls={DRAWER_ID}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="navbar-spacer" aria-hidden="true" />

      <main id="main-content" className="relative z-10 flex-1" tabIndex={-1} inert={drawerOpen || undefined}>
        {children}
      </main>

      <footer className="relative z-10 mt-auto glass-header" inert={drawerOpen || undefined}>
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-content-muted text-xs">
              © {new Date().getFullYear()} {displayName}. All rights reserved.
            </p>
            <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-5" aria-label="Footer">
              {[
                { to: `/${username}/projects`, label: 'Work' },
                { to: `/${username}/about`, label: 'About' },
                { to: `/${username}/contact`, label: 'Contact' },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-xs text-content-muted hover:text-accent transition-colors font-medium"
                >
                  {label}
                </Link>
              ))}
              {contactLinks.map(({ href, label, icon: Icon, external }) => (
                <a
                  key={label}
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="inline-flex items-center gap-1.5 text-xs text-content-muted hover:text-accent transition-colors font-medium"
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden />
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </footer>

      {drawerOpen && (
        <div
          id={DRAWER_ID}
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${DRAWER_ID}-title`}
          className="fixed inset-0 z-[60] lg:hidden"
        >
          <button
            type="button"
            className="navbar-drawer-backdrop absolute inset-0"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close navigation menu"
            tabIndex={-1}
          />
          <aside className="navbar-drawer-panel absolute right-0 top-0 h-full w-[min(100%,20rem)] animate-drawer-in flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-line/50">
              <h2 id={`${DRAWER_ID}-title`} className="font-display font-bold text-content m-0">
                Menu
              </h2>
              <button
                type="button"
                ref={drawerCloseRef}
                onClick={() => setDrawerOpen(false)}
                className="navbar-glass-btn navbar-glass-btn--icon text-content"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3 space-y-1" aria-label="Mobile">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeDrawer}
                    aria-current={active ? 'page' : undefined}
                    className={`navbar-drawer-link ${
                      active ? 'navbar-drawer-link--active' : 'navbar-drawer-link--idle'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-accent' : ''}`} aria-hidden />
                    {item.label}
                  </Link>
                );
              })}
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeDrawer}
                  className="navbar-drawer-link navbar-drawer-link--idle"
                >
                  <Download className="w-4 h-4" aria-hidden />
                  Resume (PDF)
                </a>
              )}
            </nav>
            <div className="p-4 border-t border-line/50 flex flex-col gap-2">
              <Link to={`/${username}/contact`} onClick={closeDrawer} className="btn-primary w-full rounded-full">
                Contact
              </Link>
              {email && (
                <a href={`mailto:${email}`} onClick={closeDrawer} className="btn-secondary w-full rounded-full">
                  <Mail className="w-4 h-4" aria-hidden />
                  Email directly
                </a>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default PortfolioLayout;
