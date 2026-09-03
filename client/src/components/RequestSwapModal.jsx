import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, MapPin, Star, User, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const EXCHANGE_TYPES = [
    {
        id: 'SkillSwap',
        emoji: '🔄',
        label: 'Direct Swap',
        description: 'Free — mutual skill exchange, no money.',
        accent: '#3b82f6',
        bg: '#eff6ff',
        border: '#bfdbfe',
        selectedBorder: '#3b82f6',
    },
    {
        id: 'SkillCredits',
        emoji: '🪙',
        label: 'SkillCredits',
        description: 'Spend 1 credit from your virtual wallet.',
        accent: '#d97706',
        bg: '#fffbeb',
        border: '#fde68a',
        selectedBorder: '#d97706',
    },
    {
        id: 'PaidUPI',
        emoji: '💳',
        label: 'Paid — UPI / ₹',
        description: 'Pay the mentor directly via GPay / PhonePe.',
        accent: '#16a34a',
        bg: '#f0fdf4',
        border: '#bbf7d0',
        selectedBorder: '#16a34a',
    },
];

const RequestSwapModal = ({ isOpen, onClose, skill, onSuccess }) => {
    const [message, setMessage] = useState('');
    const [exchangeType, setExchangeType] = useState('SkillSwap');
    const [agreedAmount, setAgreedAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const mentorUpi = skill?.owner?.upiId || '';
    const mentorRate = skill?.owner?.hourlyRate || 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        // Validate UPI selection
        if (exchangeType === 'PaidUPI' && !mentorUpi) {
            setError('This mentor has not added a UPI ID yet. Ask them to update their profile, or choose another payment method.');
            return;
        }
        if (exchangeType === 'PaidUPI' && (!agreedAmount || Number(agreedAmount) <= 0)) {
            setError('Please enter a valid agreed amount in ₹.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/requests`,
                {
                    skillId: skill._id,
                    message,
                    exchangeType,
                    agreedAmount:
                        exchangeType === 'PaidUPI' ? Number(agreedAmount) :
                        exchangeType === 'SkillCredits' ? 1 : 0,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onSuccess?.();
            onClose();
            setMessage('');
            setExchangeType('SkillSwap');
            setAgreedAmount('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send request');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !skill) return null;

    const modal = (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="swap-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 9999,
                        background: 'rgba(0,0,0,0.55)',
                        backdropFilter: 'blur(6px)',
                        WebkitBackdropFilter: 'blur(6px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: 16,
                    }}
                >
                    <motion.div
                        key="swap-panel"
                        initial={{ opacity: 0, y: 24, scale: 0.94 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.96 }}
                        transition={{ type: 'spring', stiffness: 340, damping: 28 }}
                        style={{
                            background: '#ffffff',
                            borderRadius: 24,
                            width: '100%',
                            maxWidth: 480,
                            maxHeight: '92vh',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 32px 80px rgba(0,0,0,0.25)',
                            overflow: 'hidden',
                        }}
                    >
                        {/* ── Header ── */}
                        <div style={{
                            background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                            padding: '24px 24px 20px',
                            flexShrink: 0,
                            position: 'relative',
                        }}>
                            <button
                                onClick={onClose}
                                style={{
                                    position: 'absolute', top: 16, right: 16,
                                    background: 'rgba(255,255,255,0.15)',
                                    border: 'none', borderRadius: 10,
                                    color: '#fff', cursor: 'pointer',
                                    padding: '6px 8px', display: 'flex', alignItems: 'center',
                                }}
                            >
                                <X size={18} />
                            </button>
                            <h2 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 800, fontSize: 22, color: '#fff', margin: '0 0 4px' }}>
                                Request a Swap
                            </h2>
                            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', margin: 0 }}>
                                CHOOSE HOW YOU'D LIKE TO EXCHANGE
                            </p>
                        </div>

                        {/* ── Scrollable body ── */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 24px', scrollbarWidth: 'thin' }}>

                            {/* Skill card */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 14,
                                background: '#f8fafc', border: '1px solid #e2e8f0',
                                borderRadius: 16, padding: '14px 16px', marginBottom: 20,
                            }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: 12,
                                    background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <Star size={20} color="#3b82f6" fill="#3b82f6" />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 800, fontSize: 15, color: '#0f172a', margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {skill.title}
                                    </p>
                                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#64748b' }}>
                                            <User size={11} /> {skill.owner?.name || 'Provider'}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#64748b' }}>
                                            <MapPin size={11} /> {skill.location || skill.owner?.location || 'Remote'}
                                        </span>
                                        {mentorRate > 0 && (
                                            <span style={{
                                                fontSize: 11, fontWeight: 700, color: '#16a34a',
                                                background: '#dcfce7', padding: '2px 8px', borderRadius: 20,
                                                border: '1px solid #bbf7d0',
                                            }}>
                                                ₹{mentorRate} base rate
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Exchange type selector */}
                            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: '#94a3b8', letterSpacing: '0.12em', margin: '0 0 10px' }}>
                                HOW WOULD YOU LIKE TO EXCHANGE?
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                                {EXCHANGE_TYPES.map((type) => {
                                    const isSelected = exchangeType === type.id;
                                    const isUpiDisabled = type.id === 'PaidUPI' && !mentorUpi;
                                    return (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => {
                                                setExchangeType(type.id);
                                                setError('');
                                                if (type.id === 'PaidUPI') setAgreedAmount(mentorRate || '');
                                            }}
                                            style={{
                                                width: '100%', textAlign: 'left',
                                                padding: '12px 14px',
                                                borderRadius: 12,
                                                border: `2px solid ${isSelected ? type.selectedBorder : type.border}`,
                                                background: isSelected ? type.bg : '#fff',
                                                cursor: 'pointer',
                                                display: 'flex', alignItems: 'flex-start', gap: 12,
                                                transition: 'all 0.18s ease',
                                                boxShadow: isSelected ? `0 0 0 3px ${type.accent}20` : 'none',
                                                opacity: isUpiDisabled ? 0.5 : 1,
                                            }}
                                        >
                                            <span style={{ fontSize: 20, lineHeight: 1, marginTop: 2, flexShrink: 0 }}>{type.emoji}</span>
                                            <div>
                                                <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: isSelected ? type.accent : '#1e293b' }}>
                                                    {type.label}
                                                    {isUpiDisabled && <span style={{ fontWeight: 400, fontSize: 11, color: '#94a3b8', marginLeft: 6 }}>— Mentor UPI not set</span>}
                                                </p>
                                                <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>
                                                    {type.description}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {exchangeType === 'PaidUPI' && (
                                <div style={{
                                    background: '#f0fdf4', border: '1px solid #bbf7d0',
                                    borderRadius: 14, padding: '14px 16px', marginBottom: 16,
                                }}>
                                    <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: '#16a34a', letterSpacing: '0.1em', margin: '0 0 6px' }}>
                                        TOTAL SESSION COST (₹)
                                    </p>
                                    <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 10px', lineHeight: 1.5 }}>
                                        Enter the <strong>total agreed price</strong> for this entire engagement
                                        {mentorRate > 0 && <> (mentor’s base rate is <strong>₹{mentorRate}</strong> — use as a reference)</>}.
                                    </p>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: 14 }}>₹</span>
                                        <input
                                            type="number"
                                            min={1}
                                            value={agreedAmount}
                                            onChange={(e) => setAgreedAmount(e.target.value)}
                                            placeholder={mentorRate > 0 ? `e.g. ₹${mentorRate} (base) or more for multi-session` : 'e.g. ₹500 total'}
                                            style={{
                                                width: '100%', paddingLeft: 28, paddingRight: 12,
                                                paddingTop: 10, paddingBottom: 10,
                                                borderRadius: 10, border: '1px solid #bbf7d0',
                                                background: '#fff', fontSize: 14, fontWeight: 700,
                                                color: '#0f172a', outline: 'none', boxSizing: 'border-box',
                                            }}
                                        />
                                    </div>
                                    {mentorUpi && (
                                        <p style={{ fontSize: 11, color: '#16a34a', margin: '8px 0 0' }}>
                                            Payment will go directly to: <strong>{mentorUpi}</strong>
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Message */}
                            <div style={{ marginBottom: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <label style={{ fontWeight: 700, fontSize: 13, color: '#1e293b' }}>Your Message</label>
                                    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: '#94a3b8', letterSpacing: '0.1em' }}>BE FRIENDLY!</span>
                                </div>
                                <textarea
                                    required
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Hi! I saw your skill and would love to swap. I can offer..."
                                    rows={3}
                                    style={{
                                        width: '100%', padding: '12px 14px',
                                        background: '#f8fafc', border: '1px solid #e2e8f0',
                                        borderRadius: 12, fontSize: 13, color: '#0f172a',
                                        resize: 'none', outline: 'none', boxSizing: 'border-box',
                                        fontFamily: 'inherit', lineHeight: 1.6,
                                        transition: 'border-color 0.2s',
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                />
                            </div>

                            {/* Error */}
                            {error && (
                                <div style={{
                                    display: 'flex', gap: 8, alignItems: 'flex-start',
                                    padding: '10px 12px', borderRadius: 10,
                                    background: '#fef2f2', border: '1px solid #fecaca',
                                    color: '#dc2626', fontSize: 12, marginBottom: 14,
                                }}>
                                    <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                                    {error}
                                </div>
                            )}

                            {/* Buttons */}
                            <div style={{ display: 'flex', gap: 10 }}>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    style={{
                                        flex: 1, padding: '13px',
                                        background: '#fff', border: '1px solid #e2e8f0',
                                        borderRadius: 12, color: '#64748b', fontWeight: 700,
                                        fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || !message.trim()}
                                    style={{
                                        flex: 2, padding: '13px',
                                        background: loading || !message.trim()
                                            ? '#94a3b8'
                                            : 'linear-gradient(135deg, #2563eb, #4f46e5)',
                                        border: 'none',
                                        borderRadius: 12, color: '#fff', fontWeight: 800,
                                        fontSize: 14, cursor: loading || !message.trim() ? 'not-allowed' : 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                        boxShadow: loading || !message.trim() ? 'none' : '0 4px 20px rgba(37,99,235,0.35)',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {loading ? 'Sending...' : (
                                        <>Send Request <Send size={15} /></>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return createPortal(modal, document.body);
};

export default RequestSwapModal;
