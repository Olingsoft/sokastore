'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ArrowRight } from 'lucide-react';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('Form submitted:', formData); // Mock submission
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-green-600 text-white py-20">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Contact Us</h1>
            <p className="text-gray-100 text-lg md:text-xl">
              Have questions? We'd love to hear from you. Fill out the form below.
            </p>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 px-4 sm:px-6 md:px-12">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Get in Touch</h2>

            {success && (
              <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">
                Your message has been sent successfully!
              </div>
            )}

            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name *"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email *"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
                  required
                />
              </div>

              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
              />

              <textarea
                name="message"
                placeholder="Your Message *"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
              ></textarea>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-semibold flex items-center justify-center gap-2 transition-transform hover:scale-105 disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </section>

        {/* Optional Contact Info */}
        <section className="py-12 px-4 sm:px-6 md:px-12 bg-gray-50">
          <div className="max-w-3xl mx-auto space-y-6 text-center">
            <p className="text-gray-600">
              Or reach us directly via:
            </p>
            <p className="text-gray-900 font-medium">Email: support@example.com</p>
            <p className="text-gray-900 font-medium">Phone: +254 769 210 601</p>
            <p className="text-gray-900 font-medium">WhatsApp: <a className="text-green-600" href="https://wa.me/254769210601">Chat Now</a></p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
