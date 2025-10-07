import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";

const JobOpportunities = () => {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
        <Card className="max-w-md w-full">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="rounded-full bg-primary/10 p-6 mb-6">
              <Briefcase className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-3">Job Opportunities</h2>
            <Badge variant="secondary" className="mb-4">Coming Soon</Badge>
            <p className="text-muted-foreground">
              We're working hard to bring you exciting job opportunities. 
              Check back soon for career openings in tech!
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default JobOpportunities;
