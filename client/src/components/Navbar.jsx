import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getAvatarUrl } from '../utils/imageHelpers';
import { LogOut, Menu, X, Sun, Moon } from 'lucide-react';

/* Exchange Seal micro-logo */
const SealLogo = () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="14" r="9" fill="none" stroke="var(--ember)" strokeWidth="2.2"
            strokeLinecap="round" strokeDasharray="56.5" strokeDashoffset="22" />
        <circle cx="14" cy="14" r="9" fill="none" stroke="var(--current)" strokeWidth="2.2"
            strokeLinecap="round" strokeDasharray="56.5" strokeDashoffset="22"
            transform="rotate(180 14 14)" />
        <circle cx="11" cy="14" r="1.8" fill="var(--ember)" opacity="0.9" />
        <circle cx="17" cy="14" r="1.8" fill="var(--current)" opacity="0.9" />
    </svg>
);

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) setIsMenuOpen(false); // close menu when resizing to desktop
        };
        window.addEventListener('resize', handleResize, { passive: true });
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close menu on route change
    useEffect(() => setIsMenuOpen(false), [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { name: 'Explore', path: '/explore' },
        { name: 'Dashboard', path: '/dashboard', private: true },
        { name: 'My Swaps', path: '/my-swaps', private: true },
        { name: 'About', path: '/about', publicOnly: true },
    ];

    const isActive = (path) => location.pathname === path;

    const navLinkStyle = (active) => ({
        fontFamily: 'Inter, sans-serif',
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: '0.01em',
        color: active ? 'var(--text-hi)' : 'var(--text-mid)',
        textDecoration: 'none',
        position: 'relative',
        paddingBottom: 2,
        transition: 'color 0.2s ease',
    });

    return (
        <nav
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                background: scrolled
                    ? theme === 'dark' ? 'rgba(10,14,31,0.94)' : 'rgba(244,245,251,0.96)'
                    : theme === 'dark' ? 'rgba(10,14,31,0.50)' : 'rgba(244,245,251,0.70)',
                backdropFilter: scrolled ? 'blur(32px) saturate(180%)' : 'blur(16px) saturate(140%)',
                WebkitBackdropFilter: scrolled ? 'blur(32px)' : 'blur(16px)',
                borderBottom: '1px solid var(--glass-border)',
                boxShadow: scrolled
                    ? theme === 'dark' ? '0 4px 32px rgba(0,0,0,0.4)' : '0 4px 24px rgba(15,23,42,0.10)'
                    : 'none',
                transition: 'background 0.3s ease, box-shadow 0.3s ease',
            }}
        >
            <div style={{
                maxWidth: 1200,
                margin: '0 auto',
                padding: '0 24px',
                height: 72,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 24,
            }}>
                {/* ── Logo ──────────────────────────────── */}
                <Link
                    to="/"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        textDecoration: 'none',
                        flexShrink: 0,
                    }}
                >
                    <SealLogo />
                    <span style={{
                        fontFamily: 'Cabinet Grotesk, sans-serif',
                        fontWeight: 800,
                        fontSize: 20,
                        color: 'var(--text-hi)',
                        letterSpacing: '-0.02em',
                    }}>
                        SkillSwap
                    </span>
                </Link>

                {/* ── Desktop Nav + Auth ────────────────── */}
                {!isMobile && (
                    <>
                        {/* Nav Links */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 32, flex: 1 }}>
                            {navLinks.map(link => {
                                if (link.private && !user) return null;
                                if (link.publicOnly && user) return null;
                                const active = isActive(link.path);
                                return (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        style={navLinkStyle(active)}
                                        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-hi)'}
                                        onMouseLeave={e => e.currentTarget.style.color = active ? 'var(--text-hi)' : 'var(--text-mid)'}
                                    >
                                        {link.name}
                                        {active && (
                                            <motion.div
                                                layoutId="nav-underline"
                                                style={{
                                                    position: 'absolute',
                                                    bottom: -2,
                                                    left: 0,
                                                    right: 0,
                                                    height: 2,
                                                    borderRadius: 2,
                                                    background: 'var(--ember)',
                                                }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Theme Toggle — desktop */}
                        <button
                            onClick={toggleTheme}
                            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                border: '1px solid var(--glass-border)',
                                background: 'var(--glass)',
                                color: theme === 'dark' ? '#FBBF24' : '#6366F1',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease',
                                flexShrink: 0,
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'var(--glass-hover)'; e.currentTarget.style.transform = 'scale(1.08)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'var(--glass)'; e.currentTarget.style.transform = 'scale(1)'; }}
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                        </button>

                        {/* Auth buttons */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                            {user ? (
                                <>
                                    <Link
                                        to="/profile"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            textDecoration: 'none',
                                            color: 'var(--text-mid)',
                                            transition: 'color 0.2s ease',
                                            fontSize: 14,
                                            fontWeight: 600,
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-hi)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-mid)'; }}
                                    >
                                        <img
                                            src={getAvatarUrl(user.avatar, user.name)}
                                            alt={user.name}
                                            style={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                                border: '2px solid var(--glass-border)',
                                                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                                            }}
                                            onMouseEnter={e => {
                                                e.target.style.borderColor = 'var(--current)';
                                                e.target.style.boxShadow = '0 0 12px var(--current-glow)';
                                            }}
                                            onMouseLeave={e => {
                                                e.target.style.borderColor = 'var(--glass-border)';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                        <span style={{ textTransform: 'capitalize' }}>
                                            {user?.name?.split(' ')[0]?.toLowerCase() || 'account'}
                                        </span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 6,
                                            padding: '8px 16px',
                                            background: 'rgba(127,40,40,0.25)',
                                            border: '1px solid rgba(248,113,113,0.2)',
                                            borderRadius: 10,
                                            color: '#F87171',
                                            fontSize: 13,
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(127,40,40,0.45)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(127,40,40,0.25)'; }}
                                        aria-label="Log out"
                                    >
                                        <LogOut size={14} />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        style={{
                                            fontSize: 13,
                                            fontWeight: 600,
                                            color: 'var(--text-mid)',
                                            textDecoration: 'none',
                                            transition: 'color 0.2s ease',
                                        }}
                                        onMouseEnter={e => e.target.style.color = 'var(--text-hi)'}
                                        onMouseLeave={e => e.target.style.color = 'var(--text-mid)'}
                                    >
                                        Sign in
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="btn-ember"
                                        style={{
                                            padding: '9px 20px',
                                            borderRadius: 10,
                                            fontSize: 13,
                                            fontWeight: 700,
                                            textDecoration: 'none',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 6,
                                        }}
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </>
                )}

                {/* ── Mobile Hamburger ──────────────────── */}
                {isMobile && (
                    <button
                        onClick={() => setIsMenuOpen(o => !o)}
                        style={{
                            background: 'var(--glass)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 10,
                            padding: 8,
                            color: 'var(--text-hi)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                    >
                        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                )}
            </div>

            {/* ── Mobile Dropdown Menu ──────────────────── */}
            <AnimatePresence>
                {isMobile && isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                            overflow: 'hidden',
                            borderTop: '1px solid var(--glass-border)',
                            background: theme === 'dark' ? 'rgba(10,14,31,0.97)' : 'rgba(244,245,251,0.98)',
                            backdropFilter: 'blur(20px)',
                        }}
                    >
                        <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {navLinks.map(link => {
                                if (link.private && !user) return null;
                                if (link.publicOnly && user) return null;
                                return (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        style={{
                                            padding: '12px 16px',
                                            borderRadius: 10,
                                            fontSize: 15,
                                            fontWeight: 600,
                                            color: isActive(link.path) ? 'var(--ember)' : 'var(--text-mid)',
                                            textDecoration: 'none',
                                            background: isActive(link.path) ? 'var(--ember-dim)' : 'transparent',
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}

                            {/* Theme toggle row */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 10, background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-mid)' }}>
                                {theme === 'dark' ? '🌙 Dark mode' : '☀️ Light mode'}
                            </span>
                            <button
                                onClick={toggleTheme}
                                style={{
                                    width: 48,
                                    height: 26,
                                    borderRadius: 13,
                                    border: 'none',
                                    background: theme === 'dark' ? 'var(--ember)' : 'var(--current)',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    transition: 'background 0.3s ease',
                                    flexShrink: 0,
                                }}
                                aria-label="Toggle theme"
                            >
                                <div style={{
                                    position: 'absolute',
                                    top: 3,
                                    left: theme === 'dark' ? 3 : 23,
                                    width: 20,
                                    height: 20,
                                    borderRadius: '50%',
                                    background: '#fff',
                                    transition: 'left 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 11,
                                }} >
                                    {theme === 'dark' ? '🌙' : '☀️'}
                                </div>
                            </button>
                        </div>

                        <div style={{ borderTop: '1px solid var(--glass-border)', marginTop: 4, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {user ? (
                                    <>
                                        <Link to="/profile" style={{ padding: '12px 16px', borderRadius: 10, fontSize: 14, fontWeight: 600, color: 'var(--text-hi)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <img src={getAvatarUrl(user.avatar, user.name)} alt={user.name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                                            {user.name}
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            style={{ width: '100%', padding: '12px', background: 'rgba(127,40,40,0.2)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 10, color: '#F87171', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" style={{ textAlign: 'center', padding: '12px', border: '1px solid var(--glass-border)', borderRadius: 10, fontSize: 14, fontWeight: 600, color: 'var(--text-hi)', textDecoration: 'none', background: 'var(--glass)' }}>
                                            Sign in
                                        </Link>
                                        <Link to="/register" className="btn-ember" style={{ textAlign: 'center', padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'block' }}>
                                            Get Started
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
