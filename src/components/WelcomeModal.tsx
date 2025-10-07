import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Calendar, Sparkles } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface WelcomeModalProps {
  isOpen: boolean;
  userName: string;
  onClose: () => void;
}

const WelcomeModal = ({ isOpen, userName, onClose }: WelcomeModalProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step === 3) {
      onClose();
    } else {
      setStep(step + 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        {step === 1 && (
          <>
            <DialogHeader>
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-r from-dicey-azure to-dicey-magenta flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <DialogTitle className="text-2xl text-center">
                Welcome to DiceyTech! 🎉
              </DialogTitle>
              <DialogDescription className="text-center text-base">
                Hi {userName}! We're thrilled to have you join our community of innovators and builders.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-center text-gray-600 dark:text-gray-300">
                DiceyTech is your gateway to exciting hackathons, collaborative projects, and career opportunities 
                in the tech world. Let's get you started!
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleSkip} className="flex-1">
                Skip Tour
              </Button>
              <Button onClick={handleNext} className="flex-1 bg-dicey-azure hover:bg-dicey-azure/90">
                Get Started
              </Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <DialogHeader>
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-dicey-magenta flex items-center justify-center">
                <Target className="h-8 w-8 text-white" />
              </div>
              <DialogTitle className="text-2xl text-center">
                Complete Your Profile
              </DialogTitle>
              <DialogDescription className="text-center text-base">
                A complete profile helps you stand out and connect with opportunities!
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="h-8 w-8 rounded-full bg-dicey-azure/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-dicey-azure font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Add Your Details</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Share your bio, skills, and experience</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="h-8 w-8 rounded-full bg-dicey-magenta/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-dicey-magenta font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Showcase Projects</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Add projects to build your portfolio</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleSkip} className="flex-1">
                Skip
              </Button>
              <Button onClick={handleNext} className="flex-1 bg-dicey-magenta hover:bg-dicey-magenta/90">
                Next
              </Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <DialogHeader>
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-dicey-yellow flex items-center justify-center">
                <Calendar className="h-8 w-8 text-dicey-dark-pink" />
              </div>
              <DialogTitle className="text-2xl text-center">
                Explore Hackathons! 🚀
              </DialogTitle>
              <DialogDescription className="text-center text-base">
                Jump into exciting challenges and collaborate with talented developers!
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="bg-gradient-to-r from-dicey-azure/10 to-dicey-magenta/10 rounded-lg p-4 text-center">
                <Trophy className="h-12 w-12 mx-auto mb-3 text-dicey-azure" />
                <p className="text-gray-700 dark:text-gray-200 mb-2">
                  Browse upcoming hackathons, apply to participate, and build amazing projects with your team!
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  onClose();
                  navigate('/profile');
                }} 
                className="flex-1"
              >
                Complete Profile
              </Button>
              <Button 
                onClick={() => {
                  onClose();
                  navigate('/hackathons');
                }} 
                className="flex-1 bg-dicey-azure hover:bg-dicey-azure/90"
              >
                View Hackathons
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
