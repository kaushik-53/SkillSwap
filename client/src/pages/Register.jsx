import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2, User, MapPin, CheckCircle, ArrowLeft, Phone, ShieldCheck } from 'lucide-react';
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

const Register = () => {
    const { register, googleAuth, verifyOtp, resendOtp } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        location: '',
        phone: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [isOtpStep, setIsOtpStep] = useState(false);
    const [emailOtp, setEmailOtp] = useState('');
    const [resendTimer, setResendTimer] = useState(0);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!agreeTerms) {
            alert("Please agree to the Terms of Service and Privacy Policy.");
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            alert("Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.");
            return;
        }

        setIsLoading(true);
        try {
            await register(formData.name, formData.email, formData.password, formData.location, formData.phone);
            setIsOtpStep(true);
            setResendTimer(60);
        } catch (error) {
            alert(error.response?.data?.message || 'Registration failed');
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
    useEffect(() => {
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
                console.error(error);
                alert("Google Login failed");
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
            {/* LEFT SIDE: Visual Branding - Indian Context */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-end p-12 text-white">
                {/* Background Image - Indian Community Context */}
                <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')" }}></div>
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>

                <div className="relative z-20 mb-8 ml-2">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                            <MapPin size={24} className="text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">SkillSwap</span>
                    </div>

                    <h1 className="text-5xl font-bold tracking-tight mb-4 leading-tight">
                        Unlock the potential<br />
                        of your <span className="text-orange-400">neighborhood.</span>
                    </h1>
                    <p className="text-lg text-gray-200 font-medium leading-relaxed max-w-md mb-8">
                        Join SkillSwap to trade talents, learn new skills, and grow your local community like never before.
                    </p>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <CheckCircle size={20} className="text-green-400 fill-current" />
                            <span className="font-medium">Safe & Verified Profiles</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: Registration Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 overflow-y-auto">
                <div className="w-full max-w-md space-y-6">
                    <div className="flex justify-start">
                        <Link to="/" className="group flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200">
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            {isOtpStep ? "Verify Your Account" : "Get Started"}
                        </h2>
                        <p className="text-gray-500 font-medium">
                            {isOtpStep
                                ? `We've sent a 6-digit code to ${formData.email}`
                                : "Create your account to start swapping skills today."
                            }
                        </p>
                    </div>

                    {isOtpStep ? (
                        <form onSubmit={handleVerifyOtp} className="space-y-6 mt-6">
                            <div className="mt-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                                        <Mail size={16} className="text-blue-500" />
                                        Email OTP
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-3.5 text-gray-400 pointer-events-none">
                                            <ShieldCheck size={20} />
                                        </div>
                                        <input
                                            type="text"
                                            maxLength="6"
                                            required
                                            placeholder="000000"
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-xl font-bold text-center text-gray-900 placeholder:text-gray-300"
                                            value={emailOtp}
                                            onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ''))}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || emailOtp.length !== 6}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <span>Verify & Activate Account</span>}
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
                                    Change email or phone number
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-3.5 text-gray-400 pointer-events-none">
                                        <User size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        placeholder="Enter your full name"
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-gray-900 placeholder:text-gray-400 font-medium"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-3.5 text-gray-400 pointer-events-none">
                                        <Mail size={20} />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="you@example.com"
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-gray-900 placeholder:text-gray-400 font-medium"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-bold text-gray-700 ml-1">Phone Number</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-3.5 text-gray-400 pointer-events-none">
                                        <Phone size={20} />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        placeholder="+91 00000 00000"
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-gray-900 placeholder:text-gray-400 font-medium"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-3.5 text-gray-400 pointer-events-none">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        required
                                        placeholder="Create a password"
                                        className="w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-gray-900 placeholder:text-gray-400 font-medium"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-400 ml-1">Must be at least 8 characters long.</p>
                            </div>

                            {/* Location Input (Preserved from original logic) */}
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-gray-700 ml-1">Location</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-3.5 text-gray-400 pointer-events-none">
                                        <MapPin size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        name="location"
                                        required
                                        placeholder="Neighbourhood / City"
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-gray-900 placeholder:text-gray-400 font-medium"
                                        value={formData.location}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>


                            {/* Terms Checkbox */}
                            <div className="flex items-start gap-3 ml-1">
                                <div className="flex items-center h-5">
                                    <input
                                        id="terms"
                                        type="checkbox"
                                        checked={agreeTerms}
                                        onChange={(e) => setAgreeTerms(e.target.checked)}
                                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                                    />
                                </div>
                                <label htmlFor="terms" className="text-sm text-gray-500 font-medium">
                                    I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <Loader2 size={20} className="animate-spin" />
                                ) : (
                                    <span>Create Account</span>
                                )}
                            </button>
                        </form>
                    )}

                    {!isOtpStep && (
                        <>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500 font-medium">Or sign up with</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold py-3.5 rounded-xl border border-gray-200 transition-all flex items-center justify-center gap-3"
                                >
                                    <GoogleIcon />
                                    <span>Google</span>
                                </button>
                            </div>

                            <div className="text-center pt-2">
                                <p className="text-sm text-gray-500">
                                    Already have an account?{' '}
                                    <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all">
                                        Log in
                                    </Link>
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Register;
