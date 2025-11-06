import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth-context';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Car, Wrench, Clock, Users, ArrowRight, LayoutDashboard } from 'lucide-react';
import logo from '../../assets/logo.png';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Navbar } from '../common/Navbar';

export function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleDashboard = () => {
    if (user?.role) {
      navigate(`/${user.role}/dashboard`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1651275666236-8ecf57b4c66e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvJTIwcmVwYWlyJTIwc2hvcCUyMGludGVyaW9yfGVufDF8fHx8MTc2MTk4ODA1MXww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Professional Vehicle Service Station"
            className="w-full h-full object-cover opacity-70 dark:opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-indigo-50/70 to-purple-50/70 dark:from-slate-900/75 dark:via-slate-800/75 dark:to-slate-900/75"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <img src={logo} alt="WheelsDoc AutoCare" className="h-48 w-auto mx-auto mb-8" />
            <h1 className="text-5xl mb-6 text-foreground">
              Professional Vehicle Service Management
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Streamline your auto service operations with real-time tracking, appointment scheduling, 
              and comprehensive service management.
            </p>
            
            {!isAuthenticated && (
              <div className="flex gap-4 justify-center">
                <Button size="lg" onClick={() => navigate('/signup')} className="text-lg px-8">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/login')} className="text-lg px-8">
                  Sign In
                </Button>
              </div>
            )}

            {isAuthenticated && (
              <Button size="lg" onClick={handleDashboard} className="text-lg px-8">
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Go to My Dashboard
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl text-center mb-12">
          Everything You Need to Manage Your Auto Service
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <Car className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Vehicle Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track all customer vehicles with detailed service history and maintenance records.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Clock className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>Real-Time Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monitor service progress in real-time with live updates and status notifications.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Wrench className="h-10 w-10 text-orange-600 mb-2" />
              <CardTitle>Service Scheduling</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Easy appointment booking and service assignment with smart scheduling tools.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-purple-600 mb-2" />
              <CardTitle>Team Collaboration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Coordinate between customers, employees, and admins with role-based access.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="container mx-auto px-4 py-16 bg-card/50 backdrop-blur-sm rounded-3xl my-16 border">
        <h2 className="text-3xl text-center mb-12">
          Built for Everyone in Your Service Center
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="bg-blue-100 dark:bg-blue-950 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl mb-3">For Customers</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>✓ Track service progress</li>
              <li>✓ Book appointments</li>
              <li>✓ Manage vehicles</li>
              <li>✓ Request modifications</li>
              <li>✓ AI chatbot assistance</li>
            </ul>
          </div>

          <div className="text-center">
            <div className="bg-green-100 dark:bg-green-950 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wrench className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl mb-3">For Employees</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>✓ View assigned services</li>
              <li>✓ Log work hours</li>
              <li>✓ Update service status</li>
              <li>✓ Track appointments</li>
              <li>✓ Monitor workload</li>
            </ul>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 dark:bg-purple-950 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl mb-3">For Admins</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>✓ User management</li>
              <li>✓ Service assignment</li>
              <li>✓ Business reports</li>
              <li>✓ Analytics dashboard</li>
              <li>✓ Full system oversight</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-2xl mx-auto bg-card rounded-2xl shadow-xl p-12 border">
            <h2 className="text-3xl mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join WheelsDoc AutoCare today and streamline your vehicle service operations.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/signup')} className="text-lg px-8">
                Create Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/login')} className="text-lg px-8">
                Sign In
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-white py-8 mt-20 border-t border-slate-800">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src={logo} alt="WheelsDoc AutoCare" className="h-8 w-auto" />
            <span className="text-lg">WheelsDoc AutoCare</span>
          </div>
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} WheelsDoc AutoCare. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
