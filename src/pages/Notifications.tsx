
import React, { useState } from 'react';
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

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'hackathon',
      title: 'New Hackathon: AgriConnect Summit 2024',
      message: 'A new hackathon matching your interests has been posted. Registration closes in 3 days.',
      time: '2 hours ago',
      isRead: false,
      avatar: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=100',
      category: 'Hackathons'
    },
    {
      id: 2,
      type: 'application',
      title: 'Application Status Update',
      message: 'Your application for "Data Analyst at Kuda Bank" has been reviewed and moved to the next stage.',
      time: '4 hours ago',
      isRead: false,
      avatar: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100',
      category: 'Jobs'
    },
    {
      id: 3,
      type: 'achievement',
      title: 'New Achievement Unlocked! 🏆',
      message: 'Congratulations! You\'ve earned the "Rising Star" badge for being in the top 10% of active users.',
      time: '1 day ago',
      isRead: true,
      avatar: null,
      category: 'Achievements'
    },
    {
      id: 4,
      type: 'project',
      title: 'Project Collaboration Request',
      message: 'Sarah Johnson wants to collaborate with you on the "AI Healthcare Assistant" project.',
      time: '1 day ago',
      isRead: false,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b6d5c0b4?w=100',
      category: 'Projects'
    },
    {
      id: 5,
      type: 'system',
      title: 'Profile Completion Reminder',
      message: 'Complete your profile to increase your visibility to potential employers. You\'re 75% done!',
      time: '2 days ago',
      isRead: true,
      avatar: null,
      category: 'System'
    },
    {
      id: 6,
      type: 'job',
      title: 'New Job Match',
      message: 'A new job posting matches your skills: "Senior Data Scientist at BlakBear"',
      time: '3 days ago',
      isRead: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      category: 'Jobs'
    }
  ]);

  const [selectedTab, setSelectedTab] = useState('all');

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
      case 'job':
        return <Briefcase className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'unread') return !notif.isRead;
    return notif.category.toLowerCase() === selectedTab;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Settings
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
                <TabsTrigger value="hackathons">Hackathons</TabsTrigger>
                <TabsTrigger value="jobs">Jobs</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTab} className="mt-6">
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <Card 
                      key={notification.id} 
                      className={`transition-all hover:shadow-md ${
                        !notification.isRead 
                          ? 'border-dicey-teal/50 bg-dicey-teal/5' 
                          : 'border-gray-200'
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            {notification.avatar ? (
                              <Avatar>
                                <AvatarImage src={notification.avatar} />
                                <AvatarFallback>{notification.title[0]}</AvatarFallback>
                              </Avatar>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                {getIcon(notification.type)}
                              </div>
                            )}
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
                                  <span className="text-sm text-gray-500">{notification.time}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {notification.category}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 ml-4">
                                {!notification.isRead && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAsRead(notification.id)}
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
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
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

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Customize how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-dicey-teal" />
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-500">Get notified via email</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-dicey-purple" />
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-gray-500">Browser push notifications</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-gray-500">Important updates via SMS</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Setup</Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Archive className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="font-medium">Weekly Digest</p>
                    <p className="text-sm text-gray-500">Summary of your activity</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
