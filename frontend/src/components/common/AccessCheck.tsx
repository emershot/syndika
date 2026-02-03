import { ReactNode } from 'react';
import { useAuth } from '@/contexts/useAuth';

interface AccessCheckProps {
  permission: boolean;
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  disabled?: boolean;
}

/**
 * Componente wrapper para controlar a exibição/desabilitação de conteúdo
 * baseado em permissões
 *
 * @example
 * // Mostrar/ocultar conteúdo
 * <AccessCheck permission={canDeleteTicket(ticket, user)}>
 *   <Button onClick={handleDelete}>Deletar</Button>
 * </AccessCheck>
 *
 * // Com fallback
 * <AccessCheck 
 *   permission={canCreateAnnouncement(user)}
 *   fallback={<p>Sem permissão para criar</p>}
 * >
 *   <Button onClick={handleCreate}>Criar</Button>
 * </AccessCheck>
 */
export function AccessCheck({
  permission,
  children,
  fallback,
  className = '',
  disabled = false,
}: AccessCheckProps) {
  const { user } = useAuth();

  // Se loading, não renderiza nada
  if (!user) return null;

  // Se tem permissão, renderiza children
  if (permission) {
    return <div className={className}>{children}</div>;
  }

  // Se não tem permissão, renderiza fallback ou nada
  return fallback ? <div className={className}>{fallback}</div> : null;
}

/**
 * Componente para desabilitar elementos condicionalmente
 * Útil quando quer manter o elemento visível mas desabilitado
 *
 * @example
 * <AccessCheckDisabled permission={canApproveReservation(reservation, user)}>
 *   <Button onClick={handleApprove}>Aprovar</Button>
 * </AccessCheckDisabled>
 */
export function AccessCheckDisabled({
  permission,
  children,
  className = '',
}: Omit<AccessCheckProps, 'fallback'>) {
  const { user } = useAuth();

  // Se loading, não renderiza nada
  if (!user) return null;

  // Se tem permissão, renderiza children normalmente
  if (permission) {
    return <div className={className}>{children}</div>;
  }

  // Se não tem permissão, renderiza children com opacity reduzida
  // e nota de cursor não-permitido (implementado via CSS)
  return (
    <div className={`${className} opacity-50 pointer-events-none`} title="Sem permissão">
      {children}
    </div>
  );
}
