import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Navbar } from '../common/Navbar';

export function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['123 Auto Service Lane', 'Tech City, TC 12345', 'United States']
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543', 'Mon-Fri: 8AM - 6PM']
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['support@wheelsdoc.com', 'sales@wheelsdoc.com', 'Response within 24 hours']
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Monday - Friday: 8:00 AM - 6:00 PM', 'Saturday: 9:00 AM - 4:00 PM', 'Sunday: Closed']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl mb-6">Contact Us</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
            <Card key={index} className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-blue-100 rounded-lg mb-3">
                    <info.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="mb-2">{info.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-1">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-sm text-gray-600">{detail}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Send Us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and our team will get back to you within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="How can we help?"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="container mx-auto px-4 pb-20">
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 h-64 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Map integration coming soon</p>
            </div>
          </div>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-20">
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl mb-4">Ready to Get Started?</CardTitle>
            <CardDescription className="text-blue-100 text-lg">
              Create an account today and experience seamless vehicle service management
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center gap-4 pb-8">
            <Button size="lg" onClick={() => navigate('/signup')} className="bg-white text-blue-600 hover:bg-gray-100">
              Create Account
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
