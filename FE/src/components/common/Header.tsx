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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: `/${username}`, hash: '' },
    { name: 'About', path: `/${username}`, hash: '#about' },
    { name: 'Projects', path: `/${username}`, hash: '#projects' },
    { name: 'Skills', path: `/${username}`, hash: '#skills' },
    { name: 'Contact', path: `/${username}`, hash: '#contact' },
  ];

  const scrollToSection = (hash: string) => {
    setIsMobileMenuOpen(false);
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md'
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
                className="w-10 h-10 rounded-full object-cover border-2 border-primary-500"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
                {username.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 
                           dark:group-hover:text-primary-400 transition-colors duration-200">
              {username}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.hash)}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 
                         dark:hover:text-primary-400 font-medium transition-colors duration-200"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-200 dark:bg-gray-700 
                       hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 animate-slide-up">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.hash)}
                  className="text-left px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 
                           hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 
                           dark:hover:text-primary-400 font-medium transition-colors duration-200"
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
