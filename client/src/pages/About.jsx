import { Shield, Users, Globe, Repeat, Lock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ConstellationSVG from '../components/ui/ConstellationSVG';
import ExchangeSeal from '../components/ui/ExchangeSeal';
import GlassCard from '../components/ui/GlassCard';

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.5, delay, ease: 'easeOut' },
});

const VALUES = [
    {
        icon: <Shield size={24} />,
        color: 'var(--current)',
        bg: 'var(--current-dim)',
        border: 'rgba(94,234,212,0.25)',
        title: 'Trust',
        body: 'Verified profiles, dual-confirmation exchanges, and community reviews create a ledger of accountability — not just a platform.',
    },
    {
        icon: <Users size={24} />,
        color: 'var(--ember)',
        bg: 'var(--ember-dim)',
        border: 'rgba(255,138,91,0.25)',
        title: 'Community',
        body: 'Real-world connections over digital transactions. Every swap is a relationship, not a receipt.',
    },
    {
        icon: <Globe size={24} />,
        color: '#86EFAC',
        bg: 'rgba(134,239,172,0.10)',
        border: 'rgba(134,239,172,0.25)',
        title: 'Accessibility',
        body: 'Skill-sharing should be for everyone. Zero cost to join — your knowledge is the only currency.',
    },
];

const HOW_IT_WORKS = [
    {
        step: '01',
        color: 'var(--ember)',
        title: 'List your skill',
        body: 'Post what you can teach or what you want to learn. No fees, no barriers.',
    },
    {
        step: '02',
        color: 'var(--current)',
        title: 'Match & request',
        body: 'Browse the community, find a partner, and send a swap request with a personal message.',
    },
    {
        step: '03',
        color: '#C4B5FD',
        title: 'Close the loop together',
        body: 'Both sides independently confirm completion. Only then does the Exchange Seal lock — dual-verified.',
    },
];

const About = () => {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--ink)', color: 'var(--text-hi)' }}>

            {/* ── Hero ─────────────────────────────────────── */}
            <section style={{
                minHeight: '90vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                padding: '120px 24px 80px',
                textAlign: 'center',
            }}>
                {/* Background constellation */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.18,
                    pointerEvents: 'none',
                }}>
                    <ConstellationSVG size="hero" animate />
                </div>

                {/* Ambient blobs */}
                <div style={{ position: 'absolute', top: '10%', left: '5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(255,138,91,0.12), transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(94,234,212,0.10), transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    style={{ position: 'relative', maxWidth: 760 }}
                >
                    {/* Chip */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '6px 16px',
                        borderRadius: 100,
                        background: 'var(--glass)',
                        border: '1px solid var(--glass-border)',
                        fontSize: 12,
                        fontWeight: 700,
                        fontFamily: 'Space Mono, monospace',
                        letterSpacing: '0.1em',
                        color: 'var(--ember)',
                        marginBottom: 32,
                    }}>
                        <ExchangeSeal size={20} triggered={false} />
                        OUR STORY
                    </div>

                    <h1 style={{
                        fontFamily: 'Cabinet Grotesk, sans-serif',
                        fontWeight: 900,
                        fontSize: 'clamp(36px, 6vw, 72px)',
                        letterSpacing: '-0.035em',
                        lineHeight: 1.08,
                        color: 'var(--text-hi)',
                        marginBottom: 24,
                    }}>
                        Built on the belief that{' '}
                        <span className="text-gradient-ec">knowledge is currency.</span>
                    </h1>

                    <p style={{
                        fontSize: 'clamp(15px, 2vw, 20px)',
                        color: 'var(--text-mid)',
                        lineHeight: 1.7,
                        maxWidth: 580,
                        margin: '0 auto 48px',
                    }}>
                        SkillSwap replaces money with trust. We built a decentralized social ledger where neighbors
                        trade expertise directly — verified by both sides, closed together.
                    </p>

                    <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/register" className="btn-ember" style={{ padding: '14px 32px', borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
                            Join the community
                        </Link>
                        <Link to="/explore" className="btn-ghost" style={{ padding: '14px 32px', borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
                            Browse skills
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* ── Mission ──────────────────────────────────── */}
            <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40, alignItems: 'center' }}>
                    {/* Text */}
                    <motion.div {...fadeUp()}>
                        <p style={{
                            fontFamily: 'Space Mono, monospace',
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: '0.15em',
                            color: 'var(--ember)',
                            marginBottom: 16,
                        }}>
                            OUR MISSION
                        </p>
                        <h2 style={{
                            fontFamily: 'Cabinet Grotesk, sans-serif',
                            fontWeight: 900,
                            fontSize: 'clamp(28px, 4vw, 44px)',
                            letterSpacing: '-0.03em',
                            color: 'var(--text-hi)',
                            lineHeight: 1.12,
                            marginBottom: 24,
                        }}>
                            Creating a world where every neighbor is a{' '}
                            <span style={{ color: 'var(--current)' }}>teacher.</span>
                        </h2>
                        <p style={{ fontSize: 16, color: 'var(--text-mid)', lineHeight: 1.75, marginBottom: 20 }}>
                            Traditional barriers to learning — cost, location, and access — are solved by looking next door.
                            SkillSwap is a decentralized network of mentorship where everyone has something valuable to share.
                        </p>
                        <p style={{ fontSize: 15, color: 'var(--text-low)', lineHeight: 1.7 }}>
                            We don't take a cut. We don't charge subscriptions. We just close the loop between people who
                            want to teach and people who want to learn.
                        </p>
                    </motion.div>

                    {/* Stats */}
                    <motion.div {...fadeUp(0.12)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        {[
                            { value: '₹0', label: 'Cost to join', accent: 'var(--ember)' },
                            { value: '2×', label: 'Dual-confirmed', accent: 'var(--current)' },
                            { value: '100%', label: 'Peer-to-peer', accent: '#86EFAC' },
                            { value: '∞', label: 'Skills to share', accent: '#C4B5FD' },
                        ].map(({ value, label, accent }) => (
                            <GlassCard key={label} style={{ padding: '28px 20px', borderRadius: 'var(--r-lg)', textAlign: 'center' }}>
                                <p style={{
                                    fontFamily: 'Cabinet Grotesk, sans-serif',
                                    fontWeight: 900,
                                    fontSize: 40,
                                    color: accent,
                                    lineHeight: 1,
                                    marginBottom: 8,
                                }}>
                                    {value}
                                </p>
                                <p style={{
                                    fontFamily: 'Space Mono, monospace',
                                    fontSize: 10,
                                    color: 'var(--text-low)',
                                    letterSpacing: '0.1em',
                                }}>
                                    {label.toUpperCase()}
                                </p>
                            </GlassCard>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── How it works ─────────────────────────────── */}
            <section style={{ padding: '80px 24px', background: 'var(--ink-2)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 64 }}>
                        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: 'var(--current)', marginBottom: 12 }}>
                            HOW IT WORKS
                        </p>
                        <h2 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.03em', color: 'var(--text-hi)', lineHeight: 1.12 }}>
                            Three steps to close a loop.
                        </h2>
                    </motion.div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
                        {HOW_IT_WORKS.map((step, i) => (
                            <motion.div key={step.step} {...fadeUp(i * 0.1)}>
                                <GlassCard hoverTilt style={{ padding: 36, borderRadius: 'var(--r-xl)', height: '100%' }}>
                                    <div style={{ marginBottom: 24 }}>
                                        <span style={{
                                            fontFamily: 'Space Mono, monospace',
                                            fontSize: 11,
                                            fontWeight: 700,
                                            color: step.color,
                                            letterSpacing: '0.12em',
                                        }}>
                                            STEP {step.step}
                                        </span>
                                        <div style={{ width: 40, height: 2, background: step.color, marginTop: 8, borderRadius: 1, opacity: 0.5 }} />
                                    </div>
                                    <h3 style={{
                                        fontFamily: 'Cabinet Grotesk, sans-serif',
                                        fontWeight: 800,
                                        fontSize: 22,
                                        color: 'var(--text-hi)',
                                        marginBottom: 12,
                                    }}>
                                        {step.title}
                                    </h3>
                                    <p style={{ fontSize: 14, color: 'var(--text-mid)', lineHeight: 1.7 }}>
                                        {step.body}
                                    </p>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── The Exchange Seal ────────────────────────── */}
            <section style={{ padding: '100px 24px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
                <motion.div {...fadeUp()}>
                    <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'center' }}>
                        <ExchangeSeal size={96} triggered={false} />
                    </div>
                    <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: 'var(--ember)', marginBottom: 16 }}>
                        THE EXCHANGE SEAL
                    </p>
                    <h2 style={{
                        fontFamily: 'Cabinet Grotesk, sans-serif',
                        fontWeight: 900,
                        fontSize: 'clamp(26px, 4vw, 42px)',
                        letterSpacing: '-0.03em',
                        color: 'var(--text-hi)',
                        marginBottom: 20,
                        lineHeight: 1.12,
                    }}>
                        Both sides confirm. Together.
                    </h2>
                    <p style={{ fontSize: 16, color: 'var(--text-mid)', lineHeight: 1.75, maxWidth: 560, margin: '0 auto 40px' }}>
                        Our dual-confirmation mechanic is the heart of SkillSwap. When a session is complete, both
                        the teacher and learner independently mark it done. Only when both confirm does the Exchange Seal
                        lock — animating closed to signal a verified, trustworthy exchange. No money. Just a closed loop.
                    </p>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 20,
                        padding: '20px 32px',
                        background: 'var(--glass)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: 'var(--r-xl)',
                    }}>
                        {[
                            { icon: <Lock size={16} />, label: 'Dual-verified', color: 'var(--current)' },
                            { icon: <Star size={16} />, label: 'Review unlocks after seal', color: 'var(--ember)' },
                            { icon: <Repeat size={16} />, label: 'Peer-to-peer only', color: '#86EFAC' },
                        ].map(item => (
                            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
                                <span style={{ color: item.color }}>{item.icon}</span>
                                <span style={{ color: 'var(--text-mid)' }}>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* ── Core Values ──────────────────────────────── */}
            <section style={{ padding: '80px 24px 100px', background: 'var(--ink-2)', borderTop: '1px solid var(--glass-border)' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 64 }}>
                        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: 'var(--text-low)', marginBottom: 12 }}>
                            PRINCIPLES
                        </p>
                        <h2 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.03em', color: 'var(--text-hi)', lineHeight: 1.12 }}>
                            Our core values.
                        </h2>
                    </motion.div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                        {VALUES.map((v, i) => (
                            <motion.div key={v.title} {...fadeUp(i * 0.1)}>
                                <GlassCard hoverTilt style={{ padding: 40, borderRadius: 'var(--r-xl)', height: '100%' }}>
                                    <div style={{
                                        width: 52,
                                        height: 52,
                                        borderRadius: 14,
                                        background: v.bg,
                                        border: `1px solid ${v.border}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: v.color,
                                        marginBottom: 24,
                                    }}>
                                        {v.icon}
                                    </div>
                                    <h3 style={{
                                        fontFamily: 'Cabinet Grotesk, sans-serif',
                                        fontWeight: 800,
                                        fontSize: 22,
                                        color: 'var(--text-hi)',
                                        marginBottom: 12,
                                    }}>
                                        {v.title}
                                    </h3>
                                    <p style={{ fontSize: 14, color: 'var(--text-mid)', lineHeight: 1.75 }}>
                                        {v.body}
                                    </p>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ──────────────────────────────────────── */}
            <section style={{
                padding: '100px 24px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Blobs */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-80%, -50%)', width: 500, height: 500, background: 'radial-gradient(circle, rgba(255,138,91,0.10), transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '50%', right: '-10%', transform: 'translateY(-50%)', width: 400, height: 400, background: 'radial-gradient(circle, rgba(94,234,212,0.08), transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

                <motion.div {...fadeUp()} style={{ position: 'relative', maxWidth: 640, margin: '0 auto' }}>
                    <h2 style={{
                        fontFamily: 'Cabinet Grotesk, sans-serif',
                        fontWeight: 900,
                        fontSize: 'clamp(30px, 5vw, 52px)',
                        letterSpacing: '-0.035em',
                        lineHeight: 1.1,
                        color: 'var(--text-hi)',
                        marginBottom: 20,
                    }}>
                        Ready to share what you know?
                    </h2>
                    <p style={{ fontSize: 17, color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: 48 }}>
                        Join a community of neighbors growing together — one skill at a time.
                    </p>
                    <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/register" className="btn-ember" style={{ padding: '14px 36px', borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
                            Get started — free
                        </Link>
                        <Link to="/explore" className="btn-ghost" style={{ padding: '14px 36px', borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
                            Browse skills
                        </Link>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default About;
