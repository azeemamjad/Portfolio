import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Briefcase, Code, Award, MessageCircle } from 'lucide-react';
import AnimatedBackground from '../common/AnimatedBackground';
import ThemeToggle from '../common/ThemeToggle';

interface PortfolioLayoutProps {
  username: string;
  name?: string;
  profileImage?: string | null;
  children: React.ReactNode;
}

const PortfolioLayout: React.FC<PortfolioLayoutProps> = ({ username, name, profileImage, children }) => {
  const displayName = name || username;
  const location = useLocation();
  const navItems = [
    { path: `/${username}`, label: 'Home', icon: Home },
    { path: `/${username}/about`, label: 'About', icon: User },
    { path: `/${username}/projects`, label: 'Projects', icon: Briefcase },
    { path: `/${username}/skills`, label: 'Skills', icon: Code },
    { path: `/${username}/achievements`, label: 'Achievements', icon: Award },
    { path: `/${username}/contact`, label: 'Contact', icon: MessageCircle },
  ];

  const isActive = (path: string) => {
    if (path === `/${username}`) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 relative overflow-hidden flex flex-col">
      <AnimatedBackground />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              to={`/${username}`}
              className="flex items-center gap-3 group"
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={username}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary-500 group-hover:border-primary-600 transition-colors"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-lg group-hover:bg-primary-700 transition-colors">
                  {username.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {displayName}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      active
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>

          {/* Mobile Navigation */}
          <nav className="md:hidden pb-4 flex flex-wrap gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
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
      <footer className="relative z-10 mt-auto bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="container-custom py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} {username}. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                to={`/${username}`}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                to={`/${username}/about`}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
              >
                About
              </Link>
              <Link
                to={`/${username}/contact`}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PortfolioLayout;
