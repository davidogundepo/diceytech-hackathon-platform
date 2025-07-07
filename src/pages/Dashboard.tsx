import React from 'react';
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

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { title: 'Active Projects', value: '12', icon: Trophy, color: 'text-dicey-azure' },
    { title: 'Hackathons Joined', value: '8', icon: Users, color: 'text-dicey-magenta' },
    { title: 'Applications', value: '15', icon: Calendar, color: 'text-dicey-yellow' },
    { title: 'Profile Views', value: '247', icon: Target, color: 'text-green-600' },
  ];

  const recentProjects = [
    {
      id: 1,
      title: 'AgriConnect Summit Hackathon',
      organization: 'DataFestAfrica',
      status: 'Active',
      endDate: 'May 15, 2025',
      difficulty: 'Hard',
      prize: '$5000',
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300'
    },
    {
      id: 2,
      title: 'DataFestAfrica Hackathon 2024',
      organization: 'DataFestAfrica',
      status: 'Submitted',
      endDate: 'Oct 10, 2024',
      difficulty: 'Intermediate',
      prize: '$3000',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=300'
    }
  ];

  const upcomingEvents = [
    {
      title: 'AI for Agriculture Workshop',
      date: 'Jan 15, 2025',
      time: '2:00 PM',
      location: 'Online',
      type: 'Workshop'
    },
    {
      title: 'Tech Career Fair',
      date: 'Jan 20, 2025',
      time: '10:00 AM',
      location: 'Lagos, Nigeria',
      type: 'Event'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="bg-dicey-azure rounded-xl p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, {user?.name}! 👋
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
                  <CardDescription>Your latest hackathons and competitions</CardDescription>
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
                {recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                       onClick={() => navigate(`/project/${project.id}`)}>
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{project.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{project.organization}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={project.status === 'Active' ? 'default' : 'secondary'} className="bg-dicey-magenta text-white">
                          {project.status}
                        </Badge>
                        <Badge variant="outline">{project.difficulty}</Badge>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          {project.prize}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Ends</p>
                      <p className="text-sm font-medium">{project.endDate}</p>
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="ghost" 
                  className="w-full border-2 border-dashed border-gray-300 h-20 hover:border-dicey-azure hover:bg-dicey-azure/10"
                  onClick={() => navigate('/explore-projects')}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Discover New Projects
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-sm">{event.title}</h5>
                      <Badge variant="outline" className="text-xs">{event.type}</Badge>
                    </div>
                    <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {event.date} at {event.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/hackathons')}>
                  View All Events
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
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Rising Star!</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  You're in the top 10% of active participants this month.
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
