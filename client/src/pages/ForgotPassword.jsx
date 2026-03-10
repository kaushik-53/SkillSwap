import { useState, useContext } from 'react';
import { Mail, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ForgotPassword = () => {
    const { forgotPassword } = useContext(AuthContext);
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
            setMessage(data.message);
            // After successful request, redirect to reset-password page after a short delay
            setTimeout(() => {
                navigate('/reset-password', { state: { email } });
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-white font-sans items-center justify-center p-6">
            <div className="w-full max-w-md space-y-8">
                <div className="flex justify-start">
                    <Link to="/login" className="group flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Login
                    </Link>
                </div>

                <div className="space-y-2">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Forgot Password?</h2>
                    <p className="text-gray-500 font-medium">Enter your email and we'll send you a 6-digit code to reset your password.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-900 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute left-4 top-3.5 text-gray-400 pointer-events-none">
                                <Mail size={20} />
                            </div>
                            <input
                                type="email"
                                required
                                placeholder="enter your email"
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-gray-900 placeholder:text-gray-400 font-medium"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {message && <div className="p-4 bg-green-50 text-green-700 rounded-xl text-sm font-medium border border-green-100">{message}</div>}
                    {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium border border-red-100">{error}</div>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 size={20} className="animate-spin" /> : <span>Send Reset Code</span>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
