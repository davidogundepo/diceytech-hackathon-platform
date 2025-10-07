import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calendar, 
  MapPin, 
  Trophy, 
  Users, 
  Clock,
  ArrowLeft,
  Heart,
  Share2,
  CheckCircle2
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { getHackathonById, createApplication, toggleSaveHackathon, getUserSavedHackathonIds } from '@/services/firestoreService';
import { Hackathon } from '@/types/firestore';
import { useToast } from '@/hooks/use-toast';

const HackathonDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [formData, setFormData] = useState({
    teamName: '',
    teamSize: '',
    projectIdea: '',
    experience: '',
    motivation: ''
  });

  useEffect(() => {
    const fetchHackathon = async () => {
      if (!id) return;
      try {
        const data = await getHackathonById(id);
        setHackathon(data);
        
        if (user) {
          const savedIds = await getUserSavedHackathonIds(user.id);
          setIsSaved(savedIds.includes(id));
        }
      } catch (error) {
        console.error('Error fetching hackathon:', error);
        toast({
          title: "Error",
          description: "Failed to load hackathon details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHackathon();
  }, [id, user]);

  const handleSave = async () => {
    if (!user || !id) return;
    try {
      await toggleSaveHackathon(user.id, id);
      setIsSaved(!isSaved);
      toast({
        title: isSaved ? "Removed from saved" : "Saved!",
        description: isSaved ? "Hackathon removed from your saved list" : "Hackathon added to your saved list"
      });
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;

    setApplying(true);
    try {
      await createApplication({
        userId: user.id,
        hackathonId: id,
        type: 'hackathon',
        status: 'pending',
        applicationData: formData
      });

      toast({
        title: "Application submitted!",
        description: "Your hackathon application has been submitted successfully."
      });

      setShowApplyForm(false);
      setFormData({
        teamName: '',
        teamSize: '',
        projectIdea: '',
        experience: '',
        motivation: ''
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Loading hackathon...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!hackathon) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Hackathon not found</h2>
          <Button onClick={() => navigate('/hackathons')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Hackathons
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const isUpcoming = hackathon.startDate.toDate() > new Date();
  const isOngoing = hackathon.startDate.toDate() <= new Date() && hackathon.endDate.toDate() >= new Date();
  const isPast = hackathon.endDate.toDate() < new Date();

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <Button variant="ghost" onClick={() => navigate('/hackathons')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Hackathons
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              {hackathon.imageUrl && (
                <div className="w-full h-64 overflow-hidden rounded-t-lg">
                  <img src={hackathon.imageUrl} alt={hackathon.title} className="w-full h-full object-cover" />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={
                        isUpcoming ? 'bg-blue-500' : 
                        isOngoing ? 'bg-green-500' : 
                        'bg-gray-500'
                      }>
                        {isUpcoming ? 'Upcoming' : isOngoing ? 'Ongoing' : 'Ended'}
                      </Badge>
                      <Badge variant="outline">{hackathon.category}</Badge>
                      {hackathon.difficulty && (
                        <Badge variant="outline">{hackathon.difficulty}</Badge>
                      )}
                    </div>
                    <CardTitle className="text-3xl mb-2">{hackathon.title}</CardTitle>
                    <CardDescription className="text-base">{hackathon.description}</CardDescription>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="ghost" size="icon" onClick={handleSave}>
                      <Heart className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-dicey-teal" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Start Date</p>
                      <p className="font-semibold">{hackathon.startDate.toDate().toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-dicey-purple" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">End Date</p>
                      <p className="font-semibold">{hackathon.endDate.toDate().toLocaleDateString()}</p>
                    </div>
                  </div>
                  {hackathon.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-dicey-yellow" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                        <p className="font-semibold">{hackathon.location}</p>
                      </div>
                    </div>
                  )}
                  {hackathon.prize && (
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Prize</p>
                        <p className="font-semibold">{hackathon.prize}</p>
                      </div>
                    </div>
                  )}
                  {hackathon.maxParticipants && (
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Participants</p>
                        <p className="font-semibold">{hackathon.participantCount} / {hackathon.maxParticipants}</p>
                      </div>
                    </div>
                  )}
                </div>

                {hackathon.tags && hackathon.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {hackathon.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {hackathon.requirements && hackathon.requirements.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Requirements</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {hackathon.requirements.map((req, index) => (
                        <li key={index} className="text-gray-700 dark:text-gray-300">{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Apply Now</CardTitle>
              </CardHeader>
              <CardContent>
                {!showApplyForm ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Interested in participating? Submit your application to join this hackathon.
                    </p>
                    <Button 
                      className="w-full" 
                      onClick={() => setShowApplyForm(true)}
                      disabled={isPast}
                    >
                      {isPast ? 'Hackathon Ended' : 'Apply to Hackathon'}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitApplication} className="space-y-4">
                    <div>
                      <Label htmlFor="teamName">Team Name</Label>
                      <Input
                        id="teamName"
                        value={formData.teamName}
                        onChange={(e) => setFormData({...formData, teamName: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="teamSize">Team Size</Label>
                      <Input
                        id="teamSize"
                        type="number"
                        min="1"
                        value={formData.teamSize}
                        onChange={(e) => setFormData({...formData, teamSize: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="projectIdea">Project Idea</Label>
                      <Textarea
                        id="projectIdea"
                        value={formData.projectIdea}
                        onChange={(e) => setFormData({...formData, projectIdea: e.target.value})}
                        placeholder="Brief description of your project idea..."
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience">Relevant Experience</Label>
                      <Textarea
                        id="experience"
                        value={formData.experience}
                        onChange={(e) => setFormData({...formData, experience: e.target.value})}
                        placeholder="Your team's relevant experience..."
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="motivation">Why do you want to join?</Label>
                      <Textarea
                        id="motivation"
                        value={formData.motivation}
                        onChange={(e) => setFormData({...formData, motivation: e.target.value})}
                        placeholder="Your motivation..."
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1" disabled={applying}>
                        {applying ? 'Submitting...' : 'Submit Application'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowApplyForm(false)}
                        disabled={applying}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HackathonDetails;
