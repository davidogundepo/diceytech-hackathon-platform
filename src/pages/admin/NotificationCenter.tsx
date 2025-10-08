import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Send, Bell, Users, Trophy, Calendar } from 'lucide-react';
import { collection, getDocs, addDoc, Timestamp, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { toast } from 'sonner';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'system' | 'hackathon' | 'achievement' | 'announcement';
  targetAudience: 'all' | 'specific';
  priority: 'normal' | 'high';
  createdAt: Date;
  sentCount?: number;
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'announcement' as 'system' | 'hackathon' | 'achievement' | 'announcement',
    targetAudience: 'all' as 'all' | 'specific',
    priority: 'normal' as 'normal' | 'high',
    link: '',
  });
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchNotifications();
    fetchUsers();
  }, []);

  const fetchNotifications = async () => {
    try {
      const q = query(
        collection(db, 'adminNotifications'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      const querySnapshot = await getDocs(q);
      const notificationsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Notification[];

      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create notification in adminNotifications collection
      const notificationData = {
        ...formData,
        createdAt: Timestamp.now(),
        sentCount: formData.targetAudience === 'all' ? users.length : 0,
      };

      await addDoc(collection(db, 'adminNotifications'), notificationData);

      // Send to all users' notifications
      if (formData.targetAudience === 'all') {
        const notificationPromises = users.map(user => 
          addDoc(collection(db, 'notifications'), {
            userId: user.id,
            title: formData.title,
            message: formData.message,
            type: formData.type,
            read: false,
            link: formData.link || null,
            createdAt: Timestamp.now(),
          })
        );
        await Promise.all(notificationPromises);
      }

      toast.success(`Notification sent to ${formData.targetAudience === 'all' ? 'all users' : 'selected users'}`);
      setIsDialogOpen(false);
      resetForm();
      fetchNotifications();
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'announcement',
      targetAudience: 'all',
      priority: 'normal',
      link: '',
    });
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      system: Bell,
      hackathon: Trophy,
      achievement: Trophy,
      announcement: Bell,
    };
    const Icon = icons[type as keyof typeof icons] || Bell;
    return <Icon className="h-4 w-4" />;
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      system: 'bg-blue-500',
      hackathon: 'bg-purple-500',
      achievement: 'bg-green-500',
      announcement: 'bg-orange-500',
    };
    return <Badge className={colors[type as keyof typeof colors] || 'bg-gray-500'}>{type}</Badge>;
  };

  const stats = {
    total: notifications.length,
    thisWeek: notifications.filter(n => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return n.createdAt >= weekAgo;
    }).length,
    totalRecipients: notifications.reduce((sum, n) => sum + (n.sentCount || 0), 0),
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Notification Center</h1>
          <p className="text-slate-400 mt-1">Create and manage platform notifications</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-blue-600">
              <Plus className="mr-2 h-4 w-4" />
              Create Notification
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-slate-900 text-white border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Notification</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-slate-200">Title</Label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="Notification title"
                />
              </div>
              <div>
                <Label className="text-slate-200">Message</Label>
                <Textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
                  placeholder="Notification message"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-200">Type</Label>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="hackathon">Hackathon</SelectItem>
                      <SelectItem value="achievement">Achievement</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-slate-200">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value: any) => setFormData({ ...formData, priority: value })}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-slate-200">Target Audience</Label>
                <Select value={formData.targetAudience} onValueChange={(value: any) => setFormData({ ...formData, targetAudience: value })}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users ({users.length})</SelectItem>
                    <SelectItem value="specific">Specific Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-200">Link (Optional)</Label>
                <Input
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="/hackathons"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                  <Send className="mr-2 h-4 w-4" />
                  {loading ? 'Sending...' : 'Send Notification'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-slate-400">Total Sent</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-500">{stats.thisWeek}</div>
            <div className="text-sm text-slate-400">This Week</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-500">{stats.totalRecipients}</div>
            <div className="text-sm text-slate-400">Total Recipients</div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications History */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Notification History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-slate-800/50">
                <TableHead className="text-slate-400">Title</TableHead>
                <TableHead className="text-slate-400">Type</TableHead>
                <TableHead className="text-slate-400">Recipients</TableHead>
                <TableHead className="text-slate-400">Priority</TableHead>
                <TableHead className="text-slate-400">Sent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-400 py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : notifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-400 py-8">
                    No notifications sent yet
                  </TableCell>
                </TableRow>
              ) : (
                notifications.map((notification) => (
                  <TableRow key={notification.id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="text-white font-medium">{notification.title}</TableCell>
                    <TableCell>{getTypeBadge(notification.type)}</TableCell>
                    <TableCell className="text-slate-300">{notification.sentCount || 0} users</TableCell>
                    <TableCell>
                      <Badge className={notification.priority === 'high' ? 'bg-red-500' : 'bg-gray-500'}>
                        {notification.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {notification.createdAt.toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;
