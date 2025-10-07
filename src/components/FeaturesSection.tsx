import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Users, Zap, Shield, Globe, Award } from "lucide-react";

const features = [
  {
    icon: Trophy,
    title: "Compete & Win",
    description: "Participate in challenges with amazing prizes and recognition from top tech companies worldwide.",
  },
  {
    icon: Users,
    title: "Build Teams",
    description: "Connect with talented developers, designers, and innovators to form the perfect team.",
  },
  {
    icon: Zap,
    title: "Instant Setup",
    description: "Get started in minutes with our streamlined registration and project submission process.",
  },
  {
    icon: Shield,
    title: "Secure Platform",
    description: "Your code and ideas are protected with enterprise-grade security and privacy measures.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Join hackathons from anywhere in the world and connect with a global community.",
  },
  {
    icon: Award,
    title: "Recognition",
    description: "Showcase your projects and get noticed by recruiters and industry leaders.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Why Choose DiceyTech?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to participate, organize, and win hackathons
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-2 bg-card border-border"
            >
              <CardContent className="p-6">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
