
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
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
  Palette
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

const MyPortfolio = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProjects = async () => {
      if (user) {
        setLoading(true);
        try {
          const { getUserProjects } = await import('@/services/firestoreService');
          const userProjects = await getUserProjects(user.id);
          setProjects(userProjects);
        } catch (error) {
          console.error('Error fetching projects:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProjects();
  }, [user]);

  const portfolioStats = {
    totalProjects: projects.length,
    completedHackathons: 5, // TODO: Fetch from applications
    totalAwards: 3, // TODO: Fetch from achievements
    profileViews: 247 // TODO: Add view tracking
  };

  const skillsData = [
    { skill: 'Python', level: 90 },
    { skill: 'Data Analysis', level: 85 },
    { skill: 'Machine Learning', level: 80 },
    { skill: 'SQL', level: 88 },
    { skill: 'React', level: 75 },
    { skill: 'Django', level: 70 },
    { skill: 'AWS', level: 68 },
    { skill: 'JavaScript', level: 82 }
  ];

  const achievements = [
    {
      title: '1st Place - AgriConnect Summit Hackathon',
      date: 'May 2025',
      organization: 'DataFestAfrica',
      prize: '$5000',
      icon: Trophy,
      color: 'text-yellow-600'
    },
    {
      title: '2nd Place - DataFest Africa 2024',
      date: 'Oct 2024',
      organization: 'DataFestAfrica',
      prize: '$2000',
      icon: Award,
      color: 'text-silver-600'
    },
    {
      title: 'Best Innovation Award',
      date: 'Sep 2023',
      organization: 'Target Tuition',
      prize: '$1000',
      icon: Star,
      color: 'text-bronze-600'
    }
  ];

  const chartConfig = {
    level: {
      label: "Skill Level",
      color: "hsl(var(--dicey-azure))",
    },
  };

  return (
    <DashboardLayout>
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
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Profile Views</p>
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
                  <Badge variant="default">Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Skills & Technologies</span>
                  <Badge variant="default">Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Work Experience</span>
                  <Badge variant="secondary">Incomplete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Education</span>
                  <Badge variant="secondary">Incomplete</Badge>
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
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Skills Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Skills</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Technical Skills Overview</CardTitle>
              <CardDescription>Visual representation of skill proficiency levels</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[400px]">
                <RadarChart data={skillsData}>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} />
                  <Radar
                    dataKey="level"
                    stroke="#428b9f"
                    fill="#428b9f"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </section>

        {/* Achievements Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Achievements</h2>
          
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800 ${achievement.color}`}>
                      <achievement.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {achievement.title}
                      </h3>
                      <p className="text-dicey-azure font-medium mb-1">
                        {achievement.organization}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {achievement.date}
                        </span>
                        <span className="flex items-center gap-1 text-dicey-yellow font-semibold">
                          <Award className="h-4 w-4" />
                          {achievement.prize}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default MyPortfolio;
