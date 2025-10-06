import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Loader2, Database, Trash2 } from 'lucide-react';
import { seedDatabase, clearDatabase } from '@/utils/seedData';
import { useNavigate } from 'react-router-dom';

const AdminSeed = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const navigate = useNavigate();

  const addLog = (log: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${log}`]);
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    setStatus('idle');
    setMessage('');
    setLogs([]);
    setProgress(0);

    try {
      addLog('Starting database seeding...');
      setProgress(10);

      addLog('Creating sample users...');
      setProgress(20);

      addLog('Creating sample projects...');
      setProgress(40);

      addLog('Creating sample hackathons...');
      setProgress(60);

      addLog('Creating achievements...');
      setProgress(80);

      await seedDatabase();

      addLog('Database seeded successfully!');
      setProgress(100);
      setStatus('success');
      setMessage('Database has been populated with sample data. You can now explore the platform!');
    } catch (error) {
      console.error('Seeding error:', error);
      addLog(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setStatus('error');
      setMessage('Failed to seed database. Check console for details.');
      setProgress(0);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Are you sure you want to clear ALL data from the database? This cannot be undone!')) {
      return;
    }

    setIsClearing(true);
    setStatus('idle');
    setMessage('');
    setLogs([]);
    setProgress(0);

    try {
      addLog('Starting database cleanup...');
      setProgress(30);

      await clearDatabase();

      addLog('Database cleared successfully!');
      setProgress(100);
      setStatus('success');
      setMessage('Database has been cleared. All collections are now empty.');
    } catch (error) {
      console.error('Clear error:', error);
      addLog(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setStatus('error');
      setMessage('Failed to clear database. Check console for details.');
      setProgress(0);
    } finally {
      setIsClearing(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Database Admin
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Manage database seeding and testing data
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Status Alert */}
        {status !== 'idle' && (
          <Alert className={status === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-950' : 'border-red-500 bg-red-50 dark:bg-red-950'}>
            <div className="flex items-start gap-2">
              {status === 'success' ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
              )}
              <AlertDescription className={status === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}>
                {message}
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* Seed Database Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Seed Database
            </CardTitle>
            <CardDescription>
              Populate Firestore with realistic sample data for testing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                This will create:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>5 sample users with complete profiles</li>
                <li>15 sample projects across different users</li>
                <li>10 sample hackathons (active, upcoming, and completed)</li>
                <li>8 sample achievements</li>
                <li>Multiple notifications for demo user</li>
                <li>Several sample applications</li>
              </ul>
            </div>

            {progress > 0 && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Progress: {progress}%
                </p>
              </div>
            )}

            <Button
              onClick={handleSeed}
              disabled={isSeeding || isClearing}
              className="w-full"
              size="lg"
            >
              {isSeeding ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Seeding Database...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-5 w-5" />
                  Seed Database
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Clear Database Card */}
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <Trash2 className="h-5 w-5" />
              Clear Database
            </CardTitle>
            <CardDescription>
              Remove all data from Firestore collections (Danger Zone)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleClear}
              disabled={isSeeding || isClearing}
              variant="destructive"
              className="w-full"
              size="lg"
            >
              {isClearing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Clearing Database...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-5 w-5" />
                  Clear All Data
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Logs */}
        {logs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Operation Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 max-h-64 overflow-y-auto">
                <code className="text-sm text-green-400 font-mono">
                  {logs.map((log, i) => (
                    <div key={i}>{log}</div>
                  ))}
                </code>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminSeed;
