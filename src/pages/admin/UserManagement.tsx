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
import { Search, Eye, Edit, Trash2, Shield, ShieldOff, Filter, Mail } from 'lucide-react';
import { collection, getDocs, updateDoc, deleteDoc, doc, query, where, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  displayName?: string;
  fullName?: string;
  username?: string;
  role: 'user' | 'admin';
  bio?: string;
  skills?: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  createdAt?: Date;
  projectCount?: number;
  applicationCount?: number;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, roleFilter]);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = await Promise.all(
        querySnapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data();
          
          // Count user's projects
          let projectCount = 0;
          try {
            const projectsQuery = query(collection(db, 'projects'), where('userId', '==', docSnapshot.id));
            const projectsSnapshot = await getDocs(projectsQuery);
            projectCount = projectsSnapshot.size;
          } catch (error) {
            console.error('Error counting projects:', error);
          }

          // Count user's applications
          let applicationCount = 0;
          try {
            const applicationsQuery = query(collection(db, 'applications'), where('userId', '==', docSnapshot.id));
            const applicationsSnapshot = await getDocs(applicationsQuery);
            applicationCount = applicationsSnapshot.size;
          } catch (error) {
            console.error('Error counting applications:', error);
          }

          return {
            id: docSnapshot.id,
            ...data,
            createdAt: data.createdAt?.toDate(),
            projectCount,
            applicationCount,
          } as User;
        })
      );

      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleToggleAdmin = async (user: User) => {
    try {
      const newRole = user.role === 'admin' ? 'user' : 'admin';
      await updateDoc(doc(db, 'users', user.id), {
        role: newRole,
      });
      toast.success(`User ${newRole === 'admin' ? 'promoted to' : 'removed from'} admin`);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await deleteDoc(doc(db, 'users', userToDelete.id));
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const getUserStats = () => {
    return {
      total: users.length,
      admins: users.filter(u => u.role === 'admin').length,
      regular: users.filter(u => u.role === 'user').length,
    };
  };

  const stats = getUserStats();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">User Management</h1>
        <p className="text-slate-400 mt-1">Manage platform users and permissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-slate-400">Total Users</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-500">{stats.admins}</div>
            <div className="text-sm text-slate-400">Administrators</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-500">{stats.regular}</div>
            <div className="text-sm text-slate-400">Regular Users</div>
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
                placeholder="Search by name, email, or username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700 text-white">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">Users</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-slate-800/50">
                <TableHead className="text-slate-400">Name</TableHead>
                <TableHead className="text-slate-400">Email</TableHead>
                <TableHead className="text-slate-400">Role</TableHead>
                <TableHead className="text-slate-400">Projects</TableHead>
                <TableHead className="text-slate-400">Applications</TableHead>
                <TableHead className="text-slate-400">Joined</TableHead>
                <TableHead className="text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-slate-400 py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-slate-400 py-8">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="text-white font-medium">
                      {user.displayName || user.fullName || user.username || 'No Name'}
                    </TableCell>
                    <TableCell className="text-slate-300">{user.email}</TableCell>
                    <TableCell>
                      <Badge className={user.role === 'admin' ? 'bg-purple-500' : 'bg-blue-500'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300">{user.projectCount || 0}</TableCell>
                    <TableCell className="text-slate-300">{user.applicationCount || 0}</TableCell>
                    <TableCell className="text-slate-300">
                      {user.createdAt?.toLocaleDateString() || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewUser(user)}
                          className="border-slate-700 text-slate-300 hover:bg-slate-800"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleAdmin(user)}
                          className={user.role === 'admin' 
                            ? 'border-orange-700 text-orange-400 hover:bg-orange-900/20'
                            : 'border-purple-700 text-purple-400 hover:bg-purple-900/20'
                          }
                        >
                          {user.role === 'admin' ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setUserToDelete(user);
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

      {/* User Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-slate-900 text-white border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-400">Full Name</Label>
                  <p className="text-white font-medium">
                    {selectedUser.displayName || selectedUser.fullName || 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-slate-400">Username</Label>
                  <p className="text-white font-medium">{selectedUser.username || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-slate-400">Email</Label>
                  <p className="text-white font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <Label className="text-slate-400">Role</Label>
                  <Badge className={selectedUser.role === 'admin' ? 'bg-purple-500' : 'bg-blue-500'}>
                    {selectedUser.role}
                  </Badge>
                </div>
                <div>
                  <Label className="text-slate-400">Projects</Label>
                  <p className="text-white font-medium">{selectedUser.projectCount || 0}</p>
                </div>
                <div>
                  <Label className="text-slate-400">Applications</Label>
                  <p className="text-white font-medium">{selectedUser.applicationCount || 0}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-slate-400">Bio</Label>
                  <p className="text-white">{selectedUser.bio || 'No bio provided'}</p>
                </div>
                {selectedUser.skills && selectedUser.skills.length > 0 && (
                  <div className="col-span-2">
                    <Label className="text-slate-400">Skills</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedUser.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="border-slate-700">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="col-span-2">
                  <Label className="text-slate-400">Links</Label>
                  <div className="space-y-1 mt-2">
                    {selectedUser.githubUrl && (
                      <a href={selectedUser.githubUrl} target="_blank" rel="noopener noreferrer" 
                         className="text-blue-400 hover:underline block">
                        GitHub: {selectedUser.githubUrl}
                      </a>
                    )}
                    {selectedUser.linkedinUrl && (
                      <a href={selectedUser.linkedinUrl} target="_blank" rel="noopener noreferrer"
                         className="text-blue-400 hover:underline block">
                        LinkedIn: {selectedUser.linkedinUrl}
                      </a>
                    )}
                    {selectedUser.portfolioUrl && (
                      <a href={selectedUser.portfolioUrl} target="_blank" rel="noopener noreferrer"
                         className="text-blue-400 hover:underline block">
                        Portfolio: {selectedUser.portfolioUrl}
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
            <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This will permanently delete user "{userToDelete?.email}". All their projects and applications will remain but be orphaned. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-700">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;
