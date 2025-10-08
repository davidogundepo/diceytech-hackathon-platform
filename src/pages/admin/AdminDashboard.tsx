import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Trophy, FolderKanban, FileText, TrendingUp, Activity, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { toast } from 'sonner';

interface DashboardStats {
  totalUsers: number;
  totalProjects: number;
  activeHackathons: number;
  pendingApplications: number;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProjects: 0,
    activeHackathons: 0,
    pendingApplications: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch total users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      
      // Fetch total projects
      const projectsSnapshot = await getDocs(collection(db, 'projects'));
      
      // Fetch active hackathons
      const hackathonsQuery = query(
        collection(db, 'hackathons'),
        where('isActive', '==', true)
      );
      const hackathonsSnapshot = await getDocs(hackathonsQuery);
      
      // Fetch pending applications
      const applicationsQuery = query(
        collection(db, 'applications'),
        where('status', '==', 'pending')
      );
      const applicationsSnapshot = await getDocs(applicationsQuery);

      setStats({
        totalUsers: usersSnapshot.size,
        totalProjects: projectsSnapshot.size,
        activeHackathons: hackathonsSnapshot.size,
        pendingApplications: applicationsSnapshot.size,
      });

      // Fetch recent activity (last 10 applications)
      const recentAppsQuery = query(
        collection(db, 'applications'),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      const recentAppsSnapshot = await getDocs(recentAppsQuery);
      
      const activities: RecentActivity[] = recentAppsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          type: 'application',
          description: `New ${data.type} application submitted`,
          timestamp: data.createdAt?.toDate() || new Date(),
        };
      });

      setRecentActivity(activities);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      action: () => navigate('/admin/users'),
    },
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: FolderKanban,
      color: 'from-green-500 to-green-600',
      action: () => navigate('/admin/projects'),
    },
    {
      title: 'Active Hackathons',
      value: stats.activeHackathons,
      icon: Trophy,
      color: 'from-purple-500 to-purple-600',
      action: () => navigate('/admin/hackathons'),
    },
    {
      title: 'Pending Applications',
      value: stats.pendingApplications,
      icon: FileText,
      color: 'from-orange-500 to-orange-600',
      action: () => navigate('/admin/applications'),
    },
  ];

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Welcome back! Here's your platform overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="bg-slate-900 border-slate-800 cursor-pointer hover:border-slate-700 transition-all"
              onClick={stat.action}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  {stat.title}
                </CardTitle>
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  {loading ? '...' : stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button
            onClick={() => navigate('/admin/hackathons')}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
          >
            <Trophy className="mr-2 h-4 w-4" />
            Add Hackathon
          </Button>
          <Button
            onClick={() => navigate('/admin/notifications')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
          >
            <Bell className="mr-2 h-4 w-4" />
            Send Notification
          </Button>
          <Button
            onClick={() => navigate('/admin/applications')}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
          >
            <FileText className="mr-2 h-4 w-4" />
            Review Applications
          </Button>
          <Button
            onClick={() => navigate('/admin/analytics')}
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            View Analytics
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-slate-400 text-center py-8">Loading activity...</p>
          ) : recentActivity.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm text-white">{activity.description}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatTimestamp(activity.timestamp)}
                    </p>
                  </div>
                  <Badge variant="outline" className="border-slate-700 text-slate-400">
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
