import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  username: string;
  profileImage?: string | null;
}

const Header: React.FC<HeaderProps> = ({ username, profileImage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', hash: '' },
    { name: 'About', hash: '#about' },
    { name: 'Projects', hash: '#projects' },
    { name: 'Skills', hash: '#skills' },
    { name: 'Contact', hash: '#contact' },
  ];

  const scrollToSection = (hash: string) => {
    setIsMobileMenuOpen(false);
    if (hash) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 dark:border-gray-700/50'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to={`/${username}`}
            onClick={() => scrollToSection('')}
            className="flex items-center gap-3 group"
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt={username}
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-primary-500/40 group-hover:ring-primary-500 transition-all duration-200"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary-500/20">
                {username.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 tracking-tight">
              {username}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.hash)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400
                           hover:text-gray-900 dark:hover:text-white
                           hover:bg-gray-100 dark:hover:bg-gray-800
                           transition-all duration-200"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center
                         bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
                         text-gray-700 dark:text-gray-300 transition-all duration-200
                         border border-gray-200 dark:border-gray-700"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 pb-4 border-t border-gray-200/50 dark:border-gray-700/50 animate-fade-in-up">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.hash)}
                  className="text-left px-4 py-2.5 rounded-xl text-gray-700 dark:text-gray-300
                             hover:bg-gray-100 dark:hover:bg-gray-800
                             hover:text-primary-600 dark:hover:text-primary-400
                             font-medium transition-all duration-200 text-sm"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
