import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { TimezoneProvider } from "@/contexts/TimezoneContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/useAuth";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";
import { RouteGuard } from "@/components/RouteGuard";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Announcements from "./pages/Announcements";
import Tickets from "./pages/Tickets";
import Reservations from "./pages/Reservations";
import ReservationCalendar from "./pages/ReservationCalendar";
import Residents from "./pages/Residents";
import Settings from "./pages/Settings";
import Auditoria from "./pages/Auditoria";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AccessDenied from "./pages/AccessDenied";

const queryClient = new QueryClient();

function HomeRoute() {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Index />;
  }
  
  // Redirecionar baseado no role
  if (user?.role === 'sindico' || user?.role === 'superadmin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Morador e Conselho vão para Avisos (página pública)
  return <Navigate to="/avisos" replace />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/" 
        element={<HomeRoute />}
      />
      <Route 
        path="/login" 
        element={
          <RouteGuard type="public">
            <Login />
          </RouteGuard>
        } 
      />
      <Route
        path="/access-denied"
        element={<AccessDenied />}
      />
      <Route
        path="/dashboard"
        element={
          <RouteGuard type="sindico-only">
            <Dashboard />
          </RouteGuard>
        }
      />
      <Route
        path="/avisos"
        element={
          <RouteGuard type="private">
            <Announcements />
          </RouteGuard>
        }
      />
      <Route
        path="/chamados"
        element={
          <RouteGuard type="private">
            <Tickets />
          </RouteGuard>
        }
      />
      <Route
        path="/reservas"
        element={
          <RouteGuard type="private">
            <Reservations />
          </RouteGuard>
        }
      />

      <Route
        path="/moradores"
        element={
          <RouteGuard type="sindico-only">
            <Residents />
          </RouteGuard>
        }
      />
      <Route
        path="/configuracoes"
        element={
          <RouteGuard type="sindico-only">
            <Settings />
          </RouteGuard>
        }
      />
      <Route
        path="/auditoria"
        element={
          <RouteGuard type="sindico-only">
            <Auditoria />
          </RouteGuard>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <NotificationProvider>
            <TimezoneProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <AppRoutes />
                </BrowserRouter>
              </TooltipProvider>
            </TimezoneProvider>
          </NotificationProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
