import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, Trophy, FolderKanban, Calendar } from 'lucide-react';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { toast } from 'sonner';

interface AnalyticsData {
  userGrowth: { month: string; count: number }[];
  hackathonStats: { category: string; count: number }[];
  projectStats: { category: string; count: number }[];
  topUsers: { name: string; projects: number; applications: number }[];
}

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    userGrowth: [],
    hackathonStats: [],
    projectStats: [],
    topUsers: [],
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch projects
      const projectsSnapshot = await getDocs(collection(db, 'projects'));
      const projects = projectsSnapshot.docs.map(doc => doc.data());

      // Fetch hackathons
      const hackathonsSnapshot = await getDocs(collection(db, 'hackathons'));
      const hackathons = hackathonsSnapshot.docs.map(doc => doc.data());

      // Fetch applications
      const applicationsSnapshot = await getDocs(collection(db, 'applications'));
      const applications = applicationsSnapshot.docs.map(doc => doc.data());

      // Calculate user growth by month (last 6 months)
      const userGrowth = calculateUserGrowth(users);

      // Calculate hackathon stats by category
      const hackathonStats = calculateCategoryStats(hackathons);

      // Calculate project stats by category
      const projectStats = calculateCategoryStats(projects);

      // Calculate top users
      const topUsers = await calculateTopUsers(users, projects, applications);

      setAnalytics({
        userGrowth,
        hackathonStats,
        projectStats,
        topUsers,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const calculateUserGrowth = (users: any[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const last6Months = [];

    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      last6Months.push(months[monthIndex]);
    }

    const growthData = last6Months.map(month => ({
      month,
      count: Math.floor(Math.random() * 50) + 20, // Mock data - replace with actual calculation
    }));

    return growthData;
  };

  const calculateCategoryStats = (items: any[]) => {
    const categories: { [key: string]: number } = {};
    
    items.forEach(item => {
      const category = item.category || 'Other';
      categories[category] = (categories[category] || 0) + 1;
    });

    return Object.entries(categories).map(([category, count]) => ({
      category,
      count,
    })).sort((a, b) => b.count - a.count);
  };

  const calculateTopUsers = async (users: any[], projects: any[], applications: any[]) => {
    const userStats = users.map(user => {
      const userProjects = projects.filter(p => p.userId === user.id).length;
      const userApplications = applications.filter(a => a.userId === user.id).length;
      
      return {
        name: user.displayName || user.fullName || user.email,
        projects: userProjects,
        applications: userApplications,
        total: userProjects + userApplications,
      };
    });

    return userStats
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  };

  const overallStats = {
    totalUsers: analytics.userGrowth.reduce((sum, m) => sum + m.count, 0),
    totalHackathons: analytics.hackathonStats.reduce((sum, h) => sum + h.count, 0),
    totalProjects: analytics.projectStats.reduce((sum, p) => sum + p.count, 0),
    avgProjectsPerUser: analytics.projectStats.length > 0 
      ? Math.round(analytics.projectStats.reduce((sum, p) => sum + p.count, 0) / analytics.topUsers.length)
      : 0,
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
        <p className="text-slate-400 mt-1">Platform insights and statistics</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Users</CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{overallStats.totalUsers}</div>
            <p className="text-xs text-slate-500 mt-1">Last 6 months</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Hackathons</CardTitle>
            <Trophy className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{overallStats.totalHackathons}</div>
            <p className="text-xs text-slate-500 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Projects</CardTitle>
            <FolderKanban className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{overallStats.totalProjects}</div>
            <p className="text-xs text-slate-500 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Avg Projects/User</CardTitle>
            <TrendingUp className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{overallStats.avgProjectsPerUser}</div>
            <p className="text-xs text-slate-500 mt-1">Platform average</p>
          </CardContent>
        </Card>
      </div>

      {/* User Growth Chart */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            User Growth (Last 6 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.userGrowth.map((data, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-16 text-slate-400">{data.month}</div>
                <div className="flex-1">
                  <div className="w-full bg-slate-800 rounded-full h-8">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-8 rounded-full flex items-center justify-end pr-3 text-white text-sm font-medium"
                      style={{ width: `${(data.count / 70) * 100}%` }}
                    >
                      {data.count}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hackathon Categories */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Hackathon Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.hackathonStats.slice(0, 5).map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-slate-300">{stat.category}</span>
                  <span className="text-white font-bold">{stat.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Categories */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Project Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.projectStats.slice(0, 5).map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-slate-300">{stat.category}</span>
                  <span className="text-white font-bold">{stat.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Users */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Top Active Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.topUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <span className="text-white font-medium">{user.name}</span>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-slate-400">
                    <span className="text-green-500 font-bold">{user.projects}</span> projects
                  </span>
                  <span className="text-slate-400">
                    <span className="text-blue-500 font-bold">{user.applications}</span> applications
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
