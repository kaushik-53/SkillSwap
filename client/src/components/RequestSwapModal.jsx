import { useState } from 'react';
import { X, Send, MapPin, Star, User, Repeat, Coins, CreditCard } from 'lucide-react';
import axios from 'axios';

const EXCHANGE_TYPES = [
    {
        id: 'SkillSwap',
        label: 'Direct Swap',
        icon: '🔄',
        description: 'Free mutual skill exchange — no money, no credits.',
        color: 'border-blue-200 bg-blue-50 text-blue-700',
        selected: 'border-blue-500 bg-blue-100 ring-2 ring-blue-300',
    },
    {
        id: 'SkillCredits',
        label: 'SkillCredits (1 Credit)',
        icon: '🪙',
        description: 'Spend 1 SkillCredit from your virtual wallet.',
        color: 'border-amber-200 bg-amber-50 text-amber-700',
        selected: 'border-amber-500 bg-amber-100 ring-2 ring-amber-300',
    },
    {
        id: 'PaidUPI',
        label: 'Paid (UPI / ₹)',
        icon: '💳',
        description: "Pay the mentor's set rate via GPay, PhonePe or any UPI app.",
        color: 'border-green-200 bg-green-50 text-green-700',
        selected: 'border-green-500 bg-green-100 ring-2 ring-green-300',
    },
];

const RequestSwapModal = ({ isOpen, onClose, skill, onSuccess }) => {
    const [message, setMessage] = useState('');
    const [exchangeType, setExchangeType] = useState('SkillSwap');
    const [agreedAmount, setAgreedAmount] = useState(skill?.owner?.hourlyRate || 0);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/requests`, {
                skillId: skill._id,
                message,
                exchangeType,
                agreedAmount: exchangeType === 'PaidUPI' ? Number(agreedAmount) : exchangeType === 'SkillCredits' ? 1 : 0,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            onSuccess();
            onClose();
            setMessage('');
            setExchangeType('SkillSwap');
        } catch (error) {
            console.error('Failed to send request:', error);
            alert(error.response?.data?.message || 'Failed to send request');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !skill) return null;

    const mentorRate = skill.owner?.hourlyRate;
    const mentorUpi = skill.owner?.upiId;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[92vh] flex flex-col">
                {/* Header */}
                <div className="relative h-32 bg-blue-600 flex items-center justify-center shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <div className="text-center text-white">
                        <h2 className="text-2xl font-black tracking-tight">Request a Swap</h2>
                        <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mt-1">Choose how you'd like to exchange</p>
                    </div>
                </div>

                <div className="p-8 overflow-y-auto flex-1">
                    {/* Skill Summary Card */}
                    <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                            <Star size={24} className="fill-current" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-black text-gray-900 leading-tight mb-1">{skill.title}</h3>
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                                    <User size={12} /> {skill.owner?.name || 'Local Provider'}
                                </span>
                                <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                                    <MapPin size={12} /> {skill.location || skill.owner?.location || 'Remote'}
                                </span>
                                {mentorRate > 0 && (
                                    <span className="text-[11px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                                        ₹{mentorRate}/hr
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Exchange Type Selector */}
                    <div className="mb-6">
                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">How would you like to exchange?</p>
                        <div className="space-y-2">
                            {EXCHANGE_TYPES.map((type) => {
                                const isSelected = exchangeType === type.id;
                                // Hide UPI option if mentor hasn't set a UPI ID
                                if (type.id === 'PaidUPI' && !mentorUpi) return null;
                                return (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => {
                                            setExchangeType(type.id);
                                            if (type.id === 'PaidUPI') setAgreedAmount(mentorRate || 0);
                                        }}
                                        className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-start gap-3 ${
                                            isSelected ? type.selected : type.color
                                        }`}
                                    >
                                        <span className="text-lg mt-0.5">{type.icon}</span>
                                        <div className="flex-1">
                                            <p className="text-xs font-black">{type.label}</p>
                                            <p className="text-[11px] opacity-75 mt-0.5">{type.description}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Custom amount for paid sessions */}
                    {exchangeType === 'PaidUPI' && (
                        <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4">
                            <label className="block text-xs font-black text-gray-600 uppercase mb-2">
                                Agreed Amount (₹)
                            </label>
                            <input
                                type="number"
                                min={1}
                                value={agreedAmount}
                                onChange={(e) => setAgreedAmount(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white font-bold text-gray-800"
                                placeholder={`Mentor's rate: ₹${mentorRate || 0}/hr`}
                            />
                            {mentorUpi && (
                                <p className="text-[11px] text-green-700 mt-2">
                                    Payment will be directed to: <strong>{mentorUpi}</strong>
                                </p>
                            )}
                        </div>
                    )}

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
                                rows="3"
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
