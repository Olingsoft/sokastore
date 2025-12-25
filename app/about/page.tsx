'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from 'next/image';
import { Trophy, Users, Star, Target, ShieldCheck, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0f0a] text-gray-100 font-sans selection:bg-green-500/30">
      <Header />

      <main>
        {/* --- Hero Section --- */}
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000&auto=format&fit=crop"
              alt="Football Stadium"
              fill
              className="object-cover opacity-30 scale-105 animate-slow-zoom"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f0a] via-transparent to-[#0a0f0a]" />
          </div>

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-green-400 to-teal-400">
              More Than Just <br /> A Jersey Store
            </h1>
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-medium">
              We are the pulse of football culture in Kenya. Bringing you the highest quality kits from the world's greatest stage directly to your doorstep.
            </p>
          </div>
        </section>

        {/* --- Stats Section --- */}
        <section className="py-12 bg-white/5 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Happy Fans', value: '10K+' },
              { label: 'Jerseys Sold', value: '25K+' },
              { label: 'Years Experience', value: '5+' },
              { label: 'Global Leagues', value: '15+' },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <p className="text-3xl md:text-4xl font-bold text-green-400 group-hover:scale-110 transition-transform">{stat.value}</p>
                <p className="text-xs md:text-sm text-gray-500 uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- Our Mission Section --- */}
        <section className="py-24 px-4 sm:px-6 md:px-12">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider">
                <Trophy size={14} /> Our Mission
              </div>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                Equipping the Fans <br /> Celebrating the Game
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                SokaStore was founded by football enthusiasts for football enthusiasts. Our mission is simple: To provide Kenyan fans with the highest grade football kits that combine professional performance with affordability.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <ShieldCheck className="text-green-400 shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold mb-1">Authentic Quality</h4>
                    <p className="text-xs text-gray-500">Premium Thai & Player versions that match the pros.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <Target className="text-teal-400 shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold mb-1">Island Delivery</h4>
                    <p className="text-xs text-gray-500">Fast shipping across all 47 counties in Kenya.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="relative z-10 rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-green-900/20">
                <img
                  src="https://images.unsplash.com/photo-1579952318536-47eb0e35384f?q=80&w=1000&auto=format&fit=crop"
                  alt="Jersey Display"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-500/20 rounded-full blur-[100px] z-0 animate-pulse" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-500/20 rounded-full blur-[100px] z-0 animate-pulse delay-700" />
            </div>
          </div>
        </section>

        {/* --- Values Section --- */}
        <section className="py-24 bg-white/[0.02] border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4 text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 italic">The SokaStore Promise</h2>
            <div className="h-1 w-20 bg-green-500 mx-auto rounded-full" />
          </div>

          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="text-green-400" size={32} />,
                title: "Community First",
                desc: "We celebrate the diversity of fans, from Sunday league players to die-hard stadium supporters."
              },
              {
                icon: <Star className="text-yellow-400" size={32} />,
                title: "Unmatched Detail",
                desc: "Every stitch, badge, and print is inspected to ensure it meets our elite standards."
              },
              {
                icon: <Heart className="text-red-400" size={32} />,
                title: "Passion Driven",
                desc: "We don't just sell jerseys; we share the love for the most beautiful game in the world."
              }
            ].map((val, i) => (
              <div key={i} className="p-8 rounded-3xl bg-[#141313] border border-white/5 hover:border-green-500/30 transition-all group">
                <div className="mb-6 p-4 rounded-2xl bg-white/5 inline-block group-hover:scale-110 transition-transform">
                  {val.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{val.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{val.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- CTA --- */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto rounded-[3rem] p-12 bg-gradient-to-br from-green-600 to-teal-700 text-center relative overflow-hidden group shadow-2xl shadow-green-900/40">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter italic">Join the Squad</h2>
              <p className="text-green-50 text-lg mb-10 max-w-xl mx-auto underline-offset-4 decoration-green-300">
                Get the latest drops, exclusive offers, and team news before anyone else.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/shop" className="px-10 py-4 bg-white text-[#0a0f0a] rounded-2xl font-bold hover:bg-gray-100 transition shadow-lg">Start Shopping</a>
                <a href="/register" className="px-10 py-4 bg-black/30 text-white border border-white/20 rounded-2xl font-bold hover:bg-black/40 transition">Create Account</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
