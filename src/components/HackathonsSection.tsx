import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";

const hackathons = [
  {
    title: "AI Innovation Challenge 2025",
    description: "Build the next generation of AI-powered applications",
    date: "Mar 15-17, 2025",
    location: "Virtual",
    participants: "1,200+",
    prize: "$50,000",
    category: "AI/ML",
    color: "primary",
  },
  {
    title: "Web3 Builders Hackathon",
    description: "Create decentralized applications that matter",
    date: "Apr 1-3, 2025",
    location: "San Francisco, CA",
    participants: "800+",
    prize: "$30,000",
    category: "Blockchain",
    color: "accent",
  },
  {
    title: "Climate Tech Sprint",
    description: "Innovate solutions for a sustainable future",
    date: "Apr 20-22, 2025",
    location: "Virtual",
    participants: "1,500+",
    prize: "$75,000",
    category: "Climate",
    color: "primary",
  },
];

const HackathonsSection = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Featured Hackathons
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover upcoming challenges and start building
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {hackathons.map((hackathon, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-2 bg-card border-border overflow-hidden"
            >
              <div className={`h-2 w-full bg-gradient-to-r ${
                hackathon.color === 'primary' 
                  ? 'from-primary to-primary/70' 
                  : 'from-accent to-accent/70'
              }`} />
              
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className="mb-2">
                    {hackathon.category}
                  </Badge>
                  <span className="text-lg font-bold text-primary">{hackathon.prize}</span>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {hackathon.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {hackathon.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{hackathon.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{hackathon.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{hackathon.participants} registered</span>
                  </div>
                </div>

                <Button className="w-full" variant="default">
                  Register Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg">
            View All Hackathons
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HackathonsSection;
