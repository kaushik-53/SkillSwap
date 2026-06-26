import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ScrollToTop from './components/ScrollToTop';
import AuthContext, { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddSkill from './pages/AddSkill';
import About from './pages/About';
import Safety from './pages/Safety';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Session from './pages/Session';
import MySwaps from './pages/MySwaps';
import Navbar from './components/Navbar';
import './App.css';

/* Ambient background — 3 slow-drifting blobs */
const AmbientBackground = () => (
    <div
        aria-hidden="true"
        style={{
            position: 'fixed',
            inset: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 0,
        }}
    >
        <div
            className="ambient-blob"
            style={{
                width: 600,
                height: 600,
                top: '-10%',
                left: '-5%',
                background: 'radial-gradient(circle, rgba(255,138,91,0.12) 0%, transparent 70%)',
                '--drift-dur': '28s',
                '--dx1': '40px', '--dy1': '-30px',
                '--dx2': '-20px', '--dy2': '50px',
                '--dx3': '15px', '--dy3': '-20px',
            }}
        />
        <div
            className="ambient-blob"
            style={{
                width: 700,
                height: 700,
                bottom: '-15%',
                right: '-10%',
                background: 'radial-gradient(circle, rgba(94,234,212,0.10) 0%, transparent 70%)',
                '--drift-dur': '34s',
                '--dx1': '-30px', '--dy1': '40px',
                '--dx2': '25px', '--dy2': '-35px',
                '--dx3': '-10px', '--dy3': '20px',
            }}
        />
        <div
            className="ambient-blob"
            style={{
                width: 400,
                height: 400,
                top: '40%',
                left: '30%',
                background: 'radial-gradient(circle, rgba(129,140,248,0.07) 0%, transparent 70%)',
                '--drift-dur': '22s',
                '--dx1': '20px', '--dy1': '30px',
                '--dx2': '-25px', '--dy2': '-20px',
                '--dx3': '10px', '--dy3': '15px',
            }}
        />
    </div>
);

/* Page transition wrapper */
const PageTransition = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        style={{ position: 'relative', zIndex: 1 }}
    >
        {children}
    </motion.div>
);

/* Boot loader */
const Loader = () => (
    <div
        style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--ink)',
            gap: 24,
        }}
    >
        <div style={{ width: 80, height: 80 }}>
            {/* Mini constellation draw-in as loader */}
            <svg viewBox="0 0 80 80" width="80" height="80">
                <circle cx="40" cy="40" r="22" fill="none" stroke="var(--ember)"
                    strokeWidth="2" strokeLinecap="round"
                    strokeDasharray="138" strokeDashoffset="138"
                    style={{ animation: 'seal-draw 0.8s ease forwards 0.1s' }} />
                <circle cx="40" cy="40" r="22" fill="none" stroke="var(--current)"
                    strokeWidth="2" strokeLinecap="round" strokeDasharray="138"
                    strokeDashoffset="138"
                    transform="rotate(90 40 40)"
                    style={{ animation: 'seal-draw 0.8s ease forwards 0.2s' }} />
            </svg>
        </div>
        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 12, color: 'var(--text-low)', letterSpacing: '0.15em' }}>
            LOADING...
        </p>
    </div>
);

const LayoutManager = () => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) return <Loader />;

    const hideNavbarRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
    const showNavbar = !hideNavbarRoutes.includes(location.pathname);

    const privateRoutes = ['/dashboard', '/profile', '/add-skill', '/my-swaps', '/messages', '/settings', '/requests'];
    const isPrivateRoute =
        privateRoutes.some(route => location.pathname.startsWith(route)) ||
        location.pathname.startsWith('/user/');

    if (isPrivateRoute && !user) {
        return <Navigate to="/login" />;
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {showNavbar && <Navbar />}
            <main style={{ flex: 1, paddingTop: showNavbar ? 80 : 0 }}>
                <AnimatePresence mode="wait">
                    <PageTransition key={location.pathname}>
                        <Routes location={location}>
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/safety" element={<Safety />} />
                            <Route path="/terms" element={<Terms />} />
                            <Route path="/privacy" element={<Privacy />} />
                            <Route path="/explore" element={<Explore />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/reset-password" element={<ResetPassword />} />
                            {/* Private Routes */}
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/user/:id" element={<Profile />} />
                            <Route path="/add-skill" element={<AddSkill />} />
                            <Route path="/requests/:id" element={<Session />} />
                            <Route path="/my-swaps" element={<MySwaps />} />
                            {/* Placeholders */}
                            <Route path="/messages" element={<Dashboard />} />
                            <Route path="/settings" element={<Dashboard />} />
                        </Routes>
                    </PageTransition>
                </AnimatePresence>
            </main>
        </div>
    );
};

function App() {
    return (
        <ThemeProvider>
            <div style={{ minHeight: '100vh', background: 'var(--ink)', color: 'var(--text-hi)', position: 'relative', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
                <AmbientBackground />
                <AuthProvider>
                    <Router>
                        <ScrollToTop />
                        <LayoutManager />
                    </Router>
                </AuthProvider>
            </div>
        </ThemeProvider>
    );
}

export default App;
