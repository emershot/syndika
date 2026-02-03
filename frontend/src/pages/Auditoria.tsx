import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/useAuth';
import { useActivityLog } from '@/hooks/useActivityLog';
import { ActivityTimeline, ActivitySummary } from '@/components/common/ActivityTimeline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ActivityAction, ActivityEntity } from '@/types/condominium';
import { Download, Filter, RotateCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Auditoria() {
  const { user } = useAuth();
  const { filterLogs, getActivityLogs } = useActivityLog();

  const [isLoading, setIsLoading] = useState(true);
  const [filterAction, setFilterAction] = useState<ActivityAction | ''>('');
  const [filterEntity, setFilterEntity] = useState<ActivityEntity | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const allLogs = getActivityLogs();

  // Filtrar logs
  const filteredLogs = filterLogs({
    action: filterAction ? (filterAction as ActivityAction) : undefined,
    entity: filterEntity ? (filterEntity as ActivityEntity) : undefined,
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
  }).filter((log) =>
    searchTerm === ''
      ? true
      : log.entityTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 250);
    return () => clearTimeout(t);
  }, []);

  const handleClearFilters = () => {
    setFilterAction('');
    setFilterEntity('');
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    toast({
      title: 'Filtros limpos',
      description: 'Exibindo todo o histórico de atividades.',
    });
  };

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      toast({
        title: 'Sem dados',
        description: 'Não há atividades para exportar.',
        variant: 'destructive',
      });
      return;
    }

    const headers = ['Data', 'Usuário', 'Ação', 'Entidade', 'Título', 'Descrição'];
    const rows = filteredLogs.map((log) => [
      new Date(log.timestamp).toLocaleString('pt-BR'),
      log.userName,
      log.action,
      log.entity,
      log.entityTitle || '',
      log.description || '',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditoria-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    toast({
      title: 'Exportado com sucesso!',
      description: `${filteredLogs.length} atividades exportadas em CSV.`,
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">🔍 Auditoria</h1>
          <p className="text-muted-foreground mt-1">
            Histórico completo de atividades no sistema
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ActivitySummary activities={filteredLogs} />
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Estatísticas Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="border-l-2 border-primary pl-3">
                <p className="text-xs text-muted-foreground">Total de Atividades</p>
                <p className="text-lg font-semibold">{allLogs.length}</p>
              </div>
              <div className="border-l-2 border-primary pl-3">
                <p className="text-xs text-muted-foreground">Filtradas</p>
                <p className="text-lg font-semibold">{filteredLogs.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div>
                <Label className="text-xs">Buscar</Label>
                <Input
                  placeholder="Usuário, título ou ação..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Action Filter */}
              <div>
                <Label className="text-xs">Tipo de Ação</Label>
                <Select
                  value={filterAction}
                  onValueChange={(v) => setFilterAction(v as ActivityAction | '')}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    <SelectItem value="create">Criado</SelectItem>
                    <SelectItem value="update">Atualizado</SelectItem>
                    <SelectItem value="delete">Deletado</SelectItem>
                    <SelectItem value="status_change">Status Alterado</SelectItem>
                    <SelectItem value="comment_added">Comentário Adicionado</SelectItem>
                    <SelectItem value="approved">Aprovado</SelectItem>
                    <SelectItem value="rejected">Rejeitado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Entity Filter */}
              <div>
                <Label className="text-xs">Tipo de Entidade</Label>
                <Select
                  value={filterEntity}
                  onValueChange={(v) => setFilterEntity(v as ActivityEntity | '')}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    <SelectItem value="ticket">Chamado</SelectItem>
                    <SelectItem value="announcement">Aviso</SelectItem>
                    <SelectItem value="reservation">Reserva</SelectItem>
                    <SelectItem value="resident">Morador</SelectItem>
                    <SelectItem value="user">Usuário</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Start Date */}
              <div>
                <Label className="text-xs">Data Inicial</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* End Date */}
              <div>
                <Label className="text-xs">Data Final</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Limpar Filtros
              </Button>
              <Button
                size="sm"
                onClick={handleExportCSV}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Exportar CSV ({filteredLogs.length})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Carregando atividades...</p>
          </div>
        ) : (
          <ActivityTimeline activities={filteredLogs} maxItems={50} />
        )}
      </div>
    </AppLayout>
  );
}
