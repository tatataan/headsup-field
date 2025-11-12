import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./contexts/AuthContext";
import { Sidebar } from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import AgencyDetail from "./pages/AgencyDetail";
import BranchDetail from "./pages/BranchDetail";
import DepartmentDetail from "./pages/DepartmentDetail";
import TopicPost from "./pages/TopicPost";
import ThemeDrilldown from "./pages/ThemeDrilldown";
import MobileView from "./pages/MobileView";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <div className="flex min-h-screen bg-background">
                      <Sidebar />
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/agency/:id" element={<AgencyDetail />} />
                        <Route path="/branch/:id" element={<BranchDetail />} />
                        <Route path="/department/:id" element={<DepartmentDetail />} />
                        <Route path="/topics/new" element={<TopicPost />} />
                        <Route path="/topics/history/:distributionId/drilldown" element={<ThemeDrilldown />} />
                        <Route path="/mobile" element={<MobileView />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
