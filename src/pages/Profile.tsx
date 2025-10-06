
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Edit, 
  Camera,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Twitter
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { SkillsSelector } from "@/components/SkillsSelector";
import { ExperienceForm } from "@/components/ExperienceForm";
import { EducationForm } from "@/components/EducationForm";
import { WorkExperience, Education } from "@/types/firestore";

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    phone: '',
    website: '',
    github: '',
    linkedin: '',
    twitter: '',
    skills: [] as string[],
    goal: '',
    experience: [] as WorkExperience[],
    education: [] as Education[]
  });

  // Load user data from Firestore
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        setLoading(true);
        try {
          const { getUserById } = await import('@/services/firestoreService');
          const userData = await getUserById(user.id);
          
          if (userData) {
            setProfileData({
              name: userData.displayName || '',
              email: userData.email,
              bio: userData.bio || '',
              location: userData.location || '',
              phone: userData.phone || '',
              website: userData.website || '',
              github: userData.github || '',
              linkedin: userData.linkedin || '',
              twitter: userData.twitter || '',
              skills: userData.skills || [],
              goal: userData.goal || '',
              experience: userData.experience || [],
              education: userData.education || []
            });
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadUserData();
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { updateUser } = await import('@/services/firestoreService');
      
      // Calculate profile completeness
      const completeness = calculateProfileCompleteness();
      
      await updateUser(user.id, {
        displayName: profileData.name,
        bio: profileData.bio,
        location: profileData.location,
        phone: profileData.phone,
        website: profileData.website,
        github: profileData.github,
        linkedin: profileData.linkedin,
        twitter: profileData.twitter,
        skills: profileData.skills,
        goal: profileData.goal,
        experience: profileData.experience,
        education: profileData.education,
        profileCompleteness: completeness
      });
      
      toast({
        title: "Profile updated ✅",
        description: `Your profile is now ${completeness}% complete!`,
      });
      setIsEditing(false);
      
      // Reload data to ensure sync
      window.location.reload();
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileCompleteness = () => {
    const fields = [
      { value: profileData.name, weight: 15 },
      { value: profileData.bio, weight: 10 },
      { value: profileData.location, weight: 5 },
      { value: profileData.phone, weight: 5 },
      { value: profileData.skills.length > 0, weight: 20 },
      { value: profileData.goal, weight: 5 },
      { value: profileData.experience.length > 0, weight: 20 },
      { value: profileData.education.length > 0, weight: 10 },
      { value: profileData.website || profileData.github || profileData.linkedin, weight: 10 }
    ];
    
    const totalWeight = fields.reduce((sum, field) => sum + field.weight, 0);
    const completedWeight = fields.reduce((sum, field) => field.value ? sum + field.weight : sum, 0);
    
    return Math.round((completedWeight / totalWeight) * 100);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading profile...</p>
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Manage your personal information and settings</p>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)} disabled={loading}>
                  Cancel
                </Button>
                <Button onClick={handleSave} className="bg-dicey-teal hover:bg-dicey-teal/90" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="bg-dicey-azure hover:bg-dicey-azure/90">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Profile Completion */}
        <Card className="bg-gradient-to-r from-dicey-azure/10 to-dicey-magenta/10 border-dicey-azure/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Complete Your Profile 🚀</h3>
                <p className="text-gray-600 dark:text-gray-300">Increase your visibility to potential employers</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-dicey-azure">{calculateProfileCompleteness()}%</div>
                <div className="text-sm text-gray-500">Complete</div>
              </div>
            </div>
            <Progress value={calculateProfileCompleteness()} className="h-2" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user?.photoURL || undefined} />
                      <AvatarFallback className="bg-dicey-azure text-white text-2xl">
                        {profileData.name ? profileData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button 
                        size="icon" 
                        variant="outline" 
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {profileData.name || 'Add your name'}
                    </h3>
                    <p className="text-dicey-azure">{profileData.email}</p>
                    <Badge variant="outline" className="mt-2">{user?.role}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Full Name</label>
                    {isEditing ? (
                      <Input
                        placeholder="Enter your full name"
                        value={profileData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{profileData.name || '-'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email</label>
                    <p className="text-gray-900 dark:text-white">{profileData.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Phone</label>
                    {isEditing ? (
                      <Input
                        placeholder="Enter your phone number"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{profileData.phone || '-'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Location</label>
                    {isEditing ? (
                      <Input
                        placeholder="City, Country"
                        value={profileData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white flex items-center gap-1">
                        {profileData.location ? (
                          <>
                            <MapPin className="h-4 w-4" />
                            {profileData.location}
                          </>
                        ) : '-'}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Bio</label>
                  {isEditing ? (
                    <Textarea
                      placeholder="Tell us about yourself..."
                      value={profileData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300">{profileData.bio || '-'}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Skills & Technologies</CardTitle>
                <CardDescription>Showcase the technologies you work with</CardDescription>
              </CardHeader>
              <CardContent>
                <SkillsSelector
                  selectedSkills={profileData.skills}
                  onChange={(skills) => setProfileData(prev => ({ ...prev, skills }))}
                  isEditing={isEditing}
                />
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>Connect your social profiles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Globe className="h-4 w-4" />
                      Website
                    </label>
                    {isEditing ? (
                      <Input
                        placeholder="https://yourwebsite.com"
                        value={profileData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                      />
                    ) : (
                      profileData.website ? (
                        <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-dicey-azure hover:underline">
                          {profileData.website}
                        </a>
                      ) : <p className="text-gray-500">-</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Github className="h-4 w-4" />
                      GitHub
                    </label>
                    {isEditing ? (
                      <Input
                        placeholder="https://github.com/username"
                        value={profileData.github}
                        onChange={(e) => handleInputChange('github', e.target.value)}
                      />
                    ) : (
                      profileData.github ? (
                        <a href={profileData.github} target="_blank" rel="noopener noreferrer" className="text-dicey-azure hover:underline">
                          {profileData.github}
                        </a>
                      ) : <p className="text-gray-500">-</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </label>
                    {isEditing ? (
                      <Input
                        placeholder="https://linkedin.com/in/username"
                        value={profileData.linkedin}
                        onChange={(e) => handleInputChange('linkedin', e.target.value)}
                      />
                    ) : (
                      profileData.linkedin ? (
                        <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer" className="text-dicey-azure hover:underline">
                          {profileData.linkedin}
                        </a>
                      ) : <p className="text-gray-500">-</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Twitter className="h-4 w-4" />
                      Twitter
                    </label>
                    {isEditing ? (
                      <Input
                        placeholder="https://twitter.com/username"
                        value={profileData.twitter}
                        onChange={(e) => handleInputChange('twitter', e.target.value)}
                      />
                    ) : (
                      profileData.twitter ? (
                        <a href={profileData.twitter} target="_blank" rel="noopener noreferrer" className="text-dicey-azure hover:underline">
                          {profileData.twitter}
                        </a>
                      ) : <p className="text-gray-500">-</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Goal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-dicey-magenta">
                  🎯 My Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Input
                    placeholder="What's your career goal?"
                    value={profileData.goal}
                    onChange={(e) => handleInputChange('goal', e.target.value)}
                  />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">{profileData.goal || '-'}</p>
                )}
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <ExperienceForm
                  experiences={profileData.experience}
                  onChange={(exp) => setProfileData(prev => ({ ...prev, experience: exp }))}
                  isEditing={isEditing}
                />
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent>
                <EducationForm
                  education={profileData.education}
                  onChange={(edu) => setProfileData(prev => ({ ...prev, education: edu }))}
                  isEditing={isEditing}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
