import React from 'react';
import { MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import type { About } from '../../types';

interface AboutSectionProps {
  about?: About;
}

const AboutSection: React.FC<AboutSectionProps> = ({ about }) => {
  if (!about) return null;

  const contactInfo = [
    { icon: MapPin, value: about.location, label: 'Location' },
    { icon: Mail, value: about.email, label: 'Email', href: `mailto:${about.email}` },
    { icon: Phone, value: about.phone, label: 'Phone', href: `tel:${about.phone}` },
  ].filter(item => item.value);

  return (
    <section id="about" className="section-padding bg-gray-50 dark:bg-gray-800/50">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="heading-secondary">About Me</h2>
            <div className="w-20 h-1 bg-primary-600 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Bio */}
          <div className="card p-8 mb-8">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              {about.bio}
            </p>

            {about.background && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Background
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {about.background}
                </p>
              </div>
            )}

            {about.career_path && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Career Path
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {about.career_path}
                </p>
              </div>
            )}

            {about.values && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Values
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {about.values}
                </p>
              </div>
            )}
          </div>

          {/* Contact Info */}
          {contactInfo.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                const content = (
                  <div className="card p-6 flex items-center gap-4 h-full">
                    <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                      <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        {item.label}
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium truncate">
                        {item.value}
                      </p>
                    </div>
                    {item.href && (
                      <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                  </div>
                );

                return item.href ? (
                  <a
                    key={index}
                    href={item.href}
                    className="block hover:scale-105 transition-transform duration-200"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={index}>{content}</div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
