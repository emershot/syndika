// SYNDIKA - Type Definitions

export type UserRole = 'superadmin' | 'sindico' | 'conselho' | 'morador';

export type TicketStatus = 'aberto' | 'em_andamento' | 'aguardando' | 'resolvido' | 'arquivado';
export type TicketCategory = 'manutencao' | 'barulho' | 'seguranca' | 'administrativo' | 'outro';
export type TicketPriority = 'baixa' | 'media' | 'alta' | 'urgente';

export type AnnouncementType = 'urgente' | 'importante' | 'informativo';

export type ReservationStatus = 'solicitada' | 'aprovada' | 'recusada' | 'cancelada';

export type PlanStatus = 'teste' | 'ativo' | 'suspenso';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  condominiumId: string;
  unitId?: string;
  avatarUrl?: string;
  createdAt: Date;
}

export interface Condominium {
  // ===== IDENTIFICAÇÃO BÁSICA =====
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  totalUnits: number;
  createdAt: Date;

  // ===== PLANO CONTRATADO =====
  planStatus: PlanStatus;
  planStartDate: Date;
  planEndDate?: Date;

  // ===== CONTATO DO CONDOMÍNIO (NOVO) =====
  telefone: string;                    // (11) 3333-3333
  email: string;                       // condo@condominio.br
  whatsapp?: string;                   // (11) 99999-9999
  website?: string;                    // www.condominio.com.br

  // ===== IDENTIFICAÇÃO LEGAL (NOVO) =====
  cnpj: string;                        // 12.345.678/0001-90
  inscricaoEstadual?: string;          // IE do estado

  // ===== SÍNDICO RESPONSÁVEL (NOVO) =====
  nomeSindico: string;                 // Carlos Silva
  telefoneSindico: string;             // (11) 99999-1234
  emailSindico: string;                // sindico@email.com
  dataSindicoInicio?: Date;            // Desde quando é sindico

  // ===== ESTRUTURA DO PRÉDIO (NOVO) =====
  tipoCondominio: 'vertical' | 'horizontal' | 'misto';  // vertical
  numeroBlocos: number;                // 3
  andaresPorBloco: number;             // 10
  vagasGaragem: number;                // 96

  // ===== SEGURANÇA E ACESSO (NOVO) =====
  temPortaria24h: boolean;             // true/false
  horariosPortaria?: string;           // "Seg-Sex 6-22h"
  temCameras: boolean;                 // true/false
  areasCameras?: string[];             // ['Entrada', 'Garagem']
  empresaVigilancia?: string;          // "Vigilância Elite"

  // ===== DADOS FINANCEIROS (NOVO) =====
  taxaCondominial: number;             // 850.00
  diaVencimento: number;               // 1-31
  formasPagamento: string[];           // ['Boleto', 'PIX']
  banco?: string;                      // "Itaú"
  agencia?: string;                    // "1234"
  contaBancaria?: string;              // "12345-6"

  // ===== CARACTERÍSTICAS (NOVO) =====
  anoConstituicao?: number;            // 2015
  anoUltimaReforma?: Date;             // 2023-05-15
  situacaoPredial?: 'excelente' | 'bom' | 'regular' | 'precario';
  amenidades?: string[];               // ['Piscina', 'Academia', 'Salão']
}

export interface Unit {
  id: string;
  condominiumId: string;
  number: string;
  block?: string;
  floor?: number;
  residents: string[];
}

export interface Announcement {
  id: string;
  condominiumId: string;
  title: string;
  content: string;
  type: AnnouncementType;
  targetBlock?: string;
  attachments?: string[];
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ticket {
  id: string;
  condominiumId: string;
  unitId?: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  location?: string;
  attachments?: string[];
  createdBy: string;
  createdByName: string;
  assignedTo?: string;
  assignedToName?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  comments?: TicketComment[];
}

export interface TicketComment {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
}

export interface CommonArea {
  id: string;
  condominiumId: string;
  name: string;
  description: string;
  rules?: string;
  openTime: string;
  closeTime: string;
  allowMultipleReservations: boolean;
  imageUrl?: string;

  // ===== NOVAS REGRAS DE FUNCIONAMENTO =====
  maxDurationMinutes?: number; // Ex: 480 = 8 horas máximo
  minAdvanceDays?: number; // Ex: 2 = mínimo 2 dias de antecedência
  maxReservationsPerResident?: number; // Ex: 3 = máximo 3 reservas ativas por morador
  blockedDates?: string[]; // Datas indisponíveis (ISO format)
}

export interface ReservationAvailability {
  // Verificação de disponibilidade para exibir slots
  areaId: string;
  date: Date;
  availableSlots: {
    startTime: string;
    endTime: string;
    isAvailable: boolean; // true = disponível, false = ocupado/indisponível
  }[];
  totalAvailable?: number; // Total de slots disponíveis para o dia
}

export interface Reservation {
  id: string;
  condominiumId: string;
  commonAreaId: string;
  commonAreaName: string;
  unitId: string;
  unitNumber: string;
  requestedBy: string;
  requestedByName: string;
  date: Date;
  startTime: string;
  endTime: string;
  purpose?: string;
  status: ReservationStatus;
  // Aprovação
  approvedBy?: string;
  approvedByName?: string;
  approvalDate?: Date;
  // Rejeição
  rejectedBy?: string;
  rejectedByName?: string;
  rejectionDate?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Dashboard Statistics
export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  totalReservations: number;
  pendingReservations: number;
  approvedReservations: number;
  avgResolutionTime: number; // in hours
  ticketsByCategory: Record<TicketCategory, number>;
  reservationsByArea: Record<string, number>;
}

// Notification System
export type NotificationType = 'info' | 'warning' | 'urgent' | 'system';
export type NotificationAction = 
  | 'announcement_created' 
  | 'announcement_updated' 
  | 'announcement_deleted'
  | 'ticket_created' 
  | 'ticket_updated' 
  | 'ticket_status_changed'
  | 'ticket_comment_added'
  | 'reservation_created'
  | 'reservation_status_changed'
  | 'resident_created'
  | 'resident_updated'
  | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  action: NotificationAction;
  title: string;
  message: string;
  relatedId?: string; // ID do aviso, chamado, reserva, etc
  relatedType?: 'announcement' | 'ticket' | 'reservation' | 'resident';
  isRead: boolean;
  createdAt: Date;
  expiresAt?: Date; // Notificações antigas podem ser arquivadas
}

// ===== EMAIL NOTIFICATIONS =====

export type EmailType = 'ticket_created' | 'ticket_updated' | 'ticket_assigned' | 'announcement_published' | 'reservation_approved' | 'reservation_rejected';

export interface EmailNotification {
  id: string;
  type: EmailType;
  to: string;
  subject: string;
  templateData: Record<string, unknown>;
  sentAt: Date;
  deliveryStatus: 'pending' | 'sent' | 'failed';
  failureReason?: string;
}

// ===== ACTIVITY LOG / AUDITORIA =====

export type ActivityAction = 'create' | 'update' | 'delete' | 'status_change' | 'comment_added' | 'approved' | 'rejected';
export type ActivityEntity = 'ticket' | 'announcement' | 'reservation' | 'resident' | 'user';

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: ActivityAction;
  entity: ActivityEntity;
  entityId: string;
  entityTitle?: string; // Ex: título do chamado, aviso, etc
  changes?: {
    field: string;
    oldValue?: unknown;
    newValue?: unknown;
  }[];
  description?: string; // Descrição legível (ex: "Status alterado de aberto para resolvido")
  timestamp: Date;
  ipAddress?: string; // Para futuro rastreamento
}
