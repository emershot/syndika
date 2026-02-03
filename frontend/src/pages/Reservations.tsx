import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { useNotificationTrigger } from '@/hooks/useNotificationTrigger';
import { useActivityLog } from '@/hooks/useActivityLog';
import { useEmailService } from '@/hooks/useEmailService';
import { mockReservations, mockCommonAreas } from '@/data/mockData';
import { Reservation, ReservationStatus, CommonArea } from '@/types/condominium';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, CalendarDays, Clock, User, Check, X, Search, Grid, Download } from 'lucide-react';
import { format, startOfDay, endOfDay } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { EmptyState } from '@/components/common/EmptyState';
import { CardSkeleton } from '@/components/common/LoadingSkeleton';
import { NewReservationModal } from '@/components/common/NewReservationModal';
import { ReservationMiniCalendar } from '@/components/common/ReservationMiniCalendar';
import { canApproveReservation } from '@/lib/permissionUtils';

export default function Reservations() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const { reservationCreated, reservationStatusChanged } = useNotificationTrigger();
  const { logReservationApproved, logReservationRejected } = useActivityLog();
  const { sendReservationApprovedEmail, sendReservationRejectedEmail } = useEmailService();
  const [reservations, setReservations] = useLocalStorage<Reservation[]>('syndika_reservations', mockReservations);
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [isNewReservationOpen, setIsNewReservationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [pendingRejectionId, setPendingRejectionId] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [pendingCancelId, setPendingCancelId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState<Date>();
  const [filterDateTo, setFilterDateTo] = useState<Date>();
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | undefined>(undefined);
  const [filterCommonArea, setFilterCommonArea] = useState<string | undefined>(undefined);

  const isSindico = user?.role === 'sindico' || user?.role === 'superadmin';

  // Filter reservations based on user role
  const userReservations = isSindico 
    ? reservations 
    : reservations.filter(r => r.requestedBy === user?.id);

  const filteredReservations = userReservations.filter((res) => {
    // Filter by status
    const matchesStatus = filterStatus === 'todos' || res.status === filterStatus;

    // Filter by search term (name, apt, area)
    const matchesSearch = searchTerm === '' || 
      res.requestedByName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.commonAreaName.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by date range or selected calendar date
    const matchesDateRange = selectedCalendarDate
      ? startOfDay(res.date).getTime() === startOfDay(selectedCalendarDate).getTime()
      : (!filterDateFrom || startOfDay(res.date) >= startOfDay(filterDateFrom)) &&
        (!filterDateTo || endOfDay(res.date) <= endOfDay(filterDateTo));

    // Filter by common area
    const matchesArea = !filterCommonArea || res.commonAreaId === filterCommonArea;

    return matchesStatus && matchesSearch && matchesDateRange && matchesArea;
  });

  const handleCreateReservation = (data: {
    commonAreaId: string;
    date: Date;
    startTime: string;
    endTime: string;
    purpose: string;
  }) => {
    try {
      const area = mockCommonAreas.find(a => a.id === data.commonAreaId);

      const reservation: Reservation = {
        id: `res-${Date.now()}`,
        condominiumId: 'condo-1',
        commonAreaId: data.commonAreaId,
        commonAreaName: area?.name || '',
        unitId: user?.unitId || 'unit-1',
        unitNumber: '101-A',
        requestedBy: user?.id || '',
        requestedByName: user?.name || '',
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        purpose: data.purpose,
        status: 'solicitada',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setReservations([reservation, ...reservations]);
      
      // Trigger notification
      const notification = reservationCreated(area?.name || '', data.date.toLocaleDateString());
      addNotification(notification);

      toast({
        title: '✓ Reserva solicitada com sucesso!',
        description: 'Aguarde a aprovação do síndico.',
      });
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      toast({
        title: 'Erro ao criar reserva',
        description: 'Algo deu errado. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    // Em produção, mostrar skeleton por 1s; em dev, 250ms
    const delay = import.meta.env.PROD ? 1000 : 250;
    const t = setTimeout(() => setIsLoading(false), delay);
    return () => clearTimeout(t);
  }, []);

  const handleApproveReservation = (reservationId: string) => {
    const reservation = reservations.find(r => r.id === reservationId);
    if (!reservation) return;

    if (!isSindico) {
      toast({
        title: 'Sem permissão',
        description: 'Apenas síndicos podem aprovar reservas.',
        variant: 'destructive',
      });
      return;
    }

    const updatedReservations = reservations.map(r => {
      if (r.id === reservationId) {
        const updated = {
          ...r,
          status: 'aprovada' as ReservationStatus,
          updatedAt: new Date(),
          approvedBy: user?.id,
          approvedByName: user?.name,
          approvalDate: new Date(),
        };

        // Log activity
        logReservationApproved(user?.id || '', reservation.commonAreaName, reservationId);
        
        // Send email
        sendReservationApprovedEmail(
          reservation.requestedByName,
          reservation.commonAreaName,
          format(reservation.date, 'dd/MM/yyyy'),
          reservation.startTime,
          reservation.endTime
        );
        
        // Trigger notification
        const notification = reservationStatusChanged(updated, 'aprovada');
        addNotification(notification);

        return updated;
      }
      return r;
    });

    setReservations(updatedReservations);

    toast({
      title: '✓ Reserva aprovada com sucesso!',
    });
  };

  const handleInitiateRejection = (reservationId: string) => {
    setPendingRejectionId(reservationId);
    setRejectionReason('');
    setRejectionDialogOpen(true);
  };

  const handleConfirmRejection = () => {
    if (!rejectionReason.trim()) {
      toast({
        title: 'Campo obrigatório',
        description: 'Informe o motivo da recusa.',
        variant: 'destructive',
      });
      return;
    }

    if (!pendingRejectionId) return;

    const reservation = reservations.find(r => r.id === pendingRejectionId);
    if (!reservation) return;

    const updatedReservations = reservations.map(r => {
      if (r.id === pendingRejectionId) {
        const updated = {
          ...r,
          status: 'recusada' as ReservationStatus,
          rejectionReason: rejectionReason,
          rejectedBy: user?.id,
          rejectedByName: user?.name,
          rejectionDate: new Date(),
          updatedAt: new Date(),
        };

        // Log activity
        logReservationRejected(user?.id || '', reservation.commonAreaName, pendingRejectionId, rejectionReason);
        
        // Send rejection email
        sendReservationRejectedEmail(
          reservation.requestedByName,
          reservation.commonAreaName,
          format(reservation.date, 'dd/MM/yyyy'),
          rejectionReason
        );
        
        // Trigger notification
        const notification = reservationStatusChanged(updated, 'recusada');
        addNotification(notification);

        return updated;
      }
      return r;
    });

    setReservations(updatedReservations);
    setRejectionDialogOpen(false);
    setPendingRejectionId(null);
    setRejectionReason('');

    toast({
      title: '✓ Reserva recusada',
      description: 'Notificação enviada ao solicitante.',
    });
  };

  const statusCounts = {
    todos: userReservations.length,
    solicitada: userReservations.filter(r => r.status === 'solicitada').length,
    aprovada: userReservations.filter(r => r.status === 'aprovada').length,
  };

  const handleStatusChange = (reservationId: string, newStatus: ReservationStatus) => {
    const reservation = reservations.find(r => r.id === reservationId);
    if (!reservation) return;

    if (newStatus === 'cancelada' && reservation.requestedBy !== user?.id) {
      toast({
        title: 'Sem permissão',
        description: 'Você pode cancelar apenas suas próprias reservas.',
        variant: 'destructive',
      });
      return;
    }

    // Guardar estado anterior para undo
    const previousStatus = reservation.status;
    const previousReservations = reservations;

    setReservations(
      reservations.map(r => {
        if (r.id === reservationId) {
          return {
            ...r,
            status: newStatus,
            updatedAt: new Date(),
          };
        }
        return r;
      })
    );

    // Toast com opção de undo para cancelamentos
    if (newStatus === 'cancelada') {
      toast({
        title: '✓ Reserva cancelada com sucesso!',
        description: 'Você pode desfazer essa ação nos próximos 30 segundos.',
        action: {
          label: 'Desfazer',
          onClick: () => {
            setReservations(previousReservations);
            toast({
              title: 'Cancelamento desfeito',
              description: 'A reserva foi restaurada.',
            });
          },
        },
      });
    } else {
      toast({
        title: '✓ Status atualizado com sucesso!',
      });
    }
  };

  const handleInitiateCancellation = (reservationId: string) => {
    setPendingCancelId(reservationId);
    setCancelDialogOpen(true);
  };

  const handleConfirmCancellation = () => {
    if (!pendingCancelId) return;
    handleStatusChange(pendingCancelId, 'cancelada');
    setCancelDialogOpen(false);
    setPendingCancelId(null);
  };

  const handleExportCSV = () => {
    // Header do CSV
    const headers = ['ID', 'Área', 'Solicitante', 'Apartamento', 'Data', 'Horário', 'Finalidade', 'Status', 'Aprovado por', 'Recusado por', 'Motivo recusa'];
    
    // Dados
    const rows = filteredReservations.map(r => [
      r.id,
      r.commonAreaName,
      r.requestedByName,
      r.unitNumber,
      format(r.date, 'dd/MM/yyyy'),
      `${r.startTime} - ${r.endTime}`,
      r.purpose || '-',
      r.status,
      r.approvedByName || '-',
      r.rejectedByName || '-',
      r.rejectionReason || '-',
    ]);

    // Montar CSV
    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reservas-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: '✓ Arquivo exportado com sucesso!',
      description: `${filteredReservations.length} reservas exportadas`,
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground flex items-center gap-2">
              <CalendarDays className="h-7 w-7 text-primary" />
              {isSindico ? 'Reservas' : 'Minhas Reservas'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isSindico ? 'Gerencie as reservas de áreas comuns' : 'Solicite e acompanhe suas reservas'}
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            {isSindico && (
              <Button
                variant="outline"
                onClick={handleExportCSV}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Exportar CSV
              </Button>
            )}
            <Button
              onClick={() => setIsNewReservationOpen(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Nova Reserva
            </Button>
          </div>
        </div>

        {/* Modal de Nova Reserva */}
        <NewReservationModal
          isOpen={isNewReservationOpen}
          onOpenChange={setIsNewReservationOpen}
          commonAreas={mockCommonAreas}
          reservations={reservations}
          userId={user?.id || ''}
          userName={user?.name || ''}
          onSubmit={handleCreateReservation}
        />

        {/* Filtros de Busca e Data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Busca por nome/apt/área */}
          <div className="flex items-center gap-2 border border-input rounded-lg px-3 py-2 bg-background">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nome, apt ou área..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-sm placeholder-muted-foreground focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filtro data de */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">De:</label>
            <input
              type="date"
              value={filterDateFrom ? format(filterDateFrom, 'yyyy-MM-dd') : ''}
              onChange={(e) => {
                if (!e.target.value) {
                  setFilterDateFrom(undefined);
                } else {
                  // Parsear data corretamente (evitar timezone shift)
                  const [year, month, day] = e.target.value.split('-').map(Number);
                  setFilterDateFrom(new Date(year, month - 1, day, 0, 0, 0));
                }
              }}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Filtro data até */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Até:</label>
            <input
              type="date"
              value={filterDateTo ? format(filterDateTo, 'yyyy-MM-dd') : ''}
              onChange={(e) => {
                if (!e.target.value) {
                  setFilterDateTo(undefined);
                } else {
                  // Parsear data corretamente (evitar timezone shift)
                  const [year, month, day] = e.target.value.split('-').map(Number);
                  // Set end of day para incluir todo o dia
                  setFilterDateTo(new Date(year, month - 1, day, 23, 59, 59));
                }
              }}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Info de filtros aplicados */}
        {(searchTerm || filterDateFrom || filterDateTo || selectedCalendarDate || filterCommonArea) && (
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <span>Filtros aplicados:</span>
            {searchTerm && <span className="bg-muted px-2 py-1 rounded">{searchTerm}</span>}
            {selectedCalendarDate && <span className="bg-primary/10 text-primary px-2 py-1 rounded font-medium">📅 {format(selectedCalendarDate, 'dd/MM/yyyy')}</span>}
            {!selectedCalendarDate && filterDateFrom && <span className="bg-muted px-2 py-1 rounded">De {format(filterDateFrom, 'dd/MM')}</span>}
            {!selectedCalendarDate && filterDateTo && <span className="bg-muted px-2 py-1 rounded">Até {format(filterDateTo, 'dd/MM')}</span>}
            {filterCommonArea && <span className="bg-muted px-2 py-1 rounded">{mockCommonAreas.find(a => a.id === filterCommonArea)?.name}</span>}
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterDateFrom(undefined);
                setFilterDateTo(undefined);
                setSelectedCalendarDate(undefined);
                setFilterCommonArea(undefined);
              }}
              className="text-primary hover:underline ml-auto"
            >
              Limpar filtros
            </button>
          </div>
        )}

        {/* Common Areas Quick View */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockCommonAreas.map((area) => (
            <Card 
              key={area.id} 
              className="shadow-card card-hover cursor-pointer transition-all hover:shadow-lg hover:scale-105"
              onClick={() => {
                setIsNewReservationOpen(true);
                // Pré-selecionar a área será feito na modal com um state
              }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{area.name}</CardTitle>
                <CardDescription className="text-xs line-clamp-2">
                  {area.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {area.openTime} - {area.closeTime}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={filterStatus} onValueChange={setFilterStatus} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="todos">
              Todas ({statusCounts.todos})
            </TabsTrigger>
            <TabsTrigger value="solicitada">
              Pendentes ({statusCounts.solicitada})
            </TabsTrigger>
            <TabsTrigger value="aprovada">
              Aprovadas ({statusCounts.aprovada})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Main Layout with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-3">
            {isLoading ? (
              <div className="space-y-3">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : filteredReservations.length === 0 ? (
              <EmptyState
                icon={CalendarDays}
                title="Nenhuma reserva encontrada"
                description="Solicite uma nova reserva para começar."
                action={{ label: 'Solicitar Reserva', onClick: () => setIsNewReservationOpen(true) }}
              />
            ) : (
              filteredReservations.map((reservation, index) => (
                <Card 
                  key={reservation.id} 
                  className="shadow-card animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-medium truncate">{reservation.commonAreaName}</h3>
                          <StatusBadge status={reservation.status} />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-1 sm:gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1 whitespace-nowrap">
                            <CalendarDays className="h-4 w-4 flex-shrink-0" />
                            {format(reservation.date, "dd/MM/yyyy")}
                          </span>
                          <span className="flex items-center gap-1 whitespace-nowrap">
                            <Clock className="h-4 w-4 flex-shrink-0" />
                            {reservation.startTime} - {reservation.endTime}
                          </span>
                          <span className="flex items-center gap-1 truncate">
                            <User className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{reservation.requestedByName} • Apt {reservation.unitNumber}</span>
                          </span>
                        </div>
                        {reservation.purpose && (
                          <p className="text-sm text-muted-foreground mt-2">
                            <span className="font-medium">Finalidade:</span> {reservation.purpose}
                          </p>
                        )}
                        {reservation.status === 'aprovada' && reservation.approvedByName && (
                          <p className="text-sm text-success mt-2">
                            <span className="font-medium">Aprovado por:</span> {reservation.approvedByName}
                            {reservation.approvalDate && ` em ${format(reservation.approvalDate, 'dd/MM/yyyy HH:mm')}`}
                          </p>
                        )}
                        {reservation.status === 'recusada' && reservation.rejectedByName && (
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-destructive">
                              <span className="font-medium">Recusado por:</span> {reservation.rejectedByName}
                              {reservation.rejectionDate && ` em ${format(reservation.rejectionDate, 'dd/MM/yyyy HH:mm')}`}
                            </p>
                            {reservation.rejectionReason && (
                              <p className="text-sm text-destructive">
                                <span className="font-medium">Motivo:</span> {reservation.rejectionReason}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Actions for pending reservations (Síndico only) */}
                      {isSindico && reservation.status === 'solicitada' && (
                        <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-success border-success hover:bg-success hover:text-success-foreground w-full sm:w-auto"
                            onClick={() => handleApproveReservation(reservation.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Aprovar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground w-full sm:w-auto"
                            onClick={() => handleInitiateRejection(reservation.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Recusar
                          </Button>
                        </div>
                      )}
                      {/* Cancel button for user's own pending reservations */}
                      {!isSindico && reservation.status === 'solicitada' && reservation.requestedBy === user?.id && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive w-full sm:w-auto mt-4 sm:mt-0"
                          onClick={() => handleInitiateCancellation(reservation.id)}
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Sidebar with Mini Calendar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <ReservationMiniCalendar
                reservations={userReservations}
                selectedDate={selectedCalendarDate}
                onSelectDate={(date) => {
                  // Se clicar na mesma data, desseleciona
                  if (selectedCalendarDate && startOfDay(date).getTime() === startOfDay(selectedCalendarDate).getTime()) {
                    setSelectedCalendarDate(undefined);
                  } else {
                    setSelectedCalendarDate(date);
                    // Limpar filtros de range ao selecionar data específica
                    setFilterDateFrom(undefined);
                    setFilterDateTo(undefined);
                  }
                }}
                commonAreas={mockCommonAreas}
                selectedCommonArea={filterCommonArea}
                onSelectCommonArea={setFilterCommonArea}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Reason Dialog */}
      <AlertDialog open={rejectionDialogOpen} onOpenChange={setRejectionDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Recusar Reserva</AlertDialogTitle>
          </AlertDialogHeader>
          
          {/* Contexto da Reserva */}
          {pendingRejectionId && reservations.find(r => r.id === pendingRejectionId) && (
            <div className="bg-muted rounded-lg p-3 space-y-2 my-4 border border-border">
              {(() => {
                const res = reservations.find(r => r.id === pendingRejectionId);
                return (
                  <>
                    <div>
                      <p className="text-xs text-muted-foreground">Solicitante</p>
                      <p className="font-medium text-sm">{res?.requestedByName} • Apt {res?.unitNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Área Comum</p>
                      <p className="font-medium text-sm">{res?.commonAreaName}</p>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Data</p>
                        <p className="font-medium text-sm">{res?.date ? format(res.date, 'dd/MM/yyyy') : '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Horário</p>
                        <p className="font-medium text-sm">{res?.startTime} - {res?.endTime}</p>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Motivo da recusa <span className="text-destructive">*</span></label>
            <textarea
              className="w-full min-h-[80px] p-3 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              placeholder="Ex: Data já reservada, conflito com outra solicitação, etc."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>

          <AlertDialogCancel>Voltar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmRejection}
            className="bg-destructive hover:bg-destructive/90"
          >
            Confirmar Recusa
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Reservation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Reserva</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar esta reserva? Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Voltar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmCancellation}
            className="bg-destructive hover:bg-destructive/90"
          >
            Confirmar Cancelamento
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
