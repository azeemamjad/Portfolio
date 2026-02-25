import React from 'react';
import { DollarSign, ArrowRight } from 'lucide-react';
import type { Service } from '../../types';

interface ServicesSectionProps {
  services: Service[];
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ services }) => {
  if (services.length === 0) return null;

  return (
    <section className="section-padding bg-section-alt">
      <div className="container-custom">
        {/* Header */}
        <div className="section-header">
          <span className="section-label">What I Offer</span>
          <h2 className="heading-secondary text-gray-900 dark:text-white">Services</h2>
          <div className="section-underline" />
          <p className="text-gray-500 dark:text-gray-400 mt-5 max-w-xl mx-auto text-base">
            Professional services tailored to bring your ideas to life with quality and care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <div
              key={service.id}
              className="card p-7 group hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Icon */}
              {service.icon && (
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-purple-100
                                dark:from-primary-950/50 dark:to-purple-950/50
                                flex items-center justify-center mb-6
                                group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">{service.icon}</span>
                </div>
              )}

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3
                             group-hover:text-primary-600 dark:group-hover:text-primary-400
                             transition-colors duration-200">
                {service.title}
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6 flex-1">
                {service.description}
              </p>

              {service.price_range && (
                <div className="pt-5 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-semibold text-sm">
                    <DollarSign className="w-4 h-4" />
                    <span>{service.price_range}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-200" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
