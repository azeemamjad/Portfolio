import React, { useState } from 'react';
import { Send, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { portfolioAPI } from '../../services/api';
import type { ContactFormData } from '../../types';

interface ContactSectionProps {
  username: string;
  email?: string;
}

const ContactSection: React.FC<ContactSectionProps> = ({ username, email }) => {
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
    } catch (err: any) {
      setSubmitStatus('error');
      setErrorMessage(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-section-alt">
      <div className="container-custom">
        {/* Header */}
        <div className="section-header">
          <span className="section-label">Let's Talk</span>
          <h2 className="heading-secondary text-gray-900 dark:text-white">Get in Touch</h2>
          <div className="section-underline" />
          <p className="text-gray-500 dark:text-gray-400 mt-5 max-w-xl mx-auto text-base">
            Have a project in mind or just want to say hi? My inbox is always open.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="card p-8 md:p-10">
            {submitStatus === 'success' ? (
              <div className="text-center py-10 animate-fade-in-up">
                <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30
                                flex items-center justify-center mx-auto mb-5">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-7">
                  Thanks for reaching out — I'll get back to you soon!
                </p>
                <button onClick={() => setSubmitStatus('idle')} className="btn-secondary">
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Name <span className="text-primary-500">*</span>
                    </label>
                    <input
                      type="text" id="name" name="name"
                      value={formData.name} onChange={handleChange}
                      required className="input-field" placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Email <span className="text-primary-500">*</span>
                    </label>
                    <input
                      type="email" id="email" name="email"
                      value={formData.email} onChange={handleChange}
                      required className="input-field" placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text" id="subject" name="subject"
                    value={formData.subject} onChange={handleChange}
                    className="input-field" placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Message <span className="text-primary-500">*</span>
                  </label>
                  <textarea
                    id="message" name="message"
                    value={formData.message} onChange={handleChange}
                    required rows={5} className="textarea-field"
                    placeholder="Tell me about your project or just say hello..."
                  />
                </div>

                {submitStatus === 'error' && (
                  <div className="flex items-start gap-3 p-4 rounded-xl
                                  bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800
                                  text-red-700 dark:text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {errorMessage}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
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
                    <a href={`mailto:${email}`}
                       className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400
                                  hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      <Mail className="w-4 h-4" />
                      Or email directly
                    </a>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
