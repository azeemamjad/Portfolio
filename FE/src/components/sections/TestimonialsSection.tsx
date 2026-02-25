import React from 'react';
import { Star, Quote } from 'lucide-react';
import type { Testimonial } from '../../types';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  if (testimonials.length === 0) return null;

  const featured = testimonials.filter((t) => t.is_featured);
  const display = featured.length > 0 ? featured : testimonials;

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 dark:text-gray-700'}`}
      />
    ));

  return (
    <section className="section-padding">
      <div className="container-custom">
        {/* Header */}
        <div className="section-header">
          <span className="section-label">Social Proof</span>
          <h2 className="heading-secondary text-gray-900 dark:text-white">What People Say</h2>
          <div className="section-underline" />
          <p className="text-gray-500 dark:text-gray-400 mt-5 max-w-xl mx-auto text-base">
            Feedback from clients and colleagues I've had the pleasure of working with.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {display.map((t, i) => (
            <div
              key={t.id}
              className="card p-7 flex flex-col animate-fade-in-up hover:-translate-y-1"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* Quote icon + stars */}
              <div className="flex items-start justify-between mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-950/50
                                flex items-center justify-center">
                  <Quote className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex items-center gap-0.5">
                  {renderStars(t.rating)}
                </div>
              </div>

              {/* Testimonial text */}
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-1 mb-6 italic text-sm">
                "{t.content}"
              </p>

              {/* Client */}
              <div className="flex items-center gap-3 pt-5 border-t border-gray-100 dark:border-gray-700">
                {t.client_image ? (
                  <img
                    src={t.client_image}
                    alt={t.client_name}
                    className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-xl flex-shrink-0
                                  bg-gradient-to-br from-primary-500 to-purple-600
                                  flex items-center justify-center text-white text-base font-bold">
                    {t.client_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{t.client_name}</p>
                  {t.client_role && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {t.client_role}{t.client_company ? ` · ${t.client_company}` : ''}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
