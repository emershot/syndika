import { AppLayout } from '@/components/layout/AppLayout';
import { KPICard } from '@/components/dashboard/KPICard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { InsightCard } from '@/components/dashboard/InsightCard';
import { DrilldownModal } from '@/components/dashboard/DrilldownModal';
import { LastUpdateDisplay } from '@/components/dashboard/LastUpdateDisplay';
import { useAuth } from '@/contexts/useAuth';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useDashboardAlerts } from '@/hooks/useDashboardAlerts';
import { useExport } from '@/hooks/useExport';
import { useLastUpdate } from '@/hooks/useLastUpdate';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useTickets } from '@/hooks/useTickets';
import { mockTickets, mockReservations, mockAnnouncements } from '@/data/mockData';
import { Ticket, Announcement, Reservation } from '@/types/condominium';
import { calculateDashboardStats, getTicketStatusTrendData, getTicketPriorityDistribution, getAnnouncementTypeDistribution, getTicketResolutionTimeDistribution } from '@/lib/dashboardUtils';
import { 
  ClipboardList, 
  CalendarDays, 
  Clock, 
  CheckCircle2,
  AlertTriangle,
  Megaphone,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Download,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { EmptyState } from '@/components/common/EmptyState';
import { CardSkeleton } from '@/components/common/LoadingSkeleton';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { cn } from '@/lib/utils';

// Cores tema Tailwind
const COLORS = {
  primary: '#3b82f6',
  success: '#22c55e',
  warning: '#f97316',
  danger: '#ef4444',
  info: '#06b6d4',
  slate: '#64748b',
};

const CHART_COLORS = ['#3b82f6', '#22c55e', '#f97316', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function Dashboard() {
  const { user } = useAuth();
  
  // **NOVO**: Usar React Query para buscar tickets
  const { 
    data: apiTickets, 
    isLoading: ticketsLoading, 
    error: ticketsError,
    refetch: refetchTickets 
  } = useTickets();
  
  // Fallback para localStorage (compatibilidade)
  const [localTickets] = useLocalStorage<Ticket[]>('syndika_tickets', mockTickets);
  const [announcements] = useLocalStorage<Announcement[]>('syndika_announcements', mockAnnouncements);
  const [reservations] = useLocalStorage<Reservation[]>('syndika_reservations', mockReservations);
  
  // **NOVO**: Usar dados da API se disponíveis, senão usa localStorage
  const tickets = useMemo(() => {
    if (apiTickets && apiTickets.length > 0) {
      console.log('[Dashboard] Usando tickets da API:', apiTickets.length);
      return apiTickets;
    }
    console.log('[Dashboard] Usando tickets do localStorage (fallback)');
    return localTickets;
  }, [apiTickets, localTickets]);
  
  const [dateRange, setDateRange] = useState('1');
  const [customDateRange, setCustomDateRange] = useState<{ start: Date; end: Date } | null>(null);
  const [isLoading, setIsLoading] = useState(false); // **ALTERADO**: Não mais true por padrão
  const [refreshing, setRefreshing] = useState(false);
  const [drilldownModal, setDrilldownModal] = useState<{ open: boolean; type?: 'tickets' | 'reservations' | 'announcements'; title?: string }>({ open: false });
  
  // Last update timestamp
  const { lastUpdate, updateTimestamp } = useLastUpdate();

  // **NOVO**: Loading state baseado no React Query
  useEffect(() => {
    setIsLoading(ticketsLoading);
  }, [ticketsLoading]);

  // Calcular stats dinamicamente
  const stats = useMemo(() => calculateDashboardStats(tickets, announcements, reservations), [tickets, announcements, reservations]);

  // Calcular urgentes e não lidos
  const urgentTickets = useMemo(() => tickets.filter(t => t.priority === 'urgente').length, [tickets]);
  const unreadAnnouncements = useMemo(() => announcements.filter(a => a.type === 'urgente' || a.type === 'importante').length, [announcements]);

  // Usar alertas do dashboard
  useDashboardAlerts({
    openTickets: stats.openTickets,
    urgentTickets,
    pendingReservations: stats.pendingReservations,
    avgResolutionTime: stats.avgResolutionTime,
    unreadAnnouncements,
  });

  // Filtrar dados baseado na data range
  const filteredTickets = useMemo(() => {
    let cutoffDate: Date;
    
    if (customDateRange) {
      cutoffDate = customDateRange.start;
    } else {
      const days = parseInt(dateRange) || 1;
      cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
    }
    
    return tickets.filter(t => {
      const ticketDate = new Date(t.createdAt);
      if (customDateRange) {
        return ticketDate >= customDateRange.start && ticketDate <= customDateRange.end;
      }
      return ticketDate >= cutoffDate;
    });
  }, [tickets, dateRange, customDateRange]);

  const recentTickets = useMemo(() =>
    filteredTickets
      .filter(t => t.status !== 'arquivado')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5),
    [filteredTickets]
  );

  const pendingReservations = useMemo(() =>
    reservations
      .filter(r => r.status === 'solicitada')
      .slice(0, 4),
    [reservations]
  );

  const recentAnnouncements = useMemo(() =>
    announcements
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3),
    [announcements]
  );

  // Dados dos gráficos
  const ticketTrendData = useMemo(() => getTicketStatusTrendData(filteredTickets), [filteredTickets]);
  const priorityData = useMemo(() => {
    const data = getTicketPriorityDistribution(filteredTickets);
    return data.map((item, idx) => ({
      ...item,
      fill: CHART_COLORS[idx % CHART_COLORS.length],
    }));
  }, [filteredTickets]);
  
  const announcementData = useMemo(() => {
    const data = getAnnouncementTypeDistribution(announcements);
    return data.map((item, idx) => ({
      ...item,
      fill: CHART_COLORS[idx % CHART_COLORS.length],
    }));
  }, [announcements]);
  
  const resolutionTimeData = useMemo(() => {
    const data = getTicketResolutionTimeDistribution(filteredTickets);
    return data.map((item, idx) => ({
      ...item,
      fill: CHART_COLORS[idx % CHART_COLORS.length],
    }));
  }, [filteredTickets]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    
    try {
      // **NOVO**: Recarrega tickets da API
      await refetchTickets();
      updateTimestamp();
    } catch (error) {
      console.error('[Dashboard] Erro ao atualizar dados:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetchTickets, updateTimestamp]);

  // Usar hook de export
  const { exportTicketsToCSV, exportTicketsToPDF, exportReservationsToCSV, exportAnnouncementsToCSV } = useExport();

  const handleExport = useCallback((format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      exportTicketsToCSV(filteredTickets);
    } else if (format === 'pdf') {
      exportTicketsToPDF(filteredTickets);
    }
  }, [filteredTickets, exportTicketsToCSV, exportTicketsToPDF]);

  // Calcular trends
  const ticketTrend = useMemo(() => {
    const currentMonth = new Date();
    const previousMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    
    const current = filteredTickets.filter(t => t.status === 'resolvido').length;
    const previous = Math.max(1, Math.floor(current * 0.85)); // Simula dados anteriores
    
    return {
      value: Math.round(((current - previous) / previous) * 100),
      isPositive: current >= previous,
    };
  }, [filteredTickets]);

  // Insights
  const insights = useMemo(() => {
    const insights = [];
    
    if (stats.openTickets > 5) {
      insights.push({
        type: 'warning' as const,
        title: 'Volume alto de chamados',
        message: `Você tem ${stats.openTickets} chamados abertos. Considere priorizar os mais antigos.`,
      });
    }
    
    if (stats.avgResolutionTime > 24) {
      insights.push({
        type: 'tip' as const,
        title: 'Tempo de resolução elevado',
        message: `O tempo médio está em ${stats.avgResolutionTime}h. Revise os chamados em andamento.`,
      });
    }
    
    if (stats.pendingReservations > 3) {
      insights.push({
        type: 'info' as const,
        title: `${stats.pendingReservations} reservas aguardando`,
        message: 'Aprove ou rejeite as solicitações pendentes.',
      });
    }
    
    if (insights.length === 0) {
      insights.push({
        type: 'success' as const,
        title: 'Tudo em ordem!',
        message: 'Sua gestão está em dia e o fluxo de work está normalizado.',
      });
    }
    
    return insights.slice(0, 3);
  }, [stats]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Setup keyboard shortcuts
  const shortcutsConfig = [
    {
      key: 'r',
      description: 'Atualizar dashboard',
      callback: handleRefresh,
    },
    {
      key: 'f',
      description: 'Focar nos filtros',
      callback: () => {
        document.querySelector('input[placeholder*="Personalizado"]')?.focus();
      },
    },
    {
      key: 'e',
      description: 'Exportar dados',
      callback: () => {
        document.querySelector('button[title*="Export"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      },
    },
    {
      key: '?',
      description: 'Mostrar ajuda de atalhos',
      callback: () => showHelp(),
    },
  ];

  const { showHelp } = useKeyboardShortcuts(shortcutsConfig);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header com Filtros */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-2 border-b border-border/40">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Bem-vindo, {user?.name.split(' ')[0]}! 👋
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <p className="text-sm text-muted-foreground">
                {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
              </p>
              <div className="w-1 h-1 rounded-full bg-border" />
              <LastUpdateDisplay lastUpdate={lastUpdate} isRefreshing={refreshing} />
            </div>
          </div>
          <DashboardFilters
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            onDateRangeCustom={(start, end) => setCustomDateRange({ start, end })}
            onRefresh={handleRefresh}
            onExport={handleExport}
            isLoading={refreshing}
          />
        </div>

        {/* Insights - Reduzido e simplificado */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {insights.map((insight, idx) => (
            <InsightCard key={idx} {...insight} />
          ))}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <KPICard
            title="Chamados Abertos"
            value={stats.openTickets}
            icon={ClipboardList}
            description={`${stats.inProgressTickets} em andamento`}
            trend={ticketTrend}
            variant="info"
            isLoading={isLoading}
            onClick={() => setDrilldownModal({ open: true, type: 'tickets', title: 'Chamados Abertos' })}
          />
          <KPICard
            title="Resolvidos"
            value={stats.resolvedTickets}
            icon={CheckCircle2}
            description="Este período"
            trend={{ value: 12, isPositive: true }}
            variant="success"
            isLoading={isLoading}
            onClick={() => setDrilldownModal({ open: true, type: 'tickets', title: 'Chamados Resolvidos' })}
          />
          <KPICard
            title="Reservas Pendentes"
            value={stats.pendingReservations}
            icon={CalendarDays}
            description={`${stats.approvedReservations} aprovadas`}
            variant="warning"
            isLoading={isLoading}
            onClick={() => setDrilldownModal({ open: true, type: 'reservations', title: 'Reservas Pendentes' })}
          />
          <KPICard
            title="Tempo Médio"
            value={`${stats.avgResolutionTime}h`}
            icon={Clock}
            description="Resolução"
            trend={{ value: 8, isPositive: false }}
            variant="default"
            isLoading={isLoading}
            onClick={() => setDrilldownModal({ open: true, type: 'tickets', title: 'Tempo de Resolução' })}
          />
        </div>

        {/* Primary Charts - 3 gráficos essenciais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ticket Trend */}
          <ChartCard
            title="Evolução de Chamados"
            subtitle={`Últimos ${dateRange} dias`}
            icon={TrendingUp}
            isLoading={isLoading}
          >
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={ticketTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b"
                  style={{ fontSize: '12px', fontWeight: 500 }}
                  tick={{ fill: '#64748b' }}
                />
                <YAxis 
                  stroke="#64748b"
                  style={{ fontSize: '12px', fontWeight: 500 }}
                  tick={{ fill: '#64748b' }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    padding: '12px',
                  }}
                  labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Line 
                  type="monotone" 
                  dataKey="aberto" 
                  stroke={COLORS.primary}
                  name="Abertos"
                  strokeWidth={2}
                  isAnimationActive={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="em_andamento" 
                  stroke={COLORS.warning}
                  name="Em Andamento"
                  strokeWidth={2}
                  isAnimationActive={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="resolvido" 
                  stroke={COLORS.success}
                  name="Resolvidos"
                  strokeWidth={2}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Priority Distribution */}
          <ChartCard
            title="Prioridade dos Chamados"
            subtitle={`Total: ${filteredTickets.length}`}
            isLoading={isLoading}
            icon={BarChart3}
          >
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => {
                    if (value === 0) return '';
                    return `${name}: ${value}`;
                  }}
                  outerRadius={85}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={2}
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} chamado(s)`, 'Quantidade']}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    padding: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Resolution Time Distribution */}
          <ChartCard
            title="Tempo de Resolução"
            subtitle="Distribuição dos chamados"
            isLoading={isLoading}
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={resolutionTimeData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name"
                  stroke="#64748b"
                  style={{ fontSize: '12px', fontWeight: 500 }}
                  tick={{ fill: '#64748b' }}
                />
                <YAxis 
                  stroke="#64748b"
                  style={{ fontSize: '12px', fontWeight: 500 }}
                  tick={{ fill: '#64748b' }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    padding: '12px',
                  }}
                  formatter={(value) => [`${value} chamado(s)`, 'Total']}
                  labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
                />
                <Bar dataKey="value" fill={COLORS.info} radius={[8, 8, 0, 0]}>
                  {resolutionTimeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Announcement Types Distribution */}
          <ChartCard
            title="Avisos por Tipo"
            subtitle={`${announcements.length} avisos no total`}
            icon={Megaphone}
            isLoading={isLoading}
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={announcementData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name"
                  stroke="#64748b"
                  style={{ fontSize: '12px', fontWeight: 500 }}
                  tick={{ fill: '#64748b' }}
                />
                <YAxis 
                  stroke="#64748b"
                  style={{ fontSize: '12px', fontWeight: 500 }}
                  tick={{ fill: '#64748b' }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    padding: '12px',
                  }}
                  formatter={(value) => [`${value} aviso(s)`, 'Total']}
                  labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {announcementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Lists Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Tickets */}
          <Card className="lg:col-span-2 border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/40">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-primary" />
                Chamados Recentes
              </CardTitle>
              <Link to="/chamados">
                <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary/80">
                  Ver todos <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                {isLoading ? (
                  <>
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                  </>
                ) : recentTickets.length === 0 ? (
                  <EmptyState
                    icon={ClipboardList}
                    title="Sem chamados"
                    description="Nenhum chamado neste período."
                  />
                ) : (
                  recentTickets.map((ticket) => (
                    <Link key={ticket.id} to={`/chamados/${ticket.id}`}>
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group border border-transparent hover:border-border/50">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                            {ticket.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {ticket.createdByName} • {format(ticket.createdAt, "dd MMM", { locale: ptBR })}
                          </p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <StatusBadge status={ticket.status} />
                          <StatusBadge priority={ticket.priority} />
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pending Reservations */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/40">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-warning" />
                Reservas Pendentes
              </CardTitle>
              <Link to="/reservas">
                <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary/80">
                  Ver <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-4">
              {isLoading ? (
                <>
                  <CardSkeleton />
                  <CardSkeleton />
                </>
              ) : pendingReservations.length === 0 ? (
                <EmptyState
                  icon={CalendarDays}
                  title="Sem pendências"
                  description="Nenhuma solicitação aguardando."
                />
              ) : (
                <div className="space-y-2">
                  {pendingReservations.map((reservation) => (
                    <Link key={reservation.id} to={`/reservas/${reservation.id}`}>
                      <div className="p-3 rounded-lg bg-warning/5 border border-warning/20 hover:border-warning/50 hover:bg-warning/10 transition-all cursor-pointer group">
                        <div className="flex items-start gap-2 mb-1">
                          <AlertTriangle className="h-3 w-3 text-warning flex-shrink-0 mt-0.5" />
                          <p className="font-medium text-xs group-hover:text-primary transition-colors line-clamp-1">
                            {reservation.commonAreaName}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground ml-5">
                          Apt {reservation.unitNumber}
                        </p>
                        <p className="text-xs text-muted-foreground ml-5">
                          {format(new Date(reservation.date), "dd/MM")} às {reservation.startTime}h
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Announcements */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/40">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-primary" />
              Últimos Avisos
            </CardTitle>
            <Link to="/avisos">
              <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary/80">
                Ver todos <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : recentAnnouncements.length === 0 ? (
              <EmptyState
                icon={Megaphone}
                title="Sem avisos"
                description="Nenhum aviso publicado no momento."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentAnnouncements.map((announcement) => (
                  <Link key={announcement.id} to={`/avisos/${announcement.id}`}>
                    <div className="p-4 rounded-lg border border-border/50 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer group bg-muted/30">
                      <div className="flex items-center gap-2 mb-2">
                        <StatusBadge type={announcement.type} />
                        <span className="text-xs text-muted-foreground ml-auto">
                          {format(announcement.createdAt, "dd MMM", { locale: ptBR })}
                        </span>
                      </div>
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {announcement.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {announcement.content}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Drill-down Modals */}
      {drilldownModal.type === 'tickets' && (
        <DrilldownModal
          open={drilldownModal.open}
          onOpenChange={(open) => setDrilldownModal({ ...drilldownModal, open })}
          title={drilldownModal.title || 'Chamados'}
          type="tickets"
          data={drilldownModal.title === 'Chamados Resolvidos' ? filteredTickets.filter(t => t.status === 'resolvido') : filteredTickets}
          stats={{
            total: filteredTickets.length,
            pending: filteredTickets.filter(t => t.status === 'aberto').length,
            completed: filteredTickets.filter(t => t.status === 'resolvido').length,
            avgTime: stats.avgResolutionTime,
          }}
        />
      )}

      {drilldownModal.type === 'reservations' && (
        <DrilldownModal
          open={drilldownModal.open}
          onOpenChange={(open) => setDrilldownModal({ ...drilldownModal, open })}
          title={drilldownModal.title || 'Reservas'}
          type="reservations"
          data={reservations}
          stats={{
            total: reservations.length,
            pending: reservations.filter(r => r.status === 'solicitada').length,
            completed: reservations.filter(r => r.status === 'aprovada').length,
          }}
        />
      )}

      {drilldownModal.type === 'announcements' && (
        <DrilldownModal
          open={drilldownModal.open}
          onOpenChange={(open) => setDrilldownModal({ ...drilldownModal, open })}
          title={drilldownModal.title || 'Avisos'}
          type="announcements"
          data={announcements}
          stats={{
            total: announcements.length,
          }}
        />
      )}
    </AppLayout>
  );
}
