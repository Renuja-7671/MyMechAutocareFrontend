import { useState, useEffect } from 'react';
import { employeeAPI } from '../../lib/supabase-api';
import { formatStatusText } from '../../lib/types';
import { Header } from '../shared/Header';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Calendar, Clock, ClipboardList, Plus } from 'lucide-react';
import { LogTimeDialog } from './LogTimeDialog';
import { UpdateStatusDialog } from './UpdateStatusDialog';

interface Service {
  id: string;
  vehicleName: string;
  customerName: string;
  serviceType: string;
  status: string;
  progress: number;
  startDate: string;
  estimatedCompletion: string;
  totalHoursLogged: number;
}

interface Appointment {
  id: string;
  vehicleName: string;
  customerName: string;
  customerPhone: string;
  serviceType: string;
  date: string;
  time: string;
  status: string;
}

interface TimeLog {
  id: string;
  serviceName: string;
  hours: number;
  description: string;
  date: string;
}

interface EmployeeDashboardProps {
  onGoHome?: () => void;
}

export function EmployeeDashboard({ onGoHome }: EmployeeDashboardProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [showLogTime, setShowLogTime] = useState(false);
  const [showUpdateStatus, setShowUpdateStatus] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [servicesRes, appointmentsRes, timeLogsRes] = await Promise.all([
      employeeAPI.getAssignedServices(),
      employeeAPI.getUpcomingAppointments(),
      employeeAPI.getTimeLogs(),
    ]);

    if (servicesRes.success) setServices(servicesRes.data || []);
    if (appointmentsRes.success) setAppointments(appointmentsRes.data || []);
    if (timeLogsRes.success) setTimeLogs(timeLogsRes.data || []);
  };

  const handleLogTime = (service: Service) => {
    setSelectedService(service);
    setShowLogTime(true);
  };

  const handleUpdateStatus = (service: Service) => {
    setSelectedService(service);
    setShowUpdateStatus(true);
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header onGoHome={onGoHome} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl mb-2">Employee Dashboard</h2>
            <p className="text-gray-600">Manage assigned services and log work hours</p>
          </div>
        </div>

        <Tabs defaultValue="services" className="space-y-6">
          <TabsList>
            <TabsTrigger value="services">Assigned Services</TabsTrigger>
            <TabsTrigger value="appointments">Upcoming Appointments</TabsTrigger>
            <TabsTrigger value="timelogs">Time Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-4">
            {services.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <ClipboardList className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No services assigned at the moment</p>
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
                        <p className="text-sm text-gray-600 mt-1">Customer: {service.customerName}</p>
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
                      <div>
                        <p className="text-gray-600">Hours Logged</p>
                        <p>{service.totalHoursLogged} hrs</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleLogTime(service)}
                        variant="outline"
                        className="flex-1 gap-2"
                      >
                        <Clock className="h-4 w-4" />
                        Log Time
                      </Button>
                      <Button
                        onClick={() => handleUpdateStatus(service)}
                        className="flex-1"
                      >
                        Update Status
                      </Button>
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
                  <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No upcoming appointments</p>
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
                      <div>
                        <p className="text-sm text-gray-600">Customer</p>
                        <p>{appointment.customerName}</p>
                        <p className="text-sm text-gray-500">{appointment.customerPhone}</p>
                      </div>
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

          <TabsContent value="timelogs" className="space-y-4">
            {timeLogs.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No time logs recorded yet</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Time Logs</CardTitle>
                  <CardDescription>Your logged work hours for services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {timeLogs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p>{log.serviceName}</p>
                          <p className="text-sm text-gray-600">{log.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(log.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{log.hours} hrs</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {selectedService && (
        <>
          <LogTimeDialog
            open={showLogTime}
            onOpenChange={setShowLogTime}
            service={selectedService}
            onSuccess={loadData}
          />
          <UpdateStatusDialog
            open={showUpdateStatus}
            onOpenChange={setShowUpdateStatus}
            service={selectedService}
            onSuccess={loadData}
          />
        </>
      )}
    </div>
  );
}
