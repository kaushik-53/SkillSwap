import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Star, Clock, MapPin, X, ArrowRight, BookOpen, Music, Camera, Code } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import RequestSwapModal from '../components/RequestSwapModal';
import { getAvatarUrl } from '../utils/imageHelpers';

const CATEGORIES = ['All Local Skills', 'Gardening', 'Coding', 'Music', 'Cooking', 'Other'];

const Explore = () => {
    const [skills, setSkills] = useState([]);
    const [search, setSearch] = useState('');
    const [location, setLocation] = useState('');
    const [activeCategory, setActiveCategory] = useState('All Local Skills');
    const [loading, setLoading] = useState(true);

    const [minRating, setMinRating] = useState('Any');
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/skills?search=${search}&location=${location}`);
                setSkills(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        const timeoutId = setTimeout(() => {
            fetchSkills();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [search, location]);

    const filteredSkills = skills.filter(skill => {
        if (activeCategory !== 'All Local Skills' && skill.category !== activeCategory) return false;

        // Dynamic rating filter
        const skillRating = parseFloat(skill.rating) || 0;
        if (minRating === '4.5' && skillRating < 4.5) return false;
        if (minRating === '4.0' && skillRating < 4.0) return false;

        return true;
    });

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || '??';
    };

    const getCategoryBg = (category) => {
        switch (category) {
            case 'Coding': return 'bg-blue-600';
            case 'Gardening': return 'bg-green-700';
            case 'Music': return 'bg-orange-600';
            case 'Cooking': return 'bg-red-700';
            default: return 'bg-indigo-600';
        }
    };

    return (
        <div className="max-w-7xl mx-auto pb-20 pt-10 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Explore Skills</h1>
                <p className="text-gray-600 text-lg font-medium">Find neighbors who can teach you something new, and share what you know.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Left Sidebar Filters */}
                <div className="w-full lg:w-72 shrink-0">
                    <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm lg:sticky lg:top-24">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-black text-gray-900">Filters</h2>
                            <button
                                onClick={() => { setSearch(''); setLocation(''); setActiveCategory('All Local Skills'); setMinRating('Any'); }}
                                className="text-blue-600 text-xs font-bold uppercase tracking-widest hover:underline"
                            >
                                Clear all
                            </button>
                        </div>

                        {/* Search & Location */}
                        <div className="mb-8 space-y-4 border-b border-gray-100 pb-8">
                            <div className="relative">
                                <Search className="absolute left-4 top-3.5 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search skills..."
                                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-sm font-semibold transition-all"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-3.5 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Location..."
                                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-sm font-semibold transition-all"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                        </div>



                        {/* Minimum Rating */}
                        <div className="mb-8 border-b border-gray-100 pb-8">
                            <h3 className="text-sm font-black text-gray-900 mb-5 tracking-tight">Minimum Rating</h3>
                            <div className="space-y-4">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input type="radio" name="rating" checked={minRating === '4.5'} onChange={() => setMinRating('4.5')} className="peer sr-only" />
                                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-blue-600 peer-checked:border-[6px] transition-all"></div>
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors flex items-center gap-1.5">4.5+ <Star size={14} className="fill-yellow-400 text-yellow-400" /></span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input type="radio" name="rating" checked={minRating === '4.0'} onChange={() => setMinRating('4.0')} className="peer sr-only" />
                                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-blue-600 peer-checked:border-[6px] transition-all"></div>
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors flex items-center gap-1.5">4.0+ <Star size={14} className="fill-yellow-400 text-yellow-400" /></span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input type="radio" name="rating" checked={minRating === 'Any'} onChange={() => setMinRating('Any')} className="peer sr-only" />
                                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-blue-600 peer-checked:border-[6px] transition-all"></div>
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">Any Rating</span>
                                </label>
                            </div>
                        </div>


                    </div>
                </div>

                {/* Right Content */}
                <div className="flex-1 min-w-0">
                    {/* Top Pill Navigation */}
                    <div className="flex overflow-x-auto pb-6 mb-4 gap-3 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${activeCategory === cat
                                    ? 'bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/20'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Skill Cards Grid */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-6"></div>
                            <p className="text-gray-500 font-bold text-lg">Finding great skills near you...</p>
                        </div>
                    ) : filteredSkills.length === 0 ? (
                        <div className="text-center py-32 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm px-6">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="text-gray-300" size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">No skills found</h3>
                            <p className="text-gray-500 font-medium mb-8 max-w-sm mx-auto">We couldn't find any skills matching your current filters. Try expanding your search area or categories.</p>
                            <button
                                onClick={() => { setSearch(''); setLocation(''); setActiveCategory('All Local Skills'); setMinRating('Any'); }}
                                className="bg-blue-50 text-blue-600 px-8 py-3.5 rounded-xl font-black hover:bg-blue-100 transition-colors"
                            >
                                Clear all filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredSkills.map(skill => (
                                <div key={skill._id} className="group flex flex-col h-full bg-white rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative">
                                    <Link to={`/user/${skill.owner?._id}`} className="block">
                                        {/* Top Banner */}
                                        <div className={`h-36 w-full ${getCategoryBg(skill.category)} relative flex flex-col items-end justify-start p-4 bg-gradient-to-br from-white/10 to-black/20 group-hover:opacity-90 transition-opacity`}>
                                            <span className="bg-white/95 backdrop-blur-md text-[9px] font-black text-gray-700 px-3 py-1.5 rounded uppercase tracking-widest shadow-sm">
                                                {skill.category}
                                            </span>
                                        </div>
                                    </Link>

                                    {/* Avatar overlapping banner */}
                                    <div className="absolute top-[104px] left-6">
                                        <div className="w-16 h-16 rounded-full border-[3px] border-white bg-white overflow-hidden shadow-md flex items-center justify-center font-bold text-xl text-gray-400">
                                            <img src={getAvatarUrl(skill.owner?.avatar, skill.owner?.name)} alt={skill.owner?.name} className="w-full h-full object-cover" />
                                        </div>
                                    </div>

                                    <div className="p-6 pt-12 flex-1 flex flex-col">
                                        {/* User Info & Rating */}
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-black text-xl text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                                                {skill.owner?.name || 'Local User'}
                                            </h3>
                                            <div className="flex items-center gap-1.5 text-xs font-black text-gray-700 bg-yellow-50 px-2 py-1 rounded-md">
                                                <Star size={12} className="fill-yellow-500 text-yellow-500" />
                                                {skill.rating || '0.0'}
                                            </div>
                                        </div>

                                        {/* Skill Title */}
                                        <h4 className="text-[13px] font-bold text-blue-500 mb-4 line-clamp-1">
                                            {skill.title}
                                        </h4>

                                        {/* Description */}
                                        <p className="text-[13px] text-gray-500 line-clamp-2 leading-relaxed mb-6 flex-1 font-medium">
                                            {skill.description}
                                        </p>

                                        {/* Location & Swap Button */}
                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 bg-gray-50 px-2.5 py-1.5 rounded-lg">
                                                <MapPin size={12} className="text-gray-400" />
                                                <span className="truncate max-w-[100px]">{skill.location || skill.owner?.location || 'Remote'}</span>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setSelectedSkill(skill);
                                                    setIsModalOpen(true);
                                                }}
                                                className="bg-blue-500 hover:bg-blue-600 text-white text-[13px] font-bold px-6 py-2.5 rounded-xl transition-colors shadow-md shadow-blue-500/20"
                                            >
                                                Swap
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Success Toast */}
                    {showSuccessToast && (
                        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] bg-gray-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
                            <div className="bg-green-500 p-1 rounded-full">
                                <CheckCircle size={16} />
                            </div>
                            <span className="font-bold text-sm">Request sent successfully!</span>
                        </div>
                    )}

                    <RequestSwapModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        skill={selectedSkill}
                        onSuccess={() => {
                            setShowSuccessToast(true);
                            setTimeout(() => setShowSuccessToast(false), 3000);
                        }}
                    />

                    {/* Load More Placeholder */}
                    {!loading && filteredSkills.length > 0 && (
                        <div className="mt-10 flex justify-center">
                            <button className="bg-white border border-gray-200 text-gray-900 font-bold text-sm px-8 py-4 rounded-2xl shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2">
                                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                Load More Providers
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Explore;
