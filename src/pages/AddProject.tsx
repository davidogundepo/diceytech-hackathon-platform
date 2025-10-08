
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  Link, 
  Github, 
  ExternalLink, 
  Plus, 
  X,
  Trophy,
  Users,
  Calendar,
  Award,
  Target,
  FileText,
  Image
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AddProject = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editProjectId = searchParams.get('edit');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState<string>('');
  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    overview: '',
    techStack: [] as string[],
    githubUrl: '',
    demoUrl: '',
    videoUrl: '',
    category: '',
    difficulty: '',
    outcomes: '',
    skills: [] as string[],
    collaborators: [] as string[],
    image: null as File | null
  });

  const [newTech, setNewTech] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newCollaborator, setNewCollaborator] = useState('');

  // Load existing project data if editing
  useEffect(() => {
    const loadProjectData = async () => {
      if (editProjectId) {
        setLoading(true);
        try {
          const { getProjectById } = await import('@/services/firestoreService');
          const project = await getProjectById(editProjectId);
          
          if (project) {
            setProjectData({
              title: project.title || '',
              description: project.description || '',
              overview: project.overview || '',
              techStack: project.techStack || [],
              githubUrl: project.githubUrl || '',
              demoUrl: project.demoUrl || '',
              videoUrl: project.videoUrl || '',
              category: project.category || '',
              difficulty: project.difficulty || '',
              outcomes: project.outcomes || '',
              skills: project.skills || [],
              collaborators: project.collaborators || [],
              image: null
            });
            setExistingImageUrl(project.imageUrl || '');
          } else {
            toast({
              title: "Project not found",
              description: "The project you're trying to edit doesn't exist.",
              variant: "destructive"
            });
            navigate('/my-portfolio');
          }
        } catch (error) {
          console.error('Error loading project:', error);
          toast({
            title: "Error",
            description: "Failed to load project data.",
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadProjectData();
  }, [editProjectId, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
  };

  const addTech = () => {
    if (newTech.trim() && !projectData.techStack.includes(newTech.trim())) {
      setProjectData(prev => ({
        ...prev,
        techStack: [...prev.techStack, newTech.trim()]
      }));
      setNewTech('');
    }
  };

  const removeTech = (tech: string) => {
    setProjectData(prev => ({
      ...prev,
      techStack: prev.techStack.filter(t => t !== tech)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !projectData.skills.includes(newSkill.trim())) {
      setProjectData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setProjectData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addCollaborator = () => {
    if (newCollaborator.trim() && !projectData.collaborators.includes(newCollaborator.trim())) {
      setProjectData(prev => ({
        ...prev,
        collaborators: [...prev.collaborators, newCollaborator.trim()]
      }));
      setNewCollaborator('');
    }
  };

  const removeCollaborator = (collaborator: string) => {
    setProjectData(prev => ({
      ...prev,
      collaborators: prev.collaborators.filter(c => c !== collaborator)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProjectData(prev => ({ ...prev, image: file }));
    }
  };

  const handleSave = () => {
    toast({
      title: "Project saved as draft",
      description: "Your project has been saved and you can continue editing later.",
    });
  };

  const handleSubmit = async () => {
    if (!projectData.title.trim() || !projectData.description.trim()) {
      toast({
        title: "Missing required fields",
        description: "Please fill in the project title and description.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { createProject, updateProject } = await import('@/services/firestoreService');
      const { uploadProjectImage } = await import('@/services/storageService');
      const { useAuth } = await import('@/contexts/AuthContext');
      
      // Get user from window global (set by AuthContext)
      const currentUser = (window as any).__currentUser;
      if (!currentUser) {
        toast({
          title: "Error",
          description: "You must be logged in to add a project.",
          variant: "destructive"
        });
        return;
      }

      let imageUrl = existingImageUrl;
      
      // Upload new image if provided
      if (projectData.image) {
        try {
          imageUrl = await uploadProjectImage(projectData.image, currentUser.id);
        } catch (error) {
          console.error('Error uploading image:', error);
          toast({
            title: "Warning",
            description: "Failed to upload image, but project will be saved.",
          });
        }
      }

      const projectPayload = {
        userId: currentUser.id,
        title: projectData.title,
        description: projectData.description,
        overview: projectData.overview,
        techStack: projectData.techStack,
        githubUrl: projectData.githubUrl,
        demoUrl: projectData.demoUrl,
        videoUrl: projectData.videoUrl,
        category: projectData.category,
        difficulty: projectData.difficulty,
        outcomes: projectData.outcomes,
        skills: projectData.skills,
        collaborators: projectData.collaborators,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
        status: 'published'
      };

      if (editProjectId) {
        // Update existing project
        await updateProject(editProjectId, projectPayload);
        toast({
          title: "Project updated!",
          description: "Your project has been successfully updated.",
        });
      } else {
        // Create new project
        await createProject(projectPayload);
        toast({
          title: "Project submitted successfully!",
          description: "Your project has been added to your portfolio.",
        });
      }
      
      navigate('/my-portfolio');
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: "Error",
        description: `Failed to ${editProjectId ? 'update' : 'create'} project. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = () => {
    const requiredFields = ['title', 'description', 'overview'];
    const completedFields = requiredFields.filter(field => 
      projectData[field as keyof typeof projectData] as string
    ).length;
    return Math.round((completedFields / requiredFields.length) * 100);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{editProjectId ? 'Edit Project' : 'Add New Project'}</h1>
            <p className="text-gray-600 mt-1">{editProjectId ? 'Update your project details' : 'Share your project with the community'}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSave} className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
              Save Draft
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={loading}
              className="bg-dicey-purple hover:bg-dicey-purple/90 text-black dark:text-white border border-black dark:border-white rounded-md"
            >
              <Trophy className="mr-2 h-4 w-4" />
              {loading ? 'Saving...' : (editProjectId ? 'Update Project' : 'Submit Project')}
            </Button>
          </div>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Project Completion</span>
              <span className="text-sm text-gray-500">{progressPercentage()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-dicey-teal h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage()}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        {/* Main Form */}
        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="demo">Demo</TabsTrigger>
                <TabsTrigger value="tech">Tech Stack</TabsTrigger>
                <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="contributors">Contributors</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Project Name *</label>
                      <Input
                        placeholder="Enter your project name"
                        value={projectData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="text-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Short Description *</label>
                      <Textarea
                        placeholder="Brief description of your project (max 200 characters)"
                        value={projectData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        maxLength={200}
                        rows={3}
                      />
                      <div className="text-right text-sm text-gray-500 mt-1">
                        {projectData.description.length}/200
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">About this Project</label>
                      <Textarea
                        placeholder="Craft a concise and impactful description of your project, focusing on the problem it solves and its unique value add to YOUR portfolio. Make it compelling and engaging to capture the attention of potential employers and collaborators."
                        value={projectData.overview}
                        onChange={(e) => handleInputChange('overview', e.target.value)}
                        rows={6}
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Project Image</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                          {existingImageUrl && !projectData.image ? (
                            <div className="space-y-2">
                              <img 
                                src={existingImageUrl} 
                                alt="Current project" 
                                className="w-full h-32 object-cover rounded-lg mb-2"
                              />
                              <p className="text-sm text-gray-600">Click to change image</p>
                            </div>
                          ) : (
                            <>
                              <Image className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">
                                {projectData.image ? projectData.image.name : 'Click to upload image'}
                              </p>
                            </>
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <Select value={projectData.category} onValueChange={(value) => handleInputChange('category', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="web-app">Web Application</SelectItem>
                            <SelectItem value="mobile-app">Mobile Application</SelectItem>
                            <SelectItem value="data-analysis">Data Analysis</SelectItem>
                            <SelectItem value="machine-learning">Machine Learning</SelectItem>
                            <SelectItem value="api">API/Backend</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Difficulty</label>
                        <Select value={projectData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="demo" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Link className="h-5 w-5" />
                        Live Demo
                      </CardTitle>
                      <CardDescription>
                        Bring your project to life with a live version that people can interact with
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Input
                        placeholder="https://your-project-demo.com"
                        value={projectData.demoUrl}
                        onChange={(e) => handleInputChange('demoUrl', e.target.value)}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Video Demo
                      </CardTitle>
                      <CardDescription>
                        Show your project in action with a short video
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Input
                        placeholder="https://youtube.com/watch?v=..."
                        value={projectData.videoUrl}
                        onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="tech" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tech Stack</CardTitle>
                    <CardDescription>
                      Select the tools you used in this project
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 mb-4">
                      <Input
                        placeholder="Add technology (e.g., React, Python, AWS)"
                        value={newTech}
                        onChange={(e) => setNewTech(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTech()}
                      />
                      <Button onClick={addTech}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {projectData.techStack.map((tech, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {tech}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeTech(tech)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Github className="h-5 w-5" />
                      GitHub Repository
                    </CardTitle>
                    <CardDescription>
                      Link to your source code
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Input
                      placeholder="https://github.com/username/repository"
                      value={projectData.githubUrl}
                      onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="outcomes" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Outcomes</CardTitle>
                    <CardDescription>
                      Summarize the impact of your project in a brief yet compelling way. Showcase how your work has contributed to your professional growth.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Summarize the impact of your project in a brief yet compelling way. Showcase how your work has contributed to your professional growth, such as acquiring a new skill, leveraging project results in a practical setting, or sharing your knowledge to empower others in the data science community."
                      value={projectData.outcomes}
                      onChange={(e) => handleInputChange('outcomes', e.target.value)}
                      rows={6}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="skills" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills Demonstrated</CardTitle>
                    <CardDescription>
                      Select the skills you demonstrated in this project
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 mb-4">
                      <Input
                        placeholder="Add skill (e.g., Data Analysis, UI/UX Design)"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      />
                      <Button onClick={addSkill}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {projectData.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          {skill}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeSkill(skill)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contributors" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Contributors
                    </CardTitle>
                    <CardDescription>
                      Add team members who contributed to this project
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 mb-4">
                      <Input
                        placeholder="Add contributor name or username"
                        value={newCollaborator}
                        onChange={(e) => setNewCollaborator(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addCollaborator()}
                      />
                      <Button onClick={addCollaborator}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {projectData.collaborators.map((collaborator, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-dicey-teal text-white rounded-full flex items-center justify-center text-sm font-medium">
                              {collaborator.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                            <span className="font-medium">{collaborator}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeCollaborator(collaborator)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AddProject;
