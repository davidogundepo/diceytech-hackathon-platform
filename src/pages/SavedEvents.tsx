import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Calendar, 
  MapPin, 
  Trophy,
  Bookmark
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { getUserSavedHackathons, toggleSaveHackathon } from '@/services/firestoreService';
import { Hackathon } from '@/types/firestore';
import { useToast } from '@/hooks/use-toast';

const SavedEvents = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [savedHackathons, setSavedHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedEvents = async () => {
      if (!user) return;
      try {
        const hackathons = await getUserSavedHackathons(user.id);
        setSavedHackathons(hackathons);
      } catch (error) {
        console.error('Error fetching saved events:', error);
        toast({
          title: "Error",
          description: "Failed to load saved events",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSavedEvents();
  }, [user]);

  const handleUnsave = async (hackathonId: string) => {
    if (!user) return;
    try {
      await toggleSaveHackathon(user.id, hackathonId);
      setSavedHackathons(prev => prev.filter(h => h.id !== hackathonId));
      toast({
        title: "Removed",
        description: "Event removed from saved list"
      });
    } catch (error) {
      console.error('Error removing saved event:', error);
    }
  };

  const getStatusBadge = (hackathon: Hackathon) => {
    const now = new Date();
    const start = hackathon.startDate.toDate();
    const end = hackathon.endDate.toDate();

    if (start > now) return { label: 'Upcoming', className: 'bg-blue-500' };
    if (start <= now && end >= now) return { label: 'Ongoing', className: 'bg-green-500' };
    return { label: 'Ended', className: 'bg-gray-500' };
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Loading saved events...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Bookmark className="h-8 w-8" />
              Saved Events
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Your bookmarked hackathons and events
            </p>
          </div>
        </div>

        {savedHackathons.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Heart className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No saved events yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Start exploring hackathons and save the ones you're interested in!
              </p>
              <Button onClick={() => navigate('/hackathons')}>
                Browse Hackathons
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedHackathons.map((hackathon) => {
              const status = getStatusBadge(hackathon);
              return (
                <Card key={hackathon.id} className="group hover:shadow-lg transition-all">
                  <CardHeader>
                    {hackathon.imageUrl && (
                      <div className="w-full h-40 overflow-hidden rounded-lg mb-4">
                        <img 
                          src={hackathon.imageUrl} 
                          alt={hackathon.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={status.className}>{status.label}</Badge>
                          <Badge variant="outline">{hackathon.category}</Badge>
                        </div>
                        <CardTitle className="line-clamp-2">{hackathon.title}</CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnsave(hackathon.id);
                        }}
                      >
                        <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                      </Button>
                    </div>
                    <CardDescription className="line-clamp-2 mt-2">
                      {hackathon.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Calendar className="h-4 w-4 mr-2 text-dicey-teal" />
                        {hackathon.startDate.toDate().toLocaleDateString()} - {hackathon.endDate.toDate().toLocaleDateString()}
                      </div>
                      {hackathon.location && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <MapPin className="h-4 w-4 mr-2 text-dicey-purple" />
                          {hackathon.location}
                        </div>
                      )}
                      {hackathon.prize && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <Trophy className="h-4 w-4 mr-2 text-dicey-yellow" />
                          {hackathon.prize}
                        </div>
                      )}
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => navigate(`/hackathon/${hackathon.id}`)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SavedEvents; 
