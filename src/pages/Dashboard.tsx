import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Users, 
  Calendar, 
  Target, 
  Award,
  Clock,
  MapPin,
  Plus
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProjects, getRecentHackathons } from '@/services/firestoreService';
import { Project, Hackathon } from '@/types/firestore';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      console.log('Dashboard: fetchData called, user:', user?.id);
      
      if (!user) {
        console.log('Dashboard: No user, skipping data fetch');
        setLoading(false);
        return;
      }
      
      try {
        console.log('Dashboard: Fetching user projects and hackathons');
        const [userProjects, upcomingHackathons] = await Promise.all([
          getUserProjects(user.id, 3),
          getRecentHackathons(5)
        ]);
        
        console.log('Dashboard: Projects fetched:', userProjects.length, 'projects');
        console.log('Dashboard: Hackathons fetched:', upcomingHackathons.length, 'hackathons');
        
        setProjects(userProjects);
        setHackathons(upcomingHackathons);
      } catch (error) {
        console.error('Dashboard: Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const stats = [
    { title: 'Active Projects', value: projects.length.toString(), icon: Trophy, color: 'text-dicey-azure' },
    { title: 'Hackathons Joined', value: hackathons.length.toString(), icon: Users, color: 'text-dicey-magenta' },
    { title: 'Applications', value: '0', icon: Calendar, color: 'text-dicey-yellow' },
    { title: 'Profile Views', value: '0', icon: Target, color: 'text-green-600' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="bg-dicey-azure rounded-xl p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, {user?.displayName || user?.email || 'User'}! 👋
              </h1>
              <p className="text-white/90 mb-4">
                Continue building your tech career with exciting projects and opportunities.
              </p>
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="text-white/80">Profile Completion: </span>
                  <span className="font-semibold">{user?.profileCompleteness}%</span>
                </div>
                <Progress value={user?.profileCompleteness} className="w-32 h-2" />
              </div>
            </div>
            <Button 
              variant="secondary" 
              onClick={() => navigate('/profile')}
              className="bg-dicey-yellow hover:bg-dicey-yellow/90 text-dicey-dark-pink border-dicey-yellow"
            >
              Complete Profile
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Projects</CardTitle>
                  <CardDescription>Your latest projects and submissions</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/explore-projects')}
                >
                  View All
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
              {loading ? (
                <p className="text-gray-500">Loading projects...</p>
              ) : projects.length === 0 ? (
                <p className="text-gray-500">No projects yet. Add your first project!</p>
              ) : projects.map((project) => (
                  <div key={project.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                       onClick={() => navigate(`/project/${project.id}`)}>
                    <img 
                      src={project.imageUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300'} 
                      alt={project.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{project.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">{project.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {project.status && (
                          <Badge variant={project.status === 'published' ? 'default' : 'secondary'} className="bg-dicey-magenta text-white">
                            {project.status}
                          </Badge>
                        )}
                        {project.difficulty && <Badge variant="outline">{project.difficulty}</Badge>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Created</p>
                      <p className="text-sm font-medium">{new Date(project.createdAt.seconds * 1000).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="ghost" 
                  className="w-full border-2 border-dashed border-gray-300 h-20 hover:border-dicey-azure hover:bg-dicey-azure/10"
                  onClick={() => navigate('/add-project')}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Add New Project
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Hackathons
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? (
                  <p className="text-gray-500">Loading events...</p>
                ) : hackathons.length === 0 ? (
                  <p className="text-gray-500">No upcoming hackathons.</p>
                ) : hackathons.map((event, index) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-sm">{event.title}</h5>
                      <Badge variant="outline" className="text-xs">{event.category}</Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{event.description}</p>
                    <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(event.startDate.seconds * 1000).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {event.participantCount || 0} participants
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/hackathons')}>
                  View All Hackathons
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:bg-dicey-azure hover:text-white"
                  onClick={() => navigate('/add-project')}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Project
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:bg-dicey-yellow hover:text-dicey-dark-pink"
                  onClick={() => navigate('/profile')}
                >
                  <Target className="mr-2 h-4 w-4" />
                  Update Profile
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-dicey-yellow/10 border-dicey-yellow/20">
              <CardContent className="p-4 text-center">
                <div className="text-dicey-magenta mb-2">
                  <Trophy className="h-8 w-8 mx-auto" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Keep Going!</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Continue building your portfolio and joining hackathons.
                </p>
                <Button 
                  size="sm" 
                  className="bg-dicey-magenta hover:bg-dicey-magenta/90 text-white"
                  onClick={() => navigate('/achievements')}
                >
                  View Achievements
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
