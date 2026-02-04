// ============================================================================
// TypeScript Types for SYNDIKA API
// ============================================================================

import { Request } from 'express';

// ============================================================================
// JWT & Authentication
// ============================================================================

export interface JWTPayload {
  userId: string;
  tenantId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  unit_number?: string;
  tenantSlug: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    tenantId: string;
  };
}

// ============================================================================
// Tenant
// ============================================================================

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTenantRequest {
  name: string;
  slug: string;
  description?: string;
}

// ============================================================================
// User / Resident
// ============================================================================

export type UserRole = 'admin' | 'manager' | 'resident' | 'guest';

export interface User {
  id: string;
  tenant_id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  unit_number?: string;
  phone?: string;
  is_active: boolean;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface UserPublic {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  unit_number?: string;
  phone?: string;
  is_active: boolean;
  created_at: Date;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  unit_number?: string;
  phone?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  unit_number?: string;
  phone?: string;
  role?: UserRole;
  is_active?: boolean;
}

// ============================================================================
// Ticket
// ============================================================================

export type TicketCategory = 'maintenance' | 'complaint' | 'request' | 'emergency' | 'other';
export type TicketPriority = 'low' | 'normal' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface Ticket {
  id: string;
  tenant_id: string;
  title: string;
  description?: string;
  category?: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  created_by: string;
  assigned_to?: string;
  created_at: Date;
  updated_at: Date;
  resolved_at?: Date;
}

export interface TicketWithUser extends Ticket {
  creator?: UserPublic;
  assignee?: UserPublic;
}

export interface CreateTicketRequest {
  title: string;
  description?: string;
  category?: TicketCategory;
  priority?: TicketPriority;
}

export interface UpdateTicketRequest {
  title?: string;
  description?: string;
  category?: TicketCategory;
  priority?: TicketPriority;
  status?: TicketStatus;
  assigned_to?: string;
}

// ============================================================================
// Reservation
// ============================================================================

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Reservation {
  id: string;
  tenant_id: string;
  user_id: string;
  area_name: string;
  reserved_date: Date;
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
  reason?: string;
  status: ReservationStatus;
  created_at: Date;
  updated_at: Date;
}

export interface CreateReservationRequest {
  area_name: string;
  reserved_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
  reason?: string;
}

// ============================================================================
// Announcement
// ============================================================================

export type AnnouncementPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Announcement {
  id: string;
  tenant_id: string;
  title: string;
  content: string;
  author_id?: string;
  priority: AnnouncementPriority;
  published_at?: Date;
  expires_at?: Date;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateAnnouncementRequest {
  title: string;
  content: string;
  priority?: AnnouncementPriority;
  expires_at?: Date;
}

// ============================================================================
// Activity Log
// ============================================================================

export interface ActivityLog {
  id: string;
  tenant_id: string;
  user_id?: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  description?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
}

// ============================================================================
// Pagination & Query Params
// ============================================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// ============================================================================
// API Response
// ============================================================================

export interface APIResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

// ============================================================================
// Request extensions (for middleware)
// ============================================================================

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    tenantId: string;
    email: string;
    role: UserRole;
  };
}

// ============================================================================
// Database Query Result
// ============================================================================

export interface QueryResult<T> {
  rows: T[];
  rowCount: number;
  command: string;
}
