import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerAPI } from '../../lib/api';
import { formatStatusText } from '../../lib/types';
import { Header } from '../shared/Header';
import { useAuth } from '../../lib/auth-context';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Calendar, Car, Clock, MessageSquare, Plus, Wrench, History, Image as ImageIcon, Stethoscope, FileText } from 'lucide-react';
import { BookAppointmentDialog } from './BookAppointmentDialog';
import { RequestModificationDialog } from './RequestModificationDialog';
import { ViewModificationRequestsDialog } from './ViewModificationRequestsDialog';
import { ServiceChatbot } from './ServiceChatbot';
import { AddVehicleDialog } from './AddVehicleDialog';
import { ViewServiceHistoryDialog } from './ViewServiceHistoryDialog';
import { VehicleImagesDialog } from '../shared/VehicleImagesDialog';

interface Service {
  id: string;
  vehicleName: string;
  serviceType: string;
  status: string;
  progress: number;
  startDate: string;
  estimatedCompletion: string;
  assignedEmployee?: string;
}

interface Appointment {
  id: string;
  vehicleName: string;
  serviceType: string;
  date: string;
  time: string;
  status: string;
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  exterior_image_1?: string | null;
  exterior_image_2?: string | null;
  interior_image?: string | null;
}

export function CustomerDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showBooking, setShowBooking] = useState(false);
  const [showModification, setShowModification] = useState(false);
  const [showViewModifications, setShowViewModifications] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showServiceHistory, setShowServiceHistory] = useState(false);
  const [showVehicleImages, setShowVehicleImages] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [servicesRes, appointmentsRes, vehiclesRes] = await Promise.all([
        customerAPI.getServiceProgress(),
        customerAPI.getAppointments(),
        customerAPI.getVehicles(),
      ]);

      console.log('Services response:', servicesRes);
      console.log('Appointments response:', appointmentsRes);
      console.log('Vehicles response:', vehiclesRes);

      if (servicesRes.success && Array.isArray(servicesRes.data)) {
        setServices(servicesRes.data);
      } else {
        console.error('Services data is not an array:', servicesRes);
        setServices([]);
      }

      if (appointmentsRes.success && Array.isArray(appointmentsRes.data)) {
        setAppointments(appointmentsRes.data);
      } else {
        console.error('Appointments data is not an array:', appointmentsRes);
        setAppointments([]);
      }

      if (vehiclesRes.success && Array.isArray(vehiclesRes.data)) {
        setVehicles(vehiclesRes.data);
      } else {
        console.error('Vehicles data is not an array:', vehiclesRes);
        setVehicles([]);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setServices([]);
      setAppointments([]);
      setVehicles([]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'not_started':
      case 'scheduled':
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'on_hold':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header onGoHome={handleLogout} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl mb-2">Customer Dashboard</h2>
            <p className="text-muted-foreground">Manage your vehicles and service appointments</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setShowChatbot(true)} variant="outline" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              AI Slot Checker
            </Button>
            <Button onClick={() => setShowViewModifications(true)} variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              My Requests
            </Button>
            <Button onClick={() => setShowModification(true)} variant="outline" className="gap-2">
              <Wrench className="h-4 w-4" />
              Request Modification
            </Button>
            <Button onClick={() => setShowBooking(true)} className="gap-2">
              <Calendar className="h-4 w-4" />
              Book Appointment
            </Button>
          </div>
        </div>

        <Tabs defaultValue="services" className="space-y-6">
          <TabsList>
            <TabsTrigger value="services">Active Services</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="modifications">Modification Requests</TabsTrigger>
            <TabsTrigger value="vehicles">My Vehicles</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-4">
            {services.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No active services at the moment</p>
                  <Button onClick={() => setShowBooking(true)} className="mt-4">
                    Book Your First Service
                  </Button>
                </CardContent>
              </Card>
            ) : (
              services.map((service) => (
                <Card key={service.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{service.vehicleName}</CardTitle>
                        <CardDescription>{service.serviceType}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(service.status)}>
                        {formatStatusText(service.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Progress</span>
                        <span className="text-sm">{service.progress}%</span>
                      </div>
                      <Progress value={service.progress} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Started</p>
                        <p>{new Date(service.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Est. Completion</p>
                        <p>{new Date(service.estimatedCompletion).toLocaleDateString()}</p>
                      </div>
                      {service.assignedEmployee && (
                        <div className="col-span-2">
                          <p className="text-gray-600">Assigned Technician</p>
                          <p>{service.assignedEmployee}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            {appointments.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No upcoming appointments</p>
                  <Button onClick={() => setShowBooking(true)} className="mt-4">
                    Book an Appointment
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {appointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{appointment.vehicleName}</CardTitle>
                          <CardDescription>{appointment.serviceType}</CardDescription>
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {formatStatusText(appointment.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{new Date(appointment.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{appointment.time}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="modifications" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-semibold">Modification Requests</h3>
                <p className="text-sm text-muted-foreground">Track your vehicle modification requests and budgets</p>
              </div>
              <Button onClick={() => setShowViewModifications(true)} className="gap-2">
                <Wrench className="h-4 w-4" />
                View All Requests
              </Button>
            </div>
            <Card>
              <CardContent className="py-12 text-center">
                <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">View and manage your modification requests</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Click "View All Requests" to see your requests and delete approved ones if needed
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => setShowViewModifications(true)} variant="outline">
                    View Requests
                  </Button>
                  <Button onClick={() => setShowModification(true)}>
                    Create New Request
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vehicles" className="space-y-4">
            <div className="flex justify-end mb-4">
              <Button onClick={() => setShowAddVehicle(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Vehicle
              </Button>
            </div>
            {vehicles.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No vehicles registered</p>
                  <Button onClick={() => setShowAddVehicle(true)} className="mt-4">
                    Add Your First Vehicle
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                {vehicles.map((vehicle) => (
                  <Card key={vehicle.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </CardTitle>
                      <CardDescription>License: {vehicle.licensePlate}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full gap-2"
                        onClick={() => {
                          setSelectedVehicle(vehicle);
                          setShowServiceHistory(true);
                        }}
                      >
                        <History className="h-4 w-4" />
                        View Service History
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full gap-2"
                        onClick={() => {
                          setSelectedVehicle(vehicle);
                          setShowVehicleImages(true);
                        }}
                      >
                        <ImageIcon className="h-4 w-4" />
                        View Images
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BookAppointmentDialog
        open={showBooking}
        onOpenChange={setShowBooking}
        vehicles={vehicles}
        onSuccess={loadData}
      />
      <RequestModificationDialog
        open={showModification}
        onOpenChange={setShowModification}
        vehicles={vehicles}
        onSuccess={loadData}
      />
      <ViewModificationRequestsDialog
        open={showViewModifications}
        onOpenChange={setShowViewModifications}
        onRequestDeleted={loadData}
      />
      <ServiceChatbot
        open={showChatbot}
        onOpenChange={setShowChatbot}
      />
      <AddVehicleDialog
        open={showAddVehicle}
        onOpenChange={setShowAddVehicle}
        onSuccess={loadData}
      />
      {selectedVehicle && (
        <>
          <ViewServiceHistoryDialog
            open={showServiceHistory}
            onOpenChange={setShowServiceHistory}
            vehicleId={selectedVehicle.id}
            vehicleName={`${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`}
          />
          <VehicleImagesDialog
            open={showVehicleImages}
            onOpenChange={setShowVehicleImages}
            vehicle={{
              id: parseInt(selectedVehicle.id),
              make: selectedVehicle.make,
              model: selectedVehicle.model,
              year: selectedVehicle.year,
              exterior_image_1: selectedVehicle.exterior_image_1,
              exterior_image_2: selectedVehicle.exterior_image_2,
              interior_image: selectedVehicle.interior_image,
            }}
          />
        </>
      )}
    </div>
  );
}
