import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import {
  LayoutDashboard,
  Megaphone,
  ClipboardList,
  CalendarDays,
  Settings,
  LogOut,
  Building2,
  Menu,
  X,
  Users,
  ChevronDown,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NotificationBell } from '@/components/layout/NotificationBell';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { UserRole } from '@/types/condominium';

const navigation = [
  { name: 'Painel', href: '/dashboard', icon: LayoutDashboard, roles: ['sindico', 'conselho', 'superadmin'] },
  { name: 'Avisos', href: '/avisos', icon: Megaphone, roles: ['sindico', 'conselho', 'morador', 'superadmin'] },
  { name: 'Chamados', href: '/chamados', icon: ClipboardList, roles: ['sindico', 'conselho', 'morador', 'superadmin'] },
  { name: 'Reservas', href: '/reservas', icon: CalendarDays, roles: ['sindico', 'conselho', 'morador', 'superadmin'] },
  { name: 'Moradores', href: '/moradores', icon: Users, roles: ['sindico', 'superadmin'] },
  { name: 'Configurações', href: '/configuracoes', icon: Settings, roles: ['sindico', 'superadmin'] },
];

export function Sidebar() {
  const { user, logout, switchRole } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const filteredNavigation = navigation.filter(
    (item) => user && item.roles.includes(user.role)
  );

  const roleLabels: Record<UserRole, string> = {
    superadmin: 'Super Admin',
    sindico: 'Síndico',
    conselho: 'Conselho',
    morador: 'Morador',
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          <span className="font-heading font-bold text-lg">SYNDIKA</span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-foreground/50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-5 border-b border-sidebar-border">
            <Building2 className="h-8 w-8 text-sidebar-primary" />
            <div>
              <span className="font-heading font-bold text-lg text-sidebar-foreground">SYNDIKA</span>
              <p className="text-xs text-sidebar-foreground/70">Gestão de Condomínios</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-sidebar-border p-4 space-y-3">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-medium text-sidebar-foreground/70">Tema</span>
              <ThemeToggle />
            </div>

            {/* Demo role switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-between text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <span className="text-xs">Demo: {user ? roleLabels[user.role] : 'Selecionar'}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem onClick={() => switchRole('sindico')}>
                  Síndico
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchRole('morador')}>
                  Morador
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => switchRole('conselho')}>
                  Conselho
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {user && (
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-sidebar-accent flex items-center justify-center">
                  <span className="text-sidebar-accent-foreground font-medium">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-sidebar-foreground/70 truncate">
                    {roleLabels[user.role]}
                  </p>
                </div>
              </div>
            )}

            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
