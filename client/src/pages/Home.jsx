import { useContext, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Users, Repeat, Star } from 'lucide-react';
import Footer from '../components/Footer';
import AuthContext from '../context/AuthContext';
import ConstellationSVG from '../components/ui/ConstellationSVG';

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.55, delay, ease: 'easeOut' },
});

const Home = () => {
    const { user } = useContext(AuthContext);

    const steps = [
        {
            num: '01',
            title: 'List your skill',
            body: 'Post what you can teach — guitar lessons, Python mentoring, yoga basics. Or list what you want to learn.',
            accent: 'var(--ember)',
            dim: 'var(--ember-dim)',
        },
        {
            num: '02',
            title: 'Connect & accept',
            body: 'Browse nearby skills, send a swap request, and match with someone who has what you need.',
            accent: 'var(--current)',
            dim: 'var(--current-dim)',
        },
        {
            num: '03',
            title: 'Close the loop together',
            body: 'Both parties mark the session complete. The dual-confirmation seals the exchange. No money, just trust.',
            accent: 'var(--ember)',
            dim: 'var(--ember-dim)',
            seal: true,
        },
    ];

    const stats = [
        { value: '0 ₹', label: 'Cost to join', sub: 'Free forever' },
        { value: '2×', label: 'Dual-confirm', sub: 'Both sides close the loop' },
        { value: '⭐', label: 'Trust ratings', sub: 'Verified exchanges only' },
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--ink)', position: 'relative', overflow: 'hidden' }}>
            {/* ── Hero Section ─────────────────────────────────────── */}
            <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '100px 24px 60px', maxWidth: 1200, margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 60, width: '100%', flexWrap: 'wrap' }}>

                    {/* Left: Copy */}
                    <div style={{ flex: '1 1 420px', maxWidth: 560 }}>
                        {/* Eyebrow */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '6px 14px',
                                background: 'var(--glass)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: 100,
                                marginBottom: 28,
                            }}
                        >
                            <span style={{
                                width: 6, height: 6, borderRadius: '50%',
                                background: 'var(--current)',
                                animation: 'pulse-dot 1.4s ease-in-out infinite',
                            }} />
                            <span style={{
                                fontFamily: 'Space Mono, monospace',
                                fontSize: 11,
                                color: 'var(--text-mid)',
                                letterSpacing: '0.12em',
                            }}>
                                PEER-TO-PEER SKILL EXCHANGE
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            style={{
                                fontFamily: 'Cabinet Grotesk, sans-serif',
                                fontWeight: 900,
                                fontSize: 'clamp(42px, 6vw, 72px)',
                                lineHeight: 1.05,
                                letterSpacing: '-0.03em',
                                color: 'var(--text-hi)',
                                marginBottom: 24,
                            }}
                        >
                            Exchange skills,{' '}
                            <span className="text-gradient-ec">not money.</span>
                        </motion.h1>

                        {/* Subhead */}
                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            style={{
                                fontSize: 18,
                                color: 'var(--text-mid)',
                                lineHeight: 1.65,
                                marginBottom: 40,
                                maxWidth: 440,
                            }}
                        >
                            A trust-based community where your knowledge is the currency.
                            Teach what you know. Learn what you need. Close the loop together.
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
                        >
                            {user ? (
                                <Link
                                    to="/explore"
                                    className="btn-ember"
                                    style={{
                                        padding: '14px 28px',
                                        borderRadius: 14,
                                        fontSize: 15,
                                        fontWeight: 700,
                                        textDecoration: 'none',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 8,
                                    }}
                                >
                                    Browse Skills <ArrowRight size={16} />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to="/register"
                                        className="btn-ember"
                                        style={{
                                            padding: '14px 28px',
                                            borderRadius: 14,
                                            fontSize: 15,
                                            fontWeight: 700,
                                            textDecoration: 'none',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 8,
                                        }}
                                    >
                                        Teach a skill <ArrowRight size={16} />
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="btn-current"
                                        style={{
                                            padding: '14px 28px',
                                            borderRadius: 14,
                                            fontSize: 15,
                                            fontWeight: 700,
                                            textDecoration: 'none',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 8,
                                        }}
                                    >
                                        Learn a skill <ArrowRight size={16} />
                                    </Link>
                                </>
                            )}
                            <button
                                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                                className="btn-ghost"
                                style={{
                                    padding: '14px 28px',
                                    borderRadius: 14,
                                    fontSize: 15,
                                    fontWeight: 600,
                                }}
                            >
                                How it works
                            </button>
                        </motion.div>

                        {/* Trust strip */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 16,
                                marginTop: 40,
                                flexWrap: 'wrap',
                            }}
                        >
                            {stats.map(s => (
                                <div key={s.label} style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                }}>
                                    <span style={{
                                        fontFamily: 'Cabinet Grotesk, sans-serif',
                                        fontWeight: 800,
                                        fontSize: 22,
                                        color: 'var(--text-hi)',
                                    }}>{s.value}</span>
                                    <span style={{ fontSize: 11, color: 'var(--text-low)', fontFamily: 'Space Mono, monospace' }}>
                                        {s.label}
                                    </span>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right: Constellation */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{
                            flex: '1 1 360px',
                            maxWidth: 520,
                            aspectRatio: '1/0.9',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {/* Glass frame */}
                        <div
                            className="glass"
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 'var(--r-xl)',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 32,
                                position: 'relative',
                                minHeight: 340,
                            }}
                        >
                            <ConstellationSVG size="hero" animate={true} />

                            {/* Floating "Trust Badge" — top-left */}
                            <div
                                className="glass-sm"
                                style={{
                                    position: 'absolute',
                                    top: 16,
                                    left: 16,
                                    padding: '8px 14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    animation: 'fade-slide-up 0.6s ease 1.2s both',
                                    borderRadius: 'var(--r-sm)',
                                }}
                            >
                                <div style={{
                                    width: 26, height: 26,
                                    background: 'var(--current-dim)',
                                    borderRadius: 6,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--current)',
                                    flexShrink: 0,
                                }}>
                                    <Shield size={13} />
                                </div>
                                <div>
                                    <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-hi)', margin: 0 }}>
                                        Dual-verified
                                    </p>
                                    <p style={{ fontSize: 9, color: 'var(--text-low)', margin: 0, fontFamily: 'Space Mono, monospace' }}>
                                        Both sides confirm
                                    </p>
                                </div>
                            </div>

                            {/* Floating ember tag — top-right */}
                            <div
                                className="glass-sm"
                                style={{
                                    position: 'absolute',
                                    top: 16,
                                    right: 16,
                                    padding: '8px 14px',
                                    animation: 'fade-slide-up 0.6s ease 1.4s both',
                                    borderRadius: 'var(--r-sm)',
                                }}
                            >
                                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ember)', fontFamily: 'Space Mono, monospace' }}>
                                    ₹0 FEES
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── How it Works ─────────────────────────────────────── */}
            <section
                id="how-it-works"
                style={{ padding: '100px 24px', maxWidth: 1200, margin: '0 auto' }}
            >
                <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 64 }}>
                    <p style={{
                        fontFamily: 'Space Mono, monospace',
                        fontSize: 11,
                        color: 'var(--text-low)',
                        letterSpacing: '0.15em',
                        marginBottom: 12,
                    }}>
                        THE PROCESS
                    </p>
                    <h2 style={{
                        fontFamily: 'Cabinet Grotesk, sans-serif',
                        fontWeight: 800,
                        fontSize: 'clamp(32px, 4vw, 48px)',
                        letterSpacing: '-0.025em',
                        color: 'var(--text-hi)',
                        marginBottom: 16,
                    }}>
                        How SkillSwap works
                    </h2>
                    <p style={{ fontSize: 16, color: 'var(--text-mid)', maxWidth: 480, margin: '0 auto', lineHeight: 1.65 }}>
                        A simple three-step loop that replaces money with mutual respect and trust.
                    </p>
                </motion.div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 24,
                }}>
                    {steps.map((step, i) => (
                        <motion.div
                            key={step.num}
                            {...fadeUp(i * 0.1)}
                            className="glass"
                            style={{
                                padding: '40px 32px',
                                borderRadius: 'var(--r-xl)',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Step number */}
                            <span style={{
                                position: 'absolute',
                                top: 24,
                                right: 28,
                                fontFamily: 'Space Mono, monospace',
                                fontSize: 11,
                                color: 'var(--text-low)',
                                letterSpacing: '0.1em',
                            }}>
                                {step.num}
                            </span>

                            {/* Accent dot */}
                            <div style={{
                                width: 48,
                                height: 48,
                                borderRadius: 14,
                                background: step.dim,
                                border: `1px solid ${step.accent}30`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 24,
                            }}>
                                {step.seal ? (
                                    // Mini exchange seal icon
                                    <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                                        <circle cx="14" cy="14" r="9" fill="none" stroke="var(--ember)" strokeWidth="2"
                                            strokeLinecap="round" strokeDasharray="56.5" strokeDashoffset="22" />
                                        <circle cx="14" cy="14" r="9" fill="none" stroke="var(--current)" strokeWidth="2"
                                            strokeLinecap="round" strokeDasharray="56.5" strokeDashoffset="22"
                                            transform="rotate(180 14 14)" />
                                    </svg>
                                ) : i === 0 ? (
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={step.accent} strokeWidth="1.8" strokeLinecap="round">
                                        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                                    </svg>
                                ) : (
                                    <Users size={22} color={step.accent} />
                                )}
                            </div>

                            <h3 style={{
                                fontFamily: 'Cabinet Grotesk, sans-serif',
                                fontWeight: 700,
                                fontSize: 20,
                                color: 'var(--text-hi)',
                                marginBottom: 12,
                            }}>
                                {step.title}
                            </h3>
                            <p style={{ fontSize: 14, color: 'var(--text-mid)', lineHeight: 1.7 }}>
                                {step.body}
                            </p>

                            {/* Accent bottom line */}
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: 2,
                                background: `linear-gradient(90deg, ${step.accent}60, transparent)`,
                            }} />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── CTA Section ──────────────────────────────────────── */}
            <section style={{ padding: '80px 24px 120px', maxWidth: 900, margin: '0 auto' }}>
                <motion.div
                    {...fadeUp()}
                    className="glass"
                    style={{
                        borderRadius: 'var(--r-2xl)',
                        padding: 'clamp(48px, 8vw, 80px)',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Background accent */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(ellipse at 50% 0%, rgba(255,138,91,0.08) 0%, transparent 60%)',
                        pointerEvents: 'none',
                    }} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2 style={{
                            fontFamily: 'Cabinet Grotesk, sans-serif',
                            fontWeight: 900,
                            fontSize: 'clamp(30px, 4vw, 48px)',
                            letterSpacing: '-0.025em',
                            color: 'var(--text-hi)',
                            marginBottom: 16,
                        }}>
                            Ready to swap your first skill?
                        </h2>
                        <p style={{ fontSize: 16, color: 'var(--text-mid)', marginBottom: 40, lineHeight: 1.65 }}>
                            Join your community and see what skills are available today.
                            It's free, it's local, and it's built on trust.
                        </p>

                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
                            {user ? (
                                <Link to="/add-skill" className="btn-ember"
                                    style={{ padding: '14px 32px', borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                    List a skill <ArrowRight size={16} />
                                </Link>
                            ) : (
                                <>
                                    <Link to="/register" className="btn-ember"
                                        style={{ padding: '14px 32px', borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                        Teach a skill <ArrowRight size={16} />
                                    </Link>
                                    <Link to="/register" className="btn-current"
                                        style={{ padding: '14px 32px', borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                        Learn a skill <ArrowRight size={16} />
                                    </Link>
                                </>
                            )}
                        </div>

                        <p style={{ fontSize: 12, color: 'var(--text-low)', fontFamily: 'Space Mono, monospace' }}>
                            FREE TO JOIN · NO FEES · TRUST-FIRST
                        </p>
                    </div>
                </motion.div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;