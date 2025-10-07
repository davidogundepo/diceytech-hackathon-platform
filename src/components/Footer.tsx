import { Code2 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                DiceyTech
              </span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              The ultimate platform for hackathon enthusiasts. Build, compete, and innovate with developers worldwide.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Platform</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Browse Hackathons</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Host Event</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Team Finder</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Prizes</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-muted-foreground">
          <p>&copy; 2025 DiceyTech. Built for innovators, by innovators.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
