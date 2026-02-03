import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Download, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Ticket, Reservation, Announcement } from '@/types/condominium';

type RowData = Ticket | Reservation | Announcement | Record<string, unknown>;

interface DrilldownModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  type: 'tickets' | 'reservations' | 'announcements';
  data: RowData[];
  stats?: {
    total: number;
    pending?: number;
    completed?: number;
    avgTime?: number;
  };
  onExport?: () => void;
}

export function DrilldownModal({
  open,
  onOpenChange,
  title,
  description,
  type,
  data,
  stats,
  onExport,
}: DrilldownModalProps) {
  const getColumns = () => {
    switch (type) {
      case 'tickets':
        return [
          { header: 'ID', accessor: 'id', width: 80 },
          { header: 'Título', accessor: 'title', width: 250 },
          { header: 'Categoria', accessor: 'category', width: 120 },
          { header: 'Prioridade', accessor: 'priority', width: 100 },
          { header: 'Status', accessor: 'status', width: 100 },
          { header: 'Criado em', accessor: 'createdAt', width: 150 },
        ];
      case 'reservations':
        return [
          { header: 'ID', accessor: 'id', width: 80 },
          { header: 'Área Comum', accessor: 'commonAreaName', width: 180 },
          { header: 'Morador', accessor: 'residentName', width: 150 },
          { header: 'Data', accessor: 'date', width: 120 },
          { header: 'Status', accessor: 'status', width: 100 },
          { header: 'Criado em', accessor: 'createdAt', width: 150 },
        ];
      case 'announcements':
        return [
          { header: 'ID', accessor: 'id', width: 80 },
          { header: 'Título', accessor: 'title', width: 300 },
          { header: 'Tipo', accessor: 'type', width: 120 },
          { header: 'Autor', accessor: 'authorName', width: 150 },
          { header: 'Criado em', accessor: 'createdAt', width: 150 },
        ];
      default:
        return [];
    }
  };

  const formatData = () => {
    return data.map(item => {
      const row = item as Record<string, unknown>;
      return {
        ...row,
        createdAt: row.createdAt ? format(new Date(row.createdAt as string | number), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : '-',
        date: row.date ? format(new Date(row.date as string | number), 'dd/MM/yyyy', { locale: ptBR }) : '-',
      };
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgente':
      case 'alta':
        return 'destructive' as const;
      case 'media':
        return 'secondary' as const;
      case 'baixa':
      default:
        return 'outline' as const;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aberto':
      case 'solicitada':
      case 'em_andamento':
        return 'secondary' as const;
      case 'resolvido':
      case 'aprovada':
        return 'default' as const;
      case 'rejeitada':
        return 'destructive' as const;
      default:
        return 'outline' as const;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {title}
            <Badge variant="outline">{data.length}</Badge>
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <Card>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Total</p>
              </CardContent>
            </Card>
            {stats.pending !== undefined && (
              <Card>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
                  <p className="text-xs text-muted-foreground">Pendentes</p>
                </CardContent>
              </Card>
            )}
            {stats.completed !== undefined && (
              <Card>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                  <p className="text-xs text-muted-foreground">Concluídos</p>
                </CardContent>
              </Card>
            )}
            {stats.avgTime !== undefined && (
              <Card>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-blue-600">{Math.round(stats.avgTime)}h</div>
                  <p className="text-xs text-muted-foreground">Tempo Médio</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mb-4">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtrar
          </Button>
          {onExport && (
            <Button variant="outline" size="sm" className="gap-2" onClick={onExport}>
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          )}
        </div>

        {/* Table */}
        <div className="rounded-lg border overflow-auto max-h-96">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b sticky top-0">
              <tr>
                {getColumns().map(col => (
                  <th key={col.accessor} className="px-4 py-2 text-left font-semibold text-slate-700" style={{ width: col.width }}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {formatData().map((row, idx) => (
                <tr key={idx} className="border-b hover:bg-slate-50 transition-colors">
                  {getColumns().map(col => (
                    <td key={`${idx}-${col.accessor}`} className="px-4 py-2">
                      {col.accessor === 'priority' ? (
                        <Badge variant={getPriorityColor(row[col.accessor])}>
                          {row[col.accessor]}
                        </Badge>
                      ) : col.accessor === 'status' ? (
                        <Badge variant={getStatusColor(row[col.accessor])}>
                          {row[col.accessor]}
                        </Badge>
                      ) : col.accessor === 'type' ? (
                        <Badge variant="outline">{row[col.accessor]}</Badge>
                      ) : (
                        <span className="text-slate-700">{row[col.accessor] || '-'}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
