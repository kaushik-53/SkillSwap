import { useState, useContext, useEffect } from 'react';
import { Mail, ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ConstellationSVG from '../components/ui/ConstellationSVG';
import OtpInput from '../components/ui/OtpInput';
import Button from '../components/ui/Button';

const ResetPassword = () => {
    const { resetPassword, forgotPassword } = useContext(AuthContext);
    const { theme } = useTheme();
    const navigate = useNavigate();
    const routerLocation = useLocation();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (routerLocation.state?.email) {
            setEmail(routerLocation.state.email);
        }
    }, [routerLocation.state]);

    useEffect(() => {
        if (resendTimer <= 0) return;
        const interval = setInterval(() => setResendTimer(t => t - 1), 1000);
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleResendOtp = async () => {
        if (resendTimer > 0 || !email) return;
        try {
            await forgotPassword(email);
            setResendTimer(60);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend reset code.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (otp.length !== 6) {
            setError('Please enter the 6-digit verification code.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            setError('Password must contain an uppercase letter, a lowercase letter, a number, and a special character.');
            return;
        }

        setIsLoading(true);
        try {
            await resetPassword(email, otp, newPassword);
            alert('Password reset successful! Redirecting to login...');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Please check your inputs.');
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
                        to="/forgot-password"
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
                        <ArrowLeft size={14} /> Back
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
                            Setup new password
                        </h1>
                        <p style={{ fontSize: 14, color: 'var(--text-mid)', lineHeight: 1.5 }}>
                            Resetting password for <span style={{ color: 'var(--current)', fontWeight: 'bold' }}>{email || 'your account'}</span>
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

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {!routerLocation.state?.email && (
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
                        )}

                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: 12,
                                fontWeight: 600,
                                color: 'var(--text-mid)',
                                marginBottom: 12,
                                letterSpacing: '0.02em',
                            }}>
                                6-Digit Code
                            </label>
                            <OtpInput
                                value={otp}
                                onChange={setOtp}
                                onResend={handleResendOtp}
                                resendTimer={resendTimer}
                            />
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: 12,
                                fontWeight: 600,
                                color: 'var(--text-mid)',
                                marginBottom: 8,
                                letterSpacing: '0.02em',
                            }}>
                                New Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={15} style={{
                                    position: 'absolute', left: 14, top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--text-low)', pointerEvents: 'none',
                                }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    placeholder="••••••••"
                                    className="glass-input"
                                    style={{ paddingLeft: 40, paddingRight: 40 }}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute', right: 14, top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none', border: 'none',
                                        color: 'var(--text-low)', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: 12,
                                fontWeight: 600,
                                color: 'var(--text-mid)',
                                marginBottom: 8,
                                letterSpacing: '0.02em',
                            }}>
                                Confirm Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={15} style={{
                                    position: 'absolute', left: 14, top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--text-low)', pointerEvents: 'none',
                                }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    placeholder="••••••••"
                                    className="glass-input"
                                    style={{ paddingLeft: 40 }}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button
                            variant="current"
                            loading={isLoading}
                            size="lg"
                            style={{ width: '100%', borderRadius: 12, marginTop: 12 }}
                            type="submit"
                        >
                            Reset Password
                        </Button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default ResetPassword;
