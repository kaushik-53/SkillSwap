import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, TrendingUp, TrendingDown, AlertCircle, Wallet } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE from '../utils/api';

const STATUS_META = {
    Completed: { bg: '#dcfce7', border: '#bbf7d0', text: '#16a34a', label: 'COMPLETED' },
    Verified:  { bg: '#dcfce7', border: '#bbf7d0', text: '#16a34a', label: 'VERIFIED' },
    Pending:   { bg: '#fef9c3', border: '#fde68a', text: '#b45309', label: 'PENDING' },
    Disputed:  { bg: '#fee2e2', border: '#fecaca', text: '#dc2626', label: 'DISPUTED' },
};

const WalletModal = ({ isOpen, onClose, currentUser }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isOpen) return;
        const fetchWallet = async () => {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(
                    `${API_BASE}/api/wallet/balance`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setData(res.data);
            } catch (err) {
                console.error('Wallet fetch error:', err);
                setError(err.response?.data?.message || err.message || 'Failed to load wallet data.');
            } finally {
                setLoading(false);
            }
        };
        fetchWallet();
    }, [isOpen]);

    const modal = (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="wallet-backdrop"
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
                        key="wallet-panel"
                        initial={{ opacity: 0, y: 28, scale: 0.93 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                        style={{
                            background: 'var(--glass)',
                            backdropFilter: 'blur(28px)',
                            WebkitBackdropFilter: 'blur(28px)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 24,
                            width: '100%',
                            maxWidth: 460,
                            maxHeight: '88vh',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 32px 80px rgba(0,0,0,0.3)',
                            overflow: 'hidden',
                        }}
                    >
                        {/* ── Header ── */}
                        <div style={{
                            padding: '20px 24px 18px',
                            borderBottom: '1px solid var(--glass-border)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, transparent 60%)',
                            flexShrink: 0,
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: 14,
                                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 4px 16px rgba(245,158,11,0.35)',
                                }}>
                                    <Wallet size={20} color="#fff" />
                                </div>
                                <div>
                                    <p style={{
                                        fontFamily: 'Cabinet Grotesk, sans-serif',
                                        fontWeight: 800, fontSize: 17,
                                        color: 'var(--text-hi)', margin: 0,
                                    }}>
                                        My Wallet
                                    </p>
                                    <p style={{
                                        fontFamily: 'Space Mono, monospace',
                                        fontSize: 10, color: 'var(--text-low)',
                                        letterSpacing: '0.08em', margin: 0,
                                    }}>
                                        SKILLCREDITS & PAYMENTS
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                style={{
                                    background: 'var(--glass)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: 10, color: 'var(--text-low)',
                                    cursor: 'pointer', padding: '6px 8px',
                                    display: 'flex', alignItems: 'center',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* ── Body ── */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 24px', scrollbarWidth: 'thin' }}>

                            {loading && (
                                <div style={{
                                    textAlign: 'center', padding: '48px 0',
                                    fontFamily: 'Space Mono, monospace', fontSize: 12,
                                    color: 'var(--text-low)', letterSpacing: '0.08em',
                                }}>
                                    Loading wallet...
                                </div>
                            )}

                            {error && (
                                <div style={{
                                    display: 'flex', gap: 8, alignItems: 'center',
                                    color: '#ef4444', fontSize: 13, padding: '12px 0',
                                }}>
                                    <AlertCircle size={16} /> {error}
                                </div>
                            )}

                            {data && !loading && (
                                <>
                                    {/* Balance + UPI row */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                                        {/* Credits */}
                                        <div style={{
                                            borderRadius: 16, padding: '18px 20px',
                                            background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(251,191,36,0.06))',
                                            border: '1px solid rgba(245,158,11,0.25)',
                                            textAlign: 'center',
                                        }}>
                                            <p style={{ fontSize: 10, fontFamily: 'Space Mono, monospace', color: 'var(--text-low)', letterSpacing: '0.1em', margin: '0 0 6px' }}>
                                                SKILLCREDITS
                                            </p>
                                            <p style={{
                                                fontFamily: 'Cabinet Grotesk, sans-serif',
                                                fontWeight: 900, fontSize: 40,
                                                color: '#f59e0b', lineHeight: 1, margin: 0,
                                            }}>
                                                {data.balance}
                                            </p>
                                            <p style={{ fontSize: 11, color: 'var(--text-low)', margin: '6px 0 0' }}>
                                                🪙 credits available
                                            </p>
                                        </div>

                                        {/* UPI & Rate */}
                                        <div style={{
                                            borderRadius: 16, padding: '14px 16px',
                                            background: 'linear-gradient(135deg, rgba(52,211,153,0.1), rgba(16,185,129,0.04))',
                                            border: '1px solid rgba(52,211,153,0.2)',
                                            display: 'flex', flexDirection: 'column', gap: 12,
                                        }}>
                                            <div>
                                                <p style={{ fontSize: 9, fontFamily: 'Space Mono, monospace', color: 'var(--text-low)', letterSpacing: '0.1em', margin: '0 0 4px' }}>
                                                    UPI ID
                                                </p>
                                                <p style={{
                                                    fontFamily: 'Space Mono, monospace', fontWeight: 700,
                                                    fontSize: 11, color: 'var(--text-hi)',
                                                    wordBreak: 'break-all', margin: 0,
                                                }}>
                                                    {data.upiId || <span style={{ color: 'var(--text-low)', fontStyle: 'italic', fontWeight: 400 }}>Not set</span>}
                                                </p>
                                            </div>
                                            <div>
                                                <p style={{ fontSize: 9, fontFamily: 'Space Mono, monospace', color: 'var(--text-low)', letterSpacing: '0.1em', margin: '0 0 4px' }}>
                                                    HOURLY RATE
                                                </p>
                                                <p style={{
                                                    fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 800,
                                                    fontSize: 18, color: 'var(--text-hi)', margin: 0,
                                                }}>
                                                    {data.hourlyRate > 0 ? `₹${data.hourlyRate}` : 'Free'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div style={{ borderTop: '1px solid var(--glass-border)', marginBottom: 16 }} />

                                    {/* Transaction List */}
                                    <p style={{
                                        fontFamily: 'Space Mono, monospace', fontSize: 9,
                                        color: 'var(--text-low)', letterSpacing: '0.12em',
                                        margin: '0 0 12px',
                                    }}>
                                        RECENT TRANSACTIONS
                                    </p>

                                    {data.transactions.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '28px 0' }}>
                                            <p style={{ fontSize: 32, marginBottom: 8 }}>🪙</p>
                                            <p style={{ fontSize: 13, color: 'var(--text-low)' }}>
                                                No transactions yet.
                                            </p>
                                            <p style={{ fontSize: 12, color: 'var(--text-low)', marginTop: 4 }}>
                                                Complete a swap to earn SkillCredits!
                                            </p>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            {data.transactions.map((tx) => {
                                                const isIncoming = tx.toUser?._id === currentUser?._id || tx.toUser === currentUser?._id;
                                                const other = isIncoming ? tx.fromUser : tx.toUser;
                                                const meta = STATUS_META[tx.status] || STATUS_META.Pending;
                                                return (
                                                    <div key={tx._id} style={{
                                                        background: 'rgba(255,255,255,0.025)',
                                                        border: '1px solid var(--glass-border)',
                                                        borderRadius: 12,
                                                        padding: '12px 14px',
                                                        display: 'flex', alignItems: 'center', gap: 12,
                                                    }}>
                                                        <div style={{
                                                            width: 36, height: 36, borderRadius: '50%',
                                                            background: isIncoming ? 'rgba(52,211,153,0.15)' : 'rgba(239,68,68,0.12)',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                                        }}>
                                                            {isIncoming
                                                                ? <TrendingUp size={15} color="#34d399" />
                                                                : <TrendingDown size={15} color="#ef4444" />}
                                                        </div>
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <p style={{
                                                                fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 700,
                                                                fontSize: 13, color: 'var(--text-hi)',
                                                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0,
                                                            }}>
                                                                {isIncoming ? `From ${other?.name || 'User'}` : `To ${other?.name || 'User'}`}
                                                            </p>
                                                            <p style={{ fontSize: 11, color: 'var(--text-low)', marginTop: 2, margin: 0 }}>
                                                                {tx.type === 'SkillCredit'
                                                                    ? `${isIncoming ? '+' : '-'}${tx.amount} Credit${tx.amount !== 1 ? 's' : ''}`
                                                                    : `${isIncoming ? '+' : '-'}₹${tx.amount}`}
                                                                {' · '}
                                                                {new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                                            </p>
                                                        </div>
                                                        <span style={{
                                                            padding: '3px 8px', borderRadius: 20,
                                                            background: meta.bg,
                                                            border: `1px solid ${meta.border}`,
                                                            color: meta.text,
                                                            fontSize: 9, fontFamily: 'Space Mono, monospace',
                                                            fontWeight: 700, flexShrink: 0, letterSpacing: '0.05em',
                                                        }}>
                                                            {meta.label}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return createPortal(modal, document.body);
};

export default WalletModal;
