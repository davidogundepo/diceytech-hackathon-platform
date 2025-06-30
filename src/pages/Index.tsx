
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Users, Trophy, Building, Star, Zap, Target, Code, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';

const Index = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const { toast } = useToast();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
      } else {
        if (password !== confirmPassword) {
          toast({
            title: "Password mismatch",
            description: "Please make sure your passwords match.",
            variant: "destructive",
          });
          return;
        }
        await register({ fullName, username, email, password });
        toast({
          title: "Account created!",
          description: "Welcome to DiceyTech! You can now start participating in hackathons.",
        });
      }
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: isLogin ? "Login failed" : "Registration failed",
        description: "Please check your details and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { label: 'Projects', value: '10+', icon: Trophy, color: 'bg-dicey-yellow' },
    { label: 'Talents', value: '400+', icon: Users, color: 'bg-dicey-magenta' },
    { label: 'Organizations', value: '50+', icon: Building, color: 'bg-dicey-azure' },
  ];

  const features = [
    { icon: Star, title: 'Real Projects', desc: 'Work on industry challenges', color: 'text-dicey-yellow' },
    { icon: Trophy, title: 'Win Prizes', desc: 'Cash & recognition', color: 'text-dicey-magenta' },
    { icon: Users, title: 'Network', desc: 'Connect with pros', color: 'text-dicey-azure' },
    { icon: Zap, title: 'Fast Track', desc: 'Accelerate career', color: 'text-dicey-dark-pink' },
  ];

  // Scrolling images of winners and participants
  const winnerImages = [
    'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=120&h=120&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=120&h=120&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=120&h=120&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=120&h=120&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces',
  ];

  return (
    <div className="h-screen bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Compact colorful background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-dicey-yellow/15 rounded-full blur-lg"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-dicey-magenta/15 rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-dicey-azure/15 rounded-full blur-lg"></div>
        <div className="absolute bottom-10 right-32 w-28 h-28 bg-dicey-dark-pink/15 rounded-full blur-lg"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 w-full px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {theme === 'dark' ? (
            <span className="text-xl font-bold text-dicey-yellow">DiceyTech</span>
          ) : (
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/icdatinnovation.appspot.com/o/redtech_africa_websitee_v2%2Fdicey%20tech%2Fsponsor_diceytech.png?alt=media&token=201427f2-3a3c-4dc1-a717-f101f8c7d7e2" 
              alt="DiceyTech" 
              className="h-8 w-auto object-contain"
            />
          )}
        </div>
        <ThemeToggle />
      </header>

      <div className="relative z-10 flex h-[calc(100vh-60px)]">
        {/* Left Side - Hero Content */}
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-12">
          <div className="max-w-xl">
            <div className="mb-4">
              <Badge className="bg-dicey-magenta text-white mb-3 text-xs px-3 py-1">
                🚀 Africa's Premier Tech Platform
              </Badge>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                Build Your Tech Career with
                <span className="text-dicey-azure block mt-1">Real Projects</span>
              </h1>
            </div>
            
            <p className="text-base text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Join hackathons, showcase your skills, and connect with top tech companies across Africa. 
              Your next career opportunity starts here.
            </p>

            {/* Compact Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="flex justify-center mb-2">
                    <div className={`p-2 rounded-xl ${stat.color} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Compact Features Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md transition-all duration-300">
                  <div className={`p-1.5 rounded-md bg-white dark:bg-gray-800 shadow-sm`}>
                    <feature.icon className={`h-4 w-4 ${feature.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-xs">{feature.title}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Compact Call to Action */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-1">
                <div className="w-8 h-8 rounded-full bg-dicey-yellow border-2 border-white dark:border-gray-900"></div>
                <div className="w-8 h-8 rounded-full bg-dicey-magenta border-2 border-white dark:border-gray-900"></div>
                <div className="w-8 h-8 rounded-full bg-dicey-azure border-2 border-white dark:border-gray-900"></div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-900 dark:text-white">Join 400+ developers</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">Building African tech</p>
              </div>
            </div>
          </div>
        </div>

        {/* Center - Scrolling Winners Images */}
        <div className="w-32 flex flex-col justify-center items-center bg-dicey-yellow/5 dark:bg-dicey-yellow/10 border-x border-dicey-yellow/20">
          <div className="text-center mb-4">
            <h3 className="text-sm font-bold text-dicey-dark-pink dark:text-dicey-yellow mb-1">Our Winners</h3>
            <p className="text-xs text-gray-600 dark:text-gray-300">& Participants</p>
          </div>
          
          {/* Scrolling animation container */}
          <div className="relative h-80 overflow-hidden">
            <div className="absolute inset-0 flex flex-col animate-[scroll_20s_linear_infinite]">
              {[...winnerImages, ...winnerImages].map((image, index) => (
                <div key={index} className="mb-4 flex-shrink-0">
                  <div className="relative">
                    <img 
                      src={image} 
                      alt={`Winner ${index + 1}`}
                      className="w-16 h-16 rounded-full object-cover border-2 border-dicey-magenta shadow-lg"
                    />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-dicey-yellow rounded-full flex items-center justify-center">
                      <Trophy className="w-2 h-2 text-dicey-dark-pink" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login/Signup Form */}
        <div className="w-80 flex flex-col justify-center px-6 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm border-l border-gray-200/50 dark:border-gray-700/50">
          <Card className="w-full border-dicey-azure/30 shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-dicey-azure rounded-xl flex items-center justify-center mx-auto mb-3">
                {isLogin ? <LogIn className="h-6 w-6 text-white" /> : <UserPlus className="h-6 w-6 text-white" />}
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                {isLogin ? 'Welcome Back' : 'Join DiceyTech'}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                {isLogin ? 'Sign in to your DiceyTech account' : 'Create your account and start building'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="space-y-1">
                      <label htmlFor="fullName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Full Name
                      </label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="border-gray-300 focus:border-dicey-azure focus:ring-dicey-azure/20 h-10"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Username
                      </label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="Choose a username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="border-gray-300 focus:border-dicey-azure focus:ring-dicey-azure/20 h-10"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-1">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {isLogin ? 'Email or username' : 'Email'}
                  </label>
                  <Input
                    id="email"
                    type={isLogin ? "text" : "email"}
                    placeholder={isLogin ? "Enter your email or username" : "Enter your email"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-gray-300 focus:border-dicey-azure focus:ring-dicey-azure/20 h-10"
                  />
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-gray-300 focus:border-dicey-azure focus:ring-dicey-azure/20 pr-10 h-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-1">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="border-gray-300 focus:border-dicey-azure focus:ring-dicey-azure/20 pr-10 h-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-dicey-azure hover:bg-dicey-azure/90 text-white h-10 text-sm font-semibold shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (isLogin ? "Signing in..." : "Creating account...") : (isLogin ? "Sign In" : "Create Account")}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-dicey-magenta hover:text-dicey-magenta/80 font-semibold"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? "Sign up for free" : "Sign in"}
                  </Button>
                </p>
              </div>

              {/* Demo Login Info - only show on login */}
              {isLogin && (
                <div className="p-3 bg-dicey-yellow/10 rounded-lg border border-dicey-yellow/30">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-dicey-yellow rounded-full"></div>
                    <p className="text-xs text-dicey-dark-pink font-semibold">Demo Login</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Email: <code className="bg-white dark:bg-gray-800 px-1 py-0.5 rounded text-dicey-azure font-mono text-xs">admin</code>
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Password: <code className="bg-white dark:bg-gray-800 px-1 py-0.5 rounded text-dicey-azure font-mono text-xs">admin</code>
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default Index;
