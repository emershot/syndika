/**
 * SYNDIKA - API Client
 * Camada de comunicação com o backend Node.js + PostgreSQL
 * Inclui: Axios instance, interceptors JWT, funções CRUD
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { User, Ticket, Reservation, Announcement } from '@/types/condominium';

// ============================================================
// TYPES - Backend API Response Formats
// ============================================================

export interface BackendUser {
  id: string;
  tenant_id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'resident';
  phone?: string;
  unit_number?: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

export interface BackendTicket {
  id: string;
  tenant_id: string;
  title: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_by: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  creator?: BackendUser;
  assignee?: BackendUser;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: BackendUser;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface APIError {
  message: string;
  error?: string;
  details?: Record<string, string>;
}

// ============================================================
// STORAGE KEYS
// ============================================================

const TOKEN_KEY = 'syndika_jwt_token';
const USER_KEY = 'syndika_user';
const TENANT_KEY = 'syndika_tenant_slug';

// ============================================================
// BASE URL CONFIGURATION
// ============================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// ============================================================
// AXIOS INSTANCE WITH INTERCEPTORS
// ============================================================

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Adiciona JWT token automaticamente
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_KEY);
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log para debug (apenas em desenvolvimento)
    if (import.meta.env.DEV) {
      console.log('[API Request]', config.method?.toUpperCase(), config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Trata erros e auto-logout em 401
apiClient.interceptors.response.use(
  (response) => {
    // Log para debug (apenas em desenvolvimento)
    if (import.meta.env.DEV) {
      console.log('[API Response]', response.status, response.config.url);
    }
    return response;
  },
  (error: AxiosError<APIError>) => {
    // Auto-logout em 401 Unauthorized
    if (error.response?.status === 401) {
      console.warn('[API] Token inválido ou expirado. Fazendo logout...');
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TENANT_KEY);
      
      // Redireciona para login (se não estiver já lá)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Erros amigáveis (sempre string)
    let errorMessage = 'Erro ao comunicar com o servidor';

    const apiError = error.response?.data as any;
    if (apiError?.error?.message) {
      errorMessage = apiError.error.message;
    } else if (apiError?.message) {
      errorMessage = apiError.message;
    } else if (typeof error.message === 'string') {
      errorMessage = error.message;
    }
    
    console.error('[API Error]', errorMessage, error.response?.data);
    
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

// ============================================================
// HELPER FUNCTIONS - Conversão Backend -> Frontend Types
// ============================================================

/**
 * Converte usuário do formato backend para frontend
 */
export function mapBackendUserToFrontend(backendUser: BackendUser): User {
  return {
    id: backendUser.id,
    name: backendUser.name,
    email: backendUser.email,
    phone: backendUser.phone,
    role: mapBackendRoleToFrontend(backendUser.role),
    condominiumId: backendUser.tenant_id,
    unitId: backendUser.unit_number,
    createdAt: new Date(backendUser.created_at),
  };
}

/**
 * Mapeia roles do backend para frontend
 */
function mapBackendRoleToFrontend(role: 'admin' | 'manager' | 'resident'): User['role'] {
  const roleMap: Record<string, User['role']> = {
    admin: 'sindico',
    manager: 'conselho',
    resident: 'morador',
  };
  return roleMap[role] || 'morador';
}

/**
 * Mapeia roles do frontend para backend
 */
function mapFrontendRoleToBackend(role: User['role']): 'admin' | 'manager' | 'resident' {
  const roleMap: Record<string, 'admin' | 'manager' | 'resident'> = {
    sindico: 'admin',
    superadmin: 'admin',
    conselho: 'manager',
    morador: 'resident',
  };
  return roleMap[role] || 'resident';
}

/**
 * Converte ticket do formato backend para frontend
 */
export function mapBackendTicketToFrontend(backendTicket: BackendTicket): Ticket {
  return {
    id: backendTicket.id,
    condominiumId: backendTicket.tenant_id,
    title: backendTicket.title,
    description: backendTicket.description || '',
    category: mapBackendCategoryToFrontend(backendTicket.category),
    priority: mapBackendPriorityToFrontend(backendTicket.priority),
    status: mapBackendStatusToFrontend(backendTicket.status),
    createdBy: backendTicket.created_by,
    createdByName: backendTicket.creator?.name || 'Desconhecido',
    assignedTo: backendTicket.assigned_to,
    assignedToName: backendTicket.assignee?.name,
    createdAt: new Date(backendTicket.created_at),
    updatedAt: new Date(backendTicket.updated_at),
  };
}

/**
 * Mapeia categorias do backend para frontend
 */
function mapBackendCategoryToFrontend(category: string): Ticket['category'] {
  const categoryMap: Record<string, Ticket['category']> = {
    maintenance: 'manutencao',
    noise: 'barulho',
    security: 'seguranca',
    administrative: 'administrativo',
    other: 'outro',
  };
  return categoryMap[category] || 'outro';
}

/**
 * Mapeia categorias do frontend para backend
 */
function mapFrontendCategoryToBackend(category: Ticket['category']): string {
  const categoryMap: Record<string, string> = {
    manutencao: 'maintenance',
    barulho: 'noise',
    seguranca: 'security',
    administrativo: 'administrative',
    outro: 'other',
  };
  return categoryMap[category] || 'other';
}

/**
 * Mapeia prioridades do backend para frontend
 */
function mapBackendPriorityToFrontend(priority: string): Ticket['priority'] {
  const priorityMap: Record<string, Ticket['priority']> = {
    low: 'baixa',
    medium: 'media',
    high: 'alta',
    urgent: 'urgente',
  };
  return priorityMap[priority] || 'media';
}

/**
 * Mapeia prioridades do frontend para backend
 */
function mapFrontendPriorityToBackend(priority: Ticket['priority']): string {
  const priorityMap: Record<string, string> = {
    baixa: 'low',
    media: 'medium',
    alta: 'high',
    urgente: 'urgent',
  };
  return priorityMap[priority] || 'medium';
}

/**
 * Mapeia status do backend para frontend
 */
function mapBackendStatusToFrontend(status: string): Ticket['status'] {
  const statusMap: Record<string, Ticket['status']> = {
    open: 'aberto',
    in_progress: 'em_andamento',
    resolved: 'resolvido',
    closed: 'arquivado',
  };
  return statusMap[status] || 'aberto';
}

/**
 * Mapeia status do frontend para backend
 */
function mapFrontendStatusToBackend(status: Ticket['status']): string {
  const statusMap: Record<string, string> = {
    aberto: 'open',
    em_andamento: 'in_progress',
    aguardando: 'in_progress',
    resolvido: 'resolved',
    arquivado: 'closed',
  };
  return statusMap[status] || 'open';
}

// ============================================================
// LOCAL STORAGE HELPERS
// ============================================================

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function saveUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser(): User | null {
  const stored = localStorage.getItem(USER_KEY);
  if (!stored) return null;
  
  try {
    const parsed = JSON.parse(stored);
    // Converter strings de data para Date objects
    if (parsed.createdAt) {
      parsed.createdAt = new Date(parsed.createdAt);
    }
    return parsed;
  } catch {
    return null;
  }
}

export function removeUser(): void {
  localStorage.removeItem(USER_KEY);
}

export function saveTenantSlug(slug: string): void {
  localStorage.setItem(TENANT_KEY, slug);
}

export function getTenantSlug(): string | null {
  return localStorage.getItem(TENANT_KEY);
}

export function removeTenantSlug(): void {
  localStorage.removeItem(TENANT_KEY);
}

// ============================================================
// AUTH API - Authentication Endpoints
// ============================================================

export interface LoginRequest {
  email: string;
  password: string;
  tenantSlug: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  tenantSlug: string;
  phone?: string;
  unitNumber?: string;
}

export const authAPI = {
  /**
   * POST /api/auth/login
   * Login de usuário com email, senha e tenant slug
   */
  async login(credentials: LoginRequest): Promise<{ user: User; token: string }> {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', {
      email: credentials.email,
      password: credentials.password,
      tenantSlug: credentials.tenantSlug,
    });

    const { token, user: backendUser } = response.data;

    // Salvar token e tenant slug
    saveToken(token);
    saveTenantSlug(credentials.tenantSlug);

    // Converter usuário para formato frontend
    const user = mapBackendUserToFrontend(backendUser);
    saveUser(user);

    return { user, token };
  },

  /**
   * POST /api/auth/register
   * Registro de novo usuário
   */
  async register(data: RegisterRequest): Promise<{ user: User; token: string }> {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', {
      email: data.email,
      password: data.password,
      name: data.name,
      tenantSlug: data.tenantSlug,
      phone: data.phone,
      unitNumber: data.unitNumber,
    });

    const { token, user: backendUser } = response.data;

    // Salvar token e tenant slug
    saveToken(token);
    saveTenantSlug(data.tenantSlug);

    // Converter usuário para formato frontend
    const user = mapBackendUserToFrontend(backendUser);
    saveUser(user);

    return { user, token };
  },

  /**
   * GET /api/auth/me
   * Busca informações do usuário autenticado
   */
  async me(): Promise<User> {
    const response = await apiClient.get<{ user: BackendUser }>('/api/auth/me');
    const user = mapBackendUserToFrontend(response.data.user);
    saveUser(user);
    return user;
  },

  /**
   * Logout local (apenas limpa localStorage)
   */
  logout(): void {
    removeToken();
    removeUser();
    removeTenantSlug();
  },

  /**
   * Verifica se usuário está autenticado
   */
  isAuthenticated(): boolean {
    return !!getToken();
  },
};

// ============================================================
// TICKETS API - Tickets CRUD
// ============================================================

export interface CreateTicketRequest {
  title: string;
  description?: string;
  category: Ticket['category'];
  priority: Ticket['priority'];
}

export interface UpdateTicketRequest {
  title?: string;
  description?: string;
  category?: Ticket['category'];
  priority?: Ticket['priority'];
  status?: Ticket['status'];
  assignedTo?: string;
}

export interface ListTicketsParams {
  status?: string;
  priority?: string;
  page?: number;
  limit?: number;
}

export const ticketsAPI = {
  /**
   * GET /api/tenants/:slug/tickets
   * Lista tickets do tenant atual com paginação
   */
  async list(params?: ListTicketsParams): Promise<Ticket[]> {
    const tenantSlug = getTenantSlug();
    if (!tenantSlug) {
      throw new Error('Tenant não encontrado. Faça login novamente.');
    }

    const response = await apiClient.get<PaginatedResponse<BackendTicket>>(
      `/api/tenants/${tenantSlug}/tickets`,
      { params }
    );

    return response.data.data.map(mapBackendTicketToFrontend);
  },

  /**
   * GET /api/tenants/:slug/tickets/:id
   * Busca um ticket específico
   */
  async get(id: string): Promise<Ticket> {
    const tenantSlug = getTenantSlug();
    if (!tenantSlug) {
      throw new Error('Tenant não encontrado. Faça login novamente.');
    }

    const response = await apiClient.get<{ ticket: BackendTicket }>(
      `/api/tenants/${tenantSlug}/tickets/${id}`
    );

    return mapBackendTicketToFrontend(response.data.ticket);
  },

  /**
   * POST /api/tenants/:slug/tickets
   * Cria novo ticket
   */
  async create(data: CreateTicketRequest): Promise<Ticket> {
    const tenantSlug = getTenantSlug();
    if (!tenantSlug) {
      throw new Error('Tenant não encontrado. Faça login novamente.');
    }

    const response = await apiClient.post<{ ticket: BackendTicket }>(
      `/api/tenants/${tenantSlug}/tickets`,
      {
        title: data.title,
        description: data.description,
        category: mapFrontendCategoryToBackend(data.category),
        priority: mapFrontendPriorityToBackend(data.priority),
      }
    );

    return mapBackendTicketToFrontend(response.data.ticket);
  },

  /**
   * PUT /api/tenants/:slug/tickets/:id
   * Atualiza ticket existente
   */
  async update(id: string, data: UpdateTicketRequest): Promise<Ticket> {
    const tenantSlug = getTenantSlug();
    if (!tenantSlug) {
      throw new Error('Tenant não encontrado. Faça login novamente.');
    }

    const payload: Record<string, string | undefined> = {};

    if (data.title) payload.title = data.title;
    if (data.description) payload.description = data.description;
    if (data.category) payload.category = mapFrontendCategoryToBackend(data.category);
    if (data.priority) payload.priority = mapFrontendPriorityToBackend(data.priority);
    if (data.status) payload.status = mapFrontendStatusToBackend(data.status);
    if (data.assignedTo) payload.assigned_to = data.assignedTo;

    const response = await apiClient.put<{ ticket: BackendTicket }>(
      `/api/tenants/${tenantSlug}/tickets/${id}`,
      payload
    );

    return mapBackendTicketToFrontend(response.data.ticket);
  },

  /**
   * DELETE /api/tenants/:slug/tickets/:id
   * Remove ticket
   */
  async delete(id: string): Promise<void> {
    const tenantSlug = getTenantSlug();
    if (!tenantSlug) {
      throw new Error('Tenant não encontrado. Faça login novamente.');
    }

    await apiClient.delete(`/api/tenants/${tenantSlug}/tickets/${id}`);
  },
};

// ============================================================
// RESERVATIONS API - Reservations CRUD (Fase 3 - Placeholder)
// ============================================================

export const reservationsAPI = {
  /**
   * Lista reservas (fallback para mock temporariamente)
   */
  async list(): Promise<Reservation[]> {
    // TODO: Implementar quando backend tiver endpoint
    console.warn('[API] Endpoint de reservations ainda não implementado. Usando mock.');
    return [];
  },

  /**
   * Cria nova reserva (fallback para mock temporariamente)
   */
  async create(data: Partial<Reservation>): Promise<Reservation> {
    // TODO: Implementar quando backend tiver endpoint
    console.warn('[API] Endpoint de reservations ainda não implementado.');
    throw new Error('Funcionalidade em desenvolvimento');
  },

  /**
   * Aprova reserva (fallback para mock temporariamente)
   */
  async approve(id: string): Promise<Reservation> {
    // TODO: Implementar quando backend tiver endpoint
    console.warn('[API] Endpoint de reservations ainda não implementado.');
    throw new Error('Funcionalidade em desenvolvimento');
  },

  /**
   * Recusa reserva (fallback para mock temporariamente)
   */
  async reject(id: string): Promise<Reservation> {
    // TODO: Implementar quando backend tiver endpoint
    console.warn('[API] Endpoint de reservations ainda não implementado.');
    throw new Error('Funcionalidade em desenvolvimento');
  },
};

// ============================================================
// ANNOUNCEMENTS API - Announcements CRUD (Fase 3 - Placeholder)
// ============================================================

export const announcementsAPI = {
  /**
   * Lista anúncios (fallback para mock temporariamente)
   */
  async list(): Promise<Announcement[]> {
    // TODO: Implementar quando backend tiver endpoint
    console.warn('[API] Endpoint de announcements ainda não implementado. Usando mock.');
    return [];
  },

  /**
   * Cria novo anúncio (fallback para mock temporariamente)
   */
  async create(data: Partial<Announcement>): Promise<Announcement> {
    // TODO: Implementar quando backend tiver endpoint
    console.warn('[API] Endpoint de announcements ainda não implementado.');
    throw new Error('Funcionalidade em desenvolvimento');
  },

  /**
   * Remove anúncio (fallback para mock temporariamente)
   */
  async delete(id: string): Promise<void> {
    // TODO: Implementar quando backend tiver endpoint
    console.warn('[API] Endpoint de announcements ainda não implementado.');
    throw new Error('Funcionalidade em desenvolvimento');
  },
};

// ============================================================
// TENANTS API - Tenant Information
// ============================================================

export const tenantsAPI = {
  /**
   * Retorna tenant slug atual
   */
  getCurrentTenantSlug(): string | null {
    return getTenantSlug();
  },

  /**
   * GET /api/tenants/:slug/users
   * Lista usuários do tenant atual
   */
  async listUsers(page = 1, limit = 50): Promise<User[]> {
    const tenantSlug = getTenantSlug();
    if (!tenantSlug) {
      throw new Error('Tenant não encontrado. Faça login novamente.');
    }

    const response = await apiClient.get<PaginatedResponse<BackendUser>>(
      `/api/tenants/${tenantSlug}/users`,
      { params: { page, limit } }
    );

    return response.data.data.map(mapBackendUserToFrontend);
  },
};

// ============================================================
// HEALTH CHECK
// ============================================================

export const healthAPI = {
  /**
   * GET /health
   * Verifica status do backend
   */
  async check(): Promise<{ status: string; version: string }> {
    const response = await apiClient.get<{ status: string; version: string }>('/health');
    return response.data;
  },
};
