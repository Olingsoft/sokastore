import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#141313] text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* --- Brand Section --- */}
        <div>
          <h2 className="text-2xl font-extrabold text-white mb-3">Soka<span className="text-[#0d9488]">Store</span></h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Discover premium quality jerseys for your favorite teams.  
            Authentic, stylish, and built for real fans.
          </p>
        </div>

        {/* --- Quick Links --- */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-[#0d9488]">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white transition">Home</a></li>
            <li><a href="#" className="hover:text-white transition">Shop</a></li>
            <li><a href="#" className="hover:text-white transition">Offers</a></li>
            <li><a href="#" className="hover:text-white transition">About Us</a></li>
          </ul>
        </div>

        {/* --- Customer Support --- */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-[#0d9488]">Customer Support</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white transition">FAQs</a></li>
            <li><a href="#" className="hover:text-white transition">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-white transition">Order Tracking</a></li>
            <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
          </ul>
        </div>

        {/* --- Contact Info --- */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-[#0d9488]">Get in Touch</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-center gap-2"><Phone size={16}/> +254 712 345 678</li>
            <li className="flex items-center gap-2"><Mail size={16}/> support@jerseystore.com</li>
            <li className="flex items-center gap-2"><MapPin size={16}/> Nairobi, Kenya</li>
          </ul>

          {/* --- Social Icons --- */}
          <div className="flex gap-3 mt-4">
            <a href="#" className="p-2 bg-[#0d9488] rounded-full hover:bg-[#2563eb] transition"><Facebook size={16}/></a>
            <a href="#" className="p-2 bg-[#0d9488] rounded-full hover:bg-[#2563eb] transition"><Twitter size={16}/></a>
            <a href="#" className="p-2 bg-[#0d9488] rounded-full hover:bg-[#2563eb] transition"><Instagram size={16}/></a>
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
