import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import ScrollToTop from './components/ScrollToTop';
import AuthContext, { AuthProvider } from './context/AuthContext';
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
import AppLayout from './components/AppLayout';

// Public Layout for pages like Home, About, etc.
const PublicLayout = ({ children }) => {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
};

// Component to handle layout switching based on route
const LayoutManager = () => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const hideNavbarRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  // Dashboard-specific routes that require login
  const privateRoutes = ['/dashboard', '/profile', '/add-skill', '/my-swaps', '/messages', '/settings', '/requests'];
  const isPrivateRoute = privateRoutes.some(route => location.pathname.startsWith(route)) || location.pathname.startsWith('/user/');

  if (isPrivateRoute && !user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {showNavbar && <Navbar />}
      <main className={`flex-1 ${showNavbar ? 'pt-24' : ''}`}>
        <Routes>
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

          {/* Placeholder for future features */}
          <Route path="/messages" element={<Dashboard />} />
          <Route path="/settings" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <LayoutManager />
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
