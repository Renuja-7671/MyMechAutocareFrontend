import { Button } from '../ui/button';
import { ThemeToggle } from '../ui/theme-toggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { 
  Calendar, Bell, MessageSquare, BarChart3, Shield, Clock, 
  Smartphone, Zap, FileText, Users, CheckCircle, TrendingUp 
} from 'lucide-react';
import logo from 'figma:asset/1e334aef77be8b1884333118e444c25de1ffa1e9.png';

interface FeaturesPageProps {
  onGoHome: () => void;
  onLogin: () => void;
  onSignup: () => void;
}

export function FeaturesPage({ onGoHome, onLogin, onSignup }: FeaturesPageProps) {
  const features = [
    {
      icon: Calendar,
      title: 'Smart Appointment Scheduling',
      description: 'Book and manage appointments with real-time availability. Get instant confirmations and reminders.',
      benefits: ['Real-time slot availability', 'Automated reminders', 'Easy rescheduling', 'Calendar integration']
    },
    {
      icon: Bell,
      title: 'Real-time Notifications',
      description: 'Stay informed with instant updates on your vehicle service progress and important milestones.',
      benefits: ['Service status updates', 'Completion alerts', 'Part arrival notifications', 'Payment reminders']
    },
    {
      icon: MessageSquare,
      title: 'AI-Powered Chatbot',
      description: 'Get instant answers to your questions and check service availability 24/7 with our intelligent assistant.',
      benefits: ['24/7 availability', 'Instant responses', 'Slot checking', 'Service recommendations']
    },
    {
      icon: BarChart3,
      title: 'Comprehensive Reporting',
      description: 'Access detailed reports and analytics for business insights and service history tracking.',
      benefits: ['Service history', 'Cost analysis', 'Performance metrics', 'Custom reports']
    },
    {
      icon: Clock,
      title: 'Time Tracking System',
      description: 'Employees can accurately log work hours with transparent time tracking for each service.',
      benefits: ['Accurate time logging', 'Project tracking', 'Labor cost calculation', 'Productivity insights']
    },
    {
      icon: Shield,
      title: 'Role-Based Access Control',
      description: 'Secure system with three user roles: Customer, Employee, and Admin with specific permissions.',
      benefits: ['Secure authentication', 'Permission management', 'Data protection', 'Audit trails']
    },
    {
      icon: Smartphone,
      title: 'Mobile Responsive',
      description: 'Access the platform seamlessly from any device - desktop, tablet, or smartphone.',
      benefits: ['Cross-device compatibility', 'Responsive design', 'Touch-optimized', 'Offline capabilities']
    },
    {
      icon: Zap,
      title: 'Instant Updates',
      description: 'Experience real-time synchronization across all devices for up-to-the-minute information.',
      benefits: ['Live updates', 'Multi-device sync', 'No refresh needed', 'Instant notifications']
    },
    {
      icon: FileText,
      title: 'Digital Documentation',
      description: 'Maintain complete digital records of all services, parts used, and maintenance history.',
      benefits: ['Paperless records', 'Easy access', 'Search capability', 'Export options']
    },
    {
      icon: Users,
      title: 'Customer Portal',
      description: 'Customers can view service progress, request modifications, and manage their vehicles online.',
      benefits: ['Service tracking', 'Vehicle management', 'Request modifications', 'Payment history']
    },
    {
      icon: CheckCircle,
      title: 'Service Verification',
      description: 'Track each service stage with detailed status updates and verification checkpoints.',
      benefits: ['Status tracking', 'Quality checkpoints', 'Photo documentation', 'Completion verification']
    },
    {
      icon: TrendingUp,
      title: 'Business Analytics',
      description: 'Admins can access powerful analytics for revenue tracking, employee performance, and more.',
      benefits: ['Revenue reports', 'Employee metrics', 'Customer insights', 'Trend analysis']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 py-4 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <button onClick={onGoHome} className="flex items-center gap-3 bg-background rounded-full px-6 py-3 shadow-md hover:shadow-lg transition-shadow border">
              <img src={logo} alt="WheelsDoc AutoCare" className="h-10 w-auto" />
              <div>
                <h1 className="text-lg">WheelsDoc AutoCare</h1>
              </div>
            </button>
          
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button onClick={onLogin} variant="ghost" size="sm" className="rounded-full">
                Sign In
              </Button>
              <Button onClick={onSignup} size="sm" className="rounded-full bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl mb-6">Platform Features</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Powerful tools and capabilities designed to streamline vehicle service management
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
                <CardDescription className="mb-4">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="container mx-auto px-4 pb-20">
        <Card className="bg-white border-2 border-blue-200">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl mb-4">Why Choose WheelsDoc AutoCare?</CardTitle>
            <CardDescription className="text-lg">
              A comprehensive solution that combines cutting-edge technology with user-friendly design
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl text-blue-600 mb-2">100%</div>
                <p className="text-gray-600">Cloud-Based</p>
              </div>
              <div className="text-center">
                <div className="text-4xl text-blue-600 mb-2">24/7</div>
                <p className="text-gray-600">Available</p>
              </div>
              <div className="text-center">
                <div className="text-4xl text-blue-600 mb-2">3</div>
                <p className="text-gray-600">User Roles</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-20">
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl mb-4">Ready to Transform Your Service Management?</CardTitle>
            <CardDescription className="text-blue-100 text-lg">
              Join hundreds of satisfied customers and service centers using WheelsDoc AutoCare
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center gap-4 pb-8">
            <Button size="lg" onClick={onSignup} className="bg-white text-blue-600 hover:bg-gray-100">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" onClick={onLogin} className="border-white text-white hover:bg-white/10">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 WheelsDoc AutoCare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
