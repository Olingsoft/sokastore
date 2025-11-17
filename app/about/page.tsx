'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const inputClass = "w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition";
const buttonClass = "w-full bg-teal-400 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded-md shadow-lg transition";

export default function AboutPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
    alert("Message sent successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* Hero Section */}
      <section className="relative bg-teal-500 text-white py-24 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">About & Contact Us</h1>
          <p className="text-lg md:text-xl text-gray-100">
            Learn more about us, our mission, our team, and how to reach out. We're here to help!
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-teal-500">Our Story</h2>
            <p className="text-gray-700 mb-4">
              Founded in 2022, our company has been committed to bringing high-quality football jerseys to fans all over the world. We believe in authenticity, comfort, and style. Our journey began with a passion for football and a vision to make every fan feel part of the game.
            </p>
            <p className="text-gray-700">
              With a dedicated team, we carefully select each product to ensure it meets our quality standards. From top leagues to local clubs, our collection continues to grow, bringing you closer to the game you love.
            </p>
          </div>
          <div className="relative w-full h-80 md:h-96 rounded-xl overflow-hidden shadow-lg">
            <Image src="/images/about-us.jpg" alt="About Us" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-100 py-16 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-teal-500 mb-3">Our Mission</h3>
            <p className="text-gray-700">
              To provide football fans with authentic, stylish, and comfortable jerseys while delivering exceptional customer experience and value.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-teal-500 mb-3">Our Vision</h3>
            <p className="text-gray-700">
              To be the go-to destination for football enthusiasts worldwide, fostering a community that celebrates the love of the game.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-teal-500">Meet Our Team</h2>
          <p className="text-gray-700 mt-2">Passionate people behind the scenes</p>
        </div>
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { name: "John Doe", role: "Founder & CEO", image: "/images/team1.jpg" },
            { name: "Jane Smith", role: "Head of Operations", image: "/images/team2.jpg" },
            { name: "Mike Johnson", role: "Marketing Lead", image: "/images/team3.jpg" },
            { name: "Sarah Williams", role: "Customer Support", image: "/images/team4.jpg" },
          ].map((member, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition">
              <div className="relative w-full h-64">
                <Image src={member.image} alt={member.name} fill className="object-cover" />
              </div>
              <div className="p-4 text-center">
                <h4 className="font-bold text-lg">{member.name}</h4>
                <p className="text-gray-500">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-teal-500 py-16 px-4 sm:px-6 md:px-12 text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
            <p>Have questions or need assistance? Reach out to us anytime. We’re always happy to help!</p>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-white"/>
              <span>123 Football Ave, Nairobi, Kenya</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-white"/>
              <span>+254 700 123 456</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-white"/>
              <span>support@footballstore.com</span>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl p-6 text-gray-900 shadow-lg">
              <h3 className="text-xl font-bold mb-2">Send Us a Message</h3>
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inputClass}/>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className={inputClass}/>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea required value={form.message} onChange={e => setForm({...form, message: e.target.value})} className={inputClass + " h-32 resize-none"} />
              </div>
              <button type="submit" className={buttonClass}>Send Message</button>
            </form>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto rounded-xl overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1994.123456!2d36.8219!3d-1.2921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1a1a1b1b1b1b%3A0x123456789abcdef!2sNairobi!5e0!3m2!1sen!2ske!4v1699999999999"
            className="w-full h-96 border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/254700123456"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-50 transition"
      >
        <Image src="/images/whatsapp-icon.png" alt="WhatsApp" width={28} height={28} />
      </a>
    </div>
  );
}
