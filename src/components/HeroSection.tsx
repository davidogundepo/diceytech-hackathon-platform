import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-hackathon.jpg";
import { Code2, Rocket } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Developers collaborating at a hackathon" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/80" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 mb-6 shadow-lg">
          <Code2 className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">Platform for Innovators</span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-foreground to-accent bg-clip-text text-transparent leading-tight">
          Build the Future at
          <br />
          <span className="text-primary">DiceyTech</span>
        </h1>

        <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of developers, designers, and creators competing in the world's most exciting hackathons
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="default" size="lg" className="gap-2">
            <Rocket className="w-5 h-5" />
            Explore Hackathons
          </Button>
          <Button variant="outline" size="lg">
            Host Your Event
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:scale-105 transition-transform duration-300">
            <div className="text-3xl font-bold text-primary mb-2">500+</div>
            <div className="text-sm text-muted-foreground">Active Hackathons</div>
          </div>
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:scale-105 transition-transform duration-300">
            <div className="text-3xl font-bold text-primary mb-2">50K+</div>
            <div className="text-sm text-muted-foreground">Participants</div>
          </div>
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:scale-105 transition-transform duration-300">
            <div className="text-3xl font-bold text-primary mb-2">$2M+</div>
            <div className="text-sm text-muted-foreground">Prize Money</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
