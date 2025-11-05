import { useState, useEffect } from 'react';
import apiClient from '../../lib/api-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { toast } from 'sonner@2.0.3';
import { RefreshCw, Wrench } from 'lucide-react';

export function EmployeeDebugPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fixing, setFixing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/admin/employee-debug');
      setUsers(response.data.users || []);
      setEmployees(response.data.employees || []);
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast.error('Failed to load debug data');
    } finally {
      setLoading(false);
    }
  };

  const fixMissingProfiles = async () => {
    setFixing(true);
    try {
      const response = await apiClient.post('/admin/fix-missing-profiles');
      toast.success(`Created ${response.data.count || 0} employee profiles`);
      await loadData(); // Reload data
    } catch (error: any) {
      console.error('Exception:', error);
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setFixing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const missingCount = users.filter(
    user => !employees.find(emp => emp.user_id === user.id)
  ).length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employee Debug Information</h1>
          {missingCount > 0 && (
            <p className="text-red-600 mt-2">
              ⚠️ {missingCount} user(s) missing employee profiles
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={loadData} disabled={loading} variant="outline" className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {missingCount > 0 && (
            <Button 
              onClick={fixMissingProfiles} 
              disabled={fixing || loading}
              className="gap-2"
            >
              <Wrench className={`h-4 w-4 ${fixing ? 'animate-spin' : ''}`} />
              Fix Missing Profiles
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users Table (role = employee)</CardTitle>
          <CardDescription>Shows all users with employee role</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-gray-500">No employee users found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-2">ID</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Role</th>
                    <th className="text-left p-2">Active</th>
                    <th className="text-left p-2">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="p-2 font-mono">{user.id}</td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2">{user.role}</td>
                      <td className="p-2">{user.is_active ? '✓' : '✗'}</td>
                      <td className="p-2">{new Date(user.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Employees Table</CardTitle>
          <CardDescription>Shows all employee records</CardDescription>
        </CardHeader>
        <CardContent>
          {employees.length === 0 ? (
            <p className="text-gray-500">No employees found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-2">ID</th>
                    <th className="text-left p-2">User ID</th>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Phone</th>
                    <th className="text-left p-2">Hire Date</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id} className="border-b">
                      <td className="p-2 font-mono bg-yellow-100 dark:bg-yellow-900">{emp.id}</td>
                      <td className="p-2 font-mono">{emp.user_id}</td>
                      <td className="p-2">{emp.first_name} {emp.last_name}</td>
                      <td className="p-2">{emp.phone}</td>
                      <td className="p-2">{emp.hire_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mapping Analysis</CardTitle>
          <CardDescription>How users map to employees</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {users.map((user) => {
              const matchingEmployee = employees.find(emp => emp.user_id === user.id);
              return (
                <div 
                  key={user.id} 
                  className={`p-3 border rounded ${matchingEmployee ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{user.email}</p>
                      <p className="text-sm text-gray-600">User ID: {user.id}</p>
                    </div>
                    {matchingEmployee ? (
                      <div className="text-right">
                        <p className="text-green-600 dark:text-green-400">✓ Has Employee Profile</p>
                        <p className="text-sm">
                          Employee ID: <span className="font-mono font-bold">{matchingEmployee.id}</span>
                        </p>
                        <p className="text-sm">{matchingEmployee.first_name} {matchingEmployee.last_name}</p>
                      </div>
                    ) : (
                      <div className="text-right">
                        <p className="text-red-600 dark:text-red-400">✗ No Employee Profile</p>
                        <p className="text-sm">Missing employees table record</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What to Use in Service Assignment</CardTitle>
          <CardDescription>These are the correct IDs to use when assigning employees</CardDescription>
        </CardHeader>
        <CardContent>
          {employees.length === 0 ? (
            <p className="text-gray-500">No employees to display</p>
          ) : (
            <div className="space-y-2">
              {employees.map((emp) => {
                const user = users.find(u => u.id === emp.user_id);
                return (
                  <div key={emp.id} className="p-3 border rounded bg-blue-50 dark:bg-blue-900/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{emp.first_name} {emp.last_name}</p>
                        <p className="text-sm text-gray-600">{user?.email || 'Unknown'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Use this ID for assignment:</p>
                        <p className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">
                          {emp.id}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
