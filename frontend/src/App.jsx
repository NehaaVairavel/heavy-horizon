import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import ServiceCategory from "./pages/ServiceCategory";
import Sales from "./pages/Sales";
import SalesCategory from "./pages/SalesCategory";
import SpareParts from "./pages/SpareParts";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMachines from "./pages/admin/AdminMachines";
import AdminParts from "./pages/admin/AdminParts";
import AdminBlogs from "./pages/admin/AdminBlogs";
import AdminEnquiries from "./pages/admin/AdminEnquiries";
import ScrollToTop from "./components/ScrollToTop";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:category" element={<ServiceCategory />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/sales/:category" element={<SalesCategory />} />
            <Route path="/spare-parts" element={<SpareParts />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogDetail />} />
            <Route path="/contact" element={<Contact />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="machines" element={<AdminMachines />} />
                <Route path="parts" element={<AdminParts />} />
                <Route path="blogs" element={<AdminBlogs />} />
                <Route path="enquiries" element={<AdminEnquiries />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
