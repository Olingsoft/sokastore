'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin, Send, MessageSquare, Instagram, Twitter, Facebook } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Form submitted:', formData);
      toast.success('Your message has been sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-gray-100 font-sans selection:bg-green-500/30">
      <Header />

      <main>
        {/* --- Hero Header --- */}
        <section className="py-24 px-4 bg-gradient-to-b from-green-900/10 to-transparent">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 italic uppercase tracking-tighter">
              Get In <span className="text-green-400">Touch</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl font-medium">
              Whether you're looking for a specific vintage kit or need help with a bulk team order, our squad is ready to assist.
            </p>
          </div>
        </section>

        {/* --- Contact Content --- */}
        <section className="pb-24 px-4 sm:px-6 md:px-12">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-12">

            {/* Contact Info Sidebar */}
            <div className="lg:col-span-2 space-y-8 order-2 lg:order-1">
              <div className="p-8 rounded-[2rem] bg-[#141313] border border-white/5 space-y-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-3xl rounded-full" />

                <h2 className="text-3xl font-bold italic">Contact Details</h2>

                <div className="space-y-8 relative z-10">
                  <div className="flex gap-6 group/item">
                    <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 group-hover/item:bg-green-500 group-hover/item:text-white transition-all duration-300">
                      <Phone size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Call/WhatsApp</p>
                      <p className="text-lg font-bold">+254 759 221095</p>
                    </div>
                  </div>

                  <div className="flex gap-6 group/item">
                    <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover/item:bg-teal-500 group-hover/item:text-white transition-all duration-300">
                      <Mail size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Email Us</p>
                      <p className="text-lg font-bold">support@soccastore.ke</p>
                    </div>
                  </div>

                  <div className="flex gap-6 group/item">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover/item:bg-blue-500 group-hover/item:text-white transition-all duration-300">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Visit Hub</p>
                      <p className="text-lg font-bold">Nairobi, Kenya</p>
                      <p className="text-sm text-gray-500">Pick-up points across CBD</p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                  <p className="text-sm text-gray-400 mb-6">Follow our socials for new gear drops:</p>
                  <div className="flex gap-4">
                    {[Facebook, Instagram, Twitter].map((Icon, i) => (
                      <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                        <Icon size={18} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* FAQ Quick Link */}
              <div className="p-8 rounded-[2rem] bg-gradient-to-r from-green-600/20 to-teal-600/20 border border-green-500/20 flex items-center justify-between group cursor-pointer" onClick={() => window.location.href = '/faq'}>
                <div className="flex items-center gap-4">
                  <MessageSquare className="text-green-400" />
                  <div>
                    <p className="font-bold">Need instant answers?</p>
                    <p className="text-xs text-gray-400">Check our FAQ section</p>
                  </div>
                </div>
                <div className="p-2 rounded-full bg-white/10 group-hover:bg-green-500 transition-all">
                  <Send size={16} />
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <form onSubmit={handleSubmit} className="bg-[#141313] p-8 md:p-12 rounded-[2rem] border border-white/5 shadow-2xl space-y-6 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/5 blur-3xl rounded-full" />

                <div className="grid md:grid-cols-2 gap-6 relative z-10">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Lionel Messi"
                      className="w-full bg-[#1E1E1E] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-green-500 transition-all placeholder:text-gray-700"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Your Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="leo@example.com"
                      className="w-full bg-[#1E1E1E] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-green-500 transition-all placeholder:text-gray-700"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 relative z-10">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Order status / Special request"
                    className="w-full bg-[#1E1E1E] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-green-500 transition-all placeholder:text-gray-700"
                  />
                </div>

                <div className="space-y-2 relative z-10">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    placeholder="How can we help you today?"
                    className="w-full bg-[#1E1E1E] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-green-500 transition-all placeholder:text-gray-700 resize-none"
                    required
                  ></textarea>
                </div>

                <div className="pt-4 relative z-10">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-500 hover:bg-green-600 active:scale-95 text-[#0a0f0a] font-black uppercase py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-green-900/20 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Transmitting...' : (
                      <>
                        Dispatch Message
                        <Send size={20} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* --- Location Map Mockup --- */}
        <section className="py-24 border-t border-white/5 bg-gradient-to-b from-transparent to-[#0a0f0a]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="h-96 w-full rounded-[3rem] overflow-hidden grayscale contrast-125 border border-white/10 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.277444359!2d36.81897!3d-1.28433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d22fca7315%3A0x633454b38d390a8a!2sNairobi%20CBD!5e0!3m2!1sen!2ske!4v1699999999999"
                className="w-full h-full border-0 absolute inset-0"
                allowFullScreen
                loading="lazy"
              ></iframe>
              <div className="absolute inset-0 pointer-events-none bg-green-500/10 mix-blend-overlay" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
