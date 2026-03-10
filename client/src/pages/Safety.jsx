import { Shield, MessageSquare, FileText, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Safety = () => {
    return (
        <div className="bg-white min-h-screen font-sans text-gray-900">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                <div className="flex items-center gap-2 text-blue-600 font-bold tracking-wider text-sm uppercase mb-4">
                    <Shield size={18} />
                    <span>Safety First</span>
                </div>
                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 text-gray-900 leading-tight">
                    Our Commitment to Your <span className="text-blue-600">Safety</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                    We've built SkillSwap with security at its core. Learn how we protect our community and the steps you can take to ensure every swap is positive and productive.
                </p>
            </div>

            {/* Feature Cards */}
            <div className="bg-gray-50 py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Card 1 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <Shield size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Verified Profiles</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Identity verification through official documentation for peace of mind.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <MessageSquare size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Secure Messaging</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Built-in encrypted chat keeps your personal contact info private.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <FileText size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Community Rules</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Clear standards of conduct to maintain a respectful environment.
                            </p>
                        </div>

                        {/* Card 4 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <MapPin size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Safe Meetups</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Best practices for meeting your swap partner in person safely.
                            </p>
                        </div>
                    </div>
                </div>
            </div>


            {/* Safe Meetup Checklist */}
            <div className="bg-gray-50 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12">Safe Meetup Checklist</h2>
                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
                        <div className="flex gap-4">
                            <div className="mt-1">
                                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                    <CheckCircle size={14} className="text-white" />
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg mb-2">Meet in public spaces</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Always choose coffee shops, libraries, or co-working spaces for initial meetups.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="mt-1">
                                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                    <CheckCircle size={14} className="text-white" />
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg mb-2">Trust your gut</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    If something feels wrong, don't feel pressured to continue the meeting.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="mt-1">
                                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                    <CheckCircle size={14} className="text-white" />
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg mb-2">Share your plans</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Tell a friend or family member where you're going and who you're meeting.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="mt-1">
                                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                    <CheckCircle size={14} className="text-white" />
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg mb-2">Review and Rate</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Always leave honest feedback after a swap to help the rest of the community.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="mt-1">
                                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                    <CheckCircle size={14} className="text-white" />
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg mb-2">Keep it on SkillSwap</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Use our messaging platform so we have a record if any issues arise.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="mt-1">
                                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                    <CheckCircle size={14} className="text-white" />
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg mb-2">Safety first, always</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    No skill is worth compromising your physical or digital security.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Simple Footer for Safety Page */}
            <div className="border-t border-gray-200 py-12 text-center">
                <div className="flex items-center justify-center gap-2 mb-8">
                    <Shield className="text-blue-600" size={24} />
                    <span className="font-bold text-xl text-gray-900">SkillSwap Safety</span>
                </div>
                <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
                    <Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
                    <Link to="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
                    <span>© 2024 SkillSwap Inc.</span>
                </div>
            </div>
        </div>
    );
};

export default Safety;
