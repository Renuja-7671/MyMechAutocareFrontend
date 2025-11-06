import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../lib/api';
import { Header } from '../shared/Header';
import { useAuth } from '../../lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Users, ClipboardList, Calendar, TrendingUp, BarChart3, Wrench } from 'lucide-react';
import { UserManagement } from './UserManagement';
import { ServiceManagement } from './ServiceManagement';
import { AppointmentManagement } from './AppointmentManagement';
import { ReportsView } from './ReportsView';
import { ModificationRequestsManagement } from './ModificationRequestsManagement';

interface DashboardStats {
  totalCustomers: number;
  totalEmployees: number;
  activeServices: number;
  completedServices: number;
  pendingAppointments: number;
  revenue: number;
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalEmployees: 0,
    activeServices: 0,
    completedServices: 0,
    pendingAppointments: 0,
    revenue: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const response = await adminAPI.getDashboardStats();
    if (response.success && response.data) {
      setStats(response.data);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const statCards = [
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Active Services',
      value: stats.activeServices,
      icon: ClipboardList,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Completed Services',
      value: stats.completedServices,
      icon: ClipboardList,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Pending Appointments',
      value: stats.pendingAppointments,
      icon: Calendar,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Total Revenue',
      value: `Rs. ${stats.revenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header onGoHome={handleLogout} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl mb-2">Admin Dashboard</h2>
          <p className="text-gray-600">Manage users, services, and monitor business insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-3xl">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="services">Service Management</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="modifications" className="gap-2">
              <Wrench className="h-4 w-4" />
              Modifications
            </TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="services">
            <ServiceManagement />
          </TabsContent>

          <TabsContent value="appointments">
            <AppointmentManagement />
          </TabsContent>

          <TabsContent value="modifications">
            <ModificationRequestsManagement />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
