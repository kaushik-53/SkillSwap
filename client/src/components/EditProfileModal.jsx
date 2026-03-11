import { useState, useEffect } from 'react';
import { X, Save, UploadCloud, Plus, Trash2, Loader2, Sparkles, User, MapPin, AlignLeft, Target } from 'lucide-react';
import axios from 'axios';

const EditProfileModal = ({ isOpen, onClose, user, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        about: '',
        avatar: '',
        skillsWanted: []
    });

    const [newWanted, setNewWanted] = useState({ title: '', description: '' });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                location: user.location || '',
                about: user.about || user.bio || '',
                avatar: user.avatar || '',
                skillsWanted: user.skillsWanted || []
            });
        }
    }, [user, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/upload`, uploadData, config);

            // Save the URL returned by the server — now a full Cloudinary HTTPS URL
            // getAvatarUrl() handles both relative paths and full https:// URLs
            setFormData(prev => ({
                ...prev,
                avatar: res.data
            }));
        } catch (error) {
            console.error('File upload error:', error.response?.data || error.message);
            alert(`Failed to upload image: ${error.response?.data?.message || 'Server Error'}`);
        }
    };

    const addWantedSkill = () => {
        if (!newWanted.title.trim()) return;
        setFormData(prev => ({
            ...prev,
            skillsWanted: [...prev.skillsWanted, { ...newWanted, tags: [] }]
        }));
        setNewWanted({ title: '', description: '' });
    };

    const removeWantedSkill = (index) => {
        setFormData(prev => ({
            ...prev,
            skillsWanted: prev.skillsWanted.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error("Save error:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">

                {/* Header with Gradient */}
                <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-700 p-8 flex items-end justify-between">
                    <div className="absolute top-4 right-4">
                        <button
                            onClick={onClose}
                            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/10 backdrop-blur-sm"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="flex items-center gap-3 text-white">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md border border-white/20">
                            <Sparkles size={24} className="text-blue-100" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight">Refine Your Profile</h2>
                            <p className="text-blue-100 text-sm font-medium opacity-80">Make your presence shine in the community</p>
                        </div>
                    </div>
                </div>

                {/* Main Scrollable Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                    <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-8">

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Basic Info */}
                            <div className="space-y-6">
                                <section className="space-y-4">
                                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                                        <User size={14} className="text-blue-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Basic Identity</span>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-xs font-black text-gray-500 uppercase ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed font-bold"
                                            disabled
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-xs font-black text-gray-500 uppercase ml-1">Your Location</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-gray-700 bg-white shadow-sm hover:border-gray-200"
                                                placeholder="e.g. Brooklyn, NY"
                                            />
                                            <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                                        <AlignLeft size={14} className="text-blue-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Storytelling</span>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-xs font-black text-gray-500 uppercase ml-1">About Me</label>
                                        <textarea
                                            name="about"
                                            value={formData.about}
                                            onChange={handleChange}
                                            rows="4"
                                            className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-medium text-gray-600 bg-white shadow-sm resize-none leading-relaxed hover:border-gray-200"
                                            placeholder="Tell your neighbors about your journey, interests, and how you love to help..."
                                        ></textarea>
                                    </div>
                                </section>
                            </div>

                            {/* Avatar & Photo */}
                            <div className="space-y-6">
                                <section className="space-y-4">
                                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                                        <UploadCloud size={14} className="text-blue-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Visual Identity</span>
                                    </div>
                                    <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100/50 flex flex-col items-center gap-4">
                                        <div className="relative group">
                                            <img
                                                src={formData.avatar || `https://ui-avatars.com/api/?name=${formData.name}&background=random&size=128`}
                                                alt="Profile preview"
                                                className="w-24 h-24 rounded-3xl object-cover ring-4 ring-white shadow-xl transition-transform group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                                <UploadCloud size={24} className="text-white" />
                                            </div>
                                        </div>
                                        <input
                                            id="avatar-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="avatar-upload"
                                            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm transition-all active:scale-95"
                                        >
                                            Change Photo
                                        </label>
                                    </div>
                                </section>

                                {/* Skills Wanted Section inside form */}
                                <section className="space-y-4">
                                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                                        <Target size={14} className="text-orange-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Growth Goals (Skills I Want)</span>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex flex-wrap gap-2">
                                            {formData.skillsWanted.map((skill, index) => (
                                                <div key={index} className="flex items-center gap-2 bg-orange-50 text-orange-700 pl-3 pr-1.5 py-1.5 rounded-full border border-orange-100 hover:border-orange-200 transition-all animate-in slide-in-from-left-2 shadow-sm">
                                                    <span className="text-xs font-bold leading-none">{skill.title}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeWantedSkill(index)}
                                                        className="p-1 hover:bg-orange-200 rounded-full transition-colors text-orange-400 hover:text-orange-700"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                            {formData.skillsWanted.length === 0 && (
                                                <p className="text-[11px] text-gray-400 italic py-2">Add skills you'd love to learn from others...</p>
                                            )}
                                        </div>

                                        <div className="p-4 bg-gray-50 rounded-2xl space-y-3 border border-gray-100/50">
                                            <input
                                                type="text"
                                                placeholder="E.g. Digital Marketing"
                                                value={newWanted.title}
                                                onChange={(e) => setNewWanted({ ...newWanted, title: e.target.value })}
                                                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                            />
                                            <button
                                                type="button"
                                                onClick={addWantedSkill}
                                                disabled={!newWanted.title.trim()}
                                                className="w-full py-2 bg-blue-600 text-white font-black text-[10px] rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:grayscale uppercase tracking-widest"
                                            >
                                                <Plus size={14} /> Add Skill
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Sticky Footer Actions */}
                <div className="p-8 border-t border-gray-100 bg-gray-50/80 backdrop-blur-sm flex gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-4 bg-white text-gray-700 font-black rounded-3xl hover:bg-gray-100 transition-all border border-gray-200 shadow-sm active:scale-[0.98]"
                    >
                        Keep as is
                    </button>
                    <button
                        form="edit-profile-form"
                        type="submit"
                        disabled={isSaving}
                        className="flex-[2] px-6 py-4 bg-blue-600 text-white font-black rounded-3xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/25 active:scale-[0.98] disabled:opacity-70"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Securing Changes...</span>
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                <span>Save My Updates</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            <style sx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </div>
    );
};

export default EditProfileModal;
