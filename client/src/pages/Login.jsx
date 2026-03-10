import { useState, useContext } from 'react';
import axios from 'axios';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2, Shield, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import AuthContext from '../context/AuthContext';

const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.09.56 4.23 1.65l3.18-3.18C17.45 2.02 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const Login = () => {
    const { login, googleAuth, verifyOtp, resendOtp } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isOtpStep, setIsOtpStep] = useState(false);
    const [emailOtp, setEmailOtp] = useState('');
    const [maskedPhone, setMaskedPhone] = useState('');
    const [resendTimer, setResendTimer] = useState(0);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (error) {
            if (error.response?.data?.requiresVerification) {
                setIsOtpStep(true);
                setMaskedPhone(error.response.data.maskedPhone || formData.email);
                setResendTimer(60);
                alert("Please verify your account first. OTP sent.");
            } else {
                alert(error.response?.data?.message || 'Login failed');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await verifyOtp(formData.email, emailOtp);
            navigate('/dashboard');
        } catch (error) {
            alert(error.response?.data?.message || 'OTP verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendTimer > 0) return;
        try {
            await resendOtp(formData.email);
            setResendTimer(60);
            alert("OTP resent successfully");
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to resend OTP');
        }
    };

    // Timer effect
    useState(() => {
        let interval;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsLoading(true);
            try {
                await googleAuth(tokenResponse.access_token);
                navigate('/dashboard');
            } catch (error) {
                if (error.response?.data?.requiresVerification) {
                    setIsOtpStep(true);
                    setMaskedPhone(error.response.data.maskedPhone || "your device");
                    setResendTimer(60);
                    alert("Complete OTP verification first.");
                } else {
                    alert(error.response?.data?.message || "Google Login failed");
                }
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => {
            alert("Google Login Failed");
        }
    });

    return (
        <div className="min-h-screen w-full flex bg-white font-sans">
            {/* LEFT SIDE: Visual Branding */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12 text-white bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center">
                {/* Dark Gradient Overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 z-10 pointer-events-none"></div>

                <div className="relative z-20">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="p-1 px-1.5 bg-white/20 rounded backdrop-blur-sm border border-white/30">
                            <Shield size={18} className="text-white fill-white/20" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-white/90">SkillSwap</span>
                    </div>
                </div>

                <div className="relative z-20 max-w-lg mb-12">
                    <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-[1.15] text-white">
                        Unlock local talent.<br />
                        Exchange skills.<br />
                        Build trust.
                    </h1>
                    <p className="text-base text-gray-300 font-medium leading-relaxed max-w-md">
                        Join thousands of neighbors sharing their passions.<br />From gardening to coding, grow your community one<br />skill at a time.
                    </p>
                </div>

                <div className="relative z-20 text-[10px] text-gray-400 font-medium tracking-wider">
                    © {new Date().getFullYear()} SkillSwap Neighborhoods
                </div>
            </div>

            {/* RIGHT SIDE: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 overflow-y-auto">
                <div className="w-full max-w-sm space-y-8">
                    <div className="flex justify-center mb-12">
                        <Link to="/" className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-all duration-200">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>
                    </div>

                    <div className="space-y-2 text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            {isOtpStep ? "Verify Your Identity" : "Welcome Back!"}
                        </h2>
                        <p className="text-gray-500 font-medium text-sm">
                            {isOtpStep
                                ? `Enter the 6-digit code sent to ${maskedPhone}`
                                : "Log in to connect with your community."
                            }
                        </p>
                    </div>

                    {isOtpStep ? (
                        <form onSubmit={handleVerifyOtp} className="space-y-6 mt-6">
                            <div className="space-y-2">
                                <div className="mt-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                            <Mail size={12} className="text-blue-500" />
                                            Email OTP
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-3 text-gray-400 pointer-events-none">
                                                <ShieldCheck size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                maxLength="6"
                                                required
                                                placeholder="000000"
                                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-xl font-bold text-center text-gray-900 placeholder:text-gray-300"
                                                value={emailOtp}
                                                onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ''))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || emailOtp.length !== 6}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <span>Verify Account</span>}
                            </button>

                            <div className="text-center space-y-4">
                                <p className="text-sm text-gray-500">
                                    Didn't receive the code?{' '}
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={resendTimer > 0}
                                        className={`font-bold ${resendTimer > 0 ? 'text-gray-400' : 'text-blue-600 hover:underline'}`}
                                    >
                                        {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                                    </button>
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setIsOtpStep(false)}
                                    className="text-xs text-gray-400 hover:text-gray-600 font-medium"
                                >
                                    Login with a different account
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleLogin} className="space-y-5 mt-8">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-900">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="enter your Email"
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-gray-900 placeholder:text-gray-400 text-sm"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-gray-900">Password</label>
                                    <Link to="/forgot-password" title="Forgot Password link" className="text-[10px] font-bold text-blue-600 hover:text-blue-700 hover:underline">
                                        Forgot Password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        required
                                        placeholder="Enter your password"
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-gray-900 placeholder:text-gray-400 text-sm pr-12"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-3 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                        tabIndex="-1"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg shadow-sm shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4 text-sm"
                            >
                                {isLoading ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <>
                                        Sign In <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {!isOtpStep && (
                        <>
                            <div className="relative mt-8 mb-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-100"></div>
                                </div>
                                <div className="relative flex justify-center text-[10px]">
                                    <span className="px-4 bg-white text-gray-400 uppercase tracking-widest font-medium">Or continue with</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold py-3.5 rounded-lg border border-gray-200 transition-all flex items-center justify-center gap-3 text-sm shadow-sm"
                            >
                                <GoogleIcon />
                                <span>Google</span>
                            </button>

                            <div className="mt-8 pt-6 border-t border-gray-50">
                                <div className="text-center mb-4">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">New to SkillSwap?</span>
                                </div>

                                <Link
                                    to="/register"
                                    className="w-full flex items-center justify-center bg-white hover:bg-gray-50 text-blue-600 font-bold py-3.5 rounded-lg border border-gray-200 transition-all text-sm shadow-sm"
                                >
                                    Create an account
                                </Link>
                            </div>
                        </>
                    )}

                    <div className="text-center pt-6">
                        <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1.5 font-medium">
                            <Lock size={10} /> Secure, encrypted connection
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
