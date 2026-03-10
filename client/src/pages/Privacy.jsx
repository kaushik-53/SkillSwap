import { Shield, Lock, Eye, Share2, UserCheck, Cookie, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy = () => {
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
                                <Link to="/safety" className="hover:text-blue-600 transition-colors">Legal</Link>
                                <span>&gt;</span>
                                <span>Privacy Policy</span>
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">Privacy Policy</h1>
                            <p className="text-gray-500 max-w-3xl">
                                At SkillSwap, your privacy is a top priority. This policy outlines how we collect, use, and protect your information when you use our skill-sharing platform.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Navigation */}
                    <div className="hidden lg:block w-72 flex-shrink-0">
                        <div className="sticky top-28 space-y-8">
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Table of Contents</h3>
                                <nav className="space-y-1">
                                    {[
                                        { id: 'introduction', label: '1. Introduction', icon: Shield },
                                        { id: 'collection', label: '2. Data Collection', icon: Lock },
                                        { id: 'usage', label: '3. Usage of Data', icon: Eye },
                                        { id: 'sharing', label: '4. Data Sharing', icon: Share2 },
                                        { id: 'rights', label: '5. Your Rights', icon: UserCheck },
                                        { id: 'cookies', label: '6. Cookie Policy', icon: Cookie },
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
                                    Welcome to SkillSwap. We value your trust and are committed to protecting your personal data. This Privacy Policy describes how SkillSwap ("we", "us", or "our") collects, uses, and shares your personal information when you use our website, mobile application, and related services (collectively, the "Services").
                                </p>
                                <p>
                                    By accessing or using our Services, you signify that you have read, understood, and agree to our collection, storage, use, and disclosure of your personal information as described in this Privacy Policy and our Terms of Service.
                                </p>
                            </div>
                        </section>

                        {/* 2. Information We Collect */}
                        <section id="collection" className="scroll-mt-36">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Information We Collect</h2>
                            <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
                                <p>
                                    We collect information that you provide directly to us when you create an account, build your profile, or communicate with other users.
                                </p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-gray-400">
                                    <li><strong>Account Data:</strong> Name, email address, password, and profile picture.</li>
                                    <li><strong>Profile Information:</strong> Skills you offer, skills you want to learn, bio, and availability.</li>
                                    <li><strong>Communications:</strong> Messages sent through our platform to other users or our support team.</li>
                                    <li><strong>Payment Information:</strong> If applicable, billing details processed through our secure third-party providers.</li>
                                </ul>
                                <p className="mt-4">
                                    We also collect information automatically through your interaction with the Services, including IP addresses, browser types, and usage patterns via cookies and similar technologies.
                                </p>
                            </div>
                        </section>

                        {/* 3. How We Use Your Information */}
                        <section id="usage" className="scroll-mt-36">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">3. How We Use Your Information</h2>
                            <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
                                <p>
                                    We use the information we collect for various purposes, including to:
                                </p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-gray-400">
                                    <li>Provide, maintain, and improve our Services.</li>
                                    <li>Facilitate skill-swapping connections between users.</li>
                                    <li>Personalize your experience and recommend relevant skills.</li>
                                    <li>Send you technical notices, updates, and security alerts.</li>
                                    <li>Monitor and analyze trends, usage, and activities.</li>
                                    <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities.</li>
                                </ul>
                            </div>
                        </section>

                        {/* 4. Sharing of Information */}
                        <section id="sharing" className="scroll-mt-36">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Sharing of Information</h2>
                            <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
                                <p>
                                    We do not sell your personal data. We may share your information in the following circumstances:
                                </p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-gray-400">
                                    <li><strong>With other users:</strong> Parts of your profile (skills, bio, name) are visible to other members of the community to facilitate swaps.</li>
                                    <li><strong>Service Providers:</strong> We share data with third-party vendors who perform services on our behalf, such as cloud hosting and analytics.</li>
                                    <li><strong>Legal Requirements:</strong> If we believe disclosure is in accordance with, or required by, any applicable law or legal process.</li>
                                    <li><strong>Business Transfers:</strong> In connection with any merger, sale of company assets, or acquisition.</li>
                                </ul>
                            </div>
                        </section>

                        {/* 5. Your Rights & Choices */}
                        <section id="rights" className="scroll-mt-36">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Your Rights & Choices</h2>
                            <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
                                <p>
                                    Depending on your location, you may have certain rights regarding your personal information, including:
                                </p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-gray-400">
                                    <li><strong>Access:</strong> The right to request copies of your personal data.</li>
                                    <li><strong>Correction:</strong> The right to request that we correct any information you believe is inaccurate.</li>
                                    <li><strong>Erasure:</strong> The right to request that we erase your personal data under certain conditions.</li>
                                    <li><strong>Data Portability:</strong> The right to request that we transfer the data that we have collected to another organization.</li>
                                </ul>
                                <p className="mt-4">
                                    You can manage most of your profile information and communication preferences directly through your account settings.
                                </p>
                            </div>
                        </section>

                        {/* 6. Cookie Policy */}
                        <section id="cookies" className="scroll-mt-36">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Cookie Policy</h2>
                            <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
                                <p>
                                    We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
                                </p>
                                <p>
                                    You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
