import React, { useState, useEffect } from 'react';
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
  Eye,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { getUserApplications, getHackathonById } from '@/services/firestoreService';
import { Application, Hackathon } from '@/types/firestore';

const MyApplications = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [applications, setApplications] = useState<Application[]>([]);
  const [hackathons, setHackathons] = useState<Record<string, Hackathon>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) {
        console.log('❌ No user logged in, cannot load applications');
        setLoading(false);
        return;
      }
      
      console.log('📋 Fetching applications for user:', user.id);
      console.log('📋 Full user object:', user);
      console.log('📋 User email:', user.email);
      setLoading(true);
      try {
        const userApps = await getUserApplications(user.id);
        console.log('✅ Loaded', userApps.length, 'applications:', userApps);
        console.log('✅ Raw applications data:', JSON.stringify(userApps, null, 2));
        
        if (userApps.length === 0) {
          console.log('💡 No applications found for user:', user.id);
        } else {
          // Fetch hackathon details for all hackathon applications
          const hackathonIds = userApps
            .filter(app => app.type === 'hackathon' && app.hackathonId)
            .map(app => app.hackathonId!);
          
          console.log('🎯 Fetching details for hackathons:', hackathonIds);
          
          const hackathonData: Record<string, Hackathon> = {};
          for (const id of hackathonIds) {
            try {
              const hackathon = await getHackathonById(id);
              if (hackathon) {
                hackathonData[id] = hackathon;
              }
            } catch (err) {
              console.error('Error fetching hackathon', id, err);
            }
          }
          
          console.log('✅ Loaded hackathon details:', hackathonData);
          setHackathons(hackathonData);
        }
        
        setApplications(userApps);
      } catch (error) {
        console.error('❌ Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return CheckCircle;
      case 'rejected': return XCircle;
      case 'under_review': return Eye;
      default: return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'under_review': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredApplications = applications.filter(app => {
    if (activeTab === 'all') return true;
    if (activeTab === 'jobs') return app.type === 'job';
    if (activeTab === 'hackathons') return app.type === 'hackathon';
    if (activeTab === 'pending') return ['pending', 'under_review'].includes(app.status);
    return true;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(app => ['pending', 'under_review'].includes(app.status)).length,
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
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                <TabsTrigger value="jobs">Jobs</TabsTrigger>
                <TabsTrigger value="hackathons">Hackathons</TabsTrigger>
                <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                <div className="space-y-4">
                  {filteredApplications.map((application) => {
                    const StatusIcon = getStatusIcon(application.status);
                    const statusColor = getStatusColor(application.status);
                    
                    // Get hackathon details if it's a hackathon application
                    const hackathon = application.hackathonId ? hackathons[application.hackathonId] : null;
                    
                    return (
                      <Card key={application.id} className="transition-all hover:shadow-md">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-full ${statusColor}`}>
                                  <StatusIcon className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {hackathon?.title || (application.type === 'job' ? 'Job Application' : 'Hackathon Application')}
                                  </h3>
                                  {hackathon && (
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                      {hackathon.description}
                                    </p>
                                  )}
                                  {application.applicationData?.teamName && (
                                    <p className="text-dicey-teal font-medium mt-1">
                                      Team: {application.applicationData.teamName}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{application.type}</Badge>
                              <Badge className={statusColor}>
                                {application.status.replace('_', ' ')}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>Applied {application.createdAt.toDate().toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>Updated {application.updatedAt.toDate().toLocaleDateString()}</span>
                            </div>
                            {hackathon && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{hackathon.location || 'Online'}</span>
                              </div>
                            )}
                          </div>
                          
                          {application.applicationData && (
                            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2 text-sm">
                              {application.applicationData.teamSize && (
                                <p><strong>Team Size:</strong> {application.applicationData.teamSize}</p>
                              )}
                              {application.applicationData.projectIdea && (
                                <p><strong>Project Idea:</strong> {application.applicationData.projectIdea}</p>
                              )}
                            </div>
                          )}
                          
                          <div className="flex gap-2">
                            {application.hackathonId && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.location.href = `/hackathons/${application.hackathonId}`}
                              >
                                <Eye className="mr-1 h-3 w-3" />
                                View Details
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  
                  {filteredApplications.length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                        No applications found
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        {activeTab === 'all' 
                          ? "You haven't submitted any applications yet." 
                          : `No ${activeTab} applications found.`
                        }
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MyApplications;
