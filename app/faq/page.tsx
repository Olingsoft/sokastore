'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ChevronDown, ChevronUp, Search, MessageCircle } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

const faqs: FAQItem[] = [
    {
        category: "Orders & Shipping",
        question: "How long does delivery take within Nairobi?",
        answer: "Delivery within Nairobi usually takes between 4 to 24 hours. Orders placed before noon are often delivered the same day."
    },
    {
        category: "Orders & Shipping",
        question: "Do you ship outside of Nairobi?",
        answer: "Yes, we ship across all 47 counties in Kenya via G4S, Wells Fargo, and reliable public courier services. Delivery outside Nairobi typically takes 24 to 48 hours."
    },
    {
        category: "Product & Quality",
        question: "Are your jerseys original?",
        answer: "We offer high-quality 'Thai Version' and 'Player Version' jerseys, which are the highest grade of replicas available, featuring the same materials, embroidery, and fit as the authentic kits used by professionals."
    },
    {
        category: "Product & Quality",
        question: "Can I customize my jersey with a name and number?",
        answer: "Absolutely! We offer custom printing for names and numbers using official fonts. You can specify your customization details when adding a product to your cart or during checkout."
    },
    {
        category: "Payments",
        question: "What payment methods do you accept?",
        answer: "We primarily use M-Pesa for all transactions. You can pay via our official Paybill or Buy Goods till number during the checkout process."
    },
    {
        category: "Returns & Exchanges",
        question: "What is your return policy?",
        answer: "We accept returns and exchanges within 7 days of delivery if the item is unused, has its original tags, and is in the same condition you received it. Customized jerseys cannot be returned unless there is a printing error on our part."
    },
    {
        category: "Groups & Bulk",
        question: "Do you offer discounts for team or bulk orders?",
        answer: "Yes, we offer special discounted rates for orders of 10 jerseys or more. Contact our sales team via WhatsApp for a custom quote for your team or organization."
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = ['All', ...Array.from(new Set(faqs.map(f => f.category)))];

    const filteredFaqs = faqs.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-[#0a0f0a] text-gray-100 font-sans">
            <Header />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                {/* Page Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                        Frequently Asked <span className="text-green-400">Questions</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Everything you need to know about SokaStore jerseys, delivery, and services.
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="mb-12 space-y-6">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-green-400 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search for a question..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-green-500/50 focus:bg-white/10 transition-all shadow-xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat
                                        ? 'bg-green-600 text-white shadow-lg shadow-green-900/20'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`group border rounded-2xl transition-all duration-300 ${openIndex === index
                                        ? 'bg-white/5 border-green-500/30 shadow-lg shadow-green-900/10'
                                        : 'bg-[#141313] border-white/5 hover:border-white/20'
                                    }`}
                            >
                                <button
                                    className="w-full text-left px-6 py-5 flex justify-between items-center gap-4"
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                >
                                    <span className={`font-bold text-lg transition-colors ${openIndex === index ? 'text-green-400' : 'text-white'}`}>
                                        {faq.question}
                                    </span>
                                    <div className={`p-2 rounded-full transition-all ${openIndex === index ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-500'}`}>
                                        {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </div>
                                </button>

                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                            <p className="text-gray-500">No questions match your search.</p>
                            <button onClick={() => { setSearchTerm(''); setActiveCategory('All'); }} className="text-green-400 mt-2 hover:underline">Clear filters</button>
                        </div>
                    )}
                </div>

                {/* CTA Section */}
                <div className="mt-20 p-8 rounded-3xl bg-gradient-to-br from-green-600/20 to-teal-600/20 border border-green-500/20 text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">Still have questions?</h3>
                    <p className="text-gray-400 mb-6">Our team is ready to help you find the perfect jersey.</p>
                    <a
                        href="https://wa.me/254759221095"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-2xl font-bold transition-all hover:scale-105"
                    >
                        <MessageCircle size={20} /> Chat on WhatsApp
                    </a>
                </div>
            </main>

            <Footer />
        </div>
    );
}
