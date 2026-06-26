import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Star, MapPin, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import RequestSwapModal from '../components/RequestSwapModal';
import { getAvatarUrl } from '../utils/imageHelpers';
import { SkillCardSkeleton } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';
import GlassCard from '../components/ui/GlassCard';

const CATEGORIES = ['All Skills', 'Gardening', 'Coding', 'Music', 'Cooking', 'Other'];

const CATEGORY_COLORS = {
    Coding:    { bg: 'rgba(94,234,212,0.12)', border: 'rgba(94,234,212,0.3)', text: 'var(--current)' },
    Gardening: { bg: 'rgba(134,239,172,0.12)', border: 'rgba(134,239,172,0.3)', text: '#86EFAC' },
    Music:     { bg: 'rgba(255,138,91,0.12)', border: 'rgba(255,138,91,0.3)', text: 'var(--ember)' },
    Cooking:   { bg: 'rgba(253,186,116,0.12)', border: 'rgba(253,186,116,0.3)', text: '#FDB674' },
    Other:     { bg: 'rgba(196,181,253,0.12)', border: 'rgba(196,181,253,0.3)', text: '#C4B5FD' },
};

/* Empty State */
const EmptyState = ({ onClear }) => (
    <div style={{ textAlign: 'center', padding: '80px 32px' }}>
        {/* Single-node incomplete constellation */}
        <svg width="80" height="80" viewBox="0 0 80 80" style={{ marginBottom: 24, opacity: 0.35 }}>
            <circle cx="40" cy="40" r="8" fill="var(--current)" opacity="0.8" />
            <circle cx="40" cy="40" r="14" fill="none" stroke="var(--current)" strokeWidth="1" opacity="0.4" />
            {/* Incomplete edges going nowhere */}
            <line x1="40" y1="26" x2="40" y2="14" stroke="var(--current)" strokeWidth="1" opacity="0.2" strokeDasharray="4 4" />
            <line x1="54" y1="34" x2="66" y2="28" stroke="var(--ember)" strokeWidth="1" opacity="0.2" strokeDasharray="4 4" />
            <line x1="26" y1="40" x2="14" y2="50" stroke="var(--text-low)" strokeWidth="1" opacity="0.2" strokeDasharray="4 4" />
        </svg>
        <h3 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 700, fontSize: 22, color: 'var(--text-hi)', marginBottom: 8 }}>
            No skills found
        </h3>
        <p style={{ fontSize: 14, color: 'var(--text-mid)', maxWidth: 340, margin: '0 auto 24px', lineHeight: 1.65 }}>
            No skills matched your filters. Try expanding your search or clearing category.
        </p>
        <button
            onClick={onClear}
            className="btn-ghost"
            style={{ padding: '10px 24px', borderRadius: 10, fontSize: 13, fontWeight: 600 }}
        >
            Clear filters
        </button>
    </div>
);

const Explore = () => {
    const [skills, setSkills] = useState([]);
    const [search, setSearch] = useState('');
    const [location, setLocation] = useState('');
    const [activeCategory, setActiveCategory] = useState('All Skills');
    const [loading, setLoading] = useState(true);
    const [minRating, setMinRating] = useState('Any');
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { show, Toast } = useToast();

    useEffect(() => {
        setLoading(true);
        const id = setTimeout(async () => {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/skills?search=${search}&location=${location}`
                );
                setSkills(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }, 300);
        return () => clearTimeout(id);
    }, [search, location]);

    const clearAll = () => { setSearch(''); setLocation(''); setActiveCategory('All Skills'); setMinRating('Any'); };

    const filtered = skills.filter(skill => {
        if (activeCategory !== 'All Skills' && skill.category !== activeCategory) return false;
        const rating = parseFloat(skill.rating) || 0;
        if (minRating === '4.5' && rating < 4.5) return false;
        if (minRating === '4.0' && rating < 4.0) return false;
        return true;
    });

    const catColor = (cat) => CATEGORY_COLORS[cat] || CATEGORY_COLORS.Other;

    return (
        <div style={{ minHeight: '100vh', padding: '24px', maxWidth: 1280, margin: '0 auto' }}>
            <Toast />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: 32 }}
            >
                <h1 style={{
                    fontFamily: 'Cabinet Grotesk, sans-serif',
                    fontWeight: 900,
                    fontSize: 'clamp(28px, 4vw, 44px)',
                    letterSpacing: '-0.025em',
                    color: 'var(--text-hi)',
                    marginBottom: 8,
                }}>
                    Explore Skills
                </h1>
                <p style={{ fontSize: 15, color: 'var(--text-mid)' }}>
                    Discover people ready to teach and learn in your community.
                </p>
            </motion.div>

            <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                {/* Sidebar Filters */}
                <div style={{ width: 260, flexShrink: 0, position: 'sticky', top: 96 }}>
                    <div className="glass" style={{ padding: 28, borderRadius: 'var(--r-xl)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <h2 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text-hi)' }}>
                                Filters
                            </h2>
                            <button
                                onClick={clearAll}
                                style={{ fontSize: 11, fontWeight: 700, color: 'var(--ember)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Space Mono, monospace', letterSpacing: '0.08em' }}
                            >
                                CLEAR ALL
                            </button>
                        </div>

                        {/* Search */}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-low)', display: 'block', marginBottom: 8, letterSpacing: '0.1em' }}>
                                SEARCH
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-low)', pointerEvents: 'none' }} />
                                <input
                                    type="text"
                                    placeholder="Search skills..."
                                    className="glass-input"
                                    style={{ paddingLeft: 36, fontSize: 13 }}
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid var(--glass-border)' }}>
                            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-low)', display: 'block', marginBottom: 8, letterSpacing: '0.1em' }}>
                                LOCATION
                            </label>
                            <div style={{ position: 'relative' }}>
                                <MapPin size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-low)', pointerEvents: 'none' }} />
                                <input
                                    type="text"
                                    placeholder="City, neighbourhood..."
                                    className="glass-input"
                                    style={{ paddingLeft: 36, fontSize: 13 }}
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Min Rating */}
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-low)', display: 'block', marginBottom: 12, letterSpacing: '0.1em' }}>
                                MIN RATING
                            </label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {['4.5', '4.0', 'Any'].map(r => (
                                    <label key={r} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                                        <div style={{
                                            width: 18, height: 18,
                                            borderRadius: '50%',
                                            border: `2px solid ${minRating === r ? 'var(--ember)' : 'var(--glass-border)'}`,
                                            background: minRating === r ? 'var(--ember)' : 'transparent',
                                            transition: 'all 0.2s ease',
                                            position: 'relative',
                                            cursor: 'pointer',
                                        }}
                                            onClick={() => setMinRating(r)}
                                        >
                                            {minRating === r && (
                                                <div style={{ position: 'absolute', inset: 3, borderRadius: '50%', background: 'var(--ink)' }} />
                                            )}
                                        </div>
                                        <span style={{ fontSize: 13, color: minRating === r ? 'var(--text-hi)' : 'var(--text-mid)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
                                            onClick={() => setMinRating(r)}
                                        >
                                            {r === 'Any' ? 'Any rating' : <>{r}+ <Star size={12} style={{ color: '#FBBF24', fill: '#FBBF24' }} /></>}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Category pills */}
                    <div className="hide-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 20, marginBottom: 8 }}>
                        {CATEGORIES.map(cat => {
                            const active = activeCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    style={{
                                        whiteSpace: 'nowrap',
                                        padding: '8px 18px',
                                        borderRadius: 100,
                                        fontSize: 13,
                                        fontWeight: 600,
                                        border: active ? '1px solid var(--ember)' : '1px solid var(--glass-border)',
                                        background: active ? 'var(--ember-dim)' : 'var(--glass)',
                                        color: active ? 'var(--ember)' : 'var(--text-mid)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        backdropFilter: 'blur(8px)',
                                    }}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>

                    {/* Results count */}
                    {!loading && (
                        <p style={{ fontSize: 12, color: 'var(--text-low)', fontFamily: 'Space Mono, monospace', marginBottom: 20 }}>
                            {filtered.length} skill{filtered.length !== 1 ? 's' : ''} found
                        </p>
                    )}

                    {/* Grid */}
                    {loading ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                            {Array.from({ length: 6 }).map((_, i) => <SkillCardSkeleton key={i} />)}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="glass" style={{ borderRadius: 'var(--r-xl)' }}>
                            <EmptyState onClear={clearAll} />
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                            {filtered.map((skill, i) => {
                                const cc = catColor(skill.category);
                                const isOffer = skill.type === 'Offer' || skill.type === 'Exchange' || skill.type === 'Free Exchange';
                                return (
                                    <GlassCard
                                        key={skill._id}
                                        hoverTilt
                                        style={{ borderRadius: 'var(--r-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                                    >
                                        {/* Banner */}
                                        <Link to={`/user/${skill.owner?._id}`} style={{ textDecoration: 'none' }}>
                                            <div style={{
                                                height: 112,
                                                background: `linear-gradient(135deg, ${isOffer ? 'rgba(255,138,91,0.25)' : 'rgba(94,234,212,0.20)'}, rgba(10,14,31,0.8))`,
                                                borderBottom: `1px solid ${isOffer ? 'rgba(255,138,91,0.2)' : 'rgba(94,234,212,0.15)'}`,
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                                alignItems: 'flex-start',
                                                padding: 14,
                                            }}>
                                                {/* Category tag */}
                                                <span style={{ padding: '4px 10px', borderRadius: 100, fontSize: 10, fontWeight: 700, background: cc.bg, border: `1px solid ${cc.border}`, color: cc.text, fontFamily: 'Space Mono, monospace', letterSpacing: '0.08em' }}>
                                                    {skill.category?.toUpperCase()}
                                                </span>
                                            </div>
                                        </Link>

                                        {/* Avatar */}
                                        <div style={{ position: 'relative', marginTop: -28, paddingLeft: 20 }}>
                                            <img
                                                src={getAvatarUrl(skill.owner?.avatar, skill.owner?.name)}
                                                alt={skill.owner?.name}
                                                style={{
                                                    width: 52, height: 52,
                                                    borderRadius: '50%',
                                                    objectFit: 'cover',
                                                    border: '3px solid var(--ink-2)',
                                                    boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
                                                }}
                                            />
                                        </div>

                                        {/* Body */}
                                        <div style={{ padding: '12px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                                                <h3 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text-hi)', flex: 1, marginRight: 8 }}>
                                                    {skill.owner?.name || 'Local User'}
                                                </h3>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(251,191,36,0.1)', padding: '3px 8px', borderRadius: 6, flexShrink: 0 }}>
                                                    <Star size={11} style={{ color: '#FBBF24', fill: '#FBBF24' }} />
                                                    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--text-hi)', fontWeight: 700 }}>
                                                        {skill.rating || '0.0'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Skill title with offer/want accent */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                                                <div style={{
                                                    width: 6, height: 6, borderRadius: '50%',
                                                    background: isOffer ? 'var(--ember)' : 'var(--current)',
                                                    flexShrink: 0,
                                                }} />
                                                <h4 style={{ fontSize: 13, fontWeight: 600, color: isOffer ? 'var(--ember)' : 'var(--current)', lineClamp: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {skill.title}
                                                </h4>
                                            </div>

                                            <p style={{ fontSize: 12, color: 'var(--text-mid)', lineHeight: 1.65, marginBottom: 16, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {skill.description}
                                            </p>

                                            {/* Footer */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid var(--glass-border)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-low)' }}>
                                                    <MapPin size={11} />
                                                    <span style={{ fontFamily: 'Space Mono, monospace', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {skill.location || skill.owner?.location || 'Remote'}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => { setSelectedSkill(skill); setIsModalOpen(true); }}
                                                    className="btn-ember"
                                                    style={{ padding: '7px 16px', borderRadius: 8, fontSize: 12 }}
                                                >
                                                    Swap
                                                </button>
                                            </div>
                                        </div>
                                    </GlassCard>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <RequestSwapModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                skill={selectedSkill}
                onSuccess={() => show('Swap request sent successfully!', 'success')}
            />
        </div>
    );
};

export default Explore;
