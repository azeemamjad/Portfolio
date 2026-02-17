import React from 'react';
import { DollarSign } from 'lucide-react';
import type { Service } from '../../types';

interface ServicesSectionProps {
  services: Service[];
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ services }) => {
  if (services.length === 0) return null;

  return (
    <section className="section-padding">
      <div className="container-custom">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="heading-secondary">Services</h2>
          <div className="w-20 h-1 bg-primary-600 mx-auto mt-4 rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            Professional services I offer to help bring your ideas to life.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="card p-8 text-center group hover:border-primary-600 
                       dark:hover:border-primary-400 border-2 border-transparent 
                       transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              {service.icon && (
                <div className="w-16 h-16 mx-auto mb-6 bg-primary-100 dark:bg-primary-900/30 
                              rounded-lg flex items-center justify-center 
                              group-hover:scale-110 transition-transform duration-300">
                  <span className="text-4xl">{service.icon}</span>
                </div>
              )}

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 
                           group-hover:text-primary-600 dark:group-hover:text-primary-400 
                           transition-colors duration-200">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                {service.description}
              </p>

              {/* Price Range */}
              {service.price_range && (
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center gap-2 text-primary-600 
                                dark:text-primary-400 font-semibold">
                    <DollarSign className="w-5 h-5" />
                    <span>{service.price_range}</span>
                  </div>
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
