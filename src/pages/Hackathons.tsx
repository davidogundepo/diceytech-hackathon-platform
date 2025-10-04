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
  ArrowRight
} from "lucide-react";
import { getAllHackathons } from '@/services/firestoreService';
import { Hackathon } from '@/types/firestore';

const Hackathons = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
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

  const filteredHackathons = hackathons.filter((hackathon) => {
    const matchesSearch = hackathon.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          hackathon.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || hackathon.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

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
            <Button variant="outline">
              <Star className="mr-2 h-4 w-4" />
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
          ) : filteredHackathons.map((hackathon) => (
            <Card key={hackathon.id} className="cursor-pointer transition-all hover:shadow-lg"
                  onClick={() => navigate(`/project/${hackathon.id}`)}>
              <div className="relative">
                <img 
                  src={hackathon.imageUrl || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400'} 
                  alt={hackathon.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Badge className="absolute top-3 right-3 bg-green-500">
                  Active
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
                  >
                    View Details
                  </Button>
                  <Button variant="outline" size="icon">
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        {filteredHackathons.length > 0 && (
          <div className="text-center pt-6">
            <Button variant="outline" size="lg">
              Load More Hackathons
            </Button>
          </div>
        )}

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
