import { 
  User, Condominium, Unit, Announcement, Ticket, 
  CommonArea, Reservation, DashboardStats 
} from '@/types/condominium';

// Mock Condominium - OPÇÃO 2 (22 novos campos)
export const mockCondominium: Condominium = {
  // ===== IDENTIFICAÇÃO BÁSICA =====
  id: 'condo-1',
  name: 'Residencial Jardim das Flores',
  address: 'Rua das Acácias, 150',
  city: 'São Paulo',
  state: 'SP',
  zipCode: '01234-567',
  totalUnits: 48,
  createdAt: new Date('2024-01-15'),

  // ===== PLANO CONTRATADO =====
  planStatus: 'ativo',
  planStartDate: new Date('2024-01-15'),
  planEndDate: new Date('2025-01-15'),

  // ===== CONTATO DO CONDOMÍNIO =====
  telefone: '(11) 3333-3333',
  email: 'contato@jardimdasflores.com.br',
  whatsapp: '(11) 98765-4321',
  website: 'www.jardimdasflores.com.br',

  // ===== IDENTIFICAÇÃO LEGAL =====
  cnpj: '12.345.678/0001-90',
  inscricaoEstadual: '123.456.789.012',

  // ===== SÍNDICO RESPONSÁVEL =====
  nomeSindico: 'Carlos Silva Santos',
  telefoneSindico: '(11) 99999-1234',
  emailSindico: 'sindico@jardimdasflores.com.br',
  dataSindicoInicio: new Date('2023-06-01'),

  // ===== ESTRUTURA DO PRÉDIO =====
  tipoCondominio: 'vertical',
  numeroBlocos: 3,
  andaresPorBloco: 10,
  vagasGaragem: 96,

  // ===== SEGURANÇA E ACESSO =====
  temPortaria24h: true,
  horariosPortaria: 'Segunda a sexta: 6h-22h | Fins de semana: 7h-20h',
  temCameras: true,
  areasCameras: ['Entrada principal', 'Garagem', 'Salão de festas', 'Piscina'],
  empresaVigilancia: 'Vigilância Elite Segurança',

  // ===== DADOS FINANCEIROS =====
  taxaCondominial: 850.00,
  diaVencimento: 10,
  formasPagamento: ['Boleto', 'PIX', 'Débito automático'],
  banco: 'Itaú Unibanco',
  agencia: '1234',
  contaBancaria: '12345-6',

  // ===== CARACTERÍSTICAS =====
  anoConstituicao: 2015,
  anoUltimaReforma: new Date('2023-05-15'),
  situacaoPredial: 'excelente',
  amenidades: ['Piscina aquecida', 'Academia completa', 'Salão de festas', 'Churrasqueira', 'Playground'],
};

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Carlos Silva',
    email: 'admin@demo.com',
    phone: '(11) 99999-1234',
    role: 'sindico',
    condominiumId: 'condo-1',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'user-2',
    name: 'Maria Santos',
    email: 'morador@demo.com',
    phone: '(11) 99999-5678',
    role: 'morador',
    condominiumId: 'condo-1',
    unitId: 'unit-1',
    createdAt: new Date('2024-02-01'),
  },
  {
    id: 'user-3',
    name: 'João Oliveira',
    email: 'joao@email.com',
    role: 'conselho',
    condominiumId: 'condo-1',
    unitId: 'unit-5',
    createdAt: new Date('2024-02-10'),
  },
];

// Mock Units
export const mockUnits: Unit[] = [
  { id: 'unit-1', condominiumId: 'condo-1', number: '101', block: 'A', floor: 1, residents: ['user-2'] },
  { id: 'unit-2', condominiumId: 'condo-1', number: '102', block: 'A', floor: 1, residents: [] },
  { id: 'unit-3', condominiumId: 'condo-1', number: '201', block: 'A', floor: 2, residents: [] },
  { id: 'unit-4', condominiumId: 'condo-1', number: '202', block: 'A', floor: 2, residents: [] },
  { id: 'unit-5', condominiumId: 'condo-1', number: '101', block: 'B', floor: 1, residents: ['user-3'] },
];

// Mock Announcements
export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    condominiumId: 'condo-1',
    title: 'Manutenção da Caixa D\'água',
    content: 'Informamos que no dia 15/12 haverá manutenção preventiva na caixa d\'água. O abastecimento será interrompido das 8h às 12h. Pedimos que armazenem água para este período.',
    type: 'urgente',
    authorId: 'user-1',
    authorName: 'Carlos Silva',
    createdAt: new Date('2024-12-01T10:00:00'),
    updatedAt: new Date('2024-12-01T10:00:00'),
  },
  {
    id: 'ann-2',
    condominiumId: 'condo-1',
    title: 'Assembleia Geral Ordinária',
    content: 'Convocamos todos os condôminos para a Assembleia Geral Ordinária que acontecerá no dia 20/12 às 19h no salão de festas. Pauta: aprovação de contas e eleição do novo conselho.',
    type: 'importante',
    authorId: 'user-1',
    authorName: 'Carlos Silva',
    createdAt: new Date('2024-11-28T14:30:00'),
    updatedAt: new Date('2024-11-28T14:30:00'),
  },
  {
    id: 'ann-3',
    condominiumId: 'condo-1',
    title: 'Decoração de Natal nas Áreas Comuns',
    content: 'A decoração natalina já está instalada nas áreas comuns do condomínio. Aproveitamos para desejar a todos um ótimo final de ano!',
    type: 'informativo',
    authorId: 'user-1',
    authorName: 'Carlos Silva',
    createdAt: new Date('2024-11-25T09:00:00'),
    updatedAt: new Date('2024-11-25T09:00:00'),
  },
  {
    id: 'ann-4',
    condominiumId: 'condo-1',
    title: 'Novo Horário da Academia',
    content: 'A partir de janeiro/2025, a academia funcionará em novo horário: segunda a sexta das 6h às 22h, sábados das 8h às 18h e domingos das 8h às 14h.',
    type: 'informativo',
    authorId: 'user-1',
    authorName: 'Carlos Silva',
    createdAt: new Date('2024-11-20T11:00:00'),
    updatedAt: new Date('2024-11-20T11:00:00'),
  },
];

// Mock Tickets
export const mockTickets: Ticket[] = [
  {
    id: 'ticket-1',
    condominiumId: 'condo-1',
    unitId: 'unit-1',
    title: 'Lâmpada queimada no corredor',
    description: 'A lâmpada do corredor do 1º andar do Bloco A está queimada há 3 dias.',
    category: 'manutencao',
    priority: 'media',
    status: 'aberto',
    location: 'Corredor 1º andar - Bloco A',
    createdBy: 'user-2',
    createdByName: 'Maria Santos',
    createdAt: new Date('2024-12-01T08:30:00'),
    updatedAt: new Date('2024-12-01T08:30:00'),
  },
  {
    id: 'ticket-2',
    condominiumId: 'condo-1',
    unitId: 'unit-5',
    title: 'Vazamento na garagem',
    description: 'Há um vazamento de água próximo à vaga G15 na garagem. A poça está aumentando.',
    category: 'manutencao',
    priority: 'alta',
    status: 'em_andamento',
    location: 'Garagem - Vaga G15',
    createdBy: 'user-3',
    createdByName: 'João Oliveira',
    assignedTo: 'user-1',
    assignedToName: 'Carlos Silva',
    createdAt: new Date('2024-11-29T14:00:00'),
    updatedAt: new Date('2024-11-30T10:00:00'),
    comments: [
      {
        id: 'comment-1',
        ticketId: 'ticket-2',
        authorId: 'user-1',
        authorName: 'Carlos Silva',
        content: 'Já contactamos o encanador. Ele virá amanhã às 9h.',
        createdAt: new Date('2024-11-30T10:00:00'),
      },
    ],
  },
  {
    id: 'ticket-3',
    condominiumId: 'condo-1',
    title: 'Barulho excessivo após 22h',
    description: 'Apartamento 302 do Bloco A com som alto após às 22h nas últimas duas semanas.',
    category: 'barulho',
    priority: 'media',
    status: 'aguardando',
    location: 'Bloco A - Apt 302',
    createdBy: 'user-2',
    createdByName: 'Maria Santos',
    assignedTo: 'user-1',
    assignedToName: 'Carlos Silva',
    createdAt: new Date('2024-11-25T23:30:00'),
    updatedAt: new Date('2024-11-27T09:00:00'),
    comments: [
      {
        id: 'comment-2',
        ticketId: 'ticket-3',
        authorId: 'user-1',
        authorName: 'Carlos Silva',
        content: 'Notificação enviada ao morador. Aguardando retorno.',
        createdAt: new Date('2024-11-27T09:00:00'),
      },
    ],
  },
  {
    id: 'ticket-4',
    condominiumId: 'condo-1',
    title: 'Interfone com defeito',
    description: 'O interfone do apartamento 101-B não está funcionando corretamente.',
    category: 'manutencao',
    priority: 'baixa',
    status: 'resolvido',
    location: 'Bloco B - Apt 101',
    createdBy: 'user-3',
    createdByName: 'João Oliveira',
    assignedTo: 'user-1',
    assignedToName: 'Carlos Silva',
    createdAt: new Date('2024-11-15T10:00:00'),
    updatedAt: new Date('2024-11-18T16:00:00'),
    resolvedAt: new Date('2024-11-18T16:00:00'),
  },
  {
    id: 'ticket-5',
    condominiumId: 'condo-1',
    unitId: 'unit-1',
    title: 'Elevador C parado - Emergência!',
    description: 'O elevador C parou com pessoas dentro. Situação de emergência. Chamei desobstrução mas precisa de manutenção urgente.',
    category: 'manutencao',
    priority: 'urgente',
    status: 'aberto',
    location: 'Bloco A - Elevador C',
    createdBy: 'user-2',
    createdByName: 'Maria Santos',
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutos atrás
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: 'ticket-6',
    condominiumId: 'condo-1',
    title: 'Falta de água nos apartamentos - Bloco B',
    description: 'Água cortada completamente no Bloco B há 2 horas. Problema na caixa d\'água ou tubulação.',
    category: 'manutencao',
    priority: 'urgente',
    status: 'aberto',
    location: 'Bloco B',
    createdBy: 'user-3',
    createdByName: 'João Oliveira',
    createdAt: new Date(Date.now() - 120 * 60 * 1000), // 2 horas atrás
    updatedAt: new Date(Date.now() - 5 * 60 * 1000), // Atualizado há 5 minutos
  },
];

// Mock Common Areas
export const mockCommonAreas: CommonArea[] = [
  {
    id: 'area-1',
    condominiumId: 'condo-1',
    name: 'Salão de Festas',
    description: 'Espaço amplo com capacidade para 60 pessoas, equipado com ar-condicionado, cozinha e banheiros.',
    rules: 'Reserva com no mínimo 5 dias de antecedência. Taxa de limpeza: R$ 150. Horário máximo: 23h. Proibido som ao vivo.',
    openTime: '08:00',
    closeTime: '23:00',
    allowMultipleReservations: false,
    maxDurationMinutes: 480, // 8 horas máximo
    minAdvanceDays: 5,
    maxReservationsPerResident: 4,
  },
  {
    id: 'area-2',
    condominiumId: 'condo-1',
    name: 'Churrasqueira',
    description: 'Área gourmet com churrasqueira, mesa para 12 pessoas e bancada.',
    rules: 'Reserva com 3 dias de antecedência. Limpeza por conta do usuário. Horário máximo: 22h.',
    openTime: '10:00',
    closeTime: '22:00',
    allowMultipleReservations: false,
    maxDurationMinutes: 360, // 6 horas máximo
    minAdvanceDays: 3,
    maxReservationsPerResident: 3,
  },
  {
    id: 'area-3',
    condominiumId: 'condo-1',
    name: 'Espaço Gourmet',
    description: 'Cozinha completa com fogão industrial, forno e utensílios.',
    rules: 'Reserva com 2 dias de antecedência. Necessário devolver utensílios limpos.',
    openTime: '09:00',
    closeTime: '22:00',
    allowMultipleReservations: false,
    maxDurationMinutes: 240, // 4 horas máximo
    minAdvanceDays: 2,
    maxReservationsPerResident: 4,
  },
  {
    id: 'area-4',
    condominiumId: 'condo-1',
    name: 'Quadra Poliesportiva',
    description: 'Quadra coberta para futebol, vôlei e basquete.',
    rules: 'Uso de tênis obrigatório. Máximo 2 horas por reserva.',
    openTime: '06:00',
    closeTime: '22:00',
    allowMultipleReservations: true,
    maxDurationMinutes: 120, // 2 horas máximo
    minAdvanceDays: 0, // Pode reservar hoje
    maxReservationsPerResident: 6, // Mais flexível por ser outdoor
  },
];

// Mock Reservations
export const mockReservations: Reservation[] = [
  {
    id: 'res-1',
    condominiumId: 'condo-1',
    commonAreaId: 'area-1',
    commonAreaName: 'Salão de Festas',
    unitId: 'unit-1',
    unitNumber: '101-A',
    requestedBy: 'user-2',
    requestedByName: 'Maria Santos',
    date: new Date('2024-12-15'),
    startTime: '14:00',
    endTime: '22:00',
    purpose: 'Festa de aniversário',
    status: 'aprovada',
    approvedBy: 'user-1',
    approvedByName: 'Carlos Silva',
    createdAt: new Date('2024-12-01T10:00:00'),
    updatedAt: new Date('2024-12-02T09:00:00'),
  },
  {
    id: 'res-2',
    condominiumId: 'condo-1',
    commonAreaId: 'area-2',
    commonAreaName: 'Churrasqueira',
    unitId: 'unit-5',
    unitNumber: '101-B',
    requestedBy: 'user-3',
    requestedByName: 'João Oliveira',
    date: new Date('2024-12-08'),
    startTime: '12:00',
    endTime: '18:00',
    purpose: 'Almoço em família',
    status: 'solicitada',
    createdAt: new Date('2024-12-02T14:00:00'),
    updatedAt: new Date('2024-12-02T14:00:00'),
  },
  {
    id: 'res-3',
    condominiumId: 'condo-1',
    commonAreaId: 'area-4',
    commonAreaName: 'Quadra Poliesportiva',
    unitId: 'unit-1',
    unitNumber: '101-A',
    requestedBy: 'user-2',
    requestedByName: 'Maria Santos',
    date: new Date('2024-12-05'),
    startTime: '19:00',
    endTime: '21:00',
    purpose: 'Futebol com amigos',
    status: 'aprovada',
    approvedBy: 'user-1',
    approvedByName: 'Carlos Silva',
    createdAt: new Date('2024-11-30T16:00:00'),
    updatedAt: new Date('2024-12-01T08:00:00'),
  },
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalTickets: 15,
  openTickets: 3,
  inProgressTickets: 2,
  resolvedTickets: 10,
  totalReservations: 8,
  pendingReservations: 1,
  approvedReservations: 6,
  avgResolutionTime: 48, // 48 hours average
  ticketsByCategory: {
    manutencao: 8,
    barulho: 3,
    seguranca: 1,
    administrativo: 2,
    outro: 1,
  },
  reservationsByArea: {
    'Salão de Festas': 3,
    'Churrasqueira': 2,
    'Espaço Gourmet': 1,
    'Quadra Poliesportiva': 2,
  },
};

// Current logged user (for demo purposes)
export const currentUser: User = mockUsers[0]; // Síndico by default
