import { useState, useContext } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ConstellationSVG from '../components/ui/ConstellationSVG';
import Button from '../components/ui/Button';

const ForgotPassword = () => {
    const { forgotPassword } = useContext(AuthContext);
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');
        try {
            const data = await forgotPassword(email);
            setMessage(data.message || 'OTP reset code sent successfully.');
            // After successful request, redirect to reset-password page after a short delay
            setTimeout(() => {
                navigate('/reset-password', { state: { email } });
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            background: 'var(--ink)',
        }}>
            {/* Left — Constellation branding */}
            <div
                className="hidden lg:flex"
                style={{
                    width: '50%',
                    background: 'var(--ink-2)',
                    borderRight: '1px solid var(--glass-border)',
                    flexDirection: 'column',
                    padding: 48,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, zIndex: 2, position: 'relative' }}>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <circle cx="14" cy="14" r="9" fill="none" stroke="var(--ember)" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="56.5" strokeDashoffset="22" />
                        <circle cx="14" cy="14" r="9" fill="none" stroke="var(--current)" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="56.5" strokeDashoffset="22" transform="rotate(180 14 14)" />
                        <circle cx="11" cy="14" r="1.8" fill="var(--ember)" opacity="0.9" />
                        <circle cx="17" cy="14" r="1.8" fill="var(--current)" opacity="0.9" />
                    </svg>
                    <span style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--text-hi)', letterSpacing: '-0.02em' }}>
                        SkillSwap
                    </span>
                </div>

                {/* Constellation */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                }}>
                    <ConstellationSVG size="compact" animate={true} />
                </div>

                {/* Tagline */}
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <h2 style={{
                        fontFamily: 'Cabinet Grotesk, sans-serif',
                        fontWeight: 900,
                        fontSize: 36,
                        letterSpacing: '-0.03em',
                        color: 'var(--text-hi)',
                        lineHeight: 1.1,
                        marginBottom: 12,
                    }}>
                        Exchange skills,<br />
                        <span className="text-gradient-ec">not money.</span>
                    </h2>
                    <p style={{ fontSize: 14, color: 'var(--text-mid)', lineHeight: 1.65 }}>
                        A trust-based community where your knowledge is the currency.
                    </p>
                </div>
            </div>

            {/* Right — Form */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px 24px',
                overflowY: 'auto',
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ width: '100%', maxWidth: 400 }}
                >
                    {/* Back link */}
                    <Link
                        to="/login"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            fontSize: 13,
                            color: 'var(--text-low)',
                            textDecoration: 'none',
                            marginBottom: 40,
                            transition: 'color 0.2s ease',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-mid)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-low)'}
                    >
                        <ArrowLeft size={14} /> Back to Login
                    </Link>

                    {/* Header */}
                    <div style={{ marginBottom: 36 }}>
                        <h1 style={{
                            fontFamily: 'Cabinet Grotesk, sans-serif',
                            fontWeight: 800,
                            fontSize: 32,
                            letterSpacing: '-0.025em',
                            color: 'var(--text-hi)',
                            marginBottom: 8,
                        }}>
                            Forgot password?
                        </h1>
                        <p style={{ fontSize: 14, color: 'var(--text-mid)', lineHeight: 1.5 }}>
                            Enter your email and we'll send you a 6-digit code to reset your password.
                        </p>
                    </div>

                    {/* Alerts */}
                    {message && (
                        <div style={{
                            marginBottom: 20,
                            padding: '12px 16px',
                            background: 'rgba(52,211,153,0.10)',
                            border: '1px solid rgba(52,211,153,0.25)',
                            borderRadius: 10,
                            fontSize: 13,
                            color: theme === 'dark' ? '#A7F3D0' : '#047857',
                        }}>
                            {message}
                        </div>
                    )}
                    {error && (
                        <div style={{
                            marginBottom: 20,
                            padding: '12px 16px',
                            background: 'rgba(248,113,113,0.10)',
                            border: '1px solid rgba(248,113,113,0.25)',
                            borderRadius: 10,
                            fontSize: 13,
                            color: theme === 'dark' ? '#FCA5A5' : '#B91C1C',
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: 12,
                                fontWeight: 600,
                                color: 'var(--text-mid)',
                                marginBottom: 8,
                                letterSpacing: '0.02em',
                            }}>
                                Email address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={15} style={{
                                    position: 'absolute', left: 14, top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--text-low)', pointerEvents: 'none',
                                }} />
                                <input
                                    type="email"
                                    required
                                    placeholder="you@example.com"
                                    className="glass-input"
                                    style={{ paddingLeft: 40 }}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button
                            variant="ember"
                            loading={isLoading}
                            size="lg"
                            style={{ width: '100%', borderRadius: 12, marginTop: 8 }}
                            type="submit"
                        >
                            Send Reset Code
                        </Button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default ForgotPassword;
