import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Pencil, Code, Music, Gamepad2, MoreHorizontal, Sprout, MapPin, HandHeart, Coins, Rocket } from 'lucide-react';

const AddSkill = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Tech',
        type: 'Free Exchange',
        location: ''
    });

    const categories = [
        { id: 'Tech', icon: <Code size={20} /> },
        { id: 'Music', icon: <Music size={20} /> },
        { id: 'Fitness', icon: <Gamepad2 size={20} /> }, // Using Gamepad2 as a placeholder for a 'fitness/activity' icon since Dumbbell isn't in lucide-react standard set often without extra config, Gamepad/Activity works. Let's use Activity or similar if available, or just Sprout for now if Fitness isn't working perfectly. Let's stick to the mockup names.
        { id: 'Other', icon: <MoreHorizontal size={20} /> }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const submissionData = {
                ...formData,
                type: formData.type === 'Free Exchange' ? 'Exchange' : 'Paid'
            };
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/skills`, submissionData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/dashboard');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add skill');
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100">

                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">List a New Skill</h2>
                    <p className="text-gray-500 font-medium">Share your expertise with the community and start swapping.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Skill Title */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-baseline">
                            <label className="block text-sm font-bold text-gray-700">Skill Title</label>
                            <span className="text-[11px] text-gray-400 italic">Clear & concise titles work best</span>
                        </div>
                        <div className="relative">
                            <Pencil className="absolute left-4 top-3.5 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="e.g. Guitar Lessons, Python Mentoring, Yoga Basics"
                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-gray-900 placeholder:text-gray-400 font-semibold transition-all"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-gray-700">Category</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, category: cat.id })}
                                    className={`flex flex-col items-center justify-center py-4 rounded-2xl border transition-all gap-2
                                        ${formData.category === cat.id
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                                            : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {cat.icon}
                                    <span className="text-xs font-bold">{cat.id}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-gray-700">Description</label>
                        <textarea
                            placeholder="Describe what you can offer and how you like to teach..."
                            className="w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-gray-900 placeholder:text-gray-400 font-semibold transition-all resize-none"
                            rows="5"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        ></textarea>
                    </div>

                    {/* Swap Type */}
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-gray-700">Swap Type</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Free Exchange */}
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'Free Exchange' })}
                                className={`flex items-center p-5 rounded-2xl border transition-all text-left gap-4
                                    ${formData.type === 'Free Exchange'
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                                        : 'bg-white border-gray-100 text-gray-700 hover:border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <div className={`p-2.5 rounded-full ${formData.type === 'Free Exchange' ? 'bg-white/20' : 'bg-green-50 text-green-600'}`}>
                                    <HandHeart size={20} />
                                </div>
                                <div>
                                    <span className={`block font-bold mb-0.5 ${formData.type === 'Free Exchange' ? 'text-white' : 'text-gray-900'}`}>Free Exchange</span>
                                    <span className={`block text-xs font-semibold ${formData.type === 'Free Exchange' ? 'text-blue-100' : 'text-gray-500'}`}>Knowledge for knowledge</span>
                                </div>
                            </button>

                            {/* Paid Skill */}
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'Paid Skill' })}
                                className={`flex items-center p-5 rounded-2xl border transition-all text-left gap-4
                                    ${formData.type === 'Paid Skill'
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                                        : 'bg-white border-gray-100 text-gray-700 hover:border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <div className={`p-2.5 rounded-full ${formData.type === 'Paid Skill' ? 'bg-white/20' : 'bg-blue-50 text-blue-600'}`}>
                                    <Coins size={20} />
                                </div>
                                <div>
                                    <span className={`block font-bold mb-0.5 ${formData.type === 'Paid Skill' ? 'text-white' : 'text-gray-900'}`}>Paid Skill</span>
                                    <span className={`block text-xs font-semibold ${formData.type === 'Paid Skill' ? 'text-blue-100' : 'text-gray-500'}`}>Charge a small fee</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-gray-700">Location (Optional)</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-3.5 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Leave empty to use your profile location"
                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-gray-900 placeholder:text-gray-400 font-semibold transition-all"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                        <p className="text-[11px] text-gray-400 font-medium ml-1">Setting a specific location helps locals find you faster.</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-6 space-y-3">
                        <button
                            type="submit"
                            className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2"
                        >
                            Post Skill to Marketplace
                            <Rocket size={18} />
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="w-full py-4 bg-white text-gray-600 font-bold border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSkill;

