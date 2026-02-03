import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/useAuth';
import { mockReservations, mockCommonAreas } from '@/data/mockData';
import { Reservation } from '@/types/condominium';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { CalendarDays } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ReservationFullCalendar } from '@/components/common/ReservationFullCalendar';

export default function ReservationCalendar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reservations] = useLocalStorage<Reservation[]>('syndika_reservations', mockReservations);

  const isSindico = user?.role === 'sindico' || user?.role === 'superadmin';

  // Filter reservations based on user role
  const userReservations = isSindico
    ? reservations
    : reservations.filter((r) => r.requestedBy === user?.id);

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground flex items-center gap-2">
              <CalendarDays className="h-7 w-7 text-primary" />
              Calendário de Reservas
            </h1>
            <p className="text-muted-foreground mt-1">
              Visualização mensal completa de todas as reservas
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => navigate('/reservas')}
            className="gap-2"
          >
            ← Voltar para Reservas
          </Button>
        </div>

        {/* Full Calendar */}
        <ReservationFullCalendar
          reservations={userReservations}
          commonAreas={mockCommonAreas}
        />
      </div>
    </AppLayout>
  );
}
