import React from 'react';
import { ActivityLog } from '@/types/condominium';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { User, FileText, CheckCircle, XCircle, Trash2, Edit2, MessageSquare, Plus } from 'lucide-react';

interface ActivityTimelineProps {
  activities: ActivityLog[];
  maxItems?: number;
  showFilters?: boolean;
}

/**
 * Componente para exibir timeline de atividades
 * Mostra histórico com ícones, usuário, ação e timestamp
 */
export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activities,
  maxItems = 20,
  showFilters = false,
}) => {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create':
        return <Plus className="h-4 w-4" />;
      case 'update':
        return <Edit2 className="h-4 w-4" />;
      case 'delete':
        return <Trash2 className="h-4 w-4" />;
      case 'comment_added':
        return <MessageSquare className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'status_change':
        return <FileText className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'bg-green-100 text-green-800';
      case 'update':
        return 'bg-blue-100 text-blue-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      case 'comment_added':
        return 'bg-purple-100 text-purple-800';
      case 'approved':
        return 'bg-emerald-100 text-emerald-800';
      case 'rejected':
        return 'bg-orange-100 text-orange-800';
      case 'status_change':
        return 'bg-cyan-100 text-cyan-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'create':
        return 'Criado';
      case 'update':
        return 'Atualizado';
      case 'delete':
        return 'Deletado';
      case 'comment_added':
        return 'Comentário';
      case 'approved':
        return 'Aprovado';
      case 'rejected':
        return 'Rejeitado';
      case 'status_change':
        return 'Status';
      default:
        return action;
    }
  };

  const getEntityLabel = (entity: string) => {
    switch (entity) {
      case 'ticket':
        return 'Chamado';
      case 'announcement':
        return 'Aviso';
      case 'reservation':
        return 'Reserva';
      case 'resident':
        return 'Morador';
      case 'user':
        return 'Usuário';
      default:
        return entity;
    }
  };

  const displayedActivities = activities.slice(0, maxItems);

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Nenhuma atividade registrada ainda</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Timeline de Atividades</h3>
        <Badge variant="outline">{activities.length} atividades</Badge>
      </div>

      <div className="relative space-y-4">
        {displayedActivities.map((activity, idx) => (
          <div key={activity.id} className="flex gap-4">
            {/* Timeline line */}
            {idx !== displayedActivities.length - 1 && (
              <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-border" />
            )}

            {/* Icon circle */}
            <div
              className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-background ${getActionColor(activity.action)} flex-shrink-0`}
            >
              {getActionIcon(activity.action)}
            </div>

            {/* Content card */}
            <Card className="flex-1 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getActionColor(activity.action)} variant="secondary">
                        {getActionLabel(activity.action)}
                      </Badge>
                      <Badge variant="outline">{getEntityLabel(activity.entity)}</Badge>
                    </div>

                    <p className="font-medium text-sm mb-2">
                      {activity.entityTitle || activity.entityId}
                    </p>

                    {activity.description && (
                      <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                    )}

                    {activity.changes && activity.changes.length > 0 && (
                      <div className="text-xs bg-muted p-2 rounded mb-2 space-y-1">
                        {activity.changes.map((change, i) => (
                          <div key={i}>
                            <strong>{change.field}:</strong> {String(change.oldValue)} →{' '}
                            {String(change.newValue)}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>👤 {activity.userName}</span>
                      <span>📅 {format(new Date(activity.timestamp), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {activities.length > maxItems && (
        <div className="text-center text-xs text-muted-foreground pt-4">
          Mostrando {maxItems} de {activities.length} atividades
        </div>
      )}
    </div>
  );
};

/**
 * Componente para exibir card com resumo de atividades
 */
interface ActivitySummaryProps {
  activities: ActivityLog[];
}

export const ActivitySummary: React.FC<ActivitySummaryProps> = ({ activities }) => {
  const createCount = activities.filter((a) => a.action === 'create').length;
  const updateCount = activities.filter((a) => a.action === 'update').length;
  const deleteCount = activities.filter((a) => a.action === 'delete').length;
  const commentCount = activities.filter((a) => a.action === 'comment_added').length;

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Resumo de Atividades</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="border-l-2 border-green-500 pl-3">
            <p className="text-xs text-muted-foreground">Criados</p>
            <p className="text-lg font-semibold">{createCount}</p>
          </div>
          <div className="border-l-2 border-blue-500 pl-3">
            <p className="text-xs text-muted-foreground">Atualizados</p>
            <p className="text-lg font-semibold">{updateCount}</p>
          </div>
          <div className="border-l-2 border-red-500 pl-3">
            <p className="text-xs text-muted-foreground">Deletados</p>
            <p className="text-lg font-semibold">{deleteCount}</p>
          </div>
          <div className="border-l-2 border-purple-500 pl-3">
            <p className="text-xs text-muted-foreground">Comentários</p>
            <p className="text-lg font-semibold">{commentCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
