import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { useNotificationTrigger } from '@/hooks/useNotificationTrigger';
import { useEmailService } from '@/hooks/useEmailService';
import { useActivityLog } from '@/hooks/useActivityLog';
import { mockTickets } from '@/data/mockData';
import { Ticket, TicketStatus, TicketCategory, TicketPriority } from '@/types/condominium';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { createTicketSchema } from '@/lib/validationSchemas';
import { canChangeTicketStatus } from '@/lib/permissionUtils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, ClipboardList, MapPin, Calendar, MessageSquare, Send } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';
import { EmptyState } from '@/components/common/EmptyState';
import { CardSkeleton } from '@/components/common/LoadingSkeleton';
import { DataTableControls } from '@/components/common/DataTableControls';
import { MultiSelectFilter } from '@/components/common/MultiSelectFilter';
import { titleSchema, descriptionSchema } from '@/lib/validationSchemas';
import { cn } from '@/lib/utils';

const categoryLabels: Record<TicketCategory, string> = {
  manutencao: 'Manutenção',
  barulho: 'Barulho',
  seguranca: 'Segurança',
  administrativo: 'Administrativo',
  outro: 'Outro',
};

export default function Tickets() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const { ticketCreated, ticketStatusChanged, ticketCommentAdded } = useNotificationTrigger();
  const { sendTicketCreatedEmail, sendTicketUpdatedEmail } = useEmailService();
  const { logTicketCreated, logTicketStatusChanged, logTicketCommentAdded } = useActivityLog();
  const [tickets, setTickets] = useLocalStorage<Ticket[]>('syndika_tickets', mockTickets);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterPriority, setFilterPriority] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('recent');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'manutencao' as TicketCategory,
    priority: 'media' as TicketPriority,
    location: '',
  });

  const isSindico = user?.role === 'sindico' || user?.role === 'superadmin';

  // Filter tickets based on user role
  const userTickets = isSindico 
    ? tickets 
    : tickets.filter(t => t.createdBy === user?.id);

  const filteredTickets = userTickets.filter((ticket) => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus.length === 0 || filterStatus.includes(ticket.status);
    const matchesPriority = filterPriority.length === 0 || filterPriority.includes(ticket.priority);
    const matchesCategory = filterCategory.length === 0 || filterCategory.includes(ticket.category);
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Sort tickets
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'priority': {
        const priorityOrder = { urgente: 0, alta: 1, media: 2, baixa: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      default:
        return 0;
    }
  });

  const hasActiveFilters = 
    searchTerm.length > 0 ||
    filterStatus.length > 0 ||
    filterPriority.length > 0 ||
    filterCategory.length > 0;

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterStatus([]);
    setFilterPriority([]);
    setFilterCategory([]);
    setSortBy('recent');
  };  const handleCreateTicket = () => {
    try {
      // Validar usando schema do Zod
      const validation = createTicketSchema.safeParse({
        title: newTicket.title,
        description: newTicket.description,
        category: newTicket.category,
        priority: newTicket.priority,
        location: newTicket.location,
      });

      if (!validation.success) {
        const firstError = validation.error.errors[0];
        toast({
          title: 'Erro na validação',
          description: firstError.message,
          variant: 'destructive',
        });
        return;
      }

      const ticket: Ticket = {
        id: `ticket-${Date.now()}`,
        condominiumId: 'condo-1',
        title: newTicket.title,
        description: newTicket.description,
        category: newTicket.category,
        priority: newTicket.priority,
        status: 'aberto',
        location: newTicket.location,
        createdBy: user?.id || '',
        createdByName: user?.name || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setTickets([ticket, ...tickets]);
      setIsDialogOpen(false);
      setNewTicket({
        title: '',
        description: '',
        category: 'manutencao',
        priority: 'media',
        location: '',
      });

      // Trigger notification
      const notification = ticketCreated(ticket);
      addNotification(notification);

      // Send email to síndico
      const sindicoEmail = 'sindico@condominio.com.br';
      sendTicketCreatedEmail(sindicoEmail, ticket);

      // Log activity
      logTicketCreated(user?.id || '', user?.name || 'Desconhecido', ticket);

      toast({
        title: 'Chamado criado com sucesso!',
        description: 'O síndico será notificado por email.',
      });
    } catch (error) {
      console.error('Erro ao criar chamado:', error);
      toast({
        title: 'Erro ao criar chamado',
        description: 'Algo deu errado. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 250);
    return () => clearTimeout(t);
  }, []);

  const handleTitleChange = (value: string) => {
    setNewTicket({ ...newTicket, title: value });
    const res = titleSchema.safeParse(value);
    setTitleError(res.success ? null : res.error.errors[0].message);
  };

  const handleDescriptionChange = (value: string) => {
    setNewTicket({ ...newTicket, description: value });
    const res = descriptionSchema.safeParse(value);
    setDescriptionError(res.success ? null : res.error.errors[0].message);
  };

  const handleStatusChange = (ticketId: string, newStatus: TicketStatus) => {
    // Validar permissão
    if (!canChangeTicketStatus(mockTickets.find(t => t.id === ticketId) || { createdBy: '' } as Ticket, user)) {
      toast({
        title: 'Sem permissão',
        description: 'Você não tem permissão para alterar o status deste chamado.',
        variant: 'destructive',
      });
      return;
    }

    setTickets(tickets.map(t => {
      if (t.id === ticketId) {
        const updatedTicket = {
          ...t,
          status: newStatus,
          updatedAt: new Date(),
          resolvedAt: newStatus === 'resolvido' ? new Date() : t.resolvedAt,
        };

        // Trigger notification
        const notification = ticketStatusChanged(updatedTicket);
        addNotification(notification);

        // Send email about status change
        sendTicketUpdatedEmail('sindico@condominio.com.br', updatedTicket);

        // Log activity
        const oldStatus = t.status;
        logTicketStatusChanged(
          user?.id || '',
          user?.name || 'Desconhecido',
          ticketId,
          t.title,
          oldStatus,
          newStatus
        );

        return updatedTicket;
      }
      return t;
    }));

    if (selectedTicket?.id === ticketId) {
      setSelectedTicket({
        ...selectedTicket,
        status: newStatus,
        updatedAt: new Date(),
      });
    }

    toast({
      title: 'Status atualizado',
      description: `Chamado marcado como "${newStatus.replace('_', ' ')}".`,
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedTicket) return;

    const comment = {
      id: `comment-${Date.now()}`,
      ticketId: selectedTicket.id,
      authorId: user?.id || '',
      authorName: user?.name || '',
      content: newComment,
      createdAt: new Date(),
    };

    const updatedTicket = {
      ...selectedTicket,
      comments: [...(selectedTicket.comments || []), comment],
      updatedAt: new Date(),
    };

    setTickets(tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t));
    setSelectedTicket(updatedTicket);
    setNewComment('');

    // Trigger notification
    const notification = ticketCommentAdded(updatedTicket, comment);
    addNotification(notification);

    toast({
      title: 'Comentário adicionado',
    });
  };

  const statusCounts = {
    todos: userTickets.length,
    aberto: userTickets.filter(t => t.status === 'aberto').length,
    em_andamento: userTickets.filter(t => t.status === 'em_andamento').length,
    resolvido: userTickets.filter(t => t.status === 'resolvido').length,
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground flex items-center gap-2">
              <ClipboardList className="h-7 w-7 text-primary" />
              {isSindico ? 'Chamados' : 'Meus Chamados'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isSindico ? 'Gerencie as ocorrências do condomínio' : 'Acompanhe suas solicitações'}
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Chamado
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Abrir Novo Chamado</DialogTitle>
                <DialogDescription>
                  Descreva o problema ou solicitação. O síndico será notificado.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    placeholder="Resumo do problema"
                      value={newTicket.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className={cn(titleError && 'border-destructive')}
                  />
                    {titleError && <p className="text-xs text-destructive mt-1">{titleError}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Select
                      value={newTicket.category}
                      onValueChange={(value: TicketCategory) => 
                        setNewTicket({ ...newTicket, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manutencao">Manutenção</SelectItem>
                        <SelectItem value="barulho">Barulho</SelectItem>
                        <SelectItem value="seguranca">Segurança</SelectItem>
                        <SelectItem value="administrativo">Administrativo</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Prioridade</Label>
                    <Select
                      value={newTicket.priority}
                      onValueChange={(value: TicketPriority) => 
                        setNewTicket({ ...newTicket, priority: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixa">Baixa</SelectItem>
                        <SelectItem value="media">Média</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="urgente">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Local (opcional)</Label>
                  <Input
                    id="location"
                    placeholder="Ex: Garagem G15, Corredor 2º andar"
                    value={newTicket.location}
                    onChange={(e) => setNewTicket({ ...newTicket, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva detalhadamente o problema..."
                    rows={4}
                    value={newTicket.description}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    className={cn(descriptionError && 'border-destructive')}
                  />
                  {descriptionError && <p className="text-xs text-destructive mt-1">{descriptionError}</p>}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateTicket}
                  disabled={!!titleError || !!descriptionError || !newTicket.title.trim() || !newTicket.description.trim()}
                >
                  Abrir Chamado
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Data Table Controls - Search, Sort, Filter */}
        <DataTableControls
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Buscar por título, descrição ou local..."
          
          sortOptions={[
            { value: 'recent', label: 'Mais recentes' },
            { value: 'oldest', label: 'Mais antigos' },
            { value: 'priority', label: 'Por prioridade' },
          ]}
          sortValue={sortBy}
          onSortChange={setSortBy}
          
          activeFilterCount={
            filterStatus.length + 
            filterPriority.length + 
            filterCategory.length
          }
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
          
          filterContent={
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-3">Status</h4>
                <MultiSelectFilter
                  options={[
                    { value: 'aberto', label: `Abertos (${statusCounts.aberto})` },
                    { value: 'em_andamento', label: `Andamento (${statusCounts.em_andamento})` },
                    { value: 'resolvido', label: `Resolvidos (${statusCounts.resolvido})` },
                  ]}
                  selected={filterStatus}
                  onChange={setFilterStatus}
                />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-3">Prioridade</h4>
                <MultiSelectFilter
                  options={[
                    { value: 'baixa', label: 'Baixa' },
                    { value: 'media', label: 'Média' },
                    { value: 'alta', label: 'Alta' },
                    { value: 'urgente', label: 'Urgente' },
                  ]}
                  selected={filterPriority}
                  onChange={setFilterPriority}
                />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-3">Categoria</h4>
                <MultiSelectFilter
                  options={[
                    { value: 'manutencao', label: 'Manutenção' },
                    { value: 'barulho', label: 'Barulho' },
                    { value: 'seguranca', label: 'Segurança' },
                    { value: 'administrativo', label: 'Administrativo' },
                    { value: 'outro', label: 'Outro' },
                  ]}
                  selected={filterCategory}
                  onChange={setFilterCategory}
                />
              </div>
            </div>
          }
        />

        {/* Tickets List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : filteredTickets.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="Nenhum chamado encontrado"
              description={searchTerm || filterStatus !== 'todos' ? 'Tente ajustar os filtros de busca.' : 'Crie um novo chamado para começar.'}
              action={{ label: 'Abrir Chamado', onClick: () => setIsDialogOpen(true) }}
            />
          ) : (
            filteredTickets.map((ticket, index) => (
              <Card 
                key={ticket.id} 
                className="shadow-card card-hover cursor-pointer animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setSelectedTicket(ticket)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-medium">{ticket.title}</h3>
                        <StatusBadge status={ticket.status} />
                        <StatusBadge priority={ticket.priority} />
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {ticket.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="bg-muted px-2 py-1 rounded">
                          {categoryLabels[ticket.category]}
                        </span>
                        {ticket.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {ticket.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(ticket.createdAt, "dd/MM/yyyy")}
                        </span>
                        {ticket.comments && ticket.comments.length > 0 && (
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {ticket.comments.length}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Ticket Detail Sheet */}
        <Sheet open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
          <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
            {selectedTicket && (
              <>
                <SheetHeader>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={selectedTicket.status} />
                    <StatusBadge priority={selectedTicket.priority} />
                  </div>
                  <SheetTitle className="text-left">{selectedTicket.title}</SheetTitle>
                  <SheetDescription className="text-left">
                    Aberto por {selectedTicket.createdByName} em{' '}
                    {format(selectedTicket.createdAt, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  {/* Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Categoria:</span>
                      <span className="font-medium">{categoryLabels[selectedTicket.category]}</span>
                    </div>
                    {selectedTicket.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedTicket.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="font-medium mb-2">Descrição</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {selectedTicket.description}
                    </p>
                  </div>

                  {/* Status Change (Síndico only) */}
                  {isSindico && (
                    <div>
                      <h4 className="font-medium mb-2">Alterar Status</h4>
                      <Select
                        value={selectedTicket.status}
                        onValueChange={(value: TicketStatus) => 
                          handleStatusChange(selectedTicket.id, value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aberto">Aberto</SelectItem>
                          <SelectItem value="em_andamento">Em andamento</SelectItem>
                          <SelectItem value="aguardando">Aguardando</SelectItem>
                          <SelectItem value="resolvido">Resolvido</SelectItem>
                          <SelectItem value="arquivado">Arquivado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Comments */}
                  <div>
                    <h4 className="font-medium mb-3">Comentários</h4>
                    <div className="space-y-3 mb-4">
                      {(!selectedTicket.comments || selectedTicket.comments.length === 0) ? (
                        <p className="text-sm text-muted-foreground">
                          Nenhum comentário ainda.
                        </p>
                      ) : (
                        selectedTicket.comments.map((comment) => (
                          <div key={comment.id} className="bg-muted rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm">{comment.authorName}</span>
                              <span className="text-xs text-muted-foreground">
                                {format(comment.createdAt, "dd/MM HH:mm")}
                              </span>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                        ))
                      )}
                    </div>
                    
                    {/* Add Comment */}
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Adicionar comentário..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={2}
                        className="flex-1"
                      />
                      <Button 
                        size="icon" 
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </AppLayout>
  );
}
