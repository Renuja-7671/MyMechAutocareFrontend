import { useState } from 'react';
import { DatabaseStatus } from './DatabaseStatus';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';

interface DatabaseCheckPageProps {
  onBack: () => void;
}

export function DatabaseCheckPage({ onBack }: DatabaseCheckPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
          <h1 className="text-3xl mb-2">WheelsDoc AutoCare - Database Diagnostic</h1>
          <p className="text-gray-600">
            Check your existing database structure and data compatibility
          </p>
        </div>

        <DatabaseStatus />

        <div className="mt-6 p-6 bg-white rounded-lg shadow-sm border">
          <h2 className="text-xl mb-4">Next Steps</h2>
          <div className="space-y-4 text-sm">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="mb-2">✅ If Everything Looks Good</h3>
              <p className="text-gray-700">
                Your database is ready! Click "Back to Login" and sign in with an existing user account.
              </p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="mb-2">⚠️ If You See Issues</h3>
              <p className="text-gray-700 mb-2">
                Check the <code className="bg-white px-2 py-1 rounded">/EXISTING_DATA_GUIDE.md</code> file for detailed troubleshooting steps.
              </p>
              <p className="text-gray-700">
                Common fixes:
              </p>
              <ul className="list-disc ml-5 mt-2 text-gray-700">
                <li>Create missing customer/employee profiles</li>
                <li>Add services to your catalog</li>
                <li>Fix foreign key relationships</li>
                <li>Enable/disable RLS policies</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="mb-2">💡 Testing Your Data</h3>
              <p className="text-gray-700">
                To test if login works with your existing data:
              </p>
              <ol className="list-decimal ml-5 mt-2 text-gray-700 space-y-1">
                <li>Find a user email from your database</li>
                <li>Make sure you know the password (or reset it)</li>
                <li>Go back and try logging in</li>
                <li>Check if your data displays correctly</li>
              </ol>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="mb-2">🔍 SQL Queries to Try</h3>
              <p className="text-gray-700 mb-2">
                Run these in Supabase SQL Editor:
              </p>
              <div className="space-y-2">
                <div className="bg-white p-2 rounded font-mono text-xs">
                  -- Get a test user
                  <br />
                  SELECT email, role FROM users LIMIT 5;
                </div>
                <div className="bg-white p-2 rounded font-mono text-xs">
                  -- Check customer profiles
                  <br />
                  SELECT u.email, c.first_name, c.last_name
                  <br />
                  FROM users u JOIN customers c ON u.id = c.user_id;
                </div>
                <div className="bg-white p-2 rounded font-mono text-xs">
                  -- View services catalog
                  <br />
                  SELECT name, base_price FROM services WHERE is_active = true;
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
