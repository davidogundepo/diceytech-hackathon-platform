import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingCards } from "@/components/ui/loading-card";
import { EmptyState } from "@/components/ui/empty-state";
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
import { sendApplicationConfirmation } from '@/services/emailService';
import { Hackathon } from '@/types/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import HostHackathonDialog from '@/components/HostHackathonDialog';

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

  const handleApply = (hackathon: Hackathon, e: React.MouseEvent) => {
    e.stopPropagation();
    // Navigate to detail page to fill application
    navigate(`/hackathon/${hackathon.id}`);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-8"
        initial="hidden"
        animate="show"
        variants={container}
      >
        {/* Header */}
        <motion.div variants={item} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold">Hackathons</h1>
            <p className="text-muted-foreground mt-2">Discover and join exciting hackathons</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/saved-events')} className="transition-smooth hover-lift">
              <Bookmark className="mr-2 h-4 w-4" />
              Saved Events
            </Button>
            <HostHackathonDialog />
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={item}>
          <Card className="border-none shadow-md">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search hackathons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 transition-fast focus:ring-2 focus:ring-dicey-azure"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="transition-fast">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-popover">
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Agriculture">Agriculture</SelectItem>
                    <SelectItem value="FinTech">FinTech</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="IoT">IoT</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="transition-fast">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-popover">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Hackathon Grid */}
        {loading ? (
          <LoadingCards count={6} />
        ) : filteredHackathons.length === 0 ? (
          <EmptyState
            icon={Trophy}
            title="No hackathons found"
            description="Try adjusting your search terms or filters to find more hackathons."
            actionLabel="Clear Filters"
            onAction={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedStatus('all');
            }}
          />
        ) : (
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            variants={container}
          >
            {filteredHackathons.map((hackathon) => {
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
                <motion.div key={hackathon.id} variants={item}>
                  <Card 
                    className="cursor-pointer hover-lift transition-smooth border-none shadow-md overflow-hidden h-full"
                    onClick={() => navigate(`/hackathon/${hackathon.id}`)}
                  >
                    <div className="relative">
                      <img 
                        src={hackathon.imageUrl || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400'} 
                        alt={hackathon.title}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                      />
                      <Badge className={`absolute top-3 right-3 ${statusColors[status]} shadow-lg`}>
                        {statusLabels[status]}
                      </Badge>
                    </div>
                  
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-1">
                            {hackathon.title}
                          </h3>
                        </div>
                        {hackathon.difficulty && <Badge variant="outline">{hackathon.difficulty}</Badge>}
                      </div>
                      
                      <p className="text-muted-foreground mb-4 truncate-2">
                        {hackathon.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(hackathon.tags || []).slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
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
                          <div className="flex items-center gap-1 font-semibold text-dicey-magenta">
                            <Trophy className="h-4 w-4" />
                            <span>{hackathon.prize}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1 bg-dicey-azure hover:bg-dicey-azure/90 transition-smooth"
                          onClick={(e) => handleApply(hackathon, e)}
                          disabled={appliedIds.has(hackathon.id)}
                        >
                          {appliedIds.has(hackathon.id) ? 'Applied' : 'Apply Now'}
                        </Button>
                        <Button 
                          variant={savedIds.has(hackathon.id) ? "secondary" : "outline"} 
                          size="icon"
                          aria-label={savedIds.has(hackathon.id) ? "Unsave hackathon" : "Save hackathon"}
                          className="transition-smooth"
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
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default Hackathons;
