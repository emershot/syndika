import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { useNotificationTrigger } from '@/hooks/useNotificationTrigger';
import { useEmailService } from '@/hooks/useEmailService';
import { useActivityLog } from '@/hooks/useActivityLog';
import { mockAnnouncements } from '@/data/mockData';
import { Announcement, AnnouncementType } from '@/types/condominium';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { createAnnouncementSchema } from '@/lib/validationSchemas';
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
import { Plus, Search, Megaphone, Calendar, User, Trash2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';
import { EmptyState } from '@/components/common/EmptyState';
import { CardSkeleton } from '@/components/common/LoadingSkeleton';
import { DataTableControls } from '@/components/common/DataTableControls';
import { MultiSelectFilter } from '@/components/common/MultiSelectFilter';
import { titleSchema, descriptionSchema } from '@/lib/validationSchemas';
import { cn } from '@/lib/utils';
import { canEditAnnouncement, canDeleteAnnouncement, canCreateAnnouncement } from '@/lib/permissionUtils';

export default function Announcements() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const { announceCreated, announceUpdated, announceDeleted } = useNotificationTrigger();
  const { sendAnnouncementPublishedEmail } = useEmailService();
  const { logAnnouncementCreated, logAnnouncementUpdated, logAnnouncementDeleted } = useActivityLog();
  const [announcements, setAnnouncements] = useLocalStorage<Announcement[]>('syndika_announcements', mockAnnouncements);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('recent');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: 'informativo' as AnnouncementType,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredAnnouncements = announcements.filter((ann) => {
    const matchesSearch = ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ann.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType.length === 0 || filterType.includes(ann.type);
    return matchesSearch && matchesType;
  });

  // Sort announcements
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      default:
        return 0;
    }
  });

  const hasActiveFilters = searchTerm.length > 0 || filterType.length > 0;

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterType([]);
  };

  const handleCreateAnnouncement = () => {
    try {
      // ✅ Validar permissão
      if (!canCreateAnnouncement(user)) {
        toast({
          title: 'Sem permissão',
          description: 'Você não tem permissão para criar avisos.',
          variant: 'destructive',
        });
        return;
      }

      // Validar usando schema do Zod
      const validation = createAnnouncementSchema.safeParse({
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        type: newAnnouncement.type,
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

      const announcement: Announcement = {
        id: `ann-${Date.now()}`,
        condominiumId: 'condo-1',
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        type: newAnnouncement.type,
        authorId: user?.id || '',
        authorName: user?.name || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setAnnouncements([announcement, ...announcements]);
      
      // Trigger notification
      const notification = announceCreated(newAnnouncement.title, announcement.id);
      addNotification(notification);
      
      // Send email to all residents
      const moradoresEmails = ['morador1@email.com', 'morador2@email.com'];
      sendAnnouncementPublishedEmail(moradoresEmails, announcement);

      // Log activity
      logAnnouncementCreated(user?.id || '', user?.name || 'Desconhecido', announcement);
      
      setIsDialogOpen(false);
      setNewAnnouncement({ title: '', content: '', type: 'informativo' });

      toast({
        title: 'Aviso publicado!',
        description: 'Os moradores serão notificados por email.',
      });
    } catch (error) {
      console.error('Erro ao criar aviso:', error);
      toast({
        title: 'Erro ao publicar',
        description: 'Algo deu errado. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleEditAnnouncement = (announcementId: string) => {
    const announcement = announcements.find(a => a.id === announcementId);
    if (!announcement) return;

    // ✅ Validar permissão
    if (!canEditAnnouncement(announcement, user)) {
      toast({
        title: 'Sem permissão',
        description: 'Você não tem permissão para editar este aviso.',
        variant: 'destructive',
      });
      return;
    }

    // Preencher form com dados do aviso
    setNewAnnouncement({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
    });
    setEditingId(announcementId);
    setIsDialogOpen(true);
  };

  const handleDeleteAnnouncement = (announcementId: string) => {
    const announcement = announcements.find(a => a.id === announcementId);
    if (!announcement) return;

    // ✅ Validar permissão
    if (!canDeleteAnnouncement(announcement, user)) {
      toast({
        title: 'Sem permissão',
        description: 'Você não tem permissão para deletar este aviso.',
        variant: 'destructive',
      });
      return;
    }

    setAnnouncements(announcements.filter(a => a.id !== announcementId));
    
    // Trigger notification
    const notification = announceDeleted(announcement.title);
    addNotification(notification);
    
    toast({
      title: 'Aviso deletado',
      description: 'O aviso foi removido com sucesso.',
    });
  };

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 250);
    return () => clearTimeout(t);
  }, []);

  // Inline validation handlers
  const handleTitleChange = (value: string) => {
    setNewAnnouncement({ ...newAnnouncement, title: value });
    const res = titleSchema.safeParse(value);
    setTitleError(res.success ? null : res.error.errors[0].message);
  };

  const handleContentChange = (value: string) => {
    setNewAnnouncement({ ...newAnnouncement, content: value });
    const res = descriptionSchema.safeParse(value);
    setContentError(res.success ? null : res.error.errors[0].message);
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground flex items-center gap-2">
              <Megaphone className="h-7 w-7 text-primary" />
              Mural de Avisos
            </h1>
            <p className="text-muted-foreground mt-1">
              Comunicados oficiais do condomínio
            </p>
          </div>

          {canCreateAnnouncement(user) && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Aviso
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Criar Novo Aviso</DialogTitle>
                  <DialogDescription>
                    O aviso será publicado para todos os moradores do condomínio.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Manutenção programada"
                      value={newAnnouncement.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className={cn(titleError && 'border-red-500')}
                    />
                    {titleError && <p className="text-sm text-red-500 mt-1">{titleError}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo do Aviso</Label>
                    <Select
                      value={newAnnouncement.type}
                      onValueChange={(value: AnnouncementType) => 
                        setNewAnnouncement({ ...newAnnouncement, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="informativo">Informativo</SelectItem>
                        <SelectItem value="importante">Importante</SelectItem>
                        <SelectItem value="urgente">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Conteúdo</Label>
                    <Textarea
                      id="content"
                      placeholder="Descreva o aviso..."
                      rows={5}
                      value={newAnnouncement.content}
                      onChange={(e) => handleContentChange(e.target.value)}
                      className={cn(contentError && 'border-red-500')}
                    />
                    {contentError && <p className="text-sm text-red-500 mt-1">{contentError}</p>}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleCreateAnnouncement}
                    disabled={!!titleError || !!contentError || !newAnnouncement.title.trim() || !newAnnouncement.content.trim()}
                  >
                    Publicar Aviso
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Data Table Controls - Search, Sort, Filter */}
        <DataTableControls
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Buscar por título ou conteúdo..."
          
          sortOptions={[
            { value: 'recent', label: 'Mais recentes' },
            { value: 'oldest', label: 'Mais antigos' },
          ]}
          sortValue={sortBy}
          onSortChange={setSortBy}
          
          activeFilterCount={filterType.length}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
          
          filterContent={
            <div className="grid grid-cols-1 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-3">Tipo de Aviso</h4>
                <MultiSelectFilter
                  options={[
                    { value: 'urgente', label: 'Urgente' },
                    { value: 'importante', label: 'Importante' },
                    { value: 'informativo', label: 'Informativo' },
                  ]}
                  selected={filterType}
                  onChange={setFilterType}
                />
              </div>
            </div>
          }
        />

        {/* Announcements List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : sortedAnnouncements.length === 0 ? (
            <EmptyState
              icon={Megaphone}
              title="Nenhum aviso encontrado"
              description={searchTerm || filterType.length > 0 ? 'Tente ajustar os filtros de busca.' : 'Os avisos do condomínio aparecerão aqui.'}
              action={{ label: 'Criar Aviso', onClick: () => setIsDialogOpen(true) }}
            />
          ) : (
            sortedAnnouncements.map((announcement, index) => (
              <Card 
                key={announcement.id} 
                className="shadow-card card-hover animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <StatusBadge type={announcement.type} />
                      </div>
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                    </div>
                    {canEditAnnouncement(announcement, user) && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditAnnouncement(announcement.id)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteAnnouncement(announcement.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 whitespace-pre-wrap mb-4">
                    {announcement.content}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {announcement.authorName}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(announcement.createdAt, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
