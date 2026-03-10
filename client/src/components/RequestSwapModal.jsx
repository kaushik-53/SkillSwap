import { useState } from 'react';
import { X, Send, MapPin, Star, User } from 'lucide-react';
import axios from 'axios';

const RequestSwapModal = ({ isOpen, onClose, skill, onSuccess }) => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/requests`, {
                skillId: skill._id,
                message: message
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            onSuccess();
            onClose();
            setMessage('');
        } catch (error) {
            console.error('Failed to send request:', error);
            alert(error.response?.data?.message || 'Failed to send request');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !skill) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="relative h-32 bg-blue-600 flex items-center justify-center">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <div className="text-center text-white">
                        <h2 className="text-2xl font-black tracking-tight">Request a Swap</h2>
                        <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mt-1">Connect with your neighbor</p>
                    </div>
                </div>

                <div className="p-8">
                    {/* Skill Summary Card */}
                    <div className="bg-gray-50 rounded-2xl p-5 mb-8 border border-gray-100 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                            <Star size={24} className="fill-current" />
                        </div>
                        <div>
                            <h3 className="font-black text-gray-900 leading-tight mb-1">{skill.title}</h3>
                            <div className="flex items-center gap-3">
                                <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                                    <User size={12} /> {skill.owner?.name || 'Local Provider'}
                                </span>
                                <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                                    <MapPin size={12} /> {skill.location || skill.owner?.location || 'Remote'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between items-baseline">
                                <label className="block text-sm font-bold text-gray-700">Your Message</label>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Be friendly!</span>
                            </div>
                            <textarea
                                required
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Hi! I saw your skill and would love to swap. I can offer..."
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-gray-900 placeholder:text-gray-400 font-semibold transition-all resize-none"
                                rows="4"
                            ></textarea>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-4 bg-white border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !message.trim()}
                                className="flex-2 px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none"
                            >
                                {loading ? 'Sending...' : (
                                    <>
                                        Send Request
                                        <Send size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RequestSwapModal;
