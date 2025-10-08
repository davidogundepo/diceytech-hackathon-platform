import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { 
  Trophy, 
  Users, 
  Calendar, 
  Target, 
  Award,
  Clock,
  MapPin,
  Plus,
  FolderPlus
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProjects, getRecentHackathons, getUserApplications, getUserHackathonApplicationIds } from '@/services/firestoreService';
import { Project, Hackathon } from '@/types/firestore';
import WelcomeModal from '@/components/WelcomeModal';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [hackathonsJoinedCount, setHackathonsJoinedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

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
        const [userProjects, upcomingHackathons, userApplications, hackathonIds] = await Promise.all([
          getUserProjects(user.id, 3),
          getRecentHackathons(5),
          getUserApplications(user.id),
          getUserHackathonApplicationIds(user.id)
        ]);
        
        console.log('Dashboard: Projects fetched:', userProjects.length, 'projects');
        console.log('Dashboard: Hackathons fetched:', upcomingHackathons.length, 'hackathons');
        console.log('Dashboard: Applications fetched:', userApplications.length);
        console.log('Dashboard: Hackathons joined:', hackathonIds.length);
        
        setProjects(userProjects);
        setHackathons(upcomingHackathons);
        setApplicationsCount(userApplications.length);
        setHackathonsJoinedCount(hackathonIds.length);
        
        // Check if first login - user created within last 5 minutes
        if (user.createdAt && typeof user.createdAt === 'object' && 'seconds' in user.createdAt) {
          const createdTime = user.createdAt.seconds * 1000;
          const now = Date.now();
          const fiveMinutes = 5 * 60 * 1000;
          const isNew = now - createdTime < fiveMinutes;
          setIsFirstLogin(isNew);
          
          // Show welcome modal for new users (only once per session)
          if (isNew && !sessionStorage.getItem('welcomeModalShown')) {
            setShowWelcomeModal(true);
            sessionStorage.setItem('welcomeModalShown', 'true');
          }
        }
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
    { title: 'Hackathons Joined', value: hackathonsJoinedCount.toString(), icon: Users, color: 'text-dicey-magenta' },
    { title: 'Applications', value: applicationsCount.toString(), icon: Calendar, color: 'text-dicey-yellow' },
    { title: 'Profile Views', value: user?.profileViews?.toString() || '0', badge: 'Coming Soon', icon: Target, color: 'text-green-600' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <DashboardLayout>
      <WelcomeModal 
        isOpen={showWelcomeModal} 
        userName={user?.displayName || 'there'}
        onClose={() => setShowWelcomeModal(false)}
      />
      <motion.div 
        className="space-y-8"
        initial="hidden"
        animate="show"
        variants={container}
      >
        <motion.div variants={item} className="bg-gradient-to-r from-dicey-azure to-dicey-magenta rounded-xl p-4 sm:p-6 md:p-8 text-white shadow-xl">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="w-full">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                {isFirstLogin ? 'Welcome' : 'Welcome back'}, {user?.displayName || user?.email || 'User'}! 👋
              </h1>
              <p className="text-sm sm:text-base text-white/90 mb-4 sm:mb-6">
                Continue building your tech career with exciting projects and opportunities.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <div className="text-xs sm:text-sm">
                  <span className="text-white/80">Profile Completion: </span>
                  <span className="font-semibold">{user?.profileCompleteness}%</span>
                </div>
                <Progress value={user?.profileCompleteness} className="w-full sm:w-40 h-2 bg-white/20" />
              </div>
            </div>
            <Button 
              variant="secondary" 
              onClick={() => navigate('/profile')}
              className="w-full sm:w-auto bg-dicey-yellow hover:bg-dicey-yellow/90 text-dicey-dark-pink border-none transition-smooth hover-lift text-sm sm:text-base whitespace-nowrap"
            >
              Complete Profile
            </Button>
          </div>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover-lift transition-smooth border-none shadow-md">
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1 sm:gap-2 mb-1">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">{stat.title}</p>
                      {(stat as any).badge && (
                        <Badge variant="outline" className="text-[10px] sm:text-xs">
                          {(stat as any).badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl bg-muted ${stat.color}`}>
                    <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
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
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="h-16 w-16 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : projects.length === 0 ? (
                <EmptyState
                  icon={FolderPlus}
                  title="No projects yet"
                  description="Start building your portfolio by adding your first project!"
                  actionLabel="Add Project"
                  onAction={() => navigate('/add-project')}
                />
              ) : projects.map((project) => (
                  <motion.div 
                    key={project.id} 
                    className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-smooth cursor-pointer hover-lift"
                    onClick={() => navigate(`/project/${project.id}`)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <img 
                      src={project.imageUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300'} 
                      alt={project.title}
                      className="w-16 h-16 rounded-lg object-cover"
                      loading="lazy"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{project.title}</h4>
                      <p className="text-sm text-muted-foreground truncate-2">{project.description}</p>
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
                      <p className="text-xs text-muted-foreground">Created</p>
                      <p className="text-sm font-medium">{new Date(project.createdAt.seconds * 1000).toLocaleDateString()}</p>
                    </div>
                  </motion.div>
                ))}
                
                <Button 
                  variant="ghost" 
                  className="w-full border-2 border-dashed border-border h-20 hover:border-dicey-azure hover:bg-dicey-azure/10 transition-smooth"
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
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : hackathons.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No upcoming hackathons.</p>
                ) : hackathons.map((event, index) => (
                  <motion.div 
                    key={index} 
                    className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-smooth cursor-pointer hover-lift"
                    onClick={() => navigate(`/hackathon/${event.id}`)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-semibold text-sm">{event.title}</h5>
                      <Badge variant="outline" className="text-xs">{event.category}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 truncate-2">{event.description}</p>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(event.startDate.seconds * 1000).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {event.participantCount || 0} participants
                      </div>
                    </div>
                  </motion.div>
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
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
