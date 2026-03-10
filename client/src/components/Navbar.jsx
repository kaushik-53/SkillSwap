import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { getAvatarUrl } from '../utils/imageHelpers';
import { LogOut, User, Menu, X, MapPin } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMenuOpen(false);
    };

    const navLinks = [
        { name: 'HOME', path: '/' },
        { name: 'ABOUT US', path: '/about', publicOnly: true },
        { name: 'SAFETY', path: '/safety', publicOnly: true },
        { name: 'EXPLORE SKILLS', path: '/explore' },
        { name: 'DASHBOARD', path: '/dashboard', private: true },
        { name: 'POST A SKILL', path: '/add-skill', private: true },
    ];

    return (
        <nav
            className={`fixed w-full z-50 top-0 start-0 border-b border-gray-100 transition-all duration-300 ${scrolled ? 'shadow-sm py-3' : 'py-4'}`}
            style={{ background: 'linear-gradient(45deg, #ffe0df 0.000%, #ffe8db 5.000%, #ffefd7 10.000%, #fff6d4 15.000%, #fffcd1 20.000%, #ffffd0 25.000%, #ffffce 30.000%, #ffffce 35.000%, #ffffce 40.000%, #ffffcf 45.000%, #ffffd1 50.000%, #ffffd4 55.000%, #ffffd7 60.000%, #fffcdb 65.000%, #fcf7df 70.000%, #f3f0e4 75.000%, #ebe9e9 80.000%, #e3e1ef 85.000%, #dcd8f4 90.000%, #d4cffa 95.000%, #cec6ff 100.000%)' }}
        >
            <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="p-1.5 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
                        <MapPin size={22} className="text-white" />
                    </div>
                    <span className="self-center text-2xl font-black text-gray-900 tracking-tighter">SkillSwap</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-10">
                    {navLinks.map((link) => (
                        ((!link.private || user) && (!link.publicOnly || !user)) && (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-[12px] font-black tracking-widest transition-all duration-200 hover:text-blue-600 ${location.pathname === link.path ? 'text-blue-600' : 'text-gray-500'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        )
                    ))}
                </div>

                {/* Auth / Profile Area */}
                <div className="hidden md:flex items-center gap-6">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors font-bold text-sm group cursor-pointer">
                                {user?.name ? (
                                    <img src={getAvatarUrl(user.avatar, user.name)} alt={user.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent group-hover:ring-blue-100 transition-all" />
                                ) : (
                                    <User size={18} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                                )}
                                <span className="capitalize">{user?.name ? user.name.split(' ')[0].toLowerCase() : 'user'}</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-[#ff4d4d] hover:bg-[#ff3333] text-white px-5 py-2.5 rounded-lg text-sm font-black transition-all shadow-md shadow-red-500/20"
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-6">
                            <Link to="/login" className="text-sm font-black text-gray-900 hover:text-blue-600 transition-colors">Login</Link>
                            <Link
                                to="/register"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-black transition-all shadow-lg shadow-blue-600/20"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="w-full md:hidden pt-4 pb-2">
                        <div className="flex flex-col space-y-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            {navLinks.map((link) => (
                                ((!link.private || user) && (!link.publicOnly || !user)) && (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="py-3 px-4 text-sm font-black text-gray-900 rounded-xl hover:bg-white hover:text-blue-600 transition-all border border-transparent hover:border-gray-100"
                                    >
                                        {link.name}
                                    </Link>
                                )
                            ))}
                            <div className="pt-4 border-t border-gray-200 mt-2">
                                {user ? (
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-center py-3.5 bg-red-50 text-red-600 font-black rounded-xl hover:bg-red-100 transition-all"
                                    >
                                        Logout
                                    </button>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        <Link
                                            to="/login"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="text-center py-3.5 text-gray-900 bg-white border border-gray-200 rounded-xl font-black"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="text-center py-3.5 text-white bg-blue-600 rounded-xl font-black"
                                        >
                                            Get Started
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};
export default Navbar;
