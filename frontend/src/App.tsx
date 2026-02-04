import { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { TimezoneProvider } from "@/contexts/TimezoneContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/useAuth";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { RouteGuard } from "@/components/RouteGuard";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";

// Pages with lazy loading for code splitting
// Reduce initial bundle size by loading pages on demand
const Login = lazy(() => import('./pages/Login'));
const Index = lazy(() => import('./pages/Index'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Announcements = lazy(() => import('./pages/Announcements'));
const Tickets = lazy(() => import('./pages/Tickets'));
const Reservations = lazy(() => import('./pages/Reservations'));
const ReservationCalendar = lazy(() => import('./pages/ReservationCalendar'));
const Residents = lazy(() => import('./pages/Residents'));
const Settings = lazy(() => import('./pages/Settings'));
const Auditoria = lazy(() => import('./pages/Auditoria'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AccessDenied = lazy(() => import('./pages/AccessDenied'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));

/**
 * Loading fallback component during lazy loading
 */
const PageSkeleton = () => <LoadingSkeleton className="p-4" />;

/**
 * HomeRoute - Redireciona baseado em auth status e role do usuário
 * Pattern: AuthContext e useAuth são globais, então funciona em qualquer lugar
 */
function HomeRoute() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Index />;
  }

  // Síndico e SuperAdmin vão para dashboard
  if (user?.role === 'sindico' || user?.role === 'superadmin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Morador e Conselho vão para avisos
  return <Navigate to="/avisos" replace />;
}

/**
 * AppRoutes - Configuração de rotas com proteção
 * Usa RouteGuard para validar permissões
 */
function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<PageSkeleton />}>
            <HomeRoute />
          </Suspense>
        }
      />

      <Route
        path="/login"
        element={
          <Suspense fallback={<PageSkeleton />}>
            <RouteGuard type="public">
              <Login />
            </RouteGuard>
          </Suspense>
        }
      />

      <Route
        path="/recuperar-acesso"
        element={
          <Suspense fallback={<PageSkeleton />}>
            <RouteGuard type="public">
              <ForgotPassword />
            </RouteGuard>
          </Suspense>
        }
      />

      <Route
        path="/access-denied"
        element={
          <Suspense fallback={<PageSkeleton />}>
            <AccessDenied />
          </Suspense>
        }
      />

      <Route
        path="/dashboard"
        element={
          <Suspense fallback={<PageSkeleton />}>
            <RouteGuard type="sindico-only">
              <Dashboard />
            </RouteGuard>
          </Suspense>
        }
      />

      <Route
        path="/avisos"
        element={
          <Suspense fallback={<PageSkeleton />}>
            <RouteGuard type="private">
              <Announcements />
            </RouteGuard>
          </Suspense>
        }
      />

      <Route
        path="/chamados"
        element={
          <Suspense fallback={<PageSkeleton />}>
            <RouteGuard type="private">
              <Tickets />
            </RouteGuard>
          </Suspense>
        }
      />

      <Route
        path="/reservas"
        element={
          <Suspense fallback={<PageSkeleton />}>
            <RouteGuard type="private">
              <Reservations />
            </RouteGuard>
          </Suspense>
        }
      />

      <Route
        path="/calendario"
        element={
          <Suspense fallback={<PageSkeleton />}>
            <RouteGuard type="private">
              <ReservationCalendar />
            </RouteGuard>
          </Suspense>
        }
      />

      <Route
        path="/moradores"
        element={
          <Suspense fallback={<PageSkeleton />}>
            <RouteGuard type="sindico-only">
              <Residents />
            </RouteGuard>
          </Suspense>
        }
      />

      <Route
        path="/configuracoes"
        element={
          <Suspense fallback={<PageSkeleton />}>
            <RouteGuard type="sindico-only">
              <Settings />
            </RouteGuard>
          </Suspense>
        }
      />

      <Route
        path="/auditoria"
        element={
          <Suspense fallback={<PageSkeleton />}>
            <RouteGuard type="sindico-only">
              <Auditoria />
            </RouteGuard>
          </Suspense>
        }
      />

      {/* 404 - Must be last */}
      <Route
        path="*"
        element={
          <Suspense fallback={<PageSkeleton />}>
            <Navigate to="/dashboard" replace />
          </Suspense>
        }
      />
    </Routes>
  );
}

/**
 * App - Root component with provider stack
 *
 * Provider order (bottom to top dependencies):
 * 1. QueryClientProvider - for async state management
 * 2. AuthProvider - for authentication context
 * 3. ThemeProvider - for theme context
 * 4. NotificationProvider - for notifications
 * 5. TimezoneProvider - for timezone handling
 * 6. TooltipProvider - for Radix UI tooltips
 * 7. Router - for routing (wraps everything)
 * 8. ErrorBoundary - catches React errors
 */
function App() {
  return (
    <ErrorBoundary fallback={<Navigate to="/login" replace />}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <ThemeProvider>
              <NotificationProvider>
                <TimezoneProvider>
                  <TooltipProvider>
                    {/* Global UI providers for toasts */}
                    <Toaster />
                    <Sonner />

                    {/* Routes with lazy loading */}
                    <AppRoutes />
                  </TooltipProvider>
                </TimezoneProvider>
              </NotificationProvider>
            </ThemeProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
