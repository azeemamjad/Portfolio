import React, { useState } from 'react';
import { Send, Mail, CheckCircle, MapPin, Phone, Linkedin } from 'lucide-react';
import { portfolioAPI } from '../../services/api';
import type { ContactFormData, About } from '../../types';

interface ContactPageProps {
  username: string;
  about?: About;
}

const ContactPage: React.FC<ContactPageProps> = ({ username, about }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '', email: '', subject: '', message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <section className="section-padding pt-32 bg-black/5">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <span className="section-label">Contact</span>
            <h1 className="heading-primary text-neutral-900">
              Let's{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-500">
                Work Together
              </span>
            </h1>
            <p className="text-neutral-500 mt-4 text-lg leading-relaxed">
              Have a project in mind or want to collaborate? Drop me a message and I'll get back to you within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">

            {submitStatus === 'success' ? (
              <div className="text-center py-16 animate-fade-in">
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-orange-100">
                  <CheckCircle className="w-10 h-10 text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-3">Message Sent!</h3>
                <p className="text-neutral-500 mb-8">Thanks for reaching out. I'll get back to you soon!</p>
                <button onClick={() => setSubmitStatus('idle')} className="btn-secondary">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text" id="name" name="name"
                      value={formData.name} onChange={handleChange} required
                      className="input-field" placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email" id="email" name="email"
                      value={formData.email} onChange={handleChange} required
                      className="input-field" placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text" id="subject" name="subject"
                    value={formData.subject} onChange={handleChange}
                    className="input-field" placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message" name="message"
                    value={formData.message} onChange={handleChange} required
                    rows={7} className="textarea-field" placeholder="Tell me about your project..."
                  />
                </div>

                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit" disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Alternative contact */}
            <div className="mt-12 pt-8 border-t border-neutral-200">
              <p className="text-center text-sm text-neutral-400 mb-6">Prefer a direct line?</p>
              <div className="flex flex-wrap justify-center items-center gap-6">
                {about?.email && (
                  <a href={`mailto:${about.email}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-orange-600 transition-colors">
                    <Mail className="w-4 h-4" />
                    {about.email}
                  </a>
                )}
                {about?.linkedin_url && (
                  <a href={about.linkedin_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-orange-600 transition-colors">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}
                {about?.phone && (
                  <a href={`tel:${about.phone}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-orange-600 transition-colors">
                    <Phone className="w-4 h-4" />
                    {about.phone}
                  </a>
                )}
                {about?.location && (
                  <span className="inline-flex items-center gap-2 text-sm text-neutral-400">
                    <MapPin className="w-4 h-4" />
                    {about.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
