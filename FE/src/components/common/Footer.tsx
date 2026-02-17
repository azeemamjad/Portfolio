import React from 'react';
import { Github, Linkedin, Twitter, Mail, Globe } from 'lucide-react';
import type { About } from '../../types';

interface FooterProps {
  username: string;
  about?: About;
}

const Footer: React.FC<FooterProps> = ({ username, about }) => {
  const socialLinks = [
    { icon: Github, url: about?.github_url, label: 'GitHub' },
    { icon: Linkedin, url: about?.linkedin_url, label: 'LinkedIn' },
    { icon: Twitter, url: about?.twitter_url, label: 'Twitter' },
    { icon: Mail, url: about?.email ? `mailto:${about.email}` : '', label: 'Email' },
    { icon: Globe, url: about?.website_url, label: 'Website' },
  ].filter(link => link.url);

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container-custom py-12">
        <div className="flex flex-col items-center gap-6">
          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 
                             hover:bg-primary-600 dark:hover:bg-primary-600 
                             hover:text-white transition-all duration-200
                             text-gray-700 dark:text-gray-300"
                    aria-label={link.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          )}

          {/* Copyright */}
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="text-sm">
              © {new Date().getFullYear()} {username}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
