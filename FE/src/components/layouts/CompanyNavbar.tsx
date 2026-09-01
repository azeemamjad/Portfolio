import React, { useEffect, useRef, useState } from 'react';
import {
  Briefcase,
  Home,
  Mail,
  Menu,
  MessageCircle,
  Users,
  X,
} from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';

interface CompanyNavbarProps {
  name: string;
  logo?: string | null;
  tagline?: string;
  email?: string;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'projects', label: 'Projects', icon: Briefcase },
  { id: 'developers', label: 'Developers', icon: Users },
  { id: 'contact', label: 'Contact', icon: MessageCircle },
] as const;

const CompanyNavbar: React.FC<CompanyNavbarProps> = ({ name, logo, tagline, email }) => {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.id);
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: '-35% 0px -55% 0px', threshold: 0 },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  useEffect(() => {
    const updateIndicator = () => {
      const activeIndex = NAV_ITEMS.findIndex((item) => item.id === activeSection);
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
  }, [activeSection]);

  const scrollToSection = (id: string) => {
    setDrawerOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else if (id === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="navbar-shell">
        <div className={`navbar-bar${scrolled ? ' navbar-bar--scrolled' : ''}`}>
          <button
            type="button"
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-2.5 md:gap-3 group flex-shrink-0 min-w-0 text-left"
          >
            <div className="relative flex-shrink-0">
              {logo ? (
                <img
                  src={logo}
                  alt={name}
                  className="navbar-brand__avatar !rounded-xl object-contain p-1 bg-surface"
                />
              ) : (
                <div className="navbar-brand__fallback !rounded-xl">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex flex-col leading-none min-w-0">
              <span className="text-sm font-semibold tracking-tight text-content group-hover:text-accent transition-colors truncate">
                {name}
              </span>
              {tagline && (
                <span className="text-[10px] text-content-muted font-medium tracking-wide mt-0.5 hidden sm:block truncate max-w-[10rem] md:max-w-[14rem]">
                  {tagline}
                </span>
              )}
            </div>
          </button>

          <nav ref={navRef} className="navbar-glass-nav">
            <div
              className="navbar-glass-nav__indicator"
              style={{ left: indicator.left, width: indicator.width }}
              aria-hidden
            />
            {NAV_ITEMS.map((item, i) => {
              const active = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  ref={(el) => {
                    linkRefs.current[i] = el;
                  }}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.id);
                  }}
                  className={`navbar-glass-nav__link ${
                    active ? 'navbar-glass-nav__link--active' : 'navbar-glass-nav__link--idle'
                  }`}
                >
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 flex-shrink-0">
            <ThemeToggle variant="glass" />
            {email && (
              <a href={`mailto:${email}`} className="navbar-glass-btn navbar-glass-btn--cta">
                Contact
              </a>
            )}
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
              <p className="font-display font-semibold tracking-tight text-content">Menu</p>
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
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.id);
                    }}
                    className={`navbar-drawer-link ${
                      active ? 'navbar-drawer-link--active' : 'navbar-drawer-link--idle'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-accent' : ''}`} />
                    {item.label}
                  </a>
                );
              })}
            </nav>
            {email && (
              <div className="p-4 border-t border-line/50">
                <a href={`mailto:${email}`} className="btn-primary w-full rounded-full">
                  <Mail className="w-4 h-4" />
                  Contact Us
                </a>
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
};

export default CompanyNavbar;
