import { useState } from 'react';
import apiClient from '../../lib/api-client';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';

export function StorageDiagnostic() {
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runDiagnostics = async () => {
    setIsChecking(true);
    try {
      const response = await apiClient.get('/admin/storage-diagnostics');
      setResults(response.data);
    } catch (error: any) {
      setResults({
        timestamp: new Date().toISOString(),
        checks: [{
          name: 'API Connection',
          status: 'error',
          message: '❌ Failed to connect to backend API',
          details: error.message,
        }]
      });
    }
    setIsChecking(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'skip':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const allPassed = results?.checks.every((c: any) => c.status === 'pass' || c.status === 'skip');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Storage Diagnostic Tool</CardTitle>
        <CardDescription>
          Test vehicle images storage configuration and permissions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runDiagnostics} 
          disabled={isChecking}
          className="w-full"
        >
          {isChecking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Diagnostics...
            </>
          ) : (
            'Run Storage Diagnostics'
          )}
        </Button>

        {results && (
          <div className="space-y-4">
            <Alert variant={allPassed ? 'default' : 'destructive'}>
              <AlertDescription>
                {allPassed ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    All checks passed! Storage is configured correctly.
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Some checks failed. Please follow the fix instructions below.
                  </span>
                )}
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {results.checks.map((check: any, index: number) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 border rounded-lg"
                >
                  {getStatusIcon(check.status)}
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">{check.name}</p>
                    <p className="text-sm text-muted-foreground">{check.message}</p>
                    {check.details && (
                      <p className="text-xs text-muted-foreground bg-muted p-2 rounded mt-2 font-mono">
                        {check.details}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {!allPassed && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">How to Fix:</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>Open Supabase Dashboard → SQL Editor</li>
                      <li>Copy and run the script from <code className="bg-muted px-1">FIX_STORAGE_POLICIES_NOW.sql</code></li>
                      <li>Run diagnostics again to verify</li>
                    </ol>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <p className="text-xs text-muted-foreground">
              Last checked: {new Date(results.timestamp).toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
