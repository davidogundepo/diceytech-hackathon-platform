import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  Award, 
  MapPin, 
  Clock,
  Heart,
  ExternalLink,
  Trophy,
  Star
} from "lucide-react";
import { getAllProjects, getUserSavedProjectIds, toggleSaveProject } from '@/services/firestoreService';
import { Project } from '@/types/firestore';
import { useAuth } from '@/contexts/AuthContext';

const ExploreProjects = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const allProjects = await getAllProjects();
        setProjects(allProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const loadSaved = async () => {
      if (!user?.id) return;
      try {
        const ids = await getUserSavedProjectIds(user.id);
        setSavedIds(new Set(ids));
      } catch (e) {
        console.error('Error loading saved projects', e);
      }
    };
    loadSaved();
  }, [user?.id]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
                           project.category?.toLowerCase() === selectedCategory.toLowerCase();
    
    const matchesDifficulty = selectedDifficulty === 'all' || project.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Explore Projects</h1>
            <p className="text-gray-600 mt-1">Discover amazing projects from the community</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/add-project')} className="bg-dicey-purple hover:bg-dicey-purple/90">
              <Trophy className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Web Development">Web Development</SelectItem>
                  <SelectItem value="Mobile App">Mobile App</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="AI/ML">AI/ML</SelectItem>
                  <SelectItem value="IoT">IoT</SelectItem>
                  <SelectItem value="Blockchain">Blockchain</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-gray-500 col-span-3 text-center">Loading projects...</p>
          ) : filteredProjects.length === 0 ? (
            <p className="text-gray-500 col-span-3 text-center">No projects found</p>
          ) : filteredProjects.map((project) => (
            <Card 
              key={project.id} 
              className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
              onClick={() => navigate(`/project/${project.id}`)}
            >
              <div className="relative">
                <img 
                  src={project.imageUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300'} 
                  alt={project.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Button
                  variant={savedIds.has(project.id) ? "secondary" : "ghost"}
                  size="icon"
                  className="absolute bottom-3 right-3 bg-white/90 hover:bg-white"
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (!user?.id) return;
                    try {
                      const nowSaved = await toggleSaveProject(user.id, project.id);
                      setSavedIds((prev) => {
                        const n = new Set(prev);
                        if (nowSaved) n.add(project.id); else n.delete(project.id);
                        return n;
                      });
                    } catch (err) {
                      console.error('Toggle save failed', err);
                    }
                  }}
                >
                  <Heart className="h-4 w-4" fill={savedIds.has(project.id) ? "currentColor" : "none"} />
                </Button>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg leading-tight">{project.title}</CardTitle>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
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
                    <div className="flex items-center gap-1 text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(project.createdAt.seconds * 1000).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {project.difficulty && <Badge variant="secondary">{project.difficulty}</Badge>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredProjects.length === 0 && !loading && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or filters to find more projects.
              </p>
              <Button onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
              }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ExploreProjects;
