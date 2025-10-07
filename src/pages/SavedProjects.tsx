import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Calendar, 
  Bookmark
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { getUserSavedProjects, toggleSaveProject } from '@/services/firestoreService';
import { Project } from '@/types/firestore';
import { useToast } from '@/hooks/use-toast';

const SavedProjects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [savedProjects, setSavedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedProjects = async () => {
      if (!user) return;
      try {
        const projects = await getUserSavedProjects(user.id);
        setSavedProjects(projects);
      } catch (error) {
        console.error('Error fetching saved projects:', error);
        toast({
          title: "Error",
          description: "Failed to load saved projects",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProjects();
  }, [user]);

  const handleUnsave = async (projectId: string) => {
    if (!user) return;
    try {
      await toggleSaveProject(user.id, projectId);
      setSavedProjects(prev => prev.filter(p => p.id !== projectId));
      toast({
        title: "Removed",
        description: "Project removed from saved list"
      });
    } catch (error) {
      console.error('Error removing saved project:', error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Loading saved projects...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Bookmark className="h-8 w-8" />
              Saved Projects
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Your bookmarked projects
            </p>
          </div>
        </div>

        {savedProjects.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Heart className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No saved projects yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Start exploring projects and save the ones you're interested in!
              </p>
              <Button onClick={() => navigate('/explore-projects')}>
                Browse Projects
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProjects.map((project) => (
              <Card key={project.id} className="group hover:shadow-lg transition-all">
                <div className="relative">
                  <img 
                    src={project.imageUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300'} 
                    alt={project.title}
                    className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnsave(project.id);
                    }}
                  >
                    <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                  </Button>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg leading-tight">{project.title}</CardTitle>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {(project.techStack || []).slice(0, 4).map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(project.createdAt.seconds * 1000).toLocaleDateString()}</span>
                      </div>
                      {project.difficulty && <Badge variant="secondary">{project.difficulty}</Badge>}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-4" 
                    onClick={() => navigate(`/project/${project.id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SavedProjects;
