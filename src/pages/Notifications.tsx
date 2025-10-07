import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  Check, 
  X, 
  Calendar, 
  Trophy, 
  Users, 
  Briefcase,
  Settings,
  Archive,
  Mail,
  MessageSquare,
  Heart,
  Star
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';
import { subscribeToAllNotifications, markNotificationAsRead } from '@/services/firestoreService';
import { Notification } from '@/types/firestore';

const Notifications = () => {
  const { user, firebaseUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedTab, setSelectedTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔔 Subscribing to all notifications (global feed)');
    setLoading(true);
    const unsubscribe = subscribeToAllNotifications((notifs) => {
      console.log('🔔 Received', notifs.length, 'notifications');
      if (notifs.length === 0) {
        console.log('💡 No notifications found in database');
      } else {
        console.log('✅ Notifications loaded:', notifs.map(n => ({ 
          id: n.id, 
          title: n.title, 
          type: n.type,
          userId: n.userId 
        })));
      }
      setNotifications(notifs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'hackathon':
        return <Trophy className="h-5 w-5 text-dicey-teal" />;
      case 'application':
        return <Briefcase className="h-5 w-5 text-dicey-purple" />;
      case 'achievement':
        return <Star className="h-5 w-5 text-dicey-yellow" />;
      case 'project':
        return <Users className="h-5 w-5 text-blue-500" />;
      case 'system':
        return <Settings className="h-5 w-5 text-dicey-azure" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleMarkAsRead = async (id: string) => {
    // Optimistic update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    try {
      await markNotificationAsRead(id);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifs = notifications.filter(n => !n.isRead);
      // Optimistic update
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      await Promise.all(unreadNotifs.map(n => markNotificationAsRead(n.id)));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'unread') return !notif.isRead;
    return notif.type === selectedTab;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Loading notifications...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Bell className="h-8 w-8" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">{unreadCount}</Badge>
              )}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Stay updated with your latest activities</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="mr-2 h-4 w-4" />
              Mark All Read
            </Button>
          </div>
        </div>

        {/* Notification Tabs */}
        <Card>
          <CardContent className="p-6">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
                <TabsTrigger value="hackathon">Hackathons</TabsTrigger>
                <TabsTrigger value="application">Jobs</TabsTrigger>
                <TabsTrigger value="project">Projects</TabsTrigger>
                <TabsTrigger value="achievement">Achievements</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTab} className="mt-6">
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <Card 
                      key={notification.id} 
                      className={`transition-all hover:shadow-md ${
                        !notification.isRead 
                          ? 'border-dicey-teal/50 bg-dicey-teal/5 dark:bg-dicey-teal/10' 
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                              {getIcon(notification.type)}
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className={`font-semibold ${
                                  !notification.isRead 
                                    ? 'text-gray-900 dark:text-white' 
                                    : 'text-gray-700 dark:text-gray-300'
                                }`}>
                                  {notification.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                  {notification.message}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {notification.createdAt.toDate().toLocaleDateString()}
                                  </span>
                                 <Badge variant="outline" className="text-xs">
                                    {notification.type}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 ml-4">
                                {!notification.isRead && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleMarkAsRead(notification.id)}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteNotification(notification.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No notifications found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {selectedTab === 'unread' 
                  ? "You're all caught up! No unread notifications."
                  : "No notifications in this category yet."
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
