import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
    title: 'Privacy Policy | SokaStore Kenya',
    description: 'How we handle your personal information and ensure your privacy while shopping with SokaStore Kenya.',
};

export default function PrivacyPolicyPage() {
    const lastUpdated = "October 20, 2023";

    return (
        <div className="min-h-screen bg-[#0a0f0a] text-gray-100 font-sans">
            <Header />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                        Privacy <span className="text-green-400">Policy</span>
                    </h1>
                    <p className="text-gray-500 italic">Last Updated: {lastUpdated}</p>
                </div>

                <div className="space-y-12 text-gray-300 leading-relaxed text-lg">
                    <section className="bg-white/5 p-8 rounded-3xl border border-white/5">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-green-500 rounded-full" />
                            1. Introduction
                        </h2>
                        <p>
                            Welcome to SokaStore Kenya. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-green-500 rounded-full" />
                            2. The Data We Collect
                        </h2>
                        <p className="mb-4">
                            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                        </p>
                        <ul className="list-disc pl-6 space-y-3 marker:text-green-500">
                            <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                            <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                            <li><strong>Financial Data:</strong> includes payment card details (managed via secure payment gateways).</li>
                            <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products you have purchased from us.</li>
                            <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-green-500 rounded-full" />
                            3. How We Use Your Data
                        </h2>
                        <p className="mb-4">
                            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                        </p>
                        <ul className="list-disc pl-6 space-y-3 marker:text-green-500">
                            <li>To register you as a new customer.</li>
                            <li>To process and deliver your order including managing payments, fees and charges.</li>
                            <li>To manage our relationship with you which will include notifying you about changes to our terms or privacy policy.</li>
                            <li>To enable you to partake in a prize draw, competition or complete a survey.</li>
                            <li>To use data analytics to improve our website, products/services, marketing and customer relationships.</li>
                        </ul>
                    </section>

                    <section className="bg-white/5 p-8 rounded-3xl border border-white/5">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-green-500 rounded-full" />
                            4. Data Security
                        </h2>
                        <p>
                            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-green-500 rounded-full" />
                            5. Your Legal Rights
                        </h2>
                        <p>
                            Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-green-500 rounded-full" />
                            6. Contact Us
                        </h2>
                        <p>
                            If you have any questions about this privacy policy or our privacy practices, please contact us at:
                        </p>
                        <div className="mt-6 p-6 bg-green-500/5 rounded-2xl border border-green-500/10">
                            <p className="font-bold text-white">Email: privacy@soccastore.ke</p>
                            <p className="text-gray-400">Phone: +254 759 221095</p>
                            <p className="text-gray-400">Nairobi, Kenya</p>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
