import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Car, Wrench, Clock, Shield, Zap, CheckCircle } from 'lucide-react';
import { Navbar } from '../common/Navbar';

export function ServicesPage() {
  const navigate = useNavigate();
  const services = [
    {
      icon: Wrench,
      title: 'General Maintenance',
      description: 'Regular maintenance services including oil changes, filter replacements, and fluid checks.',
      features: ['Oil & Filter Change', 'Fluid Top-ups', 'Battery Check', 'Tire Rotation']
    },
    {
      icon: Car,
      title: 'Diagnostic Services',
      description: 'Advanced diagnostic testing to identify and resolve vehicle issues quickly.',
      features: ['Engine Diagnostics', 'Electronic Systems', 'Performance Testing', 'Error Code Analysis']
    },
    {
      icon: Shield,
      title: 'Brake Services',
      description: 'Complete brake system inspection, repair, and replacement services.',
      features: ['Brake Pad Replacement', 'Rotor Resurfacing', 'Brake Fluid Flush', 'ABS System Check']
    },
    {
      icon: Zap,
      title: 'Electrical Systems',
      description: 'Expert electrical system diagnostics and repairs for all vehicle makes.',
      features: ['Alternator Service', 'Starter Repair', 'Wiring Repairs', 'Lighting Systems']
    },
    {
      icon: Clock,
      title: 'Scheduled Maintenance',
      description: 'Factory-recommended maintenance schedules to keep your vehicle in top condition.',
      features: ['30K/60K/90K Service', 'Timing Belt Replacement', 'Transmission Service', 'Coolant Flush']
    },
    {
      icon: Car,
      title: 'Tire Services',
      description: 'Comprehensive tire services including installation, balancing, and alignment.',
      features: ['Tire Installation', 'Wheel Balancing', 'Alignment Service', 'Tire Pressure Check']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl mb-6">Our Services</h1>
          <p className="text-xl text-gray-600 mb-8">
            Comprehensive vehicle maintenance and repair services delivered by certified technicians
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <service.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                </div>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-20">
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl mb-4">Ready to Get Started?</CardTitle>
            <CardDescription className="text-blue-100 text-lg">
              Book your appointment today and experience professional vehicle care
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center gap-4 pb-8">
            <Button size="lg" onClick={() => navigate('/signup')} className="bg-white text-blue-600 hover:bg-gray-100">
              Book an Appointment
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
