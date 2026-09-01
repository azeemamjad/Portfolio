import React, { useState } from 'react';
import { Send, Mail, CheckCircle, AlertCircle, Linkedin, Phone, MapPin } from 'lucide-react';
import { portfolioAPI } from '../../services/api';
import type { About, ContactFormData } from '../../types';
import SectionHeader from '../common/SectionHeader';
import Card from '../common/Card';

interface ContactSectionProps {
  username: string;
  email?: string;
  about?: About;
  showHeader?: boolean;
}

const ContactSection: React.FC<ContactSectionProps> = ({
  username,
  email,
  about,
  showHeader = true,
}) => {
  const [formData, setFormData] = useState<ContactFormData>({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      await portfolioAPI.sendContactMessage(username, formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 6000);
    } catch (err: unknown) {
      setSubmitStatus('error');
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setErrorMessage(message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className={showHeader ? 'section-padding bg-section-alt' : 'page-content-section'}>
      <div className="container-custom">
        {showHeader && (
          <SectionHeader
            label="Let's Talk"
            title="Get in Touch"
            description="Have a project in mind or just want to say hi? My inbox is always open."
          />
        )}

        <div className="max-w-2xl mx-auto">
          <Card
            className="p-8 md:p-10 rounded-[1.75rem] backdrop-blur-xl backdrop-saturate-150 bg-white/70 dark:bg-[rgba(20,20,23,0.7)] border-[var(--glass-border)] shadow-[var(--glass-shadow)]"
            hover={false}
          >
            {submitStatus === 'success' ? (
              <div className="text-center py-12 md:py-14 animate-fade-in-up">
                <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-content mb-2">
                  Message Sent!
                </h3>
                <p className="text-content-muted mb-8">
                  Thanks for reaching out — I'll get back to you soon!
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitStatus('idle')}
                  className="btn-secondary rounded-full"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-content mb-2">
                      Name <span className="text-accent">*</span>
                    </label>
                    <input
                      type="text" id="name" name="name"
                      value={formData.name} onChange={handleChange}
                      required className="input-field" placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-content mb-2">
                      Email <span className="text-accent">*</span>
                    </label>
                    <input
                      type="email" id="email" name="email"
                      value={formData.email} onChange={handleChange}
                      required className="input-field" placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-content mb-2">Subject</label>
                  <input
                    type="text" id="subject" name="subject"
                    value={formData.subject} onChange={handleChange}
                    className="input-field" placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-content mb-2">
                    Message <span className="text-accent">*</span>
                  </label>
                  <textarea
                    id="message" name="message"
                    value={formData.message} onChange={handleChange}
                    required rows={5} className="textarea-field"
                    placeholder="Tell me about your project or just say hello..."
                  />
                </div>

                {submitStatus === 'error' && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {errorMessage}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary rounded-full px-6 py-3 text-[17px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>

                  {email && (
                    <a href={`mailto:${email}`} className="flex items-center gap-2 text-sm text-content-muted hover:text-accent transition-colors">
                      <Mail className="w-4 h-4" />
                      Or email directly
                    </a>
                  )}
                </div>
              </form>
            )}
          </Card>

          {about && (
            <div className="mt-12 pt-8 border-t border-line">
              <p className="text-center text-sm text-content-muted mb-6">Prefer a direct line?</p>
              <div className="flex flex-wrap justify-center items-center gap-6">
                {about.email && (
                  <a href={`mailto:${about.email}`} className="inline-flex items-center gap-2 text-sm font-medium text-content-muted hover:text-accent transition-colors">
                    <Mail className="w-4 h-4" />
                    {about.email}
                  </a>
                )}
                {about.linkedin_url && (
                  <a href={about.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-content-muted hover:text-accent transition-colors">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}
                {about.phone && (
                  <a href={`tel:${about.phone}`} className="inline-flex items-center gap-2 text-sm font-medium text-content-muted hover:text-accent transition-colors">
                    <Phone className="w-4 h-4" />
                    {about.phone}
                  </a>
                )}
                {about.location && (
                  <span className="inline-flex items-center gap-2 text-sm text-content-muted">
                    <MapPin className="w-4 h-4" />
                    {about.location}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
