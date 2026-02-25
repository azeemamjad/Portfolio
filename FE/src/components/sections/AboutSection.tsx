import React from 'react';
import { MapPin, Mail, Phone, ExternalLink, User } from 'lucide-react';
import type { About } from '../../types';

interface AboutSectionProps {
  about?: About;
}

const AboutSection: React.FC<AboutSectionProps> = ({ about }) => {
  if (!about) return null;

  const contactInfo = [
    { icon: MapPin, value: about.location, label: 'Location', href: null },
    { icon: Mail, value: about.email, label: 'Email', href: `mailto:${about.email}` },
    { icon: Phone, value: about.phone, label: 'Phone', href: `tel:${about.phone}` },
  ].filter((item) => item.value);

  const infoBlocks = [
    { title: 'Background', content: about.background },
    { title: 'Career Path', content: about.career_path },
    { title: 'Values', content: about.values },
  ].filter((b) => b.content);

  return (
    <section id="about" className="section-padding bg-section-alt">
      <div className="container-custom">
        {/* Header */}
        <div className="section-header">
          <span className="section-label">Who I Am</span>
          <h2 className="heading-secondary text-gray-900 dark:text-white">About Me</h2>
          <div className="section-underline" />
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main bio card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">My Story</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                {about.bio}
              </p>
            </div>

            {infoBlocks.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {infoBlocks.map((block) => (
                  <div key={block.title} className="card p-6">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-3">
                      {block.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {block.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar — contact info */}
          <div className="space-y-4">
            <div className="card p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-5">
                Contact Info
              </h3>
              <div className="space-y-4">
                {contactInfo.map((item, i) => {
                  const Icon = item.icon;
                  const inner = (
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-0.5">{item.label}</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.value}</p>
                      </div>
                      {item.href && <ExternalLink className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-1.5" />}
                    </div>
                  );

                  return item.href ? (
                    <a key={i} href={item.href} className="block hover:opacity-80 transition-opacity">
                      {inner}
                    </a>
                  ) : (
                    <div key={i}>{inner}</div>
                  );
                })}
              </div>
            </div>

            {/* Gradient accent card */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-primary-600 to-purple-700 text-white shadow-lg shadow-primary-500/20">
              <p className="text-sm font-medium text-primary-100 mb-2">Currently</p>
              <p className="text-base font-bold leading-snug">
                Open to exciting opportunities and collaborations
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm text-primary-200">Available for hire</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
