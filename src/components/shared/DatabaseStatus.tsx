import { useState, useEffect } from 'react';
import { runDatabaseDiagnostic, printDiagnosticReport, DiagnosticReport } from '../../lib/database-diagnostic';
import { checkDatabaseSetup } from '../../lib/data-compatibility-api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { AlertCircle, CheckCircle2, Database, RefreshCw } from 'lucide-react';

export function DatabaseStatus() {
  const [report, setReport] = useState<DiagnosticReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [setupStatus, setSetupStatus] = useState<any>(null);

  const runDiagnostic = async () => {
    setLoading(true);
    try {
      const diagnosticReport = await runDatabaseDiagnostic();
      setReport(diagnosticReport);
      printDiagnosticReport(diagnosticReport);

      const status = await checkDatabaseSetup();
      setSetupStatus(status);
    } catch (error) {
      console.error('Error running diagnostic:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostic();
  }, []);

  if (!report) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Database Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Loading database information...</p>
        </CardContent>
      </Card>
    );
  }

  const totalTables = Object.keys(report.tables).length;
  const activeTables = Object.values(report.tables).filter(t => t.exists && t.rowCount > 0).length;
  const totalRows = Object.values(report.tables).reduce((sum, t) => sum + t.rowCount, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Database Status
            </CardTitle>
            <CardDescription>
              Connected to Supabase - {activeTables}/{totalTables} tables active
            </CardDescription>
          </div>
          <Button onClick={runDiagnostic} disabled={loading} variant="outline" size="sm">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl">{totalRows}</div>
            <div className="text-sm text-gray-600">Total Records</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl">{activeTables}</div>
            <div className="text-sm text-gray-600">Active Tables</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl">{report.issues.length}</div>
            <div className="text-sm text-gray-600">Issues Found</div>
          </div>
        </div>

        {/* Table Status */}
        <div>
          <h3 className="text-sm mb-3">Table Status</h3>
          <div className="space-y-2">
            {Object.entries(report.tables).map(([name, info]) => (
              <div key={name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  {info.exists && info.rowCount > 0 ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm">{name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={info.rowCount > 0 ? 'default' : 'secondary'}>
                    {info.rowCount} rows
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Issues */}
        {report.issues.length > 0 && (
          <div>
            <h3 className="text-sm mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              Issues Found
            </h3>
            <div className="space-y-2">
              {report.issues.map((issue, idx) => (
                <div key={idx} className="p-3 bg-orange-50 border border-orange-200 rounded text-sm">
                  {issue}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {report.recommendations.length > 0 && (
          <div>
            <h3 className="text-sm mb-3">💡 Recommendations</h3>
            <div className="space-y-2">
              {report.recommendations.map((rec, idx) => (
                <div key={idx} className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                  {rec}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data Summary */}
        {setupStatus && (
          <div>
            <h3 className="text-sm mb-3">Data Summary</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 bg-gray-50 rounded">
                <div className="text-gray-600">Users</div>
                <div>{setupStatus.users ? '✅ Has data' : '❌ Empty'}</div>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <div className="text-gray-600">Customers</div>
                <div>{setupStatus.customers ? '✅ Has data' : '❌ Empty'}</div>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <div className="text-gray-600">Employees</div>
                <div>{setupStatus.employees ? '✅ Has data' : '❌ Empty'}</div>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <div className="text-gray-600">Services</div>
                <div>{setupStatus.services ? '✅ Has data' : '❌ Empty'}</div>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <div className="text-gray-600">Vehicles</div>
                <div>{setupStatus.vehicles ? '✅ Has data' : '❌ Empty'}</div>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <div className="text-gray-600">Appointments</div>
                <div>{setupStatus.appointments ? '✅ Has data' : '❌ Empty'}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
