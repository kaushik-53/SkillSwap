import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code, Music, Gamepad2, MoreHorizontal, MapPin, Pencil, HandHeart } from 'lucide-react';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';

/* SVG progress path that fills as steps complete */
const ProgressPath = ({ step, total = 4 }) => {
    const pct = (step / total) * 100;
    return (
        <div style={{ marginBottom: 36 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--text-low)', letterSpacing: '0.1em' }}>
                    STEP {step} / {total}
                </span>
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--text-low)' }}>
                    {Math.round(pct)}%
                </span>
            </div>
            <div style={{ height: 3, background: 'var(--glass-border)', borderRadius: 100, overflow: 'hidden' }}>
                <motion.div
                    style={{ height: '100%', background: 'linear-gradient(90deg, var(--ember), var(--current))', borderRadius: 100 }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
            </div>
        </div>
    );
};

const categories = [
    { id: 'Tech', icon: <Code size={20} />, color: 'var(--current)' },
    { id: 'Music', icon: <Music size={20} />, color: 'var(--ember)' },
    { id: 'Fitness', icon: <Gamepad2 size={20} />, color: '#86EFAC' },
    { id: 'Other', icon: <MoreHorizontal size={20} />, color: '#C4B5FD' },
];

const AddSkill = () => {
    const navigate = useNavigate();
    const { show, Toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Tech',
        type: 'Offer',
        location: '',
    });

    // Compute progress step
    const step = (() => {
        if (formData.location || formData.description) return 4;
        if (formData.type) return 3;
        if (formData.category) return 2;
        if (formData.title) return 2;
        return 1;
    })();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const submissionData = {
                ...formData,
                type: formData.type === 'Offer' ? 'Exchange' : 'Paid',
            };
            await axios.post(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/skills`,
                submissionData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            show('Skill posted to marketplace!', 'success');
            setTimeout(() => navigate('/dashboard'), 1200);
        } catch (err) {
            show(err.response?.data?.message || 'Failed to post skill. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', padding: '40px 24px 80px', maxWidth: 720, margin: '0 auto' }}>
            <Toast />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="glass"
                style={{ borderRadius: 'var(--r-2xl)', padding: 'clamp(32px, 6vw, 56px)' }}
            >
                {/* Header */}
                <div style={{ marginBottom: 36 }}>
                    <h1 style={{
                        fontFamily: 'Cabinet Grotesk, sans-serif',
                        fontWeight: 900,
                        fontSize: 32,
                        letterSpacing: '-0.025em',
                        color: 'var(--text-hi)',
                        marginBottom: 8,
                    }}>
                        List a new skill
                    </h1>
                    <p style={{ fontSize: 14, color: 'var(--text-mid)' }}>
                        Share your expertise and start swapping with your community.
                    </p>
                </div>

                <ProgressPath step={step} total={4} />

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

                    {/* Skill Title */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-mid)', letterSpacing: '0.05em' }}>
                                SKILL TITLE
                            </label>
                            <span style={{ fontSize: 11, color: 'var(--text-low)', fontStyle: 'italic' }}>
                                Clear &amp; concise titles work best
                            </span>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Pencil size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-low)', pointerEvents: 'none' }} />
                            <input
                                type="text"
                                placeholder="e.g. Guitar Lessons, Python Mentoring, Yoga Basics"
                                className="glass-input"
                                style={{ paddingLeft: 40 }}
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-mid)', letterSpacing: '0.05em', display: 'block', marginBottom: 12 }}>
                            CATEGORY
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10 }}>
                            {categories.map(cat => {
                                const active = formData.category === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, category: cat.id })}
                                        style={{
                                            padding: '16px 12px',
                                            borderRadius: 14,
                                            border: active ? `1.5px solid ${cat.color}` : '1px solid var(--glass-border)',
                                            background: active ? `${cat.color}18` : 'var(--glass)',
                                            color: active ? cat.color : 'var(--text-mid)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 8,
                                            transition: 'all 0.2s ease',
                                            backdropFilter: 'blur(8px)',
                                        }}
                                    >
                                        {cat.icon}
                                        <span style={{ fontSize: 12, fontWeight: 700 }}>{cat.id}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-mid)', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>
                            DESCRIPTION
                        </label>
                        <textarea
                            placeholder="Describe what you can offer and how you like to teach or learn..."
                            className="glass-input"
                            rows={5}
                            style={{ resize: 'none', lineHeight: 1.65, padding: '14px 16px' }}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>

                    {/* Skill Type — Offer vs Want */}
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-mid)', letterSpacing: '0.05em', display: 'block', marginBottom: 12 }}>
                            TYPE
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            {/* Offer — ember */}
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'Offer' })}
                                style={{
                                    padding: '18px 16px',
                                    borderRadius: 14,
                                    border: formData.type === 'Offer' ? '1.5px solid var(--ember)' : '1px solid var(--glass-border)',
                                    background: formData.type === 'Offer' ? 'var(--ember-dim)' : 'var(--glass)',
                                    color: formData.type === 'Offer' ? 'var(--ember)' : 'var(--text-mid)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    textAlign: 'left',
                                    transition: 'all 0.2s ease',
                                    backdropFilter: 'blur(8px)',
                                }}
                            >
                                <HandHeart size={20} />
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 14 }}>Offer</div>
                                    <div style={{ fontSize: 11, opacity: 0.7 }}>I can teach this</div>
                                </div>
                            </button>

                            {/* Want — current */}
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'Want' })}
                                style={{
                                    padding: '18px 16px',
                                    borderRadius: 14,
                                    border: formData.type === 'Want' ? '1.5px solid var(--current)' : '1px solid var(--glass-border)',
                                    background: formData.type === 'Want' ? 'var(--current-dim)' : 'var(--glass)',
                                    color: formData.type === 'Want' ? 'var(--current)' : 'var(--text-mid)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    textAlign: 'left',
                                    transition: 'all 0.2s ease',
                                    backdropFilter: 'blur(8px)',
                                }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 8v4l3 3" />
                                </svg>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 14 }}>Want</div>
                                    <div style={{ fontSize: 11, opacity: 0.7 }}>I want to learn this</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-mid)', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>
                            LOCATION <span style={{ fontWeight: 400, opacity: 0.6 }}>(optional)</span>
                        </label>
                        <div style={{ position: 'relative' }}>
                            <MapPin size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-low)', pointerEvents: 'none' }} />
                            <input
                                type="text"
                                placeholder="Leave empty to use your profile location"
                                className="glass-input"
                                style={{ paddingLeft: 40 }}
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                        <p style={{ fontSize: 11, color: 'var(--text-low)', marginTop: 6 }}>
                            Setting a specific location helps locals find you faster.
                        </p>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 8 }}>
                        <Button
                            variant="ember"
                            loading={isLoading}
                            size="lg"
                            type="submit"
                            style={{ width: '100%', borderRadius: 14 }}
                        >
                            Post skill to marketplace
                        </Button>
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="btn-ghost"
                            style={{ width: '100%', padding: '14px', borderRadius: 14, fontSize: 14, fontWeight: 600 }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AddSkill;
