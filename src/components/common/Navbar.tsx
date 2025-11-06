import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth-context';
import { Button } from '../ui/button';
import { ThemeToggle } from '../ui/theme-toggle';
import logo from '../../assets/logo.png';

interface NavbarProps {
  showAuthButtons?: boolean;
  variant?: 'default' | 'minimal';
}

export function Navbar({ showAuthButtons = true, variant = 'default' }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleDashboard = () => {
    if (user?.role) {
      navigate(`/${user.role}/dashboard`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 py-4 bg-gradient-to-br from-blue-50/95 via-slate-50/95 to-indigo-50/95 dark:from-slate-950/95 dark:via-slate-900/95 dark:to-slate-950/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 bg-background rounded-full px-6 py-3 shadow-md border hover:shadow-lg transition-shadow"
          >
            <img src={logo} alt="WheelsDoc AutoCare" className="h-10 w-auto" />
            <div>
              <h1 className="text-lg font-semibold">WheelsDoc AutoCare</h1>
            </div>
          </button>

          {/* Navigation */}
          <nav className="flex items-center gap-2 bg-card rounded-full px-8 py-3 shadow-lg border">
            <ThemeToggle />

            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground px-4">
                  Welcome, <span className="font-medium text-foreground">{user?.name}</span>
                </span>
                <button
                  onClick={handleDashboard}
                  className="px-4 py-2 text-sm hover:text-primary transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm hover:text-primary transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {variant === 'default' && (
                  <>
                    <button
                      onClick={() => navigate('/services')}
                      className="px-4 py-2 text-sm hover:text-primary transition-colors"
                    >
                      Services
                    </button>
                    <button
                      onClick={() => navigate('/about')}
                      className="px-4 py-2 text-sm hover:text-primary transition-colors"
                    >
                      About
                    </button>
                    <button
                      onClick={() => navigate('/features')}
                      className="px-4 py-2 text-sm hover:text-primary transition-colors"
                    >
                      Features
                    </button>
                    <button
                      onClick={() => navigate('/contact')}
                      className="px-4 py-2 text-sm hover:text-primary transition-colors"
                    >
                      Contact
                    </button>
                  </>
                )}
                {showAuthButtons && (
                  <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
                    <Button onClick={() => navigate('/login')} variant="ghost" size="sm" className="rounded-full">
                      Sign In
                    </Button>
                    <Button onClick={() => navigate('/signup')} size="sm" className="rounded-full">
                      Get Started
                    </Button>
                  </div>
                )}
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
