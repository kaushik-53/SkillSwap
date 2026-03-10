import { Shield, Users, Globe, Heart, CheckCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="bg-white min-h-screen font-sans">
            {/* Hero Section */}
            <div className="relative bg-slate-900 text-white py-32 sm:py-48 px-4 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
                        alt="Indian community group"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-blue-900/20"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-sm font-medium mb-4">
                        <Sparkles size={16} />
                        <span>Empowering Communities Across India</span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight drop-shadow-lg">
                        Empowering Neighbors, <br className="hidden sm:block" />
                        One Skill at a Time
                    </h1>
                    <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-md">
                        Building stronger, more resilient neighborhoods through the simple power of skill exchange.
                    </p>
                </div>
            </div>

            {/* Mission Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    <div className="flex-1 space-y-8">
                        <div>
                            <span className="text-blue-600 font-bold tracking-widest text-sm uppercase flex items-center gap-2">
                                <span className="w-8 h-0.5 bg-blue-600"></span>
                                Our Mission
                            </span>
                            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mt-4 leading-tight">
                                Creating a world where every neighbor is a <span className="text-blue-600">teacher</span>.
                            </h2>
                        </div>
                        <p className="text-xl text-gray-600 leading-relaxed font-light">
                            We believe that traditional barriers to learning—cost, location, and accessibility—can be broken down by looking next door. Our platform facilitates a decentralized network of mentorship where everyone has something valuable to share.
                        </p>
                    </div>
                    <div className="flex-1 w-full relative group">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-orange-200 to-blue-200 rounded-3xl transform rotate-2 z-0 opacity-70 group-hover:rotate-3 transition-all duration-500"></div>
                        <img
                            src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=1587&q=80"
                            alt="Indian students collaborating"
                            className="relative z-10 w-full rounded-2xl shadow-2xl transform transition-transform duration-500 hover:-translate-y-2"
                        />
                    </div>
                </div>
            </div>

            {/* Core Values */}
            <div className="py-24 sm:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">Our Core Values</h2>
                    <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        These principles guide every decision we make, from the features we build to the communities we support.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    {/* Trust */}
                    <div className="bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 group">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                            <Shield size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Trust</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Safety is our priority. We foster a secure environment through verified profiles, community reviews, and a transparent feedback system.
                        </p>
                    </div>

                    {/* Community */}
                    <div className="bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 group">
                        <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-8 text-orange-600 group-hover:scale-110 transition-transform duration-300">
                            <Users size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Community</h3>
                        <p className="text-gray-600 leading-relaxed">
                            We are humans first. We focus on building real-world connections and meaningful interactions that go beyond digital transactions.
                        </p>
                    </div>

                    {/* Accessibility */}
                    <div className="bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 group">
                        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-8 text-green-600 group-hover:scale-110 transition-transform duration-300">
                            <Globe size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Accessibility</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Skill-sharing should be for everyone. We strive to keep our platform inclusive, welcoming, and free from financial barriers.
                        </p>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gray-900 py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-orange-600 rounded-full blur-3xl opacity-20"></div>

                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-8 tracking-tight">
                        Ready to share what you know?
                    </h2>
                    <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                        Join thousands of neighbors who are already growing their local community. Whether you're an expert or a hobbyist, your skills are needed.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link to="/register" className="inline-flex items-center justify-center px-10 py-5 border border-transparent text-lg font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-xl hover:shadow-blue-600/40 transform hover:-translate-y-1">
                            Join our Community
                        </Link>
                        <Link to="/explore" className="inline-flex items-center justify-center px-10 py-5 border-2 border-gray-700 text-lg font-bold rounded-xl text-white hover:bg-white/10 hover:border-white transition-all">
                            Browse Skills Nearby
                        </Link>
                    </div>
                </div>
            </div>
            {/* Simple Footer for About Page */}
            <div className="border-t border-gray-200 py-12 text-center">
                <div className="flex items-center justify-center gap-2 mb-8">
                    <Shield className="text-blue-600" size={24} />
                    <span className="font-bold text-xl text-gray-900">SkillSwap</span>
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

export default About;
