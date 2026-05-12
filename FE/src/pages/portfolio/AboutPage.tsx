import React from 'react';
import { MapPin, Mail, Phone, ExternalLink, Download } from 'lucide-react';
import type { About } from '../../types';

interface AboutPageProps {
  about?: About;
}

const AboutPage: React.FC<AboutPageProps> = ({ about }) => {
  if (!about) {
    return (
      <div className="section-padding pt-32">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-primary text-neutral-900">About Me</h1>
            <p className="text-neutral-500 mt-4">No information available yet.</p>
          </div>
        </div>
      </div>
    );
  }

  const contactInfo = [
    { icon: MapPin, value: about.location, label: 'Location' },
    { icon: Mail,   value: about.email,    label: 'Email',  href: `mailto:${about.email}` },
    { icon: Phone,  value: about.phone,    label: 'Phone',  href: about.phone ? `tel:${about.phone}` : undefined },
  ].filter(item => item.value);

  const socialLinks = [
    { name: 'GitHub',   url: about.github_url,   icon: '💻' },
    { name: 'LinkedIn', url: about.linkedin_url,  icon: '💼' },
    { name: 'Twitter',  url: about.twitter_url,   icon: '🐦' },
    { name: 'Website',  url: about.website_url,   icon: '🌐' },
  ].filter(link => link.url);

  return (
    <div>
      <section className="section-padding pt-32">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="heading-primary text-neutral-900 text-center mb-4">About Me</h1>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-indigo-500 mx-auto mb-12 rounded-full" />

            {/* Bio card */}
            <div className="card p-8 md:p-12 mb-8">
              <p className="text-lg text-neutral-700 leading-relaxed mb-6">
                {about.bio}
              </p>

              {about.background && (
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-neutral-900 mb-3">Background</h2>
                  <p className="text-neutral-600 leading-relaxed">{about.background}</p>
                </div>
              )}

              {about.career_path && (
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-neutral-900 mb-3">Career Path</h2>
                  <p className="text-neutral-600 leading-relaxed">{about.career_path}</p>
                </div>
              )}

              {about.values && (
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-3">Values</h2>
                  <p className="text-neutral-600 leading-relaxed">{about.values}</p>
                </div>
              )}
            </div>

            {/* Contact info */}
            {contactInfo.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  const content = (
                    <div className="card p-6 flex items-center gap-4 h-full">
                      <div className="p-3 bg-orange-100 rounded-lg flex-shrink-0">
                        <Icon className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-neutral-400 mb-1">{item.label}</p>
                        <p className="text-neutral-900 font-medium truncate">{item.value}</p>
                      </div>
                      {item.href && <ExternalLink className="w-4 h-4 text-neutral-300 flex-shrink-0" />}
                    </div>
                  );

                  return item.href ? (
                    <a key={index} href={item.href} className="block hover:scale-105 transition-transform duration-200">
                      {content}
                    </a>
                  ) : (
                    <div key={index}>{content}</div>
                  );
                })}
              </div>
            )}

            {/* Social links */}
            {socialLinks.length > 0 && (
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">Connect With Me</h2>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-6 py-3
                                 bg-white border border-neutral-300 text-neutral-700
                                 hover:bg-orange-600 hover:text-white hover:border-orange-600
                                 rounded-lg font-medium transition-all duration-200"
                    >
                      <span className="text-xl">{link.icon}</span>
                      <span>{link.name}</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Resume download */}
            {about.resume_file && (
              <div className="mt-8 text-center">
                <a href={about.resume_file} download className="btn-primary inline-flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Download My Resume
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
