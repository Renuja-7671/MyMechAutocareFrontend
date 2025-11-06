import { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { authAPI } from '../../lib/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { PasswordInput } from '../ui/password-input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner@2.0.3';
import { Loader2, Database, Home } from 'lucide-react';
import logo from 'figma:asset/1e334aef77be8b1884333118e444c25de1ffa1e9.png';

interface LoginPageProps {
  onSwitchToSignup: () => void;
  onCheckDatabase?: () => void;
  onGoHome?: () => void;
}

export function LoginPage({ onSwitchToSignup, onCheckDatabase, onGoHome }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await authAPI.login(email, password);
      
      if (response.success && response.data) {
        login(response.data.user, response.data.token);
        toast.success('Login successful!');
      } else {
        toast.error(response.error || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          {onGoHome && (
            <div className="flex justify-start mb-2">
              <Button variant="ghost" size="sm" onClick={onGoHome}>
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </div>
          )}
          <div className="flex items-center justify-center mb-4">
            <img src={logo} alt="WheelsDoc AutoCare" className="h-24 w-auto" />
          </div>
          <CardTitle className="text-2xl">Welcome to WheelsDoc AutoCare</CardTitle>
          <CardDescription>
            Sign in to manage your vehicle services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          <div className="mt-4 space-y-3">
            <div className="text-center">
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="text-blue-600 hover:underline text-sm"
              >
                Don't have an account? Sign up
              </button>
            </div>
            {onCheckDatabase && (
              <div className="pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCheckDatabase}
                  className="w-full"
                >
                  <Database className="mr-2 h-4 w-4" />
                  Check Existing Database
                </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Verify your existing data compatibility
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
