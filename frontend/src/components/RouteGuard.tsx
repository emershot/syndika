import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/useAuth';
import { UserRole } from '@/types/condominium';
import { Skeleton } from '@/components/ui/skeleton';

export type RouteGuardType = 'public' | 'private' | 'admin' | 'sindico-only' | 'morador-only' | 'conselho-only';

interface RouteGuardProps {
  children: ReactNode;
  type: RouteGuardType;
  roles?: UserRole[];
}

/**
 * RouteGuard Component
 * 
 * Protege rotas baseado em autenticação e autorização (role-based)
 * 
 * @param type - Tipo de proteção:
 *   - 'public': Qualquer um (ou redireciona autenticado para dashboard)
 *   - 'private': Apenas autenticados
 *   - 'admin': Apenas superadmin
 *   - 'sindico-only': Apenas síndico ou superadmin
 *   - 'morador-only': Apenas morador
 *   - 'conselho-only': Apenas conselho
 * @param roles - Array de roles permitidas (alternativa a type)
 */
export function RouteGuard({
  children,
  type = 'private',
  roles = [],
}: RouteGuardProps) {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Loading state - mostra skeleton enquanto carrega sessão
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-32 mx-auto" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
      </div>
    );
  }

  // Public route - se autenticado, redireciona para dashboard
  if (type === 'public') {
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
  }

  // Autenticação obrigatória
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // A partir daqui, usuário está autenticado
  // Agora valida autorização (role)

  // Admin only
  if (type === 'admin') {
    if (user?.role !== 'superadmin') {
      return <Navigate to="/access-denied" replace />;
    }
    return <>{children}</>;
  }

  // Síndico only (síndico ou superadmin)
  if (type === 'sindico-only') {
    if (!user || !['sindico', 'superadmin'].includes(user.role)) {
      return <Navigate to="/access-denied" replace />;
    }
    return <>{children}</>;
  }

  // Morador only
  if (type === 'morador-only') {
    if (user?.role !== 'morador') {
      return <Navigate to="/access-denied" replace />;
    }
    return <>{children}</>;
  }

  // Conselho only
  if (type === 'conselho-only') {
    if (user?.role !== 'conselho') {
      return <Navigate to="/access-denied" replace />;
    }
    return <>{children}</>;
  }

  // Custom roles array
  if (roles.length > 0) {
    if (!user || !roles.includes(user.role)) {
      return <Navigate to="/access-denied" replace />;
    }
    return <>{children}</>;
  }

  // Default private route
  return <>{children}</>;
}
