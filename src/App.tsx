import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './lib/auth-context';
import { ThemeProvider } from './lib/theme-context';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { EmployeeDashboard } from './components/employee/EmployeeDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DatabaseCheckPage } from './components/shared/DatabaseCheckPage';
import { HomePage } from './components/shared/HomePage';
import { ServicesPage } from './components/pages/ServicesPage';
import { AboutPage } from './components/pages/AboutPage';
import { FeaturesPage } from './components/pages/FeaturesPage';
import { ContactPage } from './components/pages/ContactPage';
import { Toaster } from './components/ui/sonner';

type View = 'home' | 'login' | 'signup' | 'dashboard' | 'database-check' | 'services' | 'about' | 'features' | 'contact';

function AppContent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<View>('home');

  // Auto-navigate to dashboard when user logs in
  useEffect(() => {
    if (isAuthenticated && (currentView === 'login' || currentView === 'signup')) {
      setCurrentView('dashboard');
    }
  }, [isAuthenticated, currentView]);

  // Auto-navigate to home when user logs out
  useEffect(() => {
    if (!isAuthenticated && currentView === 'dashboard') {
      setCurrentView('home');
    }
  }, [isAuthenticated, currentView]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading WheelsDoc AutoCare...</p>
        </div>
      </div>
    );
  }

  // Handle database check view
  if (currentView === 'database-check') {
    return <DatabaseCheckPage onBack={() => setCurrentView('login')} />;
  }

  // If user is authenticated and wants to view dashboard
  if (isAuthenticated && currentView === 'dashboard') {
    switch (user?.role) {
      case 'customer':
        return <CustomerDashboard onGoHome={() => setCurrentView('home')} />;
      case 'employee':
        return <EmployeeDashboard onGoHome={() => setCurrentView('home')} />;
      case 'admin':
        return <AdminDashboard onGoHome={() => setCurrentView('home')} />;
      default:
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h2 className="text-2xl mb-2">Invalid Role</h2>
              <p className="text-gray-600">Your account role is not recognized.</p>
            </div>
          </div>
        );
    }
  }

  // Handle login view
  if (currentView === 'login') {
    return (
      <LoginPage
        onSwitchToSignup={() => setCurrentView('signup')}
        onCheckDatabase={() => setCurrentView('database-check')}
        onGoHome={() => setCurrentView('home')}
      />
    );
  }

  // Handle signup view
  if (currentView === 'signup') {
    return (
      <SignupPage
        onSwitchToLogin={() => setCurrentView('login')}
        onGoHome={() => setCurrentView('home')}
      />
    );
  }

  // Handle services page
  if (currentView === 'services') {
    return (
      <ServicesPage
        onGoHome={() => setCurrentView('home')}
        onLogin={() => setCurrentView('login')}
        onSignup={() => setCurrentView('signup')}
      />
    );
  }

  // Handle about page
  if (currentView === 'about') {
    return (
      <AboutPage
        onGoHome={() => setCurrentView('home')}
        onLogin={() => setCurrentView('login')}
        onSignup={() => setCurrentView('signup')}
      />
    );
  }

  // Handle features page
  if (currentView === 'features') {
    return (
      <FeaturesPage
        onGoHome={() => setCurrentView('home')}
        onLogin={() => setCurrentView('login')}
        onSignup={() => setCurrentView('signup')}
      />
    );
  }

  // Handle contact page
  if (currentView === 'contact') {
    return (
      <ContactPage
        onGoHome={() => setCurrentView('home')}
        onLogin={() => setCurrentView('login')}
        onSignup={() => setCurrentView('signup')}
      />
    );
  }

  // Default to home view
  return (
    <HomePage
      onLogin={() => setCurrentView('login')}
      onSignup={() => setCurrentView('signup')}
      onDashboard={isAuthenticated ? () => setCurrentView('dashboard') : undefined}
      onServices={() => setCurrentView('services')}
      onAbout={() => setCurrentView('about')}
      onFeatures={() => setCurrentView('features')}
      onContact={() => setCurrentView('contact')}
    />
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
        <Toaster position="top-right" />
      </AuthProvider>
    </ThemeProvider>
  );
}
