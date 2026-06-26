import { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { getAvatarUrl } from '../utils/imageHelpers';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Bell, MapPin, Plus, Star } from 'lucide-react';
import StatusBadge from '../components/ui/StatusBadge';
import GlassCard from '../components/ui/GlassCard';
import Skeleton from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';

/* Animated counter on first view */
const CountUp = ({ target, duration = 1200 }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!inView) return;
        const steps = 40;
        const inc = target / steps;
        let current = 0;
        let step = 0;
        const id = setInterval(() => {
            step++;
            current = Math.min(Math.round(inc * step), target);
            setCount(current);
            if (step >= steps) clearInterval(id);
        }, duration / steps);
        return () => clearInterval(id);
    }, [inView, target, duration]);

    return <span ref={ref}>{count}</span>;
};

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay, ease: 'easeOut' },
});

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [activeSwaps, setActiveSwaps] = useState([]);
    const [stats, setStats] = useState({ completed: 0, rating: 0.0 });
    const [recommendedSkills, setRecommendedSkills] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { show, Toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                const reqRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/requests`, config);
                const received = reqRes.data.received || [];
                const sent = reqRes.data.sent || [];
                const all = [...received, ...sent];

                const active = all.filter(r => r.status === 'Accepted')
                    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                    .slice(0, 2);
                setActiveSwaps(active);

                const completed = all.filter(r => r.status === 'Completed').length;

                let rating = '0.0';
                try {
                    const reviewRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews/${user?._id}`);
                    if (reviewRes.data.length > 0) {
                        const sum = reviewRes.data.reduce((acc, r) => acc + r.rating, 0);
                        rating = (sum / reviewRes.data.length).toFixed(1);
                    }
                } catch (e) { /* no reviews yet */ }

                setStats({ completed, rating });

                const skillsRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/skills`);
                setRecommendedSkills(skillsRes.data.filter(s => s.owner?._id !== user?._id).slice(0, 3));

                const pending = received.filter(r => r.status === 'Pending').slice(0, 3);
                setNotifications(pending.map(p => ({
                    id: p._id,
                    senderName: p.sender?.name || 'User',
                    senderAvatar: p.sender?.avatar,
                    skillTitle: p.skill?.title || 'Skill',
                    message: p.message?.substring(0, 50),
                })));
            } catch (err) {
                console.error('Dashboard error:', err);
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
            show(newStatus === 'Accepted' ? 'Swap request accepted!' : 'Request declined.', newStatus === 'Accepted' ? 'success' : 'info');
            window.location.reload();
        } catch (err) {
            show('Action failed. Please try again.', 'error');
        }
    };

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 80px' }}>
            <Toast />

            {/* Welcome Header */}
            <motion.div {...fadeUp()} style={{ marginBottom: 40 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                    <div>
                        <h1 style={{
                            fontFamily: 'Cabinet Grotesk, sans-serif',
                            fontWeight: 900,
                            fontSize: 'clamp(28px, 4vw, 44px)',
                            letterSpacing: '-0.03em',
                            color: 'var(--text-hi)',
                            marginBottom: 8,
                        }}>
                            Welcome back,{' '}
                            <span className="text-gradient-ec">
                                {user?.name?.split(' ')[0] || 'there'}
                            </span>
                        </h1>
                        <p style={{ fontSize: 15, color: 'var(--text-mid)' }}>
                            You have{' '}
                            <span style={{ color: 'var(--ember)', fontWeight: 700 }}>{activeSwaps.length}</span>{' '}
                            active swap{activeSwaps.length !== 1 ? 's' : ''} in progress.
                        </p>
                    </div>

                    <Link to="/add-skill" className="btn-ember" style={{ padding: '10px 20px', borderRadius: 12, fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                        <Plus size={16} /> Post a skill
                    </Link>
                </div>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(0, 340px)', gap: 28, alignItems: 'start' }}>
                {/* Left Main */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 36, minWidth: 0 }}>

                    {/* Active Swaps */}
                    <motion.section {...fadeUp(0.05)}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <h2 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 700, fontSize: 20, color: 'var(--text-hi)' }}>
                                    Active Swaps
                                </h2>
                                <StatusBadge status="accepted" className="" />
                            </div>
                            <Link to="/my-swaps" style={{ fontSize: 13, color: 'var(--ember)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                                View all <ArrowRight size={14} />
                            </Link>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                            {loading ? (
                                <>
                                    <Skeleton variant="card" height={200} />
                                    <Skeleton variant="card" height={200} />
                                </>
                            ) : activeSwaps.length > 0 ? activeSwaps.map((swap, idx) => {
                                const partner = swap.receiver?._id === user?._id ? swap.sender : swap.receiver;
                                return (
                                    <GlassCard key={swap._id} hoverTilt style={{ padding: 24, borderRadius: 'var(--r-lg)', position: 'relative' }}>
                                        {/* Avatars */}
                                        <div style={{ display: 'flex', marginBottom: 20 }}>
                                            <img src={getAvatarUrl(partner?.avatar, partner?.name)} alt={partner?.name}
                                                style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--ink-2)', zIndex: 1 }} />
                                            <img src={getAvatarUrl(user?.avatar, user?.name)} alt={user?.name}
                                                style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--ink-2)', marginLeft: -16, opacity: 0.7, marginTop: 6 }} />
                                        </div>

                                        <h3 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text-hi)', marginBottom: 4 }}>
                                            {swap.skill?.title}
                                        </h3>
                                        <p style={{ fontSize: 12, color: 'var(--text-low)', marginBottom: 20, fontFamily: 'Space Mono, monospace' }}>
                                            with {partner?.name?.split(' ')[0]}
                                        </p>

                                        <Link
                                            to={`/requests/${swap._id}`}
                                            className="btn-ember"
                                            style={{ display: 'block', textAlign: 'center', padding: '9px', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}
                                        >
                                            Join Session
                                        </Link>
                                    </GlassCard>
                                );
                            }) : (
                                <div
                                    className="glass"
                                    style={{ gridColumn: '1/-1', padding: '48px 32px', borderRadius: 'var(--r-xl)', textAlign: 'center', borderStyle: 'dashed' }}
                                >
                                    {/* Incomplete constellation */}
                                    <svg width="56" height="56" viewBox="0 0 80 80" style={{ marginBottom: 16, opacity: 0.3 }}>
                                        <circle cx="40" cy="40" r="6" fill="var(--current)" />
                                        <circle cx="40" cy="40" r="12" fill="none" stroke="var(--current)" strokeWidth="1" opacity="0.4" />
                                        <line x1="40" y1="28" x2="40" y2="16" stroke="var(--current)" strokeWidth="1" opacity="0.3" strokeDasharray="3 3" />
                                        <line x1="52" y1="34" x2="64" y2="28" stroke="var(--ember)" strokeWidth="1" opacity="0.3" strokeDasharray="3 3" />
                                    </svg>
                                    <p style={{ fontSize: 14, color: 'var(--text-low)', marginBottom: 16, fontWeight: 500 }}>
                                        No active swaps — list a skill to find a match.
                                    </p>
                                    <Link to="/explore" className="btn-ghost" style={{ padding: '9px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
                                        Browse Skills
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.section>

                    {/* Pending Requests / Notifications */}
                    <motion.section {...fadeUp(0.1)}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h2 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 700, fontSize: 20, color: 'var(--text-hi)' }}>
                                Swap Requests
                            </h2>
                            {notifications.length > 0 && (
                                <span style={{
                                    fontSize: 10,
                                    fontFamily: 'Space Mono, monospace',
                                    padding: '4px 10px',
                                    borderRadius: 100,
                                    background: 'rgba(248,113,113,0.15)',
                                    color: '#F87171',
                                    border: '1px solid rgba(248,113,113,0.25)',
                                }}>
                                    {notifications.length} NEW
                                </span>
                            )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {loading ? (
                                Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} variant="card" height={96} />)
                            ) : notifications.length > 0 ? notifications.map(notif => (
                                <div
                                    key={notif.id}
                                    className="glass"
                                    style={{ padding: 20, borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}
                                >
                                    <img src={getAvatarUrl(notif.senderAvatar, notif.senderName)} alt={notif.senderName}
                                        style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-hi)', marginBottom: 2 }}>
                                            {notif.senderName} wants to swap
                                        </p>
                                        <p style={{ fontSize: 12, color: 'var(--ember)', fontWeight: 600 }}>{notif.skillTitle}</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                        <button
                                            onClick={() => handleRequestStatus(notif.id, 'Rejected')}
                                            className="btn-ghost"
                                            style={{ padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}
                                        >
                                            Decline
                                        </button>
                                        <button
                                            onClick={() => handleRequestStatus(notif.id, 'Accepted')}
                                            className="btn-current"
                                            style={{ padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}
                                        >
                                            Accept
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="glass" style={{ padding: '40px 32px', borderRadius: 'var(--r-lg)', textAlign: 'center' }}>
                                    <Bell size={24} style={{ color: 'var(--text-low)', marginBottom: 12 }} />
                                    <p style={{ fontSize: 14, color: 'var(--text-low)' }}>No pending requests.</p>
                                </div>
                            )}
                        </div>
                    </motion.section>

                    {/* Recommended */}
                    {recommendedSkills.length > 0 && (
                        <motion.section {...fadeUp(0.15)}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                <h2 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 700, fontSize: 20, color: 'var(--text-hi)' }}>
                                    Recommended for you
                                </h2>
                                <Link to="/explore" style={{ fontSize: 13, color: 'var(--current)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    Browse all <ArrowRight size={14} />
                                </Link>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
                                {recommendedSkills.map((skill, i) => (
                                    <GlassCard key={skill._id} hoverTilt style={{ padding: 20, borderRadius: 'var(--r-md)' }}>
                                        <div style={{ width: 40, height: 40, borderRadius: 10, background: i % 2 === 0 ? 'var(--ember-dim)' : 'var(--current-dim)', border: `1px solid ${i % 2 === 0 ? 'rgba(255,138,91,0.3)' : 'rgba(94,234,212,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                                            <Star size={18} style={{ color: i % 2 === 0 ? 'var(--ember)' : 'var(--current)' }} />
                                        </div>
                                        <h3 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 600, fontSize: 14, color: 'var(--text-hi)', marginBottom: 12, lineHeight: 1.3 }}>
                                            {skill.title}
                                        </h3>
                                        <Link to="/explore" style={{ fontSize: 11, fontWeight: 700, color: i % 2 === 0 ? 'var(--ember)' : 'var(--current)', textDecoration: 'none', fontFamily: 'Space Mono, monospace', letterSpacing: '0.08em' }}>
                                            EXPLORE →
                                        </Link>
                                    </GlassCard>
                                ))}
                            </div>
                        </motion.section>
                    )}
                </div>

                {/* Right Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Stats */}
                    <motion.div {...fadeUp(0.05)} className="glass" style={{ padding: 28, borderRadius: 'var(--r-xl)' }}>
                        <h3 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text-hi)', marginBottom: 20 }}>
                            Your stats
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            {/* Completed */}
                            <div className="glass-sm" style={{ padding: '20px 16px', textAlign: 'center', borderRadius: 14 }}>
                                <p style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 900, fontSize: 36, color: 'var(--ember)', lineHeight: 1, marginBottom: 6 }}>
                                    {loading ? '—' : <CountUp target={stats.completed} />}
                                </p>
                                <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'var(--text-low)', letterSpacing: '0.1em' }}>
                                    SWAPS<br />DONE
                                </p>
                            </div>
                            {/* Rating */}
                            <div className="glass-sm" style={{ padding: '20px 16px', textAlign: 'center', borderRadius: 14 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 6 }}>
                                    <p style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 900, fontSize: 36, color: 'var(--current)', lineHeight: 1 }}>
                                        {loading ? '—' : parseFloat(stats.rating).toFixed(1)}
                                    </p>
                                    <Star size={16} style={{ color: '#FBBF24', fill: '#FBBF24', marginTop: 4 }} />
                                </div>
                                <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'var(--text-low)', letterSpacing: '0.1em' }}>
                                    AVG<br />RATING
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* CTA — Post new skill */}
                    <motion.div {...fadeUp(0.1)}>
                        <Link
                            to="/add-skill"
                            style={{
                                display: 'block',
                                background: 'linear-gradient(135deg, var(--ink-3) 0%, rgba(255,138,91,0.15) 100%)',
                                border: '1px solid rgba(255,138,91,0.25)',
                                borderRadius: 'var(--r-xl)',
                                padding: 28,
                                textAlign: 'center',
                                textDecoration: 'none',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.25s ease',
                            }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-ember)'}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                        >
                            <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, background: 'radial-gradient(circle, rgba(255,138,91,0.2), transparent)', borderRadius: '50%' }} />
                            <Plus size={28} style={{ color: 'var(--ember)', marginBottom: 12, position: 'relative' }} />
                            <h3 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 700, fontSize: 17, color: 'var(--text-hi)', marginBottom: 8, position: 'relative' }}>
                                Share a new skill
                            </h3>
                            <p style={{ fontSize: 12, color: 'var(--text-mid)', marginBottom: 20, position: 'relative', lineHeight: 1.6 }}>
                                Grow the community — post what you know.
                            </p>
                            <div style={{
                                background: 'var(--ember)',
                                color: 'var(--ink)',
                                padding: '10px',
                                borderRadius: 10,
                                fontSize: 13,
                                fontWeight: 700,
                                position: 'relative',
                            }}>
                                Post a skill
                            </div>
                        </Link>
                    </motion.div>

                    {/* Profile quick link */}
                    <motion.div {...fadeUp(0.15)}>
                        <Link to="/profile" className="glass" style={{
                            display: 'flex', alignItems: 'center', gap: 14,
                            padding: '16px 20px', borderRadius: 'var(--r-md)', textDecoration: 'none',
                            transition: 'border-color 0.2s ease',
                        }}>
                            <img src={getAvatarUrl(user?.avatar, user?.name)} alt={user?.name}
                                style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid var(--glass-border)' }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-hi)', marginBottom: 2, textTransform: 'capitalize' }}>
                                    {user?.name}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-low)' }}>
                                    <MapPin size={10} />
                                    <span style={{ fontFamily: 'Space Mono, monospace' }}>{user?.location || 'No location set'}</span>
                                </div>
                            </div>
                            <ArrowRight size={16} style={{ color: 'var(--text-low)', flexShrink: 0 }} />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
