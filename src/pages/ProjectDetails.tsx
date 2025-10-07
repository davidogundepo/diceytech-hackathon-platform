
import { useParams, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { ArrowLeft, Calendar, Users, Star, GitBranch, ExternalLink, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { getUserLikedProjectIds, toggleLikeProject, getUserSavedProjectIds, toggleSaveProject } from '@/services/firestoreService';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
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
        
        // Check if user has liked and saved this project
        if (user?.id) {
          const [likedIds, savedIds] = await Promise.all([
            getUserLikedProjectIds(user.id),
            getUserSavedProjectIds(user.id)
          ]);
          setIsLiked(likedIds.includes(id));
          setIsSaved(savedIds.includes(id));
        }
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
  }, [id, user?.id]);

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


  const handleSaveProject = async () => {
    if (!user?.id || !id) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to save projects",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const nowSaved = await toggleSaveProject(user.id, id);
      setIsSaved(nowSaved);
      toast({
        title: nowSaved ? "Project Saved" : "Project Removed",
        description: nowSaved ? "Project added to your saved list" : "Project removed from your saved list",
      });
    } catch (error) {
      console.error('Toggle save failed', error);
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive"
      });
    }
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
          {project.imageUrl && (
            <div className="mb-6">
              <img 
                src={project.imageUrl} 
                alt={project.title}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
          )}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="secondary" className="bg-dicey-yellow text-dicey-dark-pink">
                  {project.category || 'Project'}
                </Badge>
                {project.difficulty && (
                  <Badge variant="secondary" className="bg-dicey-magenta text-white">
                    {project.difficulty}
                  </Badge>
                )}
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
              {(project.demoUrl || project.githubUrl) && (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="bg-white/20 text-white hover:bg-white/30"
                  onClick={() => window.open(project.demoUrl || project.githubUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {project.demoUrl ? 'View Demo' : 'View on GitHub'}
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">
                {project.createdAt 
                  ? new Date(project.createdAt.seconds * 1000).toLocaleDateString()
                  : 'N/A'}
              </span>
            </div>
            {project.views !== undefined && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">{project.views} views</span>
              </div>
            )}
            {project.category && (
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                <span className="text-sm">{project.category}</span>
              </div>
            )}
            {project.likes !== undefined && (
              <button
                className="flex items-center gap-2 hover:text-dicey-yellow transition-colors"
                onClick={async () => {
                  if (!user?.id) {
                    toast({
                      title: "Please log in",
                      description: "You need to be logged in to like projects",
                      variant: "destructive"
                    });
                    return;
                  }
                  try {
                    const nowLiked = await toggleLikeProject(user.id, id!);
                    setIsLiked(nowLiked);
                    setProject((prev: any) => ({
                      ...prev,
                      likes: (prev.likes || 0) + (nowLiked ? 1 : -1)
                    }));
                    toast({
                      title: nowLiked ? "Project Liked!" : "Like Removed",
                      description: nowLiked ? "You liked this project" : "You unliked this project"
                    });
                  } catch (error) {
                    console.error('Toggle like failed', error);
                  }
                }}
              >
                <Star className={`h-4 w-4 ${isLiked ? 'fill-dicey-yellow text-dicey-yellow' : ''}`} />
                <span className="text-sm">{project.likes || 0} likes</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Technologies */}
            {project.techStack && project.techStack.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Technologies Used</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech, index) => (
                      <Badge key={index} variant="outline" className="border-dicey-azure text-dicey-azure">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Project Details */}
            {(project.challenges || project.learnings || project.futureImprovements) && (
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {project.challenges && (
                    <div>
                      <h4 className="font-medium mb-2 text-dicey-magenta">Challenges</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{project.challenges}</p>
                    </div>
                  )}
                  {project.learnings && (
                    <div>
                      <h4 className="font-medium mb-2 text-dicey-magenta">Key Learnings</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{project.learnings}</p>
                    </div>
                  )}
                  {project.futureImprovements && (
                    <div>
                      <h4 className="font-medium mb-2 text-dicey-magenta">Future Improvements</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{project.futureImprovements}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Collaborators */}
            {project.collaborators && project.collaborators.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Collaborators</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {project.collaborators.map((email, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-dicey-magenta rounded-full"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">{email}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Links */}
            <Card>
              <CardHeader>
                <CardTitle>Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {project.githubUrl && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.open(project.githubUrl, '_blank')}
                  >
                    <GitBranch className="h-4 w-4 mr-2" />
                    GitHub Repository
                  </Button>
                )}
                {project.demoUrl && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.open(project.demoUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Live Demo
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Skills */}
            {project.skills && project.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetails;
