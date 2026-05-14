import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Briefcase, Code, Award, MessageCircle } from 'lucide-react';
import AnimatedBackground from '../common/AnimatedBackground';

interface PortfolioLayoutProps {
  username: string;
  name?: string;
  profileImage?: string | null;
  children: React.ReactNode;
}

const COMPANY_LOGO = 'https://dev-link.cloud/media/company/company-logo.png';

const PortfolioLayout: React.FC<PortfolioLayoutProps> = ({ username, name, profileImage, children }) => {
  const displayName = name || username;
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const navItems = [
    { path: `/${username}`,              label: 'Home',         icon: Home },
    { path: `/${username}/about`,        label: 'About',        icon: User },
    { path: `/${username}/projects`,     label: 'Projects',     icon: Briefcase },
    { path: `/${username}/skills`,       label: 'Skills',       icon: Code },
    { path: `/${username}/achievements`, label: 'Achievements', icon: Award },
    { path: `/${username}/contact`,      label: 'Contact',      icon: MessageCircle },
  ];

  const isActive = (path: string) => {
    if (path === `/${username}`) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const updateIndicator = () => {
      const activeIndex = navItems.findIndex(item => isActive(item.path));
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
  }, [location.pathname]);

  useEffect(() => {
    const sections = document.querySelectorAll('.section-padding');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -30px 0px' }
    );
    sections.forEach(section => {
      section.classList.remove('scroll-visible');
      section.classList.add('scroll-reveal');
      observer.observe(section);
    });
    return () => observer.disconnect();
  }, [location.pathname]);

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      <AnimatedBackground />

      {/* Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-md shadow-md shadow-black/10 border-b border-neutral-300/70'
            : 'bg-white/50 backdrop-blur-sm border-b border-neutral-300/40'
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-14">

            {/* Logo */}
            <Link to={`/${username}`} className="flex items-center gap-3 group flex-shrink-0">
              {/* Company logo */}
              <img
                src={COMPANY_LOGO}
                alt="Company"
                className="h-8 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
              />

              {/* Divider */}
              <span className="hidden sm:block w-px h-7 bg-neutral-300/70" />

              {/* User avatar */}
              <div className="relative hidden sm:block">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={username}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-orange-500/40 group-hover:ring-orange-400/70 transition-all duration-200"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-orange-500/30 group-hover:ring-orange-400/60 transition-all duration-200">
                    {username.charAt(0).toUpperCase()}
                  </div>
                )}
                {/* Online dot */}
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
              </div>

              <div className="hidden sm:flex flex-col leading-none">
                <span className="text-sm font-bold text-neutral-900 group-hover:text-orange-600 transition-colors duration-200 font-display tracking-wide">
                  {displayName}
                </span>
                <span className="text-[10px] text-emerald-600 font-medium tracking-wider uppercase mt-0.5">
                  Available
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav ref={navRef} className="hidden md:flex items-center relative h-full">
              {/* Sliding underline */}
              <div
                className="absolute bottom-0 h-[2px] rounded-full bg-gradient-to-r from-orange-400 to-orange-500"
                style={{
                  left: indicator.left,
                  width: indicator.width,
                  transition: 'left 0.35s cubic-bezier(0.16,1,0.3,1), width 0.35s cubic-bezier(0.16,1,0.3,1)',
                  boxShadow: '0 0 8px rgba(249,115,22,0.7)',
                }}
              />

              {navItems.map((item, i) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    ref={el => { linkRefs.current[i] = el; }}
                    to={item.path}
                    className={`relative flex items-center gap-1.5 px-3.5 h-full text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'text-neutral-900'
                        : 'text-neutral-500 hover:text-neutral-800'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 transition-colors duration-200 ${active ? 'text-orange-600' : ''}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* CTA */}
            <Link
              to={`/${username}/contact`}
              className="hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded-full
                         bg-orange-600 hover:bg-orange-500 active:bg-orange-700
                         text-white text-xs font-semibold
                         transition-all duration-200
                         shadow-md shadow-orange-900/40 hover:shadow-orange-800/50"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Hire Me
            </Link>
          </div>

          {/* Mobile nav */}
          <nav className="md:hidden pb-2 flex gap-0.5 overflow-x-auto scrollbar-hide">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                    active
                      ? 'bg-orange-100 text-orange-700 border border-orange-200'
                      : 'text-neutral-500 hover:text-neutral-800 hover:bg-black/5'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-auto bg-white/30 backdrop-blur-sm border-t border-neutral-300/50">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-neutral-500 text-xs">
              © {new Date().getFullYear()} {displayName}. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              {[
                { to: `/${username}`,         label: 'Home' },
                { to: `/${username}/about`,   label: 'About' },
                { to: `/${username}/contact`, label: 'Contact' },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-xs text-neutral-500 hover:text-orange-600 transition-colors font-medium"
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
