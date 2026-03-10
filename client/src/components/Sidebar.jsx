import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Repeat,
    MessageSquare,
    User,
    Settings,
    X,
    MapPin
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: MapPin, label: 'Explore', path: '/explore' },
        { icon: Repeat, label: 'My Swaps', path: '/my-swaps' },
        { icon: MessageSquare, label: 'Messages', path: '/messages' },
        { icon: User, label: 'Profile', path: '/profile' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 fixed h-[calc(100vh-80px)] top-20 hidden lg:flex flex-col z-20">
                <div className="p-8 pb-4 flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
                        <MapPin className="text-white" size={24} />
                    </div>
                    <span className="text-2xl font-black text-blue-600 tracking-tight">SkillSwap</span>
                </div>

                <nav className="flex-1 px-4 space-y-1 mt-6">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all duration-200 ${isActive(item.path)
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <item.icon size={22} className={isActive(item.path) ? 'text-white' : 'text-gray-400'} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 mb-4 mt-auto">
                    <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 flex flex-col gap-4">
                        <div>
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Pro Plan</p>
                            <p className="text-xs text-blue-900 leading-relaxed font-medium">
                                Unlimited swaps and priority matching.
                            </p>
                        </div>
                        <button className="w-full py-2.5 bg-blue-600 text-white text-xs font-black rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20">
                            Upgrade Now
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Mobile Sidebar */}
            <aside className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-200 ease-in-out lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'} top-20 h-[calc(100vh-80px)]`}>
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg">
                            <MapPin className="text-white" size={20} />
                        </div>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">SkillSwap</span>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive(item.path)
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
