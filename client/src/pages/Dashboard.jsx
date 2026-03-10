import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { getAvatarUrl } from '../utils/imageHelpers';
import { Link } from 'react-router-dom';
import {
    Repeat,
    MessageSquare,
    Zap,
    MapPin,
    Star,
    Plus,
    Bell,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    Camera,
    Utensils,
    Monitor,
    Rocket
} from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [activeSwaps, setActiveSwaps] = useState([]);
    const [stats, setStats] = useState({
        completed: 0,
        rating: 0.0
    });
    const [recommendedSkills, setRecommendedSkills] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                // 1. Fetch Requests & Process Active Swaps
                const reqRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/requests`, config);
                const received = reqRes.data.received || [];
                const sent = reqRes.data.sent || [];
                const all = [...received, ...sent];

                // Active = Accepted, Sorted by newest
                const active = all.filter(r => r.status === 'Accepted')
                    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                    .slice(0, 2);
                setActiveSwaps(active);

                // 2. Fetch Stats & Reviews
                // For demo/prototype, we'll derive some from the requests
                const completed = all.filter(r => r.status === 'Completed').length;

                let rating = '0.0';
                try {
                    const reviewRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews/${user?._id}`);
                    if (reviewRes.data.length > 0) {
                        const sum = reviewRes.data.reduce((acc, r) => acc + r.rating, 0);
                        rating = (sum / reviewRes.data.length).toFixed(1);
                    }
                } catch (e) {
                    console.log("No reviews found yet");
                }

                setStats({
                    completed: completed,
                    rating: rating
                });

                // 3. Fetch Recommended
                const skillsRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/skills`);
                const others = skillsRes.data.filter(s => s.owner?._id !== user?._id).slice(0, 3);
                setRecommendedSkills(others);

                // 4. Notifications (Pending Requests + Recent updates)
                const pending = received.filter(r => r.status === 'Pending').slice(0, 3);
                setNotifications(pending.map(p => ({
                    id: p._id,
                    type: 'request',
                    senderName: p.sender?.name || 'User',
                    skillTitle: p.skill?.title || 'Skill',
                    title: `New swap request from ${p.sender?.name?.split(' ')[0]}`,
                    subtitle: `"${p.message?.substring(0, 30)}..."`,
                    time: 'Recent',
                    icon: <Bell size={16} className="text-blue-600" />
                })));

            } catch (error) {
                console.error("Dashboard error:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchData();
    }, [user]);

    const handleRequestStatus = async (requestId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/requests/${requestId}`, { status: newStatus }, config);

            // Refresh data
            window.location.reload();
        } catch (error) {
            console.error("Failed to update request:", error);
            alert("Action failed. Please try again.");
        }
    };

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || '??';
    };

    if (loading) return <div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-3">
                    Welcome back, <span className="text-blue-600 italic">{user?.name?.split(' ')[0] || 'Okay'}!</span> 👋
                </h1>
                <p className="text-gray-500 font-bold text-lg">You have {activeSwaps.length} swap sessions scheduled.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-16">

                    {/* Active Swaps Section */}
                    <section>
                        <div className="flex justify-start items-center gap-3 mb-8">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">My Active Swaps</h2>
                            <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{activeSwaps.length} ONGOING</span>
                            <div className="ml-auto">
                                <Link to="/my-swaps" className="text-blue-600 font-black text-sm flex items-center gap-1 hover:gap-2 transition-all">
                                    View history <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {activeSwaps.length > 0 ? activeSwaps.map((swap, idx) => {
                                const partner = swap.receiver?._id === user?._id ? swap.sender : swap.receiver;
                                return (
                                    <div key={swap._id} className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full relative">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex -space-x-2">
                                                {/* Partner Avatar */}
                                                <div className="relative z-10 w-16 h-16 rounded-full border-4 border-white shadow-sm overflow-hidden bg-white group-hover:scale-105 transition-transform">
                                                    <img src={getAvatarUrl(partner.avatar, partner.name)} alt={partner.name} className="w-full h-full object-cover" />
                                                </div>
                                                {/* Current User Avatar */}
                                                <div className="relative z-0 w-12 h-12 -ml-6 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gray-50 opacity-90 group-hover:translate-x-2 transition-transform">
                                                    <img src={getAvatarUrl(user.avatar, user.name)} alt={user.name} className="w-full h-full object-cover grayscale opacity-70" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="text-lg font-black text-gray-900 mb-1">{swap.skill?.title}</h3>
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-6">
                                                <Repeat size={12} className="text-gray-300" />
                                                <span>Trading for: <span className="text-gray-900">{swap.offeredSkill?.title || 'Web Development'}</span></span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center mt-2 pt-6">
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors cursor-pointer">
                                                <MessageSquare size={16} className="fill-current text-gray-300" />
                                            </div>
                                            <Link to={`/requests/${swap._id}`} className={`px-6 py-2 rounded-xl text-sm font-black text-center transition-all ${idx === 0 ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20' : 'bg-gray-900 text-white hover:bg-black shadow-lg shadow-gray-900/20'}`}>
                                                {idx === 0 ? 'Join Session' : 'View Details'}
                                            </Link>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="col-span-2 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-[1.5rem] p-12 text-center">
                                    <p className="text-gray-400 font-bold mb-4">No active swaps yet.</p>
                                    <Link to="/explore" className="inline-block bg-white text-blue-600 px-6 py-2.5 rounded-xl font-black shadow-sm border border-gray-100">Browse Skills</Link>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Recommended for You Section */}
                    <section>
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Recommended for You</h2>
                            <div className="flex gap-2">
                                <button className="p-2 bg-white border border-gray-100 rounded-full text-gray-400 hover:text-blue-600 transition-all shadow-sm"><ChevronLeft size={20} /></button>
                                <button className="p-2 bg-white border border-gray-100 rounded-full text-gray-400 hover:text-blue-600 transition-all shadow-sm"><ChevronRight size={20} /></button>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {recommendedSkills.map((skill, idx) => {
                                const Icon = idx === 0 ? Camera : idx === 1 ? Utensils : Monitor;
                                return (
                                    <div key={skill._id} className="bg-white rounded-[1.25rem] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300">
                                        <div className={`h-32 flex items-center justify-start p-4 ${idx === 0 ? 'bg-purple-400' : idx === 1 ? 'bg-orange-400' : 'bg-blue-400'}`}>
                                            <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                                <Icon size={20} className="text-white" />
                                            </div>
                                        </div>
                                        <div className="p-5 flex flex-col">
                                            <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors truncate w-full">{skill.title}</h3>
                                            <div className="flex items-center gap-1 text-[11px] font-bold text-gray-900 mb-5">
                                                <Star size={12} className="text-yellow-400 fill-yellow-400" /> {skill.rating || '0.0'}
                                            </div>
                                            <Link to="/explore" className="w-full text-xs font-bold text-blue-600 bg-blue-50 py-3 rounded-lg hover:bg-blue-100 transition-all uppercase tracking-widest text-center">
                                                Browse Explore
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Notifications Section - Integrated into main content for better visibility */}
                    <section>
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Recent Notifications</h2>
                            {notifications.length > 0 && (
                                <span className="bg-red-100 text-red-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{notifications.length} NEW</span>
                            )}
                        </div>

                        <div className="space-y-4">
                            {notifications.length > 0 ? notifications.map((notif) => (
                                <div key={notif.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                                            {notif.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-gray-900 mb-1">{notif.title}</h4>
                                            <p className="text-sm text-gray-500 font-medium mb-1">Skill: <span className="text-blue-600 font-bold">{notif.skillTitle}</span></p>
                                            <p className="text-xs text-gray-400 italic">{notif.subtitle}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleRequestStatus(notif.id, 'Rejected')}
                                            className="px-6 py-2.5 bg-gray-50 text-gray-500 font-bold text-sm rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
                                        >
                                            Decline
                                        </button>
                                        <button
                                            onClick={() => handleRequestStatus(notif.id, 'Accepted')}
                                            className="px-6 py-2.5 bg-blue-600 text-white font-black text-sm rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all"
                                        >
                                            Accept
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-12 text-center">
                                    <p className="text-gray-400 font-bold">No new notifications.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Sidebar Column */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Quick Stats Widget */}
                    <div className="bg-[#f4f7fe] rounded-[2rem] p-6 border border-gray-100">
                        <h3 className="text-xl font-black text-gray-900 mb-6 tracking-tight">Quick Stats</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center">
                                <p className="text-[2.5rem] leading-none font-black text-blue-600 mb-3 tracking-tighter">{stats.completed}</p>
                                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest text-center">Completed<br />Swaps</p>
                            </div>
                            <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center">
                                <div className="flex items-center gap-1 text-[2.5rem] leading-none font-black text-gray-900 mb-3 tracking-tighter">
                                    {stats.rating} <Star size={18} className="fill-yellow-400 text-yellow-400" />
                                </div>
                                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest text-center">Avg<br />Rating</p>
                            </div>
                        </div>
                    </div>

                    {/* Grow the Circle CTA */}
                    <Link to="/add-skill" className="block bg-blue-600 rounded-[2rem] p-8 text-center text-white shadow-xl shadow-blue-500/20 group relative overflow-hidden flex flex-col items-center justify-center">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-10 -mt-20 blur-2xl"></div>
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500 rounded-full -mr-10 -mb-10 blur-xl opacity-50"></div>

                        <div className="relative z-10 w-full flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-5 border border-white/20 group-hover:scale-110 transition-transform">
                                <Rocket size={20} className="text-white fill-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Grow the Circle</h3>
                            <p className="text-[13px] text-blue-100 mb-8 leading-relaxed max-w-[220px]">Share a new skill today and connect with your local community.</p>
                            <div className="w-full bg-white text-blue-600 py-3 rounded-xl text-sm font-bold hover:bg-blue-50 transition-all uppercase tracking-widest">
                                Post New Skill
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Footer mockup as per visual */}
            <div className="pt-20 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6 opacity-40">
                <div className="flex items-center gap-2 font-bold text-sm text-gray-400">
                    <MapPin size={16} /> SkillSwap © {new Date().getFullYear()}
                </div>
                <div className="flex gap-8 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                    <Link to="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
                    <Link to="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
                    <Link to="/help" className="hover:text-gray-900 transition-colors">Help Center</Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
