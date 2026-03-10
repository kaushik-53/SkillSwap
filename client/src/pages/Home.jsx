import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Search, Play, CheckCircle, Edit, MessageSquare, Handshake } from 'lucide-react';
import Footer from '../components/Footer';
import AuthContext from '../context/AuthContext';

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-white">

            {/* Hero Section */}
            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Left Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
                            Unlock Local Talent. <br />
                            <span className="text-blue-600">Exchange Skills.</span> <br />
                            Build Trust.
                        </h1>

                        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            Join a secure marketplace where you trade your expertise for what you need. Save money, learn something new, and strengthen your community.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            {user ? (
                                <Link to="/explore" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 text-center">
                                    Browse Skills
                                </Link>
                            ) : (
                                <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 text-center">
                                    Get Started
                                </Link>
                            )}
                            <button
                                onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
                                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-xl border border-gray-200 transition-all text-center"
                            >
                                How it Works
                            </button>
                        </div>
                    </div>

                    {/* Right Content - Visual */}
                    <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
                        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-[#7C9F6E] flex items-center justify-center">
                            {/* Abstract decorative elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-16 -mb-16"></div>

                            {/* Card Content */}
                            <div className="text-center z-10 p-8">
                                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-widest mb-2">SKILLSWAP</h2>
                                <p className="text-white/80 font-mono tracking-[0.3em] text-sm md:text-base uppercase">Virtual Skill Community</p>
                            </div>

                            {/* Leaf/Organic Shapes (CSS simulation) */}
                            <div className="absolute top-4 right-4 text-white/20">
                                <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C7 2 3 7 3 12s5 10 10 10 10-5 10-10S17 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>
                            </div>
                            <div className="absolute bottom-12 left-8 text-white/10 rotate-45">
                                <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2z" /></svg>
                            </div>
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4 max-w-xs animate-bounce-slow">
                            <div className="bg-green-100 p-3 rounded-full text-green-600">
                                <Shield size={24} className="fill-green-600" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">100% Verified</p>
                                <p className="text-xs text-gray-500">Background checked users</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* How it Works Section */}
            <div id="how-it-works" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How it Works</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                            Trading skills is simpler than you think. Join our network and start exchanging today.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        {/* Step 1 */}
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6">
                                <Edit size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Post a Skill or Need</h3>
                            <p className="text-gray-500 leading-relaxed">
                                List what you can teach (e.g., Guitar lessons) or what you're looking to learn in our secure marketplace.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300">
                            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-6">
                                <MessageSquare size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Connect with Neighbors</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Message verified residents in your local area through our encrypted chat system to discuss terms.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
                                <Handshake size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Swap & Strengthen</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Meet up locally to exchange knowledge, save money, and build lasting friendships in your neighborhood.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden text-center p-12 md:p-20 relative">
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">Ready to Swap Your First Skill?</h2>
                        <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto">
                            Join your local neighborhood group and see what skills are available today.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                            {user ? (
                                <Link to="/add-skill" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20">
                                    Share a Skill
                                </Link>
                            ) : (
                                <Link to="/register" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20">
                                    Get Started Now
                                </Link>
                            )}
                            <button
                                onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
                                className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-xl border border-gray-200 transition-all"
                            >
                                Learn More
                            </button>
                        </div>

                        <div className="inline-flex items-center gap-2 text-gray-500 text-sm font-medium">
                            <CheckCircle size={16} className="text-green-500" />
                            <span>Free to join. No hidden fees.</span>
                        </div>
                    </div>

                    {/* Background decorations */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-gray-50/50 -z-0"></div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Home;