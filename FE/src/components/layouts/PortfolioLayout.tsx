import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, User, Briefcase, Code, Award, MessageCircle, BookOpen, Menu, X,
} from 'lucide-react';
import AnimatedBackground from '../common/AnimatedBackground';
import ThemeToggle from '../common/ThemeToggle';

interface PortfolioLayoutProps {
  username: string;
  name?: string;
  profileImage?: string | null;
  children: React.ReactNode;
}

const PortfolioLayout: React.FC<PortfolioLayoutProps> = ({
  username,
  name,
  profileImage,
  children,
}) => {
  const displayName = name || username;
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const navItems = [
    { path: `/${username}`, label: 'Home', icon: Home },
    { path: `/${username}/about`, label: 'About', icon: User },
    { path: `/${username}/projects`, label: 'Projects', icon: Briefcase },
    { path: `/${username}/skills`, label: 'Skills', icon: Code },
    { path: `/${username}/achievements`, label: 'Achievements', icon: Award },
    { path: `/${username}/blog`, label: 'Blog', icon: BookOpen },
    { path: `/${username}/contact`, label: 'Contact', icon: MessageCircle },
  ];

  const isActive = (path: string) => {
    if (path === `/${username}`) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
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
  }, [location.pathname, username]);

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

  return (
    <div className="min-h-screen relative overflow-x-clip flex flex-col bg-bg text-content">
      <AnimatedBackground useAccent />

      <header className="navbar-shell">
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

          <nav ref={navRef} className="navbar-glass-nav">
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
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 flex-shrink-0">
            <ThemeToggle variant="glass" />
            <Link
              to={`/${username}/contact`}
              className="navbar-glass-btn navbar-glass-btn--cta"
            >
              Contact
            </Link>
            <button
              type="button"
              className="navbar-glass-btn navbar-glass-btn--icon lg:hidden text-content"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="navbar-spacer" aria-hidden="true" />

      {drawerOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="navbar-drawer-backdrop absolute inset-0"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close navigation menu"
          />
          <aside className="navbar-drawer-panel absolute right-0 top-0 h-full w-[min(100%,20rem)] animate-drawer-in flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-line/50">
              <p className="font-display font-bold text-content">Menu</p>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="navbar-glass-btn navbar-glass-btn--icon text-content"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`navbar-drawer-link ${
                      active ? 'navbar-drawer-link--active' : 'navbar-drawer-link--idle'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-accent' : ''}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-line/50">
              <Link to={`/${username}/contact`} className="btn-primary w-full">
                Contact
              </Link>
            </div>
          </aside>
        </div>
      )}

      <main className="relative z-10 flex-1">{children}</main>

      <footer className="relative z-10 mt-auto glass-header">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-content-muted text-xs">
              © {new Date().getFullYear()} {displayName}. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              {[
                { to: `/${username}`, label: 'Home' },
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
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PortfolioLayout;
