
import { useParams, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { ArrowLeft, Calendar, Users, Star, GitBranch, ExternalLink, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const { getProjectById } = await import('@/services/firestoreService');
        const projectData = await getProjectById(id);
        setProject(projectData);
      } catch (error) {
        console.error('Error fetching project:', error);
        toast({
          title: "Error",
          description: "Failed to load project details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Loading project...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto p-6">
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Project not found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                The project you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate('/explore-projects')}>
                Back to Projects
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const mockProject = {
    id: id,
    title: "AI-Powered Healthcare Assistant",
    description: "A comprehensive healthcare management system that uses AI to assist doctors in diagnosis and treatment recommendations. The platform includes patient management, medical history tracking, and predictive analytics.",
    type: "hackathon",
    status: "active",
    difficulty: "Advanced",
    category: "Healthcare",
    technologies: ["React", "Python", "TensorFlow", "Node.js", "MongoDB"],
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    participants: 156,
    maxParticipants: 200,
    prize: "$50,000",
    organizer: {
      name: "HealthTech Initiative",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
    },
    requirements: [
      "Experience with AI/ML frameworks",
      "Healthcare domain knowledge preferred",
      "Team of 2-4 members",
      "Original code submission required"
    ],
    timeline: [
      { phase: "Registration", date: "Jan 15 - Jan 20", status: "completed" },
      { phase: "Development", date: "Jan 21 - Feb 10", status: "active" },
      { phase: "Submission", date: "Feb 11 - Feb 13", status: "upcoming" },
      { phase: "Judging", date: "Feb 14 - Feb 15", status: "upcoming" }
    ],
    mentors: [
      { name: "Dr. Sarah Johnson", role: "Healthcare AI Expert", avatar: "https://images.unsplash.com/photo-1494790108755-2616b6d5c0b4?w=150" },
      { name: "Michael Chen", role: "Tech Lead", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" }
    ]
  };

  const handleSaveProject = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Project Removed" : "Project Saved",
      description: isSaved ? "Project removed from your saved list" : "Project added to your saved list",
    });
  };

  const handleJoinProject = () => {
    if (!hasJoined) {
      setHasJoined(true);
      toast({
        title: "Successfully Joined!",
        description: "You have joined the project. Check your applications for updates.",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/explore-projects')}
            className="flex items-center gap-2 hover:bg-dicey-azure hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Button>
        </div>

        {/* Project Header */}
        <div className="bg-dicey-azure rounded-xl p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="secondary" className="bg-dicey-yellow text-dicey-dark-pink">
                  {project.type === 'hackathon' ? 'Hackathon' : 'Practice Project'}
                </Badge>
                <Badge variant="secondary" className="bg-dicey-magenta text-white">
                  {project.difficulty}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
              <p className="text-white/90 text-lg">{project.description}</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={handleSaveProject}
                className={`${isSaved ? 'bg-dicey-yellow text-dicey-dark-pink' : 'bg-white/20 text-white hover:bg-white/30'}`}
              >
                <Heart className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved ? 'Saved' : 'Save'}
              </Button>
              <Button variant="secondary" size="sm" className="bg-white/20 text-white hover:bg-white/30">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Demo
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Ends Feb 15, 2024</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="text-sm">{project.participants}/{project.maxParticipants} participants</span>
            </div>
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              <span className="text-sm">{project.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span className="text-sm">Prize: {project.prize}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Technologies */}
            <Card>
              <CardHeader>
                <CardTitle>Technologies Required</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <Badge key={index} variant="outline" className="border-dicey-azure text-dicey-azure">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {project.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-dicey-magenta rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Project Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.timeline.map((phase, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        phase.status === 'completed' ? 'bg-dicey-yellow' :
                        phase.status === 'active' ? 'bg-dicey-magenta' :
                        'bg-gray-300'
                      }`}></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{phase.phase}</span>
                          <span className="text-sm text-gray-500">{phase.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Organizer */}
            <Card>
              <CardHeader>
                <CardTitle>Organized by</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={project.organizer.avatar} />
                    <AvatarFallback className="bg-dicey-azure text-white">HT</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{project.organizer.name}</p>
                    <p className="text-sm text-gray-500">Verified Organizer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mentors */}
            <Card>
              <CardHeader>
                <CardTitle>Mentors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.mentors.map((mentor, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={mentor.avatar} />
                        <AvatarFallback className="bg-dicey-magenta text-white">{mentor.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{mentor.name}</p>
                        <p className="text-xs text-gray-500">{mentor.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Button */}
            <Card>
              <CardContent className="pt-6">
                <Button 
                  className={`w-full text-white ${
                    hasJoined 
                      ? 'bg-dicey-yellow text-dicey-dark-pink hover:bg-dicey-yellow/90' 
                      : 'bg-dicey-magenta hover:bg-dicey-magenta/90'
                  }`}
                  size="lg"
                  onClick={handleJoinProject}
                  disabled={hasJoined}
                >
                  {hasJoined ? 'Joined Successfully!' : 'Join Project'}
                </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  By joining, you agree to the project terms and conditions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetails;
