
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ExploreProjects from "./pages/ExploreProjects";
import MyPortfolio from "./pages/MyPortfolio";
import JobOpportunities from "./pages/JobOpportunities";
import MyApplications from "./pages/MyApplications";
import AddProject from "./pages/AddProject";
import ProjectDetails from "./pages/ProjectDetails";
import Profile from "./pages/Profile";
import Hackathons from "./pages/Hackathons";
import Notifications from "./pages/Notifications";
import Achievements from "./pages/Achievements";
import AdminSeed from "./pages/AdminSeed";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="diceytech-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/explore-projects" element={<ExploreProjects />} />
            <Route path="/my-portfolio" element={<MyPortfolio />} />
            <Route path="/job-opportunities" element={<JobOpportunities />} />
            <Route path="/my-applications" element={<MyApplications />} />
            <Route path="/add-project" element={<AddProject />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/hackathons" element={<Hackathons />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/admin/seed" element={<AdminSeed />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
