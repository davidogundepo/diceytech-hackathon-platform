
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Plus, 
  Edit, 
  ExternalLink, 
  Github, 
  Trophy, 
  Star, 
  Calendar,
  Award,
  Target,
  TrendingUp,
  Users,
  Code,
  Database,
  Brain,
  Palette,
  Trash2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { toast } from "@/hooks/use-toast";

const MyPortfolio = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = React.useState<any[]>([]);
  const [applications, setApplications] = React.useState<any[]>([]);
  const [achievements, setAchievements] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [projectToDelete, setProjectToDelete] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchPortfolioData = async () => {
      if (user) {
        setLoading(true);
        try {
          const { getUserProjects, getUserApplications, getUserAchievements, getAllAchievements } = await import('@/services/firestoreService');
          
          // Fetch user's projects
          const userProjects = await getUserProjects(user.id);
          console.log('📁 Loaded projects:', userProjects.length);
          setProjects(userProjects);
          
          // Fetch user's applications
          const userApplications = await getUserApplications(user.id);
          console.log('📋 Loaded applications:', userApplications.length);
          setApplications(userApplications);
          
          // Fetch user's achievements
          const userAchievements = await getUserAchievements(user.id);
          const allAchievements = await getAllAchievements();
          
          // Match user achievements with achievement details
          const enrichedAchievements = userAchievements.map(ua => {
            const achievement = allAchievements.find(a => a.id === ua.achievementId);
            return {
              ...ua,
              ...achievement
            };
          }).filter(a => a.title); // Only include achievements with details
          
          console.log('🏆 Loaded achievements:', enrichedAchievements.length);
          setAchievements(enrichedAchievements);
        } catch (error) {
          console.error('Error fetching portfolio data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPortfolioData();
  }, [user]);

  const portfolioStats = {
    totalProjects: projects.length,
    completedHackathons: applications.length,
    totalAwards: achievements.length,
    profileViews: user?.profileViews || 0
  };

  // Generate skills data from user's profile
  const skillsData = React.useMemo(() => {
    if (!user?.skills || user.skills.length === 0) return [];
    
    // Create skill level data from user's skills
    return user.skills.slice(0, 8).map(skill => ({
      skill,
      level: 75 + Math.random() * 25 // Random level between 75-100 for visualization
    }));
  }, [user?.skills]);

  const chartConfig = {
    level: {
      label: "Skill Level",
      color: "hsl(var(--dicey-azure))",
    },
  };

  const handleEditProject = (projectId: string) => {
    navigate(`/add-project?edit=${projectId}`);
  };

  const handleDeleteClick = (projectId: string) => {
    setProjectToDelete(projectId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    
    try {
      const { deleteProject } = await import('@/services/firestoreService');
      await deleteProject(projectToDelete);
      
      // Update local state
      setProjects(projects.filter(p => p.id !== projectToDelete));
      
      toast({
        title: "Project deleted",
        description: "Your project has been successfully removed.",
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  return (
    <DashboardLayout>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Portfolio</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Showcase your projects and achievements</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/profile')}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
            <Button onClick={() => navigate('/add-project')} className="bg-dicey-azure hover:bg-dicey-azure/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </div>
        </div>

        {/* Overview Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Overview</h2>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Projects</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{portfolioStats.totalProjects}</p>
                  </div>
                  <div className="p-3 rounded-full bg-dicey-azure/10 text-dicey-azure">
                    <Code className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Hackathons</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{portfolioStats.completedHackathons}</p>
                  </div>
                  <div className="p-3 rounded-full bg-dicey-magenta/10 text-dicey-magenta">
                    <Trophy className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Awards</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{portfolioStats.totalAwards}</p>
                  </div>
                  <div className="p-3 rounded-full bg-dicey-yellow/10 text-dicey-yellow">
                    <Award className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Profile Views</p>
                      {/* <Badge variant="outline" className="text-xs">Coming Soon</Badge> */}
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{portfolioStats.profileViews}</p>
                  </div>
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Completion */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Completion</CardTitle>
              <CardDescription>Complete your profile to increase visibility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-gray-500">{user?.profileCompleteness}%</span>
              </div>
              <Progress value={user?.profileCompleteness} className="h-2" />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-between">
                  <span>Basic Information</span>
                  <Badge variant={user?.displayName && user?.bio ? "default" : "secondary"}>
                    {user?.displayName && user?.bio ? "Complete" : "Incomplete"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Skills & Technologies</span>
                  <Badge variant={user?.skills && user.skills.length > 0 ? "default" : "secondary"}>
                    {user?.skills && user.skills.length > 0 ? "Complete" : "Incomplete"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Work Experience</span>
                  <Badge variant={user?.experience && user.experience.length > 0 ? "default" : "secondary"}>
                    {user?.experience && user.experience.length > 0 ? "Complete" : "Incomplete"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Education</span>
                  <Badge variant={user?.education && user.education.length > 0 ? "default" : "secondary"}>
                    {user?.education && user.education.length > 0 ? "Complete" : "Incomplete"}
                  </Badge>
                </div>
              </div>
              
              <Button className="w-full mt-4" onClick={() => navigate('/profile')}>
                Complete Profile
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Projects Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Projects</h2>
            <Button variant="outline" onClick={() => navigate('/add-project')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </div>
          
          {loading ? (
            <div className="text-center py-8">Loading projects...</div>
          ) : projects.length === 0 ? (
            <Card className="col-span-full text-center py-12">
              <CardContent>
                <Code className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No projects yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Start building your portfolio by adding your first project!
                </p>
                <Button onClick={() => navigate('/add-project')} className="bg-dicey-azure hover:bg-dicey-azure/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Project
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="transition-all hover:shadow-lg">
                  <div className="relative">
                    {project.imageUrl ? (
                      <img 
                        src={project.imageUrl} 
                        alt={project.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-dicey-azure/10 rounded-t-lg flex items-center justify-center">
                        <Code className="h-12 w-12 text-dicey-azure" />
                      </div>
                    )}
                    {project.status && (
                      <Badge 
                        className={`absolute top-3 right-3 ${
                          project.status === 'published' ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                      >
                        {project.status}
                      </Badge>
                    )}
                  </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        {project.techStack?.map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>{project.createdAt?.toDate().toLocaleDateString()}</span>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" />
                            {project.views || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Trophy className="h-3 w-3" />
                            {project.likes || 0}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => handleEditProject(project.id)}
                          >
                            <Edit className="mr-1 h-3 w-3" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteClick(project.id)}
                          >
                            <Trash2 className="mr-1 h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          {project.githubUrl && (
                            <Button size="sm" variant="outline" className="flex-1" asChild>
                              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                <Github className="mr-1 h-3 w-3" />
                                Code
                              </a>
                            </Button>
                          )}
                          {project.demoUrl && (
                            <Button size="sm" variant="outline" className="flex-1" asChild>
                              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-1 h-3 w-3" />
                                Demo
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Skills Section */}
        {skillsData.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Skills</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Technical Skills Overview</CardTitle>
                <CardDescription>Visual representation of skill proficiency levels</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={skillsData} margin={{ top: 40, right: 40, bottom: 40, left: 40 }}>
                      <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                      <PolarGrid />
                      <PolarAngleAxis 
                        dataKey="skill" 
                        tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                      />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} />
                      <Radar
                        dataKey="level"
                        stroke="#428b9f"
                        fill="#428b9f"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Achievements Section */}
        {achievements.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Achievements</h2>
            
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-dicey-azure/10 text-dicey-azure">
                        <Trophy className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {achievement.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">
                          {achievement.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {achievement.earnedAt?.toDate().toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyPortfolio;
