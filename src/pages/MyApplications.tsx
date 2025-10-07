import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Building, 
  MapPin, 
  Clock,
  ExternalLink,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { getUserApplications } from '@/services/firestoreService';
import { Application } from '@/types/firestore';

const MyApplications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'jobs' | 'hackathons' | 'pending'>('all');
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) {
        console.log('❌ No user logged in, cannot load applications');
        setLoading(false);
        return;
      }
      
      console.log('📋 Fetching applications for user:', user.id);
      setLoading(true);
      try {
        const userApps = await getUserApplications(user.id);
        console.log('✅ Loaded', userApps.length, 'applications');
        setApplications(userApps);
      } catch (error) {
        console.error('❌ Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  const filteredApplications = applications.filter(app => {
    if (activeTab === 'all') return true;
    if (activeTab === 'jobs') return app.type === 'job';
    if (activeTab === 'hackathons') return app.type === 'hackathon';
    if (activeTab === 'pending') return app.status === 'pending';
    return true;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Please log in
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              You need to be logged in to view your applications.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Loading applications...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Applications</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Track your job applications and hackathon submissions</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <div className="p-3 rounded-full bg-dicey-teal/10 text-dicey-teal">
                  <FileText className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
                </div>
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Accepted</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.accepted}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0}%
                  </p>
                </div>
                <div className="p-3 rounded-full bg-dicey-purple/10 text-dicey-purple">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
            <CardDescription>View and manage your job applications and hackathon submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'jobs' | 'hackathons' | 'pending')}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="jobs">Jobs</TabsTrigger>
                <TabsTrigger value="hackathons">Hackathons</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6 space-y-4">
                {filteredApplications.length === 0 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No applications yet</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Start applying to jobs and hackathons to track your applications here.
                      </p>
                      <div className="flex gap-3 justify-center">
                        <Button onClick={() => navigate('/job-opportunities')}>Browse Jobs</Button>
                        <Button variant="outline" onClick={() => navigate('/hackathons')}>View Hackathons</Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  filteredApplications.map((application) => (
                    <Card key={application.id} className="transition-all hover:shadow-md">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{application.title}</h3>
                              <Badge variant={application.status === 'accepted' ? 'default' : application.status === 'rejected' ? 'destructive' : 'secondary'}>
                                {application.status}
                              </Badge>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mb-3">
                              {application.type === 'job' ? 'Job Application' : 'Hackathon Application'}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Applied: {new Date(application.createdAt.seconds * 1000).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => application.hackathonId && navigate(`/hackathon/${application.hackathonId}`)}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="jobs" className="mt-6">
                <Card className="text-center py-12">
                  <CardContent>
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Job Applications Coming Soon</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Job application tracking will be available soon. Stay tuned!
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="hackathons" className="mt-6 space-y-4">
                {filteredApplications.length === 0 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No hackathon applications</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">You haven't applied to any hackathons yet.</p>
                      <Button onClick={() => navigate('/hackathons')}>View Hackathons</Button>
                    </CardContent>
                  </Card>
                ) : (
                  filteredApplications.map((application) => (
                    <Card key={application.id} className="transition-all hover:shadow-md">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{application.title}</h3>
                              <Badge variant={application.status === 'accepted' ? 'default' : application.status === 'rejected' ? 'destructive' : 'secondary'}>
                                {application.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Applied: {new Date(application.createdAt.seconds * 1000).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => application.hackathonId && navigate(`/hackathon/${application.hackathonId}`)}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="pending" className="mt-6 space-y-4">
                {filteredApplications.length === 0 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No pending applications</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">All your applications have been reviewed.</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredApplications.map((application) => (
                    <Card key={application.id} className="transition-all hover:shadow-md">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{application.title}</h3>
                              <Badge variant="secondary">{application.status}</Badge>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mb-3">
                              {application.type === 'job' ? 'Job Application' : 'Hackathon Application'}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Applied: {new Date(application.createdAt.seconds * 1000).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => application.hackathonId && navigate(`/hackathon/${application.hackathonId}`)}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MyApplications;
