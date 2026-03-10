import { FileText, ArrowRight, Shield, CreditCard, AlertCircle, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms = () => {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-900 pb-24">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 pt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
                                <span>&gt;</span>
                                <span>Terms of Service</span>
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">Terms of Service</h1>
                            <p className="text-gray-500">Last Updated: October 24, 2023. These Terms of Service ("Terms") govern your access to and use of the SkillSwap platform.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Navigation */}
                    <div className="hidden lg:block w-72 flex-shrink-0">
                        <div className="sticky top-24 space-y-8">
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Quick Navigation</h3>
                                <nav className="space-y-1">
                                    {[
                                        { id: 'introduction', label: '1. Introduction', icon: AlertCircle },
                                        { id: 'eligibility', label: '2. User Eligibility', icon: Shield },
                                        { id: 'rules', label: '3. Skill Exchange Rules', icon: FileText },
                                        { id: 'payments', label: '4. Payments & Credits', icon: CreditCard },
                                        { id: 'liability', label: '5. Liability', icon: AlertCircle },
                                        { id: 'disputes', label: '6. Dispute Resolution', icon: Scale },
                                    ].map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => scrollToSection(item.id)}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all text-left"
                                        >
                                            <item.icon size={16} />
                                            {item.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 max-w-4xl space-y-16 bg-white p-8 lg:p-12 rounded-3xl shadow-sm border border-gray-100">
                        {/* 1. Introduction */}
                        <section id="introduction" className="scroll-mt-36">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Introduction</h2>
                            <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
                                <p>
                                    Welcome to SkillSwap. These Terms of Service constitute a legally binding agreement between you and SkillSwap, Inc. regarding your use of our website, mobile application, and related services.
                                </p>
                                <p>
                                    By accessing or using the Service, you signify that you have read, understood, and agree to be bound by this Agreement and to the collection and use of your information as set forth in our Privacy Policy, whether or not you are a registered user of our Service.
                                </p>
                                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-6">
                                    <p className="text-blue-800 italic text-sm">
                                        "Please read these terms carefully. They include important information about your legal rights, remedies, and obligations, including various limitations and exclusions."
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 2. User Eligibility */}
                        <section id="eligibility" className="scroll-mt-36">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">2. User Eligibility</h2>
                            <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
                                <p>
                                    To use our Service, you must be at least 18 years of age and be able to form legally binding contracts under applicable law. If you are under 18, you may not use the Service.
                                </p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-gray-400">
                                    <li>You must provide <strong>accurate and complete information</strong> when creating an account.</li>
                                    <li>You are solely responsible for the <strong>activity that occurs on your account</strong>.</li>
                                    <li>You must notify SkillSwap immediately of any breach of security or unauthorized use of your account.</li>
                                    <li>SkillSwap reserves the right to suspend or terminate accounts that violate these terms.</li>
                                </ul>
                            </div>
                        </section>

                        {/* 3. Skill Exchange Rules */}
                        <section id="rules" className="scroll-mt-36">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Skill Exchange Rules</h2>
                            <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
                                <p>
                                    SkillSwap is a platform for members to trade skills and knowledge. We expect all users to maintain a high level of professionalism and respect.
                                </p>
                                <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">A. Prohibited Activities</h3>
                                <p>
                                    Users may not use the platform to exchange services that are illegal, sexually explicit, or promote hate speech. Additionally, you agree not to:
                                </p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-gray-400">
                                    <li>Harass, bully, or intimidate other users.</li>
                                    <li>Spam or send unsolicited commercial messages.</li>
                                    <li>Misrepresent your skills, qualifications, or identity.</li>
                                    <li>Bypass our payment or credit systems for external transactions.</li>
                                </ul>
                            </div>
                        </section>

                        {/* 4. Payments & Credits */}
                        <section id="payments" className="scroll-mt-36">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Payments & Credits</h2>
                            <div className="prose prose-gray max-w-none text-gray-600 space-y-6">
                                <p>
                                    SkillSwap uses a proprietary "Swap Credit" system to facilitate exchanges. Credits can be earned by teaching others or purchased through our platform.
                                </p>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                        <h4 className="font-bold text-gray-900 mb-2">Earning Credits</h4>
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            Credits are awarded upon successful completion of a skill-sharing session confirmed by both parties.
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                        <h4 className="font-bold text-gray-900 mb-2">Purchasing</h4>
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            Direct credit purchases are non-refundable unless required by local consumer law.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 5. Liability */}
                        <section id="liability" className="scroll-mt-36">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Liability</h2>
                            <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
                                <p>
                                    SkillSwap is not responsible for the quality, safety, or legality of the skills shared on the platform. We act solely as a facilitator.
                                </p>
                                <p className="uppercase font-medium text-gray-800 text-sm tracking-wide bg-gray-100 p-4 rounded-lg border border-gray-200">
                                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, SKILLSWAP SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES.
                                </p>
                            </div>
                        </section>

                        {/* 6. Dispute Resolution */}
                        <section id="disputes" className="scroll-mt-36">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Dispute Resolution</h2>
                            <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
                                <p>
                                    Any dispute arising from these terms shall be governed by and construed in accordance with the laws of India.
                                </p>
                                <p>
                                    Any dispute, controversy, or claim arising out of or relating to this Agreement, or the breach, termination, or invalidity thereof, shall be settled by arbitration in accordance with the <strong>Arbitration and Conciliation Act, 1996</strong>, as amended. The seat and venue of the arbitration shall be <strong>New Delhi, India</strong>. The language of the arbitration shall be English.
                                </p>
                                <p>
                                    Subject to the arbitration clause, the courts at New Delhi shall have exclusive jurisdiction over any matters arising out of or relating to these Terms.
                                </p>
                            </div>
                        </section>

                        <div className="border-t border-gray-200 pt-12 mt-12">
                            <p className="text-sm text-gray-500">
                                Thank you for using SkillSwap. If you have any feedback or concerns, please reach out to us at <a href="mailto:legal@skillswap.com" className="text-blue-600 hover:underline">legal@skillswap.com</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Terms;
