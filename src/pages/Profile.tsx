
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Edit, 
  Camera, 
  Plus, 
  X,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  Twitter
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    phone: user?.phone || '',
    website: user?.website || '',
    github: user?.github || '',
    linkedin: user?.linkedin || '',
    twitter: user?.twitter || '',
    skills: user?.skills || [],
    goal: 'Be on top of the world',
    experience: [] as any[],
    education: [] as any[]
  });

  const [newSkill, setNewSkill] = useState('');

  React.useEffect(() => {
    if (user) {
      setProfileData({
        name: user.displayName || '',
        email: user.email,
        bio: user.bio || '',
        location: user.location || '',
        phone: user.phone || '',
        website: user.website || '',
        github: user.github || '',
        linkedin: user.linkedin || '',
        twitter: user.twitter || '',
        skills: user.skills || [],
        goal: 'Be on top of the world',
        experience: [],
        education: []
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { updateUser } = await import('@/services/firestoreService');
      await updateUser(user.id, {
        displayName: profileData.name,
        bio: profileData.bio,
        location: profileData.location,
        phone: profileData.phone,
        website: profileData.website,
        github: profileData.github,
        linkedin: profileData.linkedin,
        twitter: profileData.twitter,
        skills: profileData.skills
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const profileCompleteness = () => {
    const fields = [
      profileData.name,
      profileData.bio,
      profileData.location,
      profileData.skills.length > 0,
      profileData.experience.length > 0,
      profileData.education.length > 0
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-1">Manage your personal information and settings</p>
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
              <Button onClick={() => setIsEditing(true)} className="bg-dicey-purple hover:bg-dicey-purple/90">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Profile Completion */}
        <Card className="bg-gradient-to-r from-dicey-teal/10 to-dicey-purple/10 border-dicey-teal/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Complete Your Profile 🚀</h3>
                <p className="text-gray-600">Increase your visibility to potential employers</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-dicey-teal">{profileCompleteness()}%</div>
                <div className="text-sm text-gray-500">Complete</div>
              </div>
            </div>
            <Progress value={profileCompleteness()} className="h-2" />
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
                      <AvatarFallback className="bg-dicey-teal text-white text-2xl">
                        {profileData.name.split(' ').map(n => n[0]).join('') || 'U'}
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
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{profileData.name}</h3>
                    <p className="text-dicey-teal">{user?.email}</p>
                    <Badge variant="outline" className="mt-2">{user?.role}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    {isEditing ? (
                      <Input
                        value={profileData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    {isEditing ? (
                      <Input
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-900">{profileData.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    {isEditing ? (
                      <Input
                        value={profileData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-900 flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {profileData.location}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  {isEditing ? (
                    <Textarea
                      value={profileData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-700">{profileData.bio}</p>
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
                {isEditing && (
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="Add a skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    />
                    <Button onClick={addSkill}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className={`${isEditing ? 'flex items-center gap-1' : ''}`}
                    >
                      {skill}
                      {isEditing && (
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeSkill(skill)}
                        />
                      )}
                    </Badge>
                  ))}
                </div>
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
                    <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Website
                    </label>
                    {isEditing ? (
                      <Input
                        value={profileData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                      />
                    ) : (
                      <a href={profileData.website} className="text-dicey-teal hover:underline">
                        {profileData.website}
                      </a>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                      <Github className="h-4 w-4" />
                      GitHub
                    </label>
                    {isEditing ? (
                      <Input
                        value={profileData.github}
                        onChange={(e) => handleInputChange('github', e.target.value)}
                      />
                    ) : (
                      <a href={profileData.github} className="text-dicey-teal hover:underline">
                        {profileData.github}
                      </a>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </label>
                    {isEditing ? (
                      <Input
                        value={profileData.linkedin}
                        onChange={(e) => handleInputChange('linkedin', e.target.value)}
                      />
                    ) : (
                      <a href={profileData.linkedin} className="text-dicey-teal hover:underline">
                        {profileData.linkedin}
                      </a>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                      <Twitter className="h-4 w-4" />
                      Twitter
                    </label>
                    {isEditing ? (
                      <Input
                        value={profileData.twitter}
                        onChange={(e) => handleInputChange('twitter', e.target.value)}
                      />
                    ) : (
                      <a href={profileData.twitter} className="text-dicey-teal hover:underline">
                        {profileData.twitter}
                      </a>
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
                <CardTitle className="flex items-center gap-2 text-dicey-purple">
                  🎯 My Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Input
                    value={profileData.goal}
                    onChange={(e) => handleInputChange('goal', e.target.value)}
                  />
                ) : (
                  <p className="text-gray-700">{profileData.goal}</p>
                )}
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profileData.experience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-dicey-teal pl-4">
                    <h4 className="font-semibold">{exp.title}</h4>
                    <p className="text-dicey-teal text-sm">{exp.company}</p>
                    <p className="text-xs text-gray-500 mb-1">{exp.period}</p>
                    <p className="text-sm text-gray-600">{exp.description}</p>
                  </div>
                ))}
                {profileData.experience.length === 0 && (
                  <p className="text-gray-500 text-sm">No work experience to display</p>
                )}
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profileData.education.map((edu, index) => (
                  <div key={index} className="border-l-2 border-dicey-purple pl-4">
                    <h4 className="font-semibold">{edu.degree}</h4>
                    <p className="text-dicey-purple text-sm">{edu.school}</p>
                    <p className="text-xs text-gray-500 mb-1">{edu.period}</p>
                    <p className="text-sm text-gray-600">{edu.description}</p>
                  </div>
                ))}
                {profileData.education.length === 0 && (
                  <p className="text-gray-500 text-sm">No education to display</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
