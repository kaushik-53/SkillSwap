import { createContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const timeoutIdRef = useRef(null);

    const updateUserState = (userData) => {
        setUser(prev => ({ ...prev, ...userData }));
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
            timeoutIdRef.current = null;
        }
    };

    const setupAutoLogout = (token) => {
        try {
            if (!token) return;
            const payloadUrl = token.split('.')[1];
            const base64 = payloadUrl.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(window.atob(base64));

            const expTime = payload.exp * 1000;
            const remainingTime = expTime - Date.now();

            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }

            if (remainingTime > 0) {
                timeoutIdRef.current = setTimeout(() => {
                    logout();
                    // Redirect to login — the React state + PrivateRoute will handle this,
                    // but we also forcibly navigate to ensure the user sees login
                    window.location.href = '/login';
                }, remainingTime);
            } else {
                logout();
            }
        } catch (error) {
            console.error('Error setting up auto logout', error);
        }
    };

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    };
                    const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/me`, config);
                    setUser(data);
                    setupAutoLogout(token);
                } catch (error) {
                    logout();
                }
            }
            setLoading(false);
        };
        checkUserLoggedIn();

        return () => {
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
        }
    }, []);

    const login = async (email, password) => {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, { email, password });
        localStorage.setItem('token', data.token);
        setUser(data);
        setupAutoLogout(data.token);
    };

    const register = async (name, email, password, location, phone) => {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, { name, email, password, location, phone });
        return data; // Return data so component can handle redirect to OTP
    };

    const verifyOtp = async (email, emailOtp) => {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/verify-otp`, { email, emailOtp });
        localStorage.setItem('token', data.token);
        setUser(data);
        setupAutoLogout(data.token);
        return data;
    };

    const resendOtp = async (email) => {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/resend-otp`, { email });
        return data;
    };

    const forgotPassword = async (email) => {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/forgot-password`, { email });
        return data;
    };

    const resetPassword = async (email, otp, newPassword) => {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/reset-password`, { email, otp, newPassword });
        return data;
    };

    const googleAuth = async (token) => {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/google`, { token });
        localStorage.setItem('token', data.token);
        setUser(data);
        setupAutoLogout(data.token);
    };

    const requestDeleteAccount = async () => {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/profile/request-delete`, {}, config);
        return data;
    };

    const deleteAccount = async (otp) => {
        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: `Bearer ${token}` },
            data: { otp } // In axios, DELETE body goes inside `data` in config
        };
        await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/profile`, config);
        logout();
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, googleAuth, verifyOtp, resendOtp, forgotPassword, resetPassword, loading, updateUserState, deleteAccount, requestDeleteAccount }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
