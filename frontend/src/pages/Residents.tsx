import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useNotifications } from '@/hooks/useNotifications';
import { useNotificationTrigger } from '@/hooks/useNotificationTrigger';
import { mockUsers, mockUnits } from '@/data/mockData';
import { User } from '@/types/condominium';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useFormError } from '@/hooks/useFormError';
import { createUserSchema, nameSchema, emailSchema, phoneSchema } from '@/lib/validationSchemas';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/common/EmptyState';
import { TableSkeleton } from '@/components/common/LoadingSkeleton';
import { DataTableControls } from '@/components/common/DataTableControls';
import { MultiSelectFilter } from '@/components/common/MultiSelectFilter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneInput } from '@/components/forms/PhoneInput';
import { isValidPhone, formatPhone } from '@/lib/phoneUtils';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Search, Users, Mail, Phone, Home, UserPlus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const roleLabels = {
  superadmin: 'Super Admin',
  sindico: 'Síndico',
  conselho: 'Conselho',
  morador: 'Morador',
};

export default function Residents() {
  const { addNotification } = useNotifications();
  const { residentCreated, residentUpdated } = useNotificationTrigger();
  const [users, setUsers] = useLocalStorage<User[]>('syndika_users', mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('recent');
  const [isLoading, setIsLoading] = useState(true);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    unitId: '',
    role: 'morador' as User['role'],
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole.length === 0 || filterRole.includes(user.role);
    return matchesSearch && matchesRole;
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const hasActiveFilters = searchTerm.length > 0 || filterRole.length > 0;

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterRole([]);
  };

  useEffect(() => {
    // Small polished loading on first render
    const t = setTimeout(() => setIsLoading(false), 250);
    return () => clearTimeout(t);
  }, []);

  const getUnitLabel = (unitId?: string) => {
    const unit = mockUnits.find(u => u.id === unitId);
    return unit ? `${unit.number}${unit.block ? ` - Bloco ${unit.block}` : ''}` : '-';
  };

  const handleCreateUser = () => {
    try {
      // Validar usando schema do Zod
      const validation = createUserSchema.safeParse({
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        unitId: newUser.unitId || undefined,
      });

      if (!validation.success) {
        // Mostrar primeiro erro no toast
        const firstError = validation.error.errors[0];
        toast({
          title: 'Erro na validação',
          description: firstError.message,
          variant: 'destructive',
        });
        setPhoneError('');
        return;
      }

      const user: User = {
        id: `user-${Date.now()}`,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone ? formatPhone(newUser.phone) : '',
        role: newUser.role,
        condominiumId: 'condo-1',
        unitId: newUser.unitId || undefined,
        createdAt: new Date(),
      };

      setUsers([...users, user]);
      
      // Trigger notification
      const notification = residentCreated(user.name, user.role);
      addNotification(notification);
      
      setIsDialogOpen(false);
      setNewUser({
        name: '',
        email: '',
        phone: '',
        unitId: '',
        role: 'morador',
      });
      setPhoneError('');

      toast({
        title: 'Morador cadastrado!',
        description: 'Um convite será enviado por e-mail.',
      });
    } catch (error) {
      console.error('Erro ao criar morador:', error);
      toast({
        title: 'Erro ao cadastrar',
        description: 'Algo deu errado. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground flex items-center gap-2">
              <Users className="h-7 w-7 text-primary" />
              Moradores
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os moradores do condomínio
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Cadastrar Morador
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Morador</DialogTitle>
                <DialogDescription>
                  Preencha os dados do morador. Um convite será enviado por e-mail.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    placeholder="Nome do morador"
                    value={newUser.name}
                    onChange={(e) => {
                      const v = e.target.value;
                      setNewUser({ ...newUser, name: v });
                      const res = nameSchema.safeParse(v);
                      setNameError(res.success ? '' : res.error.errors[0].message);
                    }}
                    className={cn(nameError && 'border-destructive')}
                  />
                  {nameError && <p className="text-xs text-destructive mt-1">{nameError}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@exemplo.com"
                    value={newUser.email}
                    onChange={(e) => {
                      const v = e.target.value;
                      setNewUser({ ...newUser, email: v });
                      const res = emailSchema.safeParse(v);
                      setEmailError(res.success ? '' : res.error.errors[0].message);
                    }}
                    className={cn(emailError && 'border-destructive')}
                  />
                  {emailError && <p className="text-xs text-destructive mt-1">{emailError}</p>}
                </div>
                <PhoneInput
                  id="phone"
                  label="Telefone"
                  placeholder="(11) 99999-9999"
                  value={newUser.phone}
                  onChange={(phone) => {
                    setNewUser({ ...newUser, phone });
                    setPhoneError('');
                  }}
                  error={phoneError}
                  hint="Pode ser celular (11 dígitos) ou fixo (10 dígitos)"
                  showValidation
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Unidade</Label>
                    <Select
                      value={newUser.unitId}
                      onValueChange={(value) => setNewUser({ ...newUser, unitId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockUnits.map((unit) => (
                          <SelectItem key={unit.id} value={unit.id}>
                            {unit.number}{unit.block ? ` - Bloco ${unit.block}` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Perfil</Label>
                    <Select
                      value={newUser.role}
                      onValueChange={(value: User['role']) => setNewUser({ ...newUser, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morador">Morador</SelectItem>
                        <SelectItem value="conselho">Conselho</SelectItem>
                        <SelectItem value="sindico">Síndico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateUser}
                  disabled={Boolean(nameError || emailError || phoneError || !newUser.name || !newUser.email)}
                >
                  Cadastrar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Data Table Controls - Search, Sort, Filter */}
        <DataTableControls
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Buscar por nome ou email..."
          
          sortOptions={[
            { value: 'recent', label: 'Mais recentes' },
            { value: 'oldest', label: 'Mais antigos' },
            { value: 'name', label: 'Por nome' },
          ]}
          sortValue={sortBy}
          onSortChange={setSortBy}
          
          activeFilterCount={filterRole.length}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
          
          filterContent={
            <div className="grid grid-cols-1 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-3">Função</h4>
                <MultiSelectFilter
                  options={[
                    { value: 'superadmin', label: 'Super Admin' },
                    { value: 'sindico', label: 'Síndico' },
                    { value: 'conselho', label: 'Conselho' },
                    { value: 'morador', label: 'Morador' },
                  ]}
                  selected={filterRole}
                  onChange={setFilterRole}
                />
              </div>
            </div>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary-light flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-sm text-muted-foreground">Total de usuários</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-info-light flex items-center justify-center">
                <Home className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockUnits.length}</p>
                <p className="text-sm text-muted-foreground">Unidades cadastradas</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success-light flex items-center justify-center">
                <Users className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.filter(u => u.role === 'morador').length}</p>
                <p className="text-sm text-muted-foreground">Moradores ativos</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="shadow-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden sm:table-cell">E-mail</TableHead>
                  <TableHead className="hidden md:table-cell">Telefone</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Perfil</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="p-6">
                      <TableSkeleton rows={5} />
                    </TableCell>
                  </TableRow>
                ) : sortedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="p-6">
                      <EmptyState
                        icon={Users}
                        title="Nenhum morador encontrado"
                        description="Comece adicionando moradores ao condomínio."
                        action={{ label: 'Cadastrar Morador', onClick: () => setIsDialogOpen(true) }}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary-light flex items-center justify-center">
                            <span className="text-primary text-sm font-medium">
                              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground sm:hidden">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.phone ? (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            {user.phone}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Home className="h-3 w-3 text-muted-foreground" />
                          {getUnitLabel(user.unitId)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                          ${user.role === 'sindico' ? 'bg-primary-light text-primary' : ''}
                          ${user.role === 'conselho' ? 'bg-info-light text-info' : ''}
                          ${user.role === 'morador' ? 'bg-muted text-muted-foreground' : ''}
                        `}>
                          {roleLabels[user.role]}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
