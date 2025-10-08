import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  Trophy,
  FolderKanban,
  Users,
  FileText,
  Bell,
  FileEdit,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/admin/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const handleExitAdmin = () => {
    navigate('/dashboard');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Trophy, label: 'Hackathons', path: '/admin/hackathons' },
    { icon: FolderKanban, label: 'Projects', path: '/admin/projects' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: FileText, label: 'Applications', path: '/admin/applications' },
    { icon: Bell, label: 'Notifications', path: '/admin/notifications' },
    { icon: FileEdit, label: 'Content', path: '/admin/content' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
        } bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col fixed lg:relative z-50 h-full`}
      >
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex-shrink-0" />
              <span className="font-bold text-base sm:text-lg">DiceyTech</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 hover:text-white"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        <ScrollArea className="flex-1 px-2">
          <nav className="space-y-1 py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  className={`w-full justify-start ${
                    isActive(item.path)
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  <Icon className={`h-5 w-5 ${sidebarOpen ? 'mr-3' : ''}`} />
                  {sidebarOpen && <span>{item.label}</span>}
                </Button>
              );
            })}
          </nav>

          <Separator className="my-4 bg-slate-800" />

          <div className="space-y-1 pb-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-blue-400 hover:text-blue-300 hover:bg-slate-800/50"
              onClick={handleExitAdmin}
            >
              <ExternalLink className={`h-5 w-5 ${sidebarOpen ? 'mr-3' : ''}`} />
              {sidebarOpen && <span>Exit Admin</span>}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-slate-800/50"
              onClick={handleLogout}
            >
              <LogOut className={`h-5 w-5 ${sidebarOpen ? 'mr-3' : ''}`} />
              {sidebarOpen && <span>Logout</span>}
            </Button>
          </div>
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Top Bar */}
        <header className="h-14 sm:h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-3 sm:px-6">
          <div className="flex items-center gap-2 lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-400 hover:text-white"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="hidden sm:block">
            <h1 className="text-lg sm:text-xl font-bold text-white">Admin Portal</h1>
            <p className="text-xs sm:text-sm text-slate-400 hidden md:block">Platform Management System</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-white">{user?.displayName || 'Admin'}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-slate-700">
              <AvatarImage src={user?.photoURL || ''} />
              <AvatarFallback className="bg-gradient-to-br from-red-500 to-orange-600 text-white text-sm">
                {user?.displayName?.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
