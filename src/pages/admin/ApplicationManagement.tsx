import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, CheckCircle, XCircle, Clock, Filter } from 'lucide-react';
import { collection, getDocs, updateDoc, doc, getDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Application {
  id: string;
  userId: string;
  hackathonId: string;
  userName?: string;
  userEmail?: string;
  hackathonTitle?: string;
  status: 'pending' | 'accepted' | 'rejected';
  type: string;
  createdAt: Date;
  reviewNotes?: string;
}

const ApplicationManagement = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchQuery, statusFilter]);

  const fetchApplications = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'applications'));
      const applicationsData = await Promise.all(
        querySnapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data();
          
          // Fetch user details
          let userName = 'Unknown User';
          let userEmail = '';
          try {
            const userDoc = await getDoc(doc(db, 'users', data.userId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              userName = userData.displayName || userData.fullName || 'Unknown User';
              userEmail = userData.email || '';
            }
          } catch (error) {
            console.error('Error fetching user:', error);
          }

          // Fetch hackathon details
          let hackathonTitle = 'Unknown Hackathon';
          try {
            const hackathonDoc = await getDoc(doc(db, 'hackathons', data.hackathonId));
            if (hackathonDoc.exists()) {
              hackathonTitle = hackathonDoc.data().title;
            }
          } catch (error) {
            console.error('Error fetching hackathon:', error);
          }

          return {
            id: docSnapshot.id,
            ...data,
            userName,
            userEmail,
            hackathonTitle,
            createdAt: data.createdAt?.toDate() || new Date(),
          } as Application;
        })
      );

      setApplications(applicationsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    if (searchQuery) {
      filtered = filtered.filter(app => 
        app.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.hackathonTitle?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  };

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setReviewNotes(application.reviewNotes || '');
    setIsDialogOpen(true);
  };

  const handleUpdateStatus = async (status: 'accepted' | 'rejected') => {
    if (!selectedApplication) return;

    try {
      await updateDoc(doc(db, 'applications', selectedApplication.id), {
        status,
        reviewNotes,
        reviewedAt: new Date(),
      });

      // Send confirmation email via Supabase function
      try {
        await supabase.functions.invoke('send-application-confirmation', {
          body: {
            email: selectedApplication.userEmail,
            userName: selectedApplication.userName,
            hackathonTitle: selectedApplication.hackathonTitle,
            status,
          },
        });
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Don't fail the whole operation if email fails
      }

      toast.success(`Application ${status}`);
      setIsDialogOpen(false);
      fetchApplications();
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application');
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { color: 'bg-yellow-500', icon: Clock },
      accepted: { color: 'bg-green-500', icon: CheckCircle },
      rejected: { color: 'bg-red-500', icon: XCircle },
    };
    const { color, icon: Icon } = config[status as keyof typeof config] || config.pending;
    return (
      <Badge className={`${color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const getApplicationStats = () => {
    return {
      total: applications.length,
      pending: applications.filter(a => a.status === 'pending').length,
      accepted: applications.filter(a => a.status === 'accepted').length,
      rejected: applications.filter(a => a.status === 'rejected').length,
    };
  };

  const stats = getApplicationStats();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Application Management</h1>
        <p className="text-slate-400 mt-1">Review and manage hackathon applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-slate-400">Total Applications</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
            <div className="text-sm text-slate-400">Pending Review</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-500">{stats.accepted}</div>
            <div className="text-sm text-slate-400">Accepted</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-500">{stats.rejected}</div>
            <div className="text-sm text-slate-400">Rejected</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name, email, or hackathon..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700 text-white">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-slate-800/50">
                <TableHead className="text-slate-400">Applicant</TableHead>
                <TableHead className="text-slate-400">Email</TableHead>
                <TableHead className="text-slate-400">Hackathon</TableHead>
                <TableHead className="text-slate-400">Type</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                <TableHead className="text-slate-400">Date</TableHead>
                <TableHead className="text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-slate-400 py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredApplications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-slate-400 py-8">
                    No applications found
                  </TableCell>
                </TableRow>
              ) : (
                filteredApplications.map((application) => (
                  <TableRow key={application.id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="text-white font-medium">{application.userName}</TableCell>
                    <TableCell className="text-slate-300">{application.userEmail}</TableCell>
                    <TableCell className="text-slate-300">{application.hackathonTitle}</TableCell>
                    <TableCell className="text-slate-300">{application.type}</TableCell>
                    <TableCell>{getStatusBadge(application.status)}</TableCell>
                    <TableCell className="text-slate-300">
                      {application.createdAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewApplication(application)}
                        className="border-slate-700 text-slate-300 hover:bg-slate-800"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-slate-900 text-white border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Review Application</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-400">Applicant Name</Label>
                  <p className="text-white font-medium">{selectedApplication.userName}</p>
                </div>
                <div>
                  <Label className="text-slate-400">Email</Label>
                  <p className="text-white font-medium">{selectedApplication.userEmail}</p>
                </div>
                <div>
                  <Label className="text-slate-400">Hackathon</Label>
                  <p className="text-white font-medium">{selectedApplication.hackathonTitle}</p>
                </div>
                <div>
                  <Label className="text-slate-400">Application Type</Label>
                  <p className="text-white font-medium">{selectedApplication.type}</p>
                </div>
                <div>
                  <Label className="text-slate-400">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedApplication.status)}</div>
                </div>
                <div>
                  <Label className="text-slate-400">Submitted</Label>
                  <p className="text-white font-medium">
                    {selectedApplication.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-slate-200">Review Notes</Label>
                <Textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add internal notes about this application..."
                  className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
                />
              </div>

              {selectedApplication.status === 'pending' && (
                <div className="flex gap-3 justify-end">
                  <Button
                    onClick={() => handleUpdateStatus('rejected')}
                    variant="outline"
                    className="border-red-700 text-red-400 hover:bg-red-900/20"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleUpdateStatus('accepted')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Accept
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationManagement;
