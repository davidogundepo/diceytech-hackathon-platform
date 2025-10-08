
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProtectedAdminRoute from "@/components/admin/ProtectedAdminRoute";
import Index from "./pages/Index";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import HackathonManagement from "./pages/admin/HackathonManagement";
import ApplicationManagement from "./pages/admin/ApplicationManagement";
import UserManagement from "./pages/admin/UserManagement";
import ProjectManagement from "./pages/admin/ProjectManagement";
import NotificationCenter from "./pages/admin/NotificationCenter";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";
import ContentManagement from "./pages/admin/ContentManagement";
import Dashboard from "./pages/Dashboard";
import ExploreProjects from "./pages/ExploreProjects";
import MyPortfolio from "./pages/MyPortfolio";
import JobOpportunities from "./pages/JobOpportunities";
import MyApplications from "./pages/MyApplications";
import AddProject from "./pages/AddProject";
import ProjectDetails from "./pages/ProjectDetails";
import Profile from "./pages/Profile";
import Hackathons from "./pages/Hackathons";
import HackathonDetails from "./pages/HackathonDetails";
import Notifications from "./pages/Notifications";
import Achievements from "./pages/Achievements";
import SavedEvents from "./pages/SavedEvents";
import SavedProjects from "./pages/SavedProjects";
import AdminSeed from "./pages/AdminSeed";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="diceytech-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/explore-projects" element={<ProtectedRoute><ExploreProjects /></ProtectedRoute>} />
              <Route path="/my-portfolio" element={<ProtectedRoute><MyPortfolio /></ProtectedRoute>} />
              <Route path="/job-opportunities" element={<ProtectedRoute><JobOpportunities /></ProtectedRoute>} />
              <Route path="/my-applications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />
              <Route path="/add-project" element={<ProtectedRoute><AddProject /></ProtectedRoute>} />
              <Route path="/project/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/hackathons" element={<ProtectedRoute><Hackathons /></ProtectedRoute>} />
              <Route path="/hackathon/:id" element={<ProtectedRoute><HackathonDetails /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
              <Route path="/saved-events" element={<ProtectedRoute><SavedEvents /></ProtectedRoute>} />
              <Route path="/saved-projects" element={<ProtectedRoute><SavedProjects /></ProtectedRoute>} />
              <Route path="/admin/seed" element={<ProtectedRoute><AdminSeed /></ProtectedRoute>} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
              <Route path="/admin/hackathons" element={<ProtectedAdminRoute><HackathonManagement /></ProtectedAdminRoute>} />
              <Route path="/admin/applications" element={<ProtectedAdminRoute><ApplicationManagement /></ProtectedAdminRoute>} />
              <Route path="/admin/users" element={<ProtectedAdminRoute><UserManagement /></ProtectedAdminRoute>} />
              <Route path="/admin/projects" element={<ProtectedAdminRoute><ProjectManagement /></ProtectedAdminRoute>} />
              <Route path="/admin/notifications" element={<ProtectedAdminRoute><NotificationCenter /></ProtectedAdminRoute>} />
              <Route path="/admin/content" element={<ProtectedAdminRoute><ContentManagement /></ProtectedAdminRoute>} />
              <Route path="/admin/analytics" element={<ProtectedAdminRoute><Analytics /></ProtectedAdminRoute>} />
              <Route path="/admin/settings" element={<ProtectedAdminRoute><Settings /></ProtectedAdminRoute>} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
