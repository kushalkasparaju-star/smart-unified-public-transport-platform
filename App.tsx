import React, { useState, useEffect } from 'react';
import { Screen } from './types';
import HomeScreen from './screens/HomeScreen';
import TrackingScreen from './screens/TrackingScreen';
import RouteScreen from './screens/RouteScreen';
import BookingScreen from './screens/BookingScreen';
import SafetyScreen from './screens/SafetyScreen';
import EcoScreen from './screens/EcoScreen';
import DriverDashboard from './screens/DriverDashboard';
import AdminPanel from './screens/AdminPanel';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import DriverLoginScreen from './screens/DriverLoginScreen';
import ChatBot from './components/ChatBot';
import { ICON_MAP } from './constants';
import { Moon, Sun, LogOut } from 'lucide-react';
import { AuthProvider, useAuth } from './authContext';
import { DriverAuthProvider, useDriverAuth } from './driverAuthContext';
import initAnalytics from './src/firebase';

const AppContent: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [darkMode, setDarkMode] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const { user, loading, signIn, signUp, signOut } = useAuth();
  const { driver, loading: driverLoading, signIn: driverSignIn, signOut: driverSignOut } = useDriverAuth();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // initialize analytics in background
    initAnalytics();
  }, []);

  // Handle driver logout - redirect to driver login if on driver route
  useEffect(() => {
    if (activeScreen === 'driver' && !driver) {
      // Driver logged out, stay on driver screen to show login
      setActiveScreen('driver');
    }
  }, [driver, activeScreen]);

  const handleLogout = async () => {
    await signOut();
  };

  // Show loading state
  if (loading || driverLoading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    );
  }

  // Check if user is trying to access driver routes
  const isDriverRoute = activeScreen === 'driver';
  const isDriverAuthenticated = !!driver;
  const isUserAuthenticated = !!user;

  // Handle driver route access
      if (isDriverRoute) {
    // If not authenticated as driver, show driver login
    if (!isDriverAuthenticated) {
      return (
        <DriverLoginScreen
          onLogin={async (driverId, password) => {
            const result = await driverSignIn(driverId, password);
            if (result.success) {
              // Stay on driver screen after login
              setActiveScreen('driver');
            }
            return result.success;
          }}
              onBack={() => setActiveScreen('home')}
        />
      );
    }
    // Driver is authenticated, show driver dashboard (full screen, no sidebar)
    // DriverDashboard handles its own logout and will trigger re-render
    return <DriverDashboard onNavigate={setActiveScreen} />;
  }

  // Regular user/admin routes - show login/signup if not authenticated
  if (!isUserAuthenticated) {
    if (showSignup) {
      return (
        <SignupScreen
          onSignup={async (username, email, password) => {
            const result = await signUp(username, email, password);
            // If signup succeeds, user state will be updated automatically
            // and component will re-render showing the main app
            return result;
          }}
          onSwitchToLogin={() => setShowSignup(false)}
        />
      );
    }
    return (
      <LoginScreen
        onLogin={async (email, password) => {
          const result = await signIn(email, password);
          return result.success;
        }}
        onSwitchToSignup={() => setShowSignup(true)}
      />
    );
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home': return <HomeScreen onNavigate={setActiveScreen} />;
      case 'tracking': return <TrackingScreen onNavigate={setActiveScreen} />;
      case 'routes': return <RouteScreen onNavigate={setActiveScreen} />;
      case 'booking': return <BookingScreen onNavigate={setActiveScreen} />;
      case 'safety': return <SafetyScreen onNavigate={setActiveScreen} />;
      case 'eco': return <EcoScreen onNavigate={setActiveScreen} />;
      case 'driver': 
        // Driver routes are handled separately above
        return <DriverDashboard onNavigate={setActiveScreen} />;
      case 'admin': return <AdminPanel onNavigate={setActiveScreen} />;
      default: return <HomeScreen onNavigate={setActiveScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Top Web Header */}
      <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* LOGO WITH HOME REDIRECT - Issue 3 Fix */}
          <button
            onClick={() => setActiveScreen('home')}
            className="text-xl font-bold text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer text-left"
            aria-label="Go to Home"
          >
            Smart Unified Public Transport Platform
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
              {ICON_MAP.User}
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6 px-6 py-6">
        
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm">
          <nav className="space-y-3">
            <button onClick={() => setActiveScreen('home')} className="nav-btn">{ICON_MAP.Navigation} Explore</button>
            <button onClick={() => setActiveScreen('eco')} className="nav-btn">{ICON_MAP.Leaf} Impact</button>
            <button onClick={() => setActiveScreen('safety')} className="nav-btn">{ICON_MAP.ShieldCheck} Safety</button>
            <button onClick={() => setActiveScreen('driver')} className="nav-btn">{ICON_MAP.LayoutDashboard} Driver</button>
            <button onClick={() => setActiveScreen('admin')} className="nav-btn">{ICON_MAP.User} Admin</button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10 bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-y-auto">
          <div className="p-6">
            {renderScreen()}
          </div>
        </main>

      </div>

      {/* ChatBot component (isolated, hidden by default) */}
      <ChatBot />

      {/* Tailwind utility for sidebar buttons */}
      <style>
        {`
          .nav-btn {
            display: flex;
            align-items: center;
            gap: 10px;
            width: 100%;
            padding: 10px 12px;
            border-radius: 12px;
            font-weight: 500;
            color: #475569;
          }
          .dark .nav-btn {
            color: #cbd5f5;
          }
          .nav-btn:hover {
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
          }
        `}
      </style>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DriverAuthProvider>
        <AppContent />
      </DriverAuthProvider>
    </AuthProvider>
  );
};

export default App;
