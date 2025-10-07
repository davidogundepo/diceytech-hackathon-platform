import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Star, 
  Award, 
  Target, 
  Zap, 
  Crown, 
  Medal,
  Users,
  Calendar,
  Code,
  Heart,
  TrendingUp
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { getAllAchievements, getUserAchievements } from '@/services/firestoreService';
import { Achievement, UserAchievement } from '@/types/firestore';

const Achievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const [allAchievements, userAchs] = await Promise.all([
          getAllAchievements(),
          getUserAchievements(user.id)
        ]);
        setAchievements(allAchievements);
        setUserAchievements(userAchs);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [user]);

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      Trophy, Star, Award, Target, Zap, Crown, Medal, Users, Code, Heart
    };
    return icons[iconName] || Trophy;
  };

  const earnedAchievements = userAchievements.filter(ua => ua.progress >= 100);
  const totalPoints = earnedAchievements.reduce((sum, ua) => {
    const ach = achievements.find(a => a.id === ua.achievementId);
    return sum + (ach?.points || 0);
  }, 0);

  const stats = {
    totalPoints,
    totalEarned: earnedAchievements.length,
    totalAchievements: achievements.length,
    rank: totalPoints > 500 ? 'Platinum' : totalPoints > 300 ? 'Gold' : totalPoints > 150 ? 'Silver' : 'Bronze',
    nextRank: totalPoints > 500 ? 'Diamond' : totalPoints > 300 ? 'Platinum' : totalPoints > 150 ? 'Gold' : 'Silver',
    pointsToNextRank: totalPoints > 500 ? 1000 - totalPoints : totalPoints > 300 ? 500 - totalPoints : totalPoints > 150 ? 300 - totalPoints : 150 - totalPoints
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'rare':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'epic':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'legendary':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Loading achievements...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Coming Soon Banner */}
        <Card className="bg-gradient-to-r from-dicey-azure to-dicey-magenta border-0">
          <CardContent className="p-8 text-center text-white">
            <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-90" />
            <h2 className="text-3xl font-bold mb-2">🚀 Achievements System Coming Soon!</h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              We're building something amazing! Soon you'll be able to track your progress, unlock exclusive badges, 
              and compete with other developers. Stay tuned for epic rewards and achievements!
            </p>
          </CardContent>
        </Card>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Trophy className="h-8 w-8 text-dicey-azure" />
              Achievements
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Track your progress and unlock rewards</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-dicey-azure border-dicey-azure">
            <CardContent className="p-6 text-center">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-white" />
              <div className="text-3xl font-bold mb-2 text-white">{stats.totalPoints}</div>
              <div className="text-sm text-white/90">Total Points</div>
            </CardContent>
          </Card>
          
          <Card className="bg-dicey-magenta border-dicey-magenta">
            <CardContent className="p-6 text-center">
              <Award className="h-12 w-12 mx-auto mb-4 text-white" />
              <div className="text-3xl font-bold mb-2 text-white">{stats.totalEarned}/{stats.totalAchievements}</div>
              <div className="text-sm text-white/90">Achievements</div>
            </CardContent>
          </Card>
          
          <Card className="bg-dicey-yellow border-dicey-yellow">
            <CardContent className="p-6 text-center">
              <Crown className="h-12 w-12 mx-auto mb-4 text-dicey-dark-pink" />
              <div className="text-3xl font-bold mb-2 text-dicey-dark-pink">{stats.rank}</div>
              <div className="text-sm text-dicey-dark-pink/80">Current Rank</div>
            </CardContent>
          </Card>
          
          <Card className="border-dicey-azure">
            <CardContent className="p-6 text-center">
              <Medal className="h-12 w-12 mx-auto mb-4 text-dicey-azure" />
              <div className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                {Math.round((stats.totalPoints % 1000) / 10)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">To {stats.nextRank}</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress to Next Rank */}
        <Card className="border-dicey-azure">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Progress to {stats.nextRank}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {stats.pointsToNextRank} more points needed
                </p>
              </div>
              <Badge className="bg-dicey-azure text-white">{stats.rank}</Badge>
            </div>
            <Progress value={((stats.totalPoints % 1000) / 1000) * 100} className="h-3" />
          </CardContent>
        </Card>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => {
            const userAch = userAchievements.find(ua => ua.achievementId === achievement.id);
            const IconComponent = getIconComponent(achievement.icon);
            const isEarned = userAch && userAch.progress >= 100;

            return (
              <Card 
                key={achievement.id} 
                className={`transition-all hover:shadow-lg border-2 ${
                  isEarned
                    ? 'border-dicey-azure bg-dicey-azure/5 dark:bg-dicey-azure/10' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-full bg-dicey-azure/10">
                      <IconComponent className="h-8 w-8 text-dicey-azure" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getRarityColor(achievement.rarity)}>
                        {achievement.rarity}
                      </Badge>
                      {isEarned && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                          ✓ Earned
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {achievement.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {achievement.description}
                  </p>
                  
                  {isEarned ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {userAch?.earnedAt.toDate().toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-dicey-yellow" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{achievement.points} pts</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Progress: {userAch?.progress || 0}/100
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">{achievement.points} pts</span>
                        </div>
                      </div>
                      <Progress 
                        value={userAch?.progress || 0} 
                        className="h-2"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {achievements.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Trophy className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No achievements yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Start participating in hackathons and building projects to earn achievements!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Achievements;
