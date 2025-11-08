import { useState, useEffect } from 'react';
import { adminAPI } from '../../lib/api';
import { formatStatusText } from '../../lib/types';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { toast } from 'sonner';
import { Search, UserPlus } from 'lucide-react';

interface Service {
  id: string;
  vehicleName: string;
  customerName: string;
  serviceType: string;
  status: string;
  progress: number;
  assignedEmployee?: string;
  assignedEmployeeId?: string;
  startDate: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  employeeId?: string;
}

export function ServiceManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterServices();
  }, [searchTerm, statusFilter, services]);

  const loadData = async () => {
    const [servicesRes, usersRes] = await Promise.all([
      adminAPI.getAllServices(),
      adminAPI.getAllUsers(),
    ]);

    if (servicesRes.success && servicesRes.data) {
      setServices(servicesRes.data);
    }

    if (usersRes.success && usersRes.data) {
      const employeeList = usersRes.data.filter((user: any) => user.role === 'employee');
      console.log('Loaded employees:', employeeList);
      console.log('Employee IDs:', employeeList.map((e: any) => ({ 
        name: e.name, 
        userId: e.id, 
        employeeId: e.employeeId 
      })));
      setEmployees(employeeList);
    }
  };

  const filterServices = () => {
    let filtered = services;

    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((service) => service.status === statusFilter);
    }

    setFilteredServices(filtered);
  };

  const handleAssignEmployee = async () => {
    if (!selectedService || !selectedEmployee) {
      toast.error('Please select an employee');
      return;
    }

    console.log('Assigning employee:', { 
      serviceId: selectedService.id, 
      employeeId: selectedEmployee,
      selectedService,
      employees: employees.map(e => ({ id: e.id, employeeId: e.employeeId, name: e.name }))
    });

    const response = await adminAPI.assignServiceToEmployee(selectedService.id, selectedEmployee);
    if (response.success) {
      toast.success('Employee assigned successfully');
      loadData();
      setShowAssignDialog(false);
      setSelectedService(null);
      setSelectedEmployee('');
    } else {
      console.error('Assignment failed:', response.error);
      toast.error(response.error || 'Failed to assign employee');
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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Service Management</CardTitle>
          <CardDescription>Monitor and manage all service requests</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="not_started">Not Started</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredServices.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No services found
              </div>
            ) : (
              filteredServices.map((service) => (
                <Card key={service.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{service.vehicleName}</CardTitle>
                        <CardDescription>{service.serviceType}</CardDescription>
                        <p className="text-sm text-gray-600 mt-1">
                          Customer: {service.customerName}
                        </p>
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
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        {service.assignedEmployee ? (
                          <>
                            <span className="text-gray-600">Assigned to: </span>
                            <span>{service.assignedEmployee}</span>
                          </>
                        ) : (
                          <span className="text-gray-500">No employee assigned</span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedService(service);
                          const initialEmployee = service.assignedEmployeeId ? service.assignedEmployeeId.toString() : '';
                          console.log('Opening assign dialog:', { 
                            service, 
                            assignedEmployeeId: service.assignedEmployeeId,
                            initialEmployee 
                          });
                          setSelectedEmployee(initialEmployee);
                          setShowAssignDialog(true);
                        }}
                        className="gap-2"
                      >
                        <UserPlus className="h-4 w-4" />
                        {service.assignedEmployee ? 'Reassign' : 'Assign'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Employee</DialogTitle>
            <DialogDescription>
              Select an employee to assign to this service
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm">
                Service: {selectedService?.vehicleName} - {selectedService?.serviceType}
              </p>
            </div>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger>
                <SelectValue placeholder="Select an employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem 
                    key={employee.id} 
                    value={employee.employeeId ? employee.employeeId.toString() : ''}
                    disabled={!employee.employeeId}
                  >
                    {employee.name} ({employee.email})
                    {!employee.employeeId && ' - No Employee Profile'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowAssignDialog(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleAssignEmployee} className="flex-1">
              Assign Employee
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
