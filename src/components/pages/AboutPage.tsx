import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Target, Award, Users, TrendingUp } from 'lucide-react';
import { Navbar } from '../common/Navbar';

export function AboutPage() {
  const navigate = useNavigate();
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To revolutionize vehicle service management through technology, providing transparent and efficient solutions for service centers and customers alike.'
    },
    {
      icon: Award,
      title: 'Quality First',
      description: 'We maintain the highest standards in every service, using state-of-the-art equipment and certified technicians to ensure your vehicle receives the best care.'
    },
    {
      icon: Users,
      title: 'Customer Focus',
      description: 'Your satisfaction is our priority. We provide real-time updates, transparent pricing, and exceptional customer service throughout your vehicle\'s service journey.'
    },
    {
      icon: TrendingUp,
      title: 'Innovation',
      description: 'We continuously innovate our service management platform, incorporating AI and automation to streamline operations and enhance the customer experience.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Vehicles Serviced' },
    { number: '500+', label: 'Active Customers' },
    { number: '50+', label: 'Certified Technicians' },
    { number: '98%', label: 'Customer Satisfaction' }
  ];

  const team = [
    { name: 'Service Excellence', description: 'Certified technicians with years of experience' },
    { name: 'Advanced Technology', description: 'Latest diagnostic and repair equipment' },
    { name: 'Customer Support', description: '24/7 support for your service needs' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl mb-6">About WheelsDoc AutoCare</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your trusted partner in vehicle service management, combining technology with expertise to deliver exceptional automotive care.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="pt-8 pb-8">
                <div className="text-4xl text-blue-600 mb-2">{stat.number}</div>
                <p className="text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-4">Our Core Values</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Built on principles of excellence, transparency, and innovation
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <value.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="mb-2">{value.title}</CardTitle>
                    <CardDescription>{value.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-4">What Sets Us Apart</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience the difference of professional vehicle care
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {team.map((item, index) => (
            <Card key={index} className="text-center hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="mb-2">{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-20">
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl mb-4">Join Our Community</CardTitle>
            <CardDescription className="text-blue-100 text-lg">
              Experience the future of vehicle service management
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center gap-4 pb-8">
            <Button size="lg" onClick={() => navigate('/signup')} className="bg-white text-blue-600 hover:bg-gray-100">
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')} className="border-white text-white hover:bg-white/10">
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
