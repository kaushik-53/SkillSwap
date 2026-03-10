import { useState, useContext, useEffect } from 'react';
import { Mail, ArrowLeft, Loader2, ShieldCheck, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ResetPassword = () => {
    const { resetPassword } = useContext(AuthContext);
    const navigate = useNavigate();
    const routerLocation = useLocation();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (routerLocation.state?.email) {
            setEmail(routerLocation.state.email);
        }
    }, [routerLocation.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters');
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
            setError(err.response?.data?.message || 'Verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-white font-sans items-center justify-center p-6">
            <div className="w-full max-w-md space-y-8">
                <div className="flex justify-start">
                    <Link to="/forgot-password" title="Go back" className="group flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Back
                    </Link>
                </div>

                <div className="space-y-2">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Setup New Password</h2>
                    <p className="text-gray-500 font-medium">Resetting password for <span className="text-blue-600 font-bold">{email}</span></p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!routerLocation.state?.email && (
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-900 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute left-4 top-3.5 text-gray-400">
                                    <Mail size={20} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    placeholder="you@example.com"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 transition-all outline-none font-medium"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-900 uppercase tracking-widest ml-1">6-Digit OTP</label>
                        <div className="relative">
                            <div className="absolute left-4 top-3.5 text-gray-400">
                                <ShieldCheck size={20} />
                            </div>
                            <input
                                type="text"
                                maxLength="6"
                                required
                                placeholder="000000"
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 transition-all outline-none text-xl font-bold tracking-widest"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-900 uppercase tracking-widest ml-1">New Password</label>
                        <div className="relative">
                            <div className="absolute left-4 top-3.5 text-gray-400">
                                <Lock size={20} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="••••••••"
                                className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 transition-all outline-none font-medium"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-900 uppercase tracking-widest ml-1">Confirm New Password</label>
                        <div className="relative">
                            <div className="absolute left-4 top-3.5 text-gray-400">
                                <Lock size={20} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="••••••••"
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 transition-all outline-none font-medium"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium border border-red-100">{error}</div>}

                    <button
                        type="submit"
                        disabled={isLoading || otp.length !== 6 || !newPassword}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 size={20} className="animate-spin" /> : <span>Reset Password</span>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
