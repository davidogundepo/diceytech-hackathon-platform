import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { 
  Plus, 
  Search, 
  User, 
  LogOut,
  ChevronDown,
  Bell,
  Home,
  FolderOpen,
  FileText,
  Trophy,
  Award
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { title: 'Dashboard', url: '/dashboard', icon: Home },
    { title: 'Explore Projects', url: '/explore-projects', icon: Search },
    { title: 'My Portfolio', url: '/my-portfolio', icon: User },
    { title: 'My Applications', url: '/my-applications', icon: FileText },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50 dark:bg-background">
        <Sidebar className="border-r border-gray-200 dark:border-gray-800">
          <SidebarHeader className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <span className="text-xl font-bold text-dicey-yellow">DiceyTech</span>
              ) : (
                <img 
                  src="https://firebasestorage.googleapis.com/v0/b/icdatinnovation.appspot.com/o/redtech_africa_websitee_v2%2Fdicey%20tech%2Fsponsor_diceytech.png?alt=media&token=201427f2-3a3c-4dc1-a717-f101f8c7d7e2" 
                  alt="DiceyTech" 
                  className="h-10 w-auto object-contain"
                />
              )}
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <div className="mb-6">
              <Button 
                onClick={() => navigate('/add-project')}
                className="w-full bg-dicey-magenta hover:bg-dicey-magenta/90 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </div>

            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive 
                            ? 'bg-dicey-azure text-white' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-dicey-azure/10 dark:hover:bg-dicey-azure/20'
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Quick Actions</div>
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start hover:bg-dicey-yellow/20" onClick={() => navigate('/hackathons')}>
                  <Trophy className="mr-2 h-4 w-4" />
                  Hackathons
                  <Badge variant="secondary" className="ml-auto bg-dicey-yellow text-dicey-dark-pink">12</Badge>
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start hover:bg-dicey-magenta/20" onClick={() => navigate('/notifications')}>
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                  <Badge variant="destructive" className="ml-auto bg-dicey-magenta">3</Badge>
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start hover:bg-dicey-azure/20" onClick={() => navigate('/achievements')}>
                  <Award className="mr-2 h-4 w-4" />
                  Achievements
                </Button>
              </div>
            </div>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="bg-white dark:bg-background border-b border-gray-200 dark:border-gray-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Welcome back, <span className="font-medium text-gray-900 dark:text-white">{user?.name}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <ThemeToggle />
                
                <Button variant="ghost" size="icon" className="relative hover:bg-dicey-magenta/20" onClick={() => navigate('/notifications')}>
                  <Bell className="h-5 w-5" />
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-dicey-magenta">
                    3
                  </Badge>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 p-2 hover:bg-dicey-azure/20">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="bg-dicey-azure text-white">
                          {user?.name?.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-gray-500">@{user?.username}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
