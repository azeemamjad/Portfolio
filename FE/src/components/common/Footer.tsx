import React from 'react';
import { Github, Linkedin, Twitter, Mail, Globe } from 'lucide-react';
import type { About } from '../../types';

interface FooterProps {
  username: string;
  about?: About;
}

const Footer: React.FC<FooterProps> = ({ username, about }) => {
  const socialLinks = [
    { icon: Github,   url: about?.github_url,                      label: 'GitHub' },
    { icon: Linkedin, url: about?.linkedin_url,                     label: 'LinkedIn' },
    { icon: Twitter,  url: about?.twitter_url,                      label: 'Twitter' },
    { icon: Mail,     url: about?.email ? `mailto:${about.email}` : '', label: 'Email' },
    { icon: Globe,    url: about?.website_url,                      label: 'Website' },
  ].filter((l) => l.url);

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container-custom py-10">
        <div className="flex flex-col items-center gap-6">
          {/* Wordmark */}
          <div className="text-xl font-black tracking-tight text-gradient-primary">
            {username}
          </div>

          {/* Social links */}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, url, label }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl flex items-center justify-center
                             bg-white dark:bg-gray-800
                             border border-gray-200 dark:border-gray-700
                             text-gray-500 dark:text-gray-400
                             hover:bg-primary-600 dark:hover:bg-primary-600
                             hover:text-white hover:border-primary-600
                             transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          )}

          {/* Copyright */}
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} <span className="font-semibold text-gray-500 dark:text-gray-400">{username}</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
