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
        className={`w-4 h-4 ${i < rating ? 'fill-accent text-accent' : 'text-content-muted/30'}`}
      />
    ));

  return (
    <section className="section-padding">
      <div className="container-custom">
        {/* Header */}
        <div className="section-header">
          <span className="section-label">
            <span className="section-label__rule" aria-hidden />
            Social Proof
          </span>
          <h2 className="heading-secondary text-content">What People Say</h2>
          <p className="text-content-muted mt-5 max-w-xl mx-auto text-base">
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
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                     style={{
                       background: 'color-mix(in oklch, var(--accent) 10%, transparent)',
                       border: '1px solid color-mix(in oklch, var(--accent) 18%, transparent)',
                     }}>
                  <Quote className="w-5 h-5 text-accent" />
                </div>
                <div className="flex items-center gap-0.5">
                  {renderStars(t.rating)}
                </div>
              </div>

              {/* Testimonial text */}
              <p className="text-content-muted leading-relaxed flex-1 mb-6 italic text-sm">
                "{t.content}"
              </p>

              {/* Client */}
              <div className="flex items-center gap-3 pt-5 border-t border-line">
                {t.client_image ? (
                  <img
                    src={t.client_image}
                    alt={t.client_name}
                    className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center text-accent-fg text-base font-semibold"
                       style={{ background: 'linear-gradient(145deg, var(--accent-500), var(--accent-600))' }}>
                    {t.client_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-content text-sm truncate">{t.client_name}</p>
                  {t.client_role && (
                    <p className="text-xs text-content-muted truncate">
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
