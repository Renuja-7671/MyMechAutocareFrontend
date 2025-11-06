import { useAuth } from '../../lib/auth-context';
import { Button } from '../ui/button';
import { ThemeToggle } from '../ui/theme-toggle';
import { LogOut, User, Home } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { toast } from 'sonner@2.0.3';
import logo from '../../assets/logo.png';

interface HeaderProps {
  onGoHome?: () => void;
}

export function Header({ onGoHome }: HeaderProps) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="WheelsDoc AutoCare" className="h-12 w-auto" />
          <div>
            <h1 className="text-xl">WheelsDoc AutoCare</h1>
            <p className="text-xs text-muted-foreground">Vehicle Service Management</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {onGoHome && (
            <Button variant="ghost" onClick={onGoHome}>
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          )}
          
          <ThemeToggle />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <User className="h-4 w-4" />
                {user?.name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                <div className="flex flex-col">
                  <span>{user?.email}</span>
                  <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="destructive" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
