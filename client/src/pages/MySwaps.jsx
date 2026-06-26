import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import { getAvatarUrl } from '../utils/imageHelpers';
import { ArrowRight } from 'lucide-react';
import StatusBadge from '../components/ui/StatusBadge';
import ExchangeSeal from '../components/ui/ExchangeSeal';
import Skeleton from '../components/ui/Skeleton';

const EmptyState = ({ type }) => (
    <div style={{ padding: '64px 32px', textAlign: 'center' }}>
        <svg width="64" height="64" viewBox="0 0 80 80" style={{ marginBottom: 20, opacity: 0.3, display: 'block', margin: '0 auto 20px' }}>
            <circle cx="40" cy="40" r="7" fill="var(--current)" />
            <circle cx="40" cy="40" r="13" fill="none" stroke="var(--current)" strokeWidth="1" opacity="0.5" />
            <line x1="40" y1="27" x2="40" y2="14" stroke="var(--current)" strokeWidth="1" opacity="0.3" strokeDasharray="3 3" />
            <line x1="53" y1="33" x2="65" y2="27" stroke="var(--ember)" strokeWidth="1" opacity="0.3" strokeDasharray="3 3" />
            <line x1="27" y1="33" x2="15" y2="20" stroke="var(--text-low)" strokeWidth="1" opacity="0.2" strokeDasharray="3 3" />
        </svg>
        <h3 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 700, fontSize: 20, color: 'var(--text-hi)', marginBottom: 8 }}>
            {type === 'active' ? 'No active swaps' : 'No swap history'}
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-low)', marginBottom: 24, lineHeight: 1.65 }}>
            {type === 'active'
                ? 'Find a skill to swap and get started.'
                : 'Completed and declined swaps will appear here.'}
        </p>
        {type === 'active' && (
            <Link to="/explore" className="btn-ghost" style={{ padding: '10px 24px', borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                Browse Skills <ArrowRight size={14} />
            </Link>
        )}
    </div>
);

const MySwaps = () => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('active');
    const [requests, setRequests] = useState({ active: [], history: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/requests`, { headers: { Authorization: `Bearer ${token}` } });
                const allRequests = [...(res.data.received || []), ...(res.data.sent || [])];
                allRequests.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                const active = allRequests.filter(r => r.status === 'Pending' || r.status === 'Accepted');
                const history = allRequests.filter(r => r.status === 'Completed' || r.status === 'Rejected');
                setRequests({ active, history });
            } catch (error) {
                console.error('Failed to fetch swaps:', error);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchRequests();
    }, [user]);

    const renderSwapRow = (swap) => {
        const isReceiver = swap.receiver?._id === user?._id;
        const partner = isReceiver ? swap.sender : swap.receiver;
        const isCompleted = swap.status === 'Completed';

        return (
            <motion.div
                key={swap._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="glass"
                style={{
                    padding: '20px 24px',
                    borderRadius: 'var(--r-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 20,
                    flexWrap: 'wrap',
                    transition: 'border-color 0.2s ease',
                    borderColor: isCompleted ? 'rgba(255,255,255,0.18)' : 'var(--glass-border)',
                }}
            >
                {/* Partner avatar */}
                <img
                    src={getAvatarUrl(partner?.avatar, partner?.name)}
                    alt={partner?.name}
                    style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid var(--glass-border)' }}
                />

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                        <h3 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-hi)' }}>
                            {swap.skill?.title || 'Unknown Skill'}
                        </h3>
                        <StatusBadge status={swap.status?.toLowerCase()} />
                        {isCompleted && <ExchangeSeal triggered={false} size={22} />}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 12, color: 'var(--text-low)', fontFamily: 'Space Mono, monospace' }}>
                            {isReceiver ? '→ from ' : '← to '}
                            <span style={{ color: 'var(--text-mid)', fontWeight: 700 }}>{partner?.name || 'Deleted user'}</span>
                        </span>
                        {swap.skill?.category && (
                            <span style={{
                                fontSize: 9,
                                fontWeight: 700,
                                padding: '3px 8px',
                                borderRadius: 6,
                                background: 'var(--glass)',
                                border: '1px solid var(--glass-border)',
                                color: 'var(--text-low)',
                                fontFamily: 'Space Mono, monospace',
                                letterSpacing: '0.08em',
                            }}>
                                {swap.skill.category.toUpperCase()}
                            </span>
                        )}
                        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--text-low)' }}>
                            {new Date(swap.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                    </div>
                </div>

                {/* CTA */}
                <div style={{ flexShrink: 0 }}>
                    {(swap.status === 'Accepted' || swap.status === 'Completed') ? (
                        <Link
                            to={`/requests/${swap._id}`}
                            className={swap.status === 'Completed' ? 'btn-ghost' : 'btn-ember'}
                            style={{ padding: '9px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                        >
                            {swap.status === 'Completed' ? 'View' : 'Join Session'}
                            <ArrowRight size={14} />
                        </Link>
                    ) : swap.status === 'Pending' && isReceiver ? (
                        <Link to="/dashboard" className="btn-current" style={{ padding: '9px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            Manage <ArrowRight size={14} />
                        </Link>
                    ) : (
                        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--text-low)', letterSpacing: '0.08em' }}>
                            {swap.status === 'Rejected' ? 'CLOSED' : 'WAITING'}
                        </span>
                    )}
                </div>
            </motion.div>
        );
    };

    const currentList = requests[activeTab];

    return (
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px 80px' }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}
            >
                <div>
                    <h1 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 40px)', letterSpacing: '-0.025em', color: 'var(--text-hi)', marginBottom: 8 }}>
                        My Swaps
                    </h1>
                    <p style={{ fontSize: 14, color: 'var(--text-mid)' }}>
                        Track your ongoing and past exchanges.
                    </p>
                </div>

                {/* Tab switcher */}
                <div style={{
                    display: 'flex',
                    background: 'var(--glass)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 14,
                    padding: 4,
                    gap: 4,
                }}>
                    {[
                        { key: 'active', label: `Active (${requests.active.length})` },
                        { key: 'history', label: `History (${requests.history.length})` },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            style={{
                                padding: '9px 20px',
                                borderRadius: 10,
                                fontSize: 13,
                                fontWeight: 700,
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                background: activeTab === tab.key ? 'var(--ember)' : 'transparent',
                                color: activeTab === tab.key ? 'var(--ink)' : 'var(--text-mid)',
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* List */}
            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} variant="card" height={96} />)}
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.25 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
                    >
                        {currentList.length > 0
                            ? currentList.map(renderSwapRow)
                            : (
                                <div className="glass" style={{ borderRadius: 'var(--r-xl)' }}>
                                    <EmptyState type={activeTab} />
                                </div>
                            )
                        }
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
};

export default MySwaps;
