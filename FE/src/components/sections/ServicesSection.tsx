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
          <span className="section-label">
            <span className="section-label__rule" aria-hidden />
            What I Offer
          </span>
          <h2 className="heading-secondary text-content">Services</h2>
          <p className="text-content-muted mt-5 max-w-xl mx-auto text-base">
            Professional services tailored to bring your ideas to life with quality and care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <div
              key={service.id}
              className="card p-7 group card-hover animate-fade-in-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* Icon */}
              {service.icon && (
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-105"
                     style={{
                       background: 'color-mix(in oklch, var(--accent) 10%, transparent)',
                       border: '1px solid color-mix(in oklch, var(--accent) 18%, transparent)',
                     }}>
                  <span className="text-2xl">{service.icon}</span>
                </div>
              )}

              <h3 className="text-lg font-semibold text-content mb-3 transition-colors duration-200 group-hover:text-accent">
                {service.title}
              </h3>

              <p className="text-sm text-content-muted leading-relaxed mb-6 flex-1">
                {service.description}
              </p>

              {service.price_range && (
                <div className="pt-5 border-t border-line flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-accent font-semibold text-sm">
                    <DollarSign className="w-4 h-4" />
                    <span>{service.price_range}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-content-muted group-hover:text-accent group-hover:translate-x-1 transition-all duration-200" />
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
