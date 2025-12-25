import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
    title: 'Terms & Conditions | SokaStore Kenya',
    description: 'Terms and conditions for using SokaStore Kenya services and purchasing products.',
};

export default function TermsAndConditionsPage() {
    const lastUpdated = "October 20, 2023";

    return (
        <div className="min-h-screen bg-[#0a0f0a] text-gray-100 font-sans">
            <Header />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                        Terms & <span className="text-green-400">Conditions</span>
                    </h1>
                    <p className="text-gray-500 italic">Last Updated: {lastUpdated}</p>
                </div>

                <div className="space-y-12 text-gray-300 leading-relaxed text-lg">
                    <section className="bg-white/5 p-8 rounded-3xl border border-white/5">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-teal-500 rounded-full" />
                            1. Agreement to Terms
                        </h2>
                        <p>
                            By accessing or using SokaStore Kenya, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to all of these terms, do not use our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-teal-500 rounded-full" />
                            2. Products & Pricing
                        </h2>
                        <p className="mb-4">
                            We strive to display our products as accurately as possible. However, we cannot guarantee that your device's display of any color will be accurate.
                        </p>
                        <ul className="list-disc pl-6 space-y-3 marker:text-teal-500">
                            <li>All prices are subject to change without notice.</li>
                            <li>We reserve the right to limit the quantities of any products or services that we offer.</li>
                            <li>We reserve the right to discontinue any product at any time.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-teal-500 rounded-full" />
                            3. Orders & Payment
                        </h2>
                        <p>
                            We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order. Payment must be made through our approved payment methods at the time of purchase.
                        </p>
                    </section>

                    <section className="bg-white/5 p-8 rounded-3xl border border-white/5">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-teal-500 rounded-full" />
                            4. Shipping & Delivery
                        </h2>
                        <p>
                            Delivery times may vary based on your location in Kenya. While we aim for prompt delivery, we are not responsible for delays outside of our control. Risk of loss and title for items purchased from SokaStore pass to you upon delivery of the items to the carrier.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-teal-500 rounded-full" />
                            5. Returns & Refunds
                        </h2>
                        <p>
                            Our refund and returns policy is valid for 7 days after delivery. If 7 days have passed since your purchase, we cannot offer you a full refund or exchange. Items must be unused and in the same condition that you received them.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-teal-500 rounded-full" />
                            6. Intellectual Property
                        </h2>
                        <p>
                            The website and its entire contents, features, and functionality are owned by SokaStore Kenya and are protected by international copyright, trademark, and other intellectual property laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-teal-500 rounded-full" />
                            7. Governing Law
                        </h2>
                        <p>
                            These Terms and Conditions shall be governed by and construed in accordance with the laws of Kenya, without regard to its conflict of law provisions.
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
