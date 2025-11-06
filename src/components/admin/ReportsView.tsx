import { useState } from 'react';
import { adminAPI } from '../../lib/api';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner@2.0.3';
import { BarChart3, Download, FileText, Loader2 } from 'lucide-react';

export function ReportsView() {
  const [reportType, setReportType] = useState('revenue');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  const reportTypes = [
    { value: 'revenue', label: 'Revenue Report' },
    { value: 'services', label: 'Services Report' },
    { value: 'customers', label: 'Customer Activity Report' },
    { value: 'employees', label: 'Employee Performance Report' },
  ];

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error('Start date must be before end date');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await adminAPI.getReports(reportType, startDate, endDate);
      
      if (response.success && response.data) {
        setReportData(response.data);
        toast.success('Report generated successfully');
      } else {
        toast.error(response.error || 'Failed to generate report');
      }
    } catch (error) {
      toast.error('An error occurred while generating the report');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportReport = () => {
    if (!reportData) {
      toast.error('Please generate a report first');
      return;
    }

    // Create CSV or download logic here
    toast.success('Report export functionality would be implemented here');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
          <CardDescription>
            Create custom reports to gain insights into your business
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="reportType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={isLoading}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleGenerateReport}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <BarChart3 className="h-4 w-4" />
                  Generate Report
                </>
              )}
            </Button>
            {reportData && (
              <Button
                onClick={handleExportReport}
                variant="outline"
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {reportData && (
        <Card>
          <CardHeader>
            <CardTitle>Report Results</CardTitle>
            <CardDescription>
              {reportTypes.find((t) => t.value === reportType)?.label} from{' '}
              {new Date(startDate).toLocaleDateString()} to{' '}
              {new Date(endDate).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Example report visualization - customize based on your needs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-600">Total Records</p>
                  <p className="text-2xl">{reportData.totalRecords || 0}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl">Rs. {reportData.totalAmount?.toLocaleString() || 0}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-600">Average</p>
                  <p className="text-2xl">${reportData.average?.toFixed(2) || 0}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-600">Growth</p>
                  <p className="text-2xl">{reportData.growth || 0}%</p>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Report Summary</p>
                <p className="text-sm">
                  This is a placeholder for detailed report data visualization.
                  In a production environment, this would display charts, graphs,
                  and detailed breakdowns based on the selected report type and date range.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Quick Insights</CardTitle>
          <CardDescription>Key business metrics at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="flex-1">
                <p>Revenue reports help track income trends over time</p>
                <p className="text-sm text-gray-600">
                  Identify peak revenue periods and plan accordingly
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <BarChart3 className="h-8 w-8 text-green-600" />
              <div className="flex-1">
                <p>Service reports show which services are most popular</p>
                <p className="text-sm text-gray-600">
                  Optimize resource allocation based on demand
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
