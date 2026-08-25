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
    <footer className="border-t border-line bg-transparent">
      <div className="container-custom py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-display text-xl text-content">{username}</p>
            <p className="text-xs text-content-muted mt-1">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </div>

          {socialLinks.length > 0 && (
            <div className="flex items-center gap-5">
              {socialLinks.map(({ icon: Icon, url, label }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-content-muted hover:text-content transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
