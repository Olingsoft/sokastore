import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
const Footer = () => {
  return (
    <footer className="bg-[#141313] text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* --- Brand Section --- */}

        <div>
          <div>
            <Image src="/soccastore.png" alt="SoccaStore logo" width={100} height={100} className="ml-10" />
            {/* Logo */}
            <Link href="/" className="text-2xl font-extrabold tracking-wide text-green-400 whitespace-nowrap">
              Socca<span className="text-white">Store<span className="text-sm">.ke</span></span>
            </Link>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Discover premium quality jerseys for your favorite teams.
            Authentic, stylish, and built for real fans.
          </p>
        </div>

        {/* --- Quick Links --- */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-[#0d9488]">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li><Link href="/" className="hover:text-white transition">Home</Link></li>
            <li><Link href="/shop" className="hover:text-white transition">Shop</Link></li>
            <li><Link href="/blogs" className="hover:text-white transition">Blogs</Link></li>
            <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>

          </ul>
        </div>

        {/* --- Customer Support --- */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-[#0d9488]">Customer Support</h3>
          <ul className="space-y-2 text-gray-400">
            <li><Link href="/faq" className="hover:text-white transition">FAQs</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
            <li><Link href="/terms-and-conditions" className="hover:text-white transition">Terms & Conditions</Link></li>
            <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>

          </ul>
        </div>

        {/* --- Contact Info --- */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-[#0d9488]">Get in Touch</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-center gap-2"><Phone size={16} /> +254 75922105</li>
            <li className="flex items-center gap-2"><Mail size={16} /> support@soccastore.ke</li>
            <li className="flex items-center gap-2"><MapPin size={16} /> Nairobi, Kenya</li>
          </ul>

          {/* --- Social Icons --- */}
          <div className="flex gap-3 mt-4">
            <a href="#" className="p-2 bg-[#0d9488] rounded-full hover:bg-[#2563eb] transition"><Facebook size={16} /></a>
            <a href="#" className="p-2 bg-[#0d9488] rounded-full hover:bg-[#2563eb] transition"><Twitter size={16} /></a>
            <a href="#" className="p-2 bg-[#0d9488] rounded-full hover:bg-[#2563eb] transition"><Instagram size={16} /></a>
          </div>
        </div>
      </div>

      {/* --- Bottom Bar --- */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} <span className="text-white font-semibold">JerseyStore</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
