import { Link } from 'react-router-dom';
import { MapPin, Mail, Globe, Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-white pt-12 pb-8 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
                    {/* Brand */}
                    <div className="text-center md:text-left">
                        <Link to="/" onClick={scrollToTop} className="inline-flex items-center gap-2 group mb-2">
                            <MapPin size={24} className="text-blue-600" />
                            <span className="text-xl font-bold text-gray-900">SkillSwap</span>
                        </Link>
                        <p className="text-gray-500 text-sm max-w-xs mx-auto md:mx-0">
                            Connecting communities across India to share skills and grow together.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-gray-600">
                        <Link to="/explore" className="hover:text-blue-600 transition-colors">Explore Skills</Link>
                        <Link to="/about" className="hover:text-blue-600 transition-colors">About</Link>
                        <Link to="/safety" className="hover:text-blue-600 transition-colors">Safety</Link>
                        <Link to="/terms" className="hover:text-blue-600 transition-colors">Terms</Link>
                        <Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy</Link>
                    </div>

                    {/* Socials */}
                    <div className="flex gap-4">
                        <a href="#" className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"><Twitter size={18} /></a>
                        <a href="#" className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-pink-600 hover:bg-pink-50 transition-all"><Instagram size={18} /></a>
                        <a href="#" className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-blue-700 hover:bg-blue-50 transition-all"><Linkedin size={18} /></a>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
                    <p>
                        © {new Date().getFullYear()} SkillSwap. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 font-medium text-gray-500">
                        <span className="flex items-center gap-1.5"><Heart size={12} className="text-red-500 fill-red-500" /> Made in India</span>
                        <span className="flex items-center gap-1.5"><Globe size={12} /> English (IN)</span>
                        <span className="flex items-center gap-1.5">₹ INR</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
