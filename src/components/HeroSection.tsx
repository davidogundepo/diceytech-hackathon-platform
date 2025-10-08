import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-hackathon.jpg";
import { Code2, Rocket } from "lucide-react";

const HeroSection = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const stagger = {
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

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
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Content */}
      <motion.div 
        className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 mb-6 shadow-lg">
          <Code2 className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">Platform for Innovators</span>
        </motion.div>

        <motion.h1 
          variants={fadeInUp}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight px-4"
        >
          <span className="bg-gradient-to-r from-primary via-foreground to-accent bg-clip-text text-transparent">
            Build the Future at
          </span>
          <br />
          <span className="text-primary dark:text-dicey-yellow">DiceyTech</span>
        </motion.h1>

        <motion.p 
          variants={fadeInUp}
          className="text-base sm:text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto px-4"
        >
          Join thousands of developers, designers, and creators competing in the world's most exciting hackathons
        </motion.p>

        <motion.div 
          variants={fadeInUp}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button 
            variant="default" 
            size="lg" 
            className="gap-2 hover-lift"
          >
            <Rocket className="w-5 h-5" />
            Explore Hackathons
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="hover-lift"
          >
            Host Your Event
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div 
          variants={fadeInUp}
          className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-8 mt-12 sm:mt-16 max-w-3xl mx-auto px-4"
        >
          {[
            { value: "500+", label: "Active Hackathons" },
            { value: "50K+", label: "Participants" },
            { value: "$2M+", label: "Prize Money" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-3 sm:p-4 md:p-6 hover-lift transition-smooth"
              whileHover={{ y: -5 }}
            >
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary dark:text-dicey-yellow mb-1 sm:mb-2">{stat.value}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
