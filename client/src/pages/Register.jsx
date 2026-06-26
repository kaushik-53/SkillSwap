import { useState, useEffect, useContext } from 'react';
import { Eye, EyeOff, ArrowRight, ArrowLeft, Lock, Mail, User, MapPin, Phone } from 'lucide-react';
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

const getInputStyle = (theme) => ({
    width: '100%',
    padding: '12px 16px 12px 40px',
    background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.80)',
    border: '1px solid var(--glass-border)',
    borderRadius: 10,
    color: 'var(--text-hi)',
    fontSize: 14,
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
});

const LabeledInput = ({ label, icon: Icon, rightElement, inputStyle, ...props }) => (
    <div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-mid)', marginBottom: 8 }}>
            {label}
        </label>
        <div style={{ position: 'relative' }}>
            {Icon && <Icon size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-low)', pointerEvents: 'none' }} />}
            <input
                {...props}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'var(--current)'; e.target.style.boxShadow = '0 0 0 3px var(--current-dim)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--glass-border)'; e.target.style.boxShadow = 'none'; }}
            />
            {rightElement}
        </div>
    </div>
);

const Register = () => {
    const { register, googleAuth, verifyOtp, resendOtp } = useContext(AuthContext);
    const { theme } = useTheme();
    const inputStyle = getInputStyle(theme);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', location: '', phone: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [isOtpStep, setIsOtpStep] = useState(false);
    const [emailOtp, setEmailOtp] = useState('');
    const [resendTimer, setResendTimer] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        if (resendTimer <= 0) return;
        const interval = setInterval(() => setResendTimer(t => t - 1), 1000);
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!agreeTerms) { setError('Please agree to the Terms of Service and Privacy Policy.'); return; }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            setError('Password must be 8+ chars with uppercase, lowercase, number, and special character.');
            return;
        }

        setIsLoading(true);
        setError('');
        try {
            await register(formData.name, formData.email, formData.password, formData.location, formData.phone);
            setIsOtpStep(true);
            setResendTimer(60);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
            setError(err.response?.data?.message || 'Failed to resend. Please wait.');
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
                setError(err.response?.data?.message || 'Google sign-up failed.');
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => setError('Google sign-up failed. Please try again.'),
    });

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--ink)' }}>
            {/* Left — Constellation branding */}
            <div
                className="hidden lg:flex"
                style={{
                    width: '45%',
                    background: 'var(--ink-2)',
                    borderRight: '1px solid var(--glass-border)',
                    flexDirection: 'column',
                    padding: 48,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
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

                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ConstellationSVG size="compact" animate={true} />
                </div>

                <div>
                    <h2 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 900, fontSize: 32, letterSpacing: '-0.03em', color: 'var(--text-hi)', lineHeight: 1.1, marginBottom: 12 }}>
                        Join the ledger<br />
                        <span className="text-gradient-ec">of trust.</span>
                    </h2>
                    <p style={{ fontSize: 14, color: 'var(--text-mid)', lineHeight: 1.65 }}>
                        Your skills have value. Trade them directly — no money needed.
                    </p>
                </div>
            </div>

            {/* Right — Form */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', overflowY: 'auto' }}>
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ width: '100%', maxWidth: 440 }}
                >
                    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-low)', textDecoration: 'none', marginBottom: 40, transition: 'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-mid)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-low)'}
                    >
                        <ArrowLeft size={14} /> Back to home
                    </Link>

                    <div style={{ marginBottom: 32 }}>
                        <h1 style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 800, fontSize: 30, letterSpacing: '-0.025em', color: 'var(--text-hi)', marginBottom: 8 }}>
                            {isOtpStep ? 'Verify your account' : 'Create your account'}
                        </h1>
                        <p style={{ fontSize: 14, color: 'var(--text-mid)' }}>
                            {isOtpStep
                                ? `We've sent a 6-digit code to ${formData.email}`
                                : 'Start exchanging skills with your community.'
                            }
                        </p>
                    </div>

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
                            <OtpInput value={emailOtp} onChange={setEmailOtp} onResend={handleResendOtp} resendTimer={resendTimer} />
                            <Button variant="current" loading={isLoading} size="lg" type="submit" style={{ width: '100%', borderRadius: 12, marginBottom: 16 }} disabled={emailOtp.length !== 6}>
                                Verify &amp; activate account
                            </Button>
                            <button type="button" onClick={() => setIsOtpStep(false)} style={{ width: '100%', padding: '12px', background: 'none', border: 'none', color: 'var(--text-low)', fontSize: 13, cursor: 'pointer' }}>
                                Change email address
                            </button>
                        </form>
                    ) : (
                        <>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                <LabeledInput label="Full name" icon={User} type="text" name="name" required placeholder="your full name" value={formData.name} onChange={handleChange} inputStyle={inputStyle} />
                                <LabeledInput label="Email address" icon={Mail} type="email" name="email" required placeholder="enter your email" value={formData.email} onChange={handleChange} inputStyle={inputStyle} />
                                <LabeledInput label="Phone number" icon={Phone} type="tel" name="phone" required placeholder="+91 00000 00000" value={formData.phone} onChange={handleChange} inputStyle={inputStyle} />
                                <LabeledInput
                                    label="Password"
                                    icon={Lock}
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    required
                                    placeholder="Min. 8 chars, 1 upper, 1 number, 1 special"
                                    value={formData.password}
                                    onChange={handleChange}
                                    inputStyle={inputStyle}
                                    rightElement={
                                        <button type="button" onClick={() => setShowPassword(v => !v)} tabIndex={-1} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-low)', cursor: 'pointer', display: 'flex' }} aria-label={showPassword ? 'Hide' : 'Show'}>
                                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    }
                                />
                                <LabeledInput label="Location" icon={MapPin} type="text" name="location" required placeholder="Neighbourhood / City" value={formData.location} onChange={handleChange} inputStyle={inputStyle} />

                                {/* Terms */}
                                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={agreeTerms}
                                        onChange={e => setAgreeTerms(e.target.checked)}
                                        style={{ marginTop: 2, accentColor: 'var(--current)', width: 16, height: 16, flexShrink: 0 }}
                                    />
                                    <span style={{ fontSize: 12, color: 'var(--text-low)', lineHeight: 1.6 }}>
                                        I agree to the{' '}
                                        <Link to="/terms" style={{ color: 'var(--current)', fontWeight: 600 }}>Terms of Service</Link>
                                        {' '}and{' '}
                                        <Link to="/privacy" style={{ color: 'var(--current)', fontWeight: 600 }}>Privacy Policy</Link>.
                                    </span>
                                </label>

                                <Button variant="ember" loading={isLoading} size="lg" type="submit" style={{ width: '100%', borderRadius: 12, marginTop: 4 }}>
                                    Create account <ArrowRight size={16} />
                                </Button>
                            </form>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
                                <div style={{ flex: 1, height: 1, background: 'var(--glass-border)' }} />
                                <span style={{ fontSize: 11, color: 'var(--text-low)', fontFamily: 'Space Mono, monospace', letterSpacing: '0.1em' }}>OR</span>
                                <div style={{ flex: 1, height: 1, background: 'var(--glass-border)' }} />
                            </div>

                            <button type="button" onClick={handleGoogleLogin} className="btn-ghost" style={{ width: '100%', padding: '12px', borderRadius: 12, fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                                <GoogleIcon /> Continue with Google
                            </button>

                            <p style={{ textAlign: 'center', marginTop: 28, fontSize: 13, color: 'var(--text-low)' }}>
                                Already have an account?{' '}
                                <Link to="/login" style={{ color: 'var(--current)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
                            </p>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
