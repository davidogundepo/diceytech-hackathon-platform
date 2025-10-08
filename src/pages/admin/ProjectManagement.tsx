import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Search, Eye, Trash2, Star, EyeOff, Filter, ExternalLink } from 'lucide-react';
import { collection, getDocs, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { toast } from 'sonner';

interface Project {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  hidden?: boolean;
  createdAt?: Date;
  userName?: string;
  userEmail?: string;
}

const ProjectManagement = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchQuery, categoryFilter]);

  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const projectsData = await Promise.all(
        querySnapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data();
          
          // Fetch user details
          let userName = 'Unknown User';
          let userEmail = '';
          try {
            const userDoc = await getDoc(doc(db, 'users', data.userId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              userName = userData.displayName || userData.fullName || 'Unknown User';
              userEmail = userData.email || '';
            }
          } catch (error) {
            console.error('Error fetching user:', error);
          }

          return {
            id: docSnapshot.id,
            ...data,
            userName,
            userEmail,
            createdAt: data.createdAt?.toDate() || new Date(),
          } as Project;
        })
      );

      setProjects(projectsData.sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime()));
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = [...projects];

    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    setFilteredProjects(filtered);
  };

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setIsDialogOpen(true);
  };

  const handleToggleFeatured = async (project: Project) => {
    try {
      await updateDoc(doc(db, 'projects', project.id), {
        featured: !project.featured,
      });
      toast.success(project.featured ? 'Project unfeatured' : 'Project featured');
      fetchProjects();
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
    }
  };

  const handleToggleHidden = async (project: Project) => {
    try {
      await updateDoc(doc(db, 'projects', project.id), {
        hidden: !project.hidden,
      });
      toast.success(project.hidden ? 'Project unhidden' : 'Project hidden');
      fetchProjects();
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      await deleteDoc(doc(db, 'projects', projectToDelete.id));
      toast.success('Project deleted successfully');
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    } finally {
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const getProjectStats = () => {
    return {
      total: projects.length,
      featured: projects.filter(p => p.featured).length,
      hidden: projects.filter(p => p.hidden).length,
    };
  };

  const stats = getProjectStats();
  const categories = Array.from(new Set(projects.map(p => p.category)));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Project Management</h1>
        <p className="text-slate-400 mt-1">Review and manage user-submitted projects</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-slate-400">Total Projects</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-500">{stats.featured}</div>
            <div className="text-sm text-slate-400">Featured</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-500">{stats.hidden}</div>
            <div className="text-sm text-slate-400">Hidden</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by title, user, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px] bg-slate-800 border-slate-700 text-white">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-slate-800/50">
                <TableHead className="text-slate-400">Title</TableHead>
                <TableHead className="text-slate-400">Owner</TableHead>
                <TableHead className="text-slate-400">Category</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                <TableHead className="text-slate-400">Created</TableHead>
                <TableHead className="text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-400 py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-400 py-8">
                    No projects found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((project) => (
                  <TableRow key={project.id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="text-white font-medium">{project.title}</TableCell>
                    <TableCell className="text-slate-300">{project.userName}</TableCell>
                    <TableCell className="text-slate-300">{project.category}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {project.featured && <Badge className="bg-yellow-500">Featured</Badge>}
                        {project.hidden && <Badge className="bg-red-500">Hidden</Badge>}
                        {!project.featured && !project.hidden && <Badge className="bg-green-500">Active</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {project.createdAt?.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewProject(project)}
                          className="border-slate-700 text-slate-300 hover:bg-slate-800"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleFeatured(project)}
                          className={project.featured 
                            ? 'border-yellow-700 text-yellow-400 hover:bg-yellow-900/20'
                            : 'border-slate-700 text-slate-400 hover:bg-slate-800'
                          }
                        >
                          <Star className={`h-4 w-4 ${project.featured ? 'fill-current' : ''}`} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleHidden(project)}
                          className={project.hidden 
                            ? 'border-red-700 text-red-400 hover:bg-red-900/20'
                            : 'border-slate-700 text-slate-400 hover:bg-slate-800'
                          }
                        >
                          <EyeOff className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setProjectToDelete(project);
                            setDeleteDialogOpen(true);
                          }}
                          className="border-red-700 text-red-400 hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Project Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl bg-slate-900 text-white border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Project Details</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-4">
              {selectedProject.imageUrl && (
                <img src={selectedProject.imageUrl} alt={selectedProject.title} 
                     className="w-full h-48 object-cover rounded-lg" />
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label className="text-slate-400">Title</Label>
                  <p className="text-white font-medium text-lg">{selectedProject.title}</p>
                </div>
                <div>
                  <Label className="text-slate-400">Owner</Label>
                  <p className="text-white font-medium">{selectedProject.userName}</p>
                  <p className="text-slate-500 text-sm">{selectedProject.userEmail}</p>
                </div>
                <div>
                  <Label className="text-slate-400">Category</Label>
                  <p className="text-white font-medium">{selectedProject.category}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-slate-400">Description</Label>
                  <p className="text-white">{selectedProject.description}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-slate-400">Links</Label>
                  <div className="flex gap-3 mt-2">
                    {selectedProject.liveUrl && (
                      <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer"
                         className="text-blue-400 hover:underline flex items-center gap-1">
                        <ExternalLink className="h-4 w-4" />
                        Live Demo
                      </a>
                    )}
                    {selectedProject.githubUrl && (
                      <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer"
                         className="text-blue-400 hover:underline flex items-center gap-1">
                        <ExternalLink className="h-4 w-4" />
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-900 border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Project?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This will permanently delete "{projectToDelete?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-700">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectManagement;
