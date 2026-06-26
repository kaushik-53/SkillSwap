import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Eye, EyeOff, ArrowRight, ArrowLeft, Lock, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ConstellationSVG from '../components/ui/ConstellationSVG';
import OtpInput from '../components/ui/OtpInput';
import Button from '../components/ui/Button';

const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.09.56 4.23 1.65l3.18-3.18C17.45 2.02 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const Login = () => {
    const { login, googleAuth, verifyOtp, resendOtp } = useContext(AuthContext);
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isOtpStep, setIsOtpStep] = useState(false);
    const [emailOtp, setEmailOtp] = useState('');
    const [maskedPhone, setMaskedPhone] = useState('');
    const [resendTimer, setResendTimer] = useState(0);
    const [error, setError] = useState('');

    // Resend countdown timer
    useEffect(() => {
        if (resendTimer <= 0) return;
        const interval = setInterval(() => setResendTimer(t => t - 1), 1000);
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            if (err.response?.data?.requiresVerification) {
                setIsOtpStep(true);
                setMaskedPhone(err.response.data.maskedPhone || formData.email);
                setResendTimer(60);
            } else {
                setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await verifyOtp(formData.email, emailOtp);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid code — please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendTimer > 0) return;
        try {
            await resendOtp(formData.email);
            setResendTimer(60);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend. Please wait a moment.');
        }
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsLoading(true);
            setError('');
            try {
                await googleAuth(tokenResponse.access_token);
                navigate('/dashboard');
            } catch (err) {
                if (err.response?.data?.requiresVerification) {
                    setIsOtpStep(true);
                    setMaskedPhone(err.response.data.maskedPhone || 'your email');
                    setResendTimer(60);
                } else {
                    setError(err.response?.data?.message || 'Google sign-in failed.');
                }
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => setError('Google sign-in failed. Please try again.'),
    });

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
                        to="/"
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
                        <ArrowLeft size={14} /> Back to home
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
                            {isOtpStep ? 'Verify your identity' : 'Welcome back'}
                        </h1>
                        <p style={{ fontSize: 14, color: 'var(--text-mid)' }}>
                            {isOtpStep
                                ? `Enter the 6-digit code sent to ${maskedPhone}`
                                : 'Sign in to continue your exchanges.'
                            }
                        </p>
                    </div>

                    {/* Error */}
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

                    {isOtpStep ? (
                        <form onSubmit={handleVerifyOtp}>
                            <OtpInput
                                value={emailOtp}
                                onChange={setEmailOtp}
                                onResend={handleResendOtp}
                                resendTimer={resendTimer}
                            />

                            <Button
                                variant="current"
                                loading={isLoading}
                                size="lg"
                                style={{ width: '100%', borderRadius: 12, marginBottom: 16 }}
                                disabled={emailOtp.length !== 6}
                                type="submit"
                            >
                                Verify account
                            </Button>

                            <button
                                type="button"
                                onClick={() => setIsOtpStep(false)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-low)',
                                    fontSize: 13,
                                    cursor: 'pointer',
                                }}
                            >
                                Sign in with a different account
                            </button>
                        </form>
                    ) : (
                        <>
                            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
                                            name="email"
                                            required
                                            placeholder="enter your email"
                                            className="glass-input"
                                            style={{ paddingLeft: 40 }}
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-mid)', letterSpacing: '0.02em' }}>
                                            Password
                                        </label>
                                        <Link to="/forgot-password" style={{
                                            fontSize: 12, color: 'var(--current)',
                                            textDecoration: 'none', fontWeight: 600,
                                            transition: 'opacity 0.2s',
                                        }}>
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <Lock size={15} style={{
                                            position: 'absolute', left: 14, top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: 'var(--text-low)', pointerEvents: 'none',
                                        }} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            required
                                            placeholder="your password"
                                            className="glass-input"
                                            style={{ paddingLeft: 40, paddingRight: 44 }}
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(v => !v)}
                                            tabIndex={-1}
                                            style={{
                                                position: 'absolute', right: 14, top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'none', border: 'none',
                                                color: 'var(--text-low)', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center',
                                            }}
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    variant="ember"
                                    loading={isLoading}
                                    size="lg"
                                    type="submit"
                                    style={{ width: '100%', borderRadius: 12, marginTop: 8 }}
                                >
                                    Sign in <ArrowRight size={16} />
                                </Button>
                            </form>

                            {/* Divider */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
                                <div style={{ flex: 1, height: 1, background: 'var(--glass-border)' }} />
                                <span style={{ fontSize: 11, color: 'var(--text-low)', fontFamily: 'Space Mono, monospace', letterSpacing: '0.1em' }}>
                                    OR
                                </span>
                                <div style={{ flex: 1, height: 1, background: 'var(--glass-border)' }} />
                            </div>

                            {/* Google */}
                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                className="btn-ghost"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: 12,
                                    fontSize: 14,
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 10,
                                }}
                            >
                                <GoogleIcon />
                                Continue with Google
                            </button>

                            {/* Register link */}
                            <p style={{
                                textAlign: 'center',
                                marginTop: 32,
                                fontSize: 13,
                                color: 'var(--text-low)',
                            }}>
                                New to SkillSwap?{' '}
                                <Link to="/register" style={{ color: 'var(--current)', fontWeight: 600, textDecoration: 'none' }}>
                                    Create an account
                                </Link>
                            </p>
                        </>
                    )}

                    {/* Security note */}
                    <p style={{
                        textAlign: 'center',
                        marginTop: 24,
                        fontSize: 11,
                        color: 'var(--text-low)',
                        fontFamily: 'Space Mono, monospace',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                    }}>
                        <Lock size={10} /> Secure, encrypted connection
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
