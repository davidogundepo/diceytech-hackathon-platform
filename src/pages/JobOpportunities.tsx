import React from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Sparkles, Rocket, TrendingUp, Building2, Users, Globe, Trophy } from "lucide-react";

const JobOpportunities = () => {
  const features = [
    {
      icon: Building2,
      title: "Top Companies",
      description: "Connect with leading tech companies across Africa"
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Find roles that match your skills and ambitions"
    },
    {
      icon: Users,
      title: "Network",
      description: "Build meaningful connections with industry leaders"
    },
    {
      icon: Globe,
      title: "Remote & Hybrid",
      description: "Explore flexible work opportunities worldwide"
    }
  ];

  return (
    <DashboardLayout>
      <div className="min-h-[80vh] animate-fade-in">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-dicey-yellow via-dicey-yellow to-dicey-yellow p-1"
        >
          <div className="relative bg-white dark:bg-gray-900 rounded-xl p-12 md:p-16 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-dicey-azure to-dicey-azure mb-6"
            >
              <Briefcase className="h-12 w-12 text-white" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Badge className="mb-4 bg-dicey-yellow text-dicey-dark-pink border-none px-4 py-1 text-sm font-semibold">
                <Sparkles className="mr-2 h-4 w-4 inline" />
                Coming Soon
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-dicey-azure via-dicey-magenta to-dicey-yellow bg-clip-text text-transparent">
                Your Dream Job Awaits
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                We're curating exclusive job opportunities from leading tech companies across Africa and beyond. 
                Get ready to take your career to the next level!
              </p>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <Card className="h-full hover-lift transition-smooth border-dicey-azure/20">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-dicey-azure/10 mb-4">
                    <feature.icon className="h-8 w-8 text-dicey-azure" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-r from-dicey-magenta/10 to-dicey-azure/10 border-none">
            <CardContent className="p-8 text-center">
              <Sparkles className="h-12 w-12 text-dicey-magenta mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                Building Something Amazing
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Our team is working around the clock to bring you the best job opportunities. 
                In the meantime, keep building your portfolio and connecting with the community!
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/add-project'}
                  className="border-dicey-azure text-dicey-azure hover:bg-dicey-azure hover:text-white"
                >
                  Build Your Portfolio
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/hackathons'}
                  className="border-dicey-magenta text-dicey-magenta hover:bg-dicey-magenta hover:text-white"
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  Explore Hackathons
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default JobOpportunities;
