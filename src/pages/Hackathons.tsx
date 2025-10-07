import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Calendar, 
  Users, 
  Trophy, 
  Clock,
  MapPin,
  Filter,
  Star,
  ArrowRight,
  Heart,
  Bookmark
} from "lucide-react";
import { getAllHackathons, getUserSavedHackathonIds, toggleSaveHackathon, hasUserAppliedToHackathon, createApplication } from '@/services/firestoreService';
import { Hackathon } from '@/types/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Hackathons = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const allHackathons = await getAllHackathons();
        setHackathons(allHackathons);
      } catch (error) {
        console.error('Error fetching hackathons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHackathons();
  }, []);

  useEffect(() => {
    const loadSaved = async () => {
      if (!user?.id) return;
      try {
        const ids = await getUserSavedHackathonIds(user.id);
        setSavedIds(new Set(ids));
      } catch (e) {
        console.error('Error loading saved hackathons', e);
      }
    };
    loadSaved();
  }, [user?.id]);

  useEffect(() => {
    const loadApplied = async () => {
      if (!user?.id || hackathons.length === 0) return;
      try {
        const applied = await Promise.all(
          hackathons.map(h => hasUserAppliedToHackathon(user.id, h.id))
        );
        const appliedSet = new Set<string>();
        hackathons.forEach((h, i) => {
          if (applied[i]) appliedSet.add(h.id);
        });
        setAppliedIds(appliedSet);
      } catch (e) {
        console.error('Error loading applied hackathons', e);
      }
    };
    loadApplied();
  }, [user?.id, hackathons]);

  const filteredHackathons = hackathons.filter((hackathon) => {
    const matchesSearch = hackathon.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          hackathon.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || (hackathon.category || '').toLowerCase() === selectedCategory.toLowerCase();

    const start = hackathon.startDate?.seconds ? hackathon.startDate.seconds * 1000 : 0;
    const end = hackathon.endDate?.seconds ? hackathon.endDate.seconds * 1000 : 0;
    const now = Date.now();
    let status: 'active' | 'upcoming' | 'completed' = 'upcoming';
    if (now >= start && now <= end) status = 'active';
    else if (now > end) status = 'completed';

    const matchesStatus = selectedStatus === 'all' || selectedStatus === status;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getHackathonStatus = (hackathon: Hackathon): 'active' | 'upcoming' | 'completed' => {
    const start = hackathon.startDate?.seconds ? hackathon.startDate.seconds * 1000 : 0;
    const end = hackathon.endDate?.seconds ? hackathon.endDate.seconds * 1000 : 0;
    const now = Date.now();
    if (now >= start && now <= end) return 'active';
    if (now > end) return 'completed';
    return 'upcoming';
  };

  const handleApply = async (hackathon: Hackathon, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to apply to hackathons.",
        variant: "destructive"
      });
      return;
    }

    if (appliedIds.has(hackathon.id)) {
      toast({
        title: "Already Applied",
        description: "You have already applied to this hackathon.",
      });
      return;
    }

    try {
      await createApplication({
        userId: user.id,
        type: 'hackathon',
        hackathonId: hackathon.id,
        title: hackathon.title,
        status: 'pending',
        applicationData: {}
      });
      
      setAppliedIds(prev => new Set(prev).add(hackathon.id));
      
      toast({
        title: "Application Submitted",
        description: `Your application to ${hackathon.title} has been submitted successfully.`,
      });
    } catch (error) {
      console.error('Error applying to hackathon:', error);
      toast({
        title: "Application Failed",
        description: "Failed to submit your application. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hackathons</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Discover and join exciting hackathons</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/saved-events')}>
              <Bookmark className="mr-2 h-4 w-4" />
              Saved Events
            </Button>
            <Button className="bg-dicey-teal hover:bg-dicey-teal/90">
              <Trophy className="mr-2 h-4 w-4" />
              Host Hackathon
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search hackathons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Agriculture">Agriculture</SelectItem>
                  <SelectItem value="FinTech">FinTech</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="IoT">IoT</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Hackathon Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <p className="text-gray-500 col-span-2 text-center">Loading hackathons...</p>
          ) : filteredHackathons.length === 0 ? (
            <p className="text-gray-500 col-span-2 text-center">No hackathons found</p>
          ) : filteredHackathons.map((hackathon) => {
            const status = getHackathonStatus(hackathon);
            const statusColors = {
              active: 'bg-green-500',
              upcoming: 'bg-blue-500',
              completed: 'bg-gray-500'
            };
            const statusLabels = {
              active: 'Active',
              upcoming: 'Upcoming',
              completed: 'Completed'
            };
            
            return (
              <Card key={hackathon.id} className="cursor-pointer transition-all hover:shadow-lg"
                    onClick={() => navigate(`/hackathon/${hackathon.id}`)}>
                <div className="relative">
                  <img 
                    src={hackathon.imageUrl || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400'} 
                    alt={hackathon.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge className={`absolute top-3 right-3 ${statusColors[status]}`}>
                    {statusLabels[status]}
                  </Badge>
                </div>
              
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      {hackathon.title}
                    </h3>
                  </div>
                  {hackathon.difficulty && <Badge variant="outline">{hackathon.difficulty}</Badge>}
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {hackathon.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {(hackathon.tags || []).slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(hackathon.startDate.seconds * 1000).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{hackathon.participantCount}</span>
                    </div>
                  </div>
                  {hackathon.prize && (
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4" />
                      <span>{hackathon.prize}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-dicey-teal hover:bg-dicey-teal/90"
                    onClick={(e) => handleApply(hackathon, e)}
                    disabled={appliedIds.has(hackathon.id)}
                  >
                    {appliedIds.has(hackathon.id) ? 'Applied' : 'Apply Now'}
                  </Button>
                  <Button 
                    variant={savedIds.has(hackathon.id) ? "secondary" : "outline"} 
                    size="icon"
                    aria-label={savedIds.has(hackathon.id) ? "Unsave hackathon" : "Save hackathon"}
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (!user?.id) return;
                      try {
                        const nowSaved = await toggleSaveHackathon(user.id, hackathon.id);
                        setSavedIds((prev) => {
                          const n = new Set(prev);
                          if (nowSaved) n.add(hackathon.id); else n.delete(hackathon.id);
                          return n;
                        });
                      } catch (err) {
                        console.error('Toggle save failed', err);
                      }
                    }}
                  >
                    <Heart className="h-4 w-4" fill={savedIds.has(hackathon.id) ? "currentColor" : "none"} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        </div>


        {/* No Results */}
        {filteredHackathons.length === 0 && !loading && (
          <Card className="text-center py-12">
            <CardContent>
              <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No hackathons found</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Try adjusting your search terms or filters to find more hackathons.
              </p>
              <Button onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedStatus('all');
              }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Hackathons;
