import { z } from 'zod';

// Email validation
export const emailSchema = z.string().email('E-mail inválido');

// Password validation
export const passwordSchema = z.string().min(3, 'Mínimo 3 caracteres');

// Name validation
export const nameSchema = z.string().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres');

// Phone validation (Brazilian format)
// Aceita: (11) 99999-9999, (11) 9999-9999, 11 99999-9999, 119999999999, etc
export const phoneSchema = z
  .string()
  .optional()
  .refine(
    (phone) => {
      if (!phone || phone.trim() === '') return true;
      // Remove tudo que não é dígito
      const cleaned = phone.replace(/\D/g, '');
      // Deve ter 10 ou 11 dígitos
      if (cleaned.length !== 10 && cleaned.length !== 11) return false;
      // DDD deve estar entre 11 e 99
      const areaCode = parseInt(cleaned.slice(0, 2), 10);
      if (areaCode < 11 || areaCode > 99) return false;
      // Segundo dígito deve ser 2-5 (fixo) ou 6-9 (celular)
      const secondDigit = parseInt(cleaned[2], 10);
      if (secondDigit < 2 || secondDigit > 9) return false;
      // Não pode ter todos os dígitos iguais
      if (/^(\d)\1{9,}$/.test(cleaned)) return false;
      return true;
    },
    { message: 'Telefone deve estar no formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX' }
  );

// Title/Subject validation
export const titleSchema = z.string().min(3, 'Mínimo 3 caracteres').max(100, 'Máximo 100 caracteres');

// Description/Content validation
export const descriptionSchema = z.string().min(10, 'Mínimo 10 caracteres').max(2000, 'Máximo 2000 caracteres');

// Login form schema
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Create user form schema
export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  role: z.enum(['morador', 'conselho', 'sindico', 'superadmin']),
  unitId: z.string().optional(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;

// Create announcement form schema
export const createAnnouncementSchema = z.object({
  title: titleSchema,
  content: descriptionSchema,
  type: z.enum(['urgente', 'importante', 'informativo']),
});

export type CreateAnnouncementFormData = z.infer<typeof createAnnouncementSchema>;

// Create ticket form schema
export const createTicketSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  category: z.enum(['manutencao', 'barulho', 'seguranca', 'administrativo', 'outro']),
  priority: z.enum(['baixa', 'media', 'alta', 'urgente']),
  location: z.string().optional(),
});

export type CreateTicketFormData = z.infer<typeof createTicketSchema>;

// Create reservation form schema
export const createReservationSchema = z.object({
  commonAreaId: z.string().min(1, 'Selecione uma área'),
  date: z.date({ invalid_type_error: 'Data inválida' }),
  startTime: z.string().min(1, 'Hora de início é obrigatória'),
  endTime: z.string().min(1, 'Hora de término é obrigatória'),
  purpose: z.string().optional(),
}).refine((data) => {
  if (!data.startTime || !data.endTime) return true;
  return data.startTime < data.endTime;
}, {
  message: 'Hora de término deve ser maior que a hora de início',
  path: ['endTime'],
});

export type CreateReservationFormData = z.infer<typeof createReservationSchema>;

// ===== CONDOMINIUM VALIDATION (OPÇÃO 2) =====
// CNPJ validation: XX.XXX.XXX/0001-XX format
export const cnpjSchema = z
  .string()
  .regex(/^\d{2}\.\d{3}\.\d{3}\/0001-\d{2}$/, 'CNPJ deve estar no formato: 12.345.678/0001-90');

// Update condominium form schema
export const updateCondominiumSchema = z.object({
  // ===== IDENTIFICAÇÃO BÁSICA =====
  name: z.string().min(3, 'Mínimo 3 caracteres').max(100, 'Máximo 100 caracteres'),
  totalUnits: z.number().int().min(1, 'Mínimo 1 unidade').max(10000, 'Máximo 10000 unidades'),
  tipoCondominio: z.enum(['vertical', 'horizontal', 'misto']),

  // ===== ENDEREÇO =====
  address: z.string().min(5, 'Mínimo 5 caracteres').max(150, 'Máximo 150 caracteres'),
  city: z.string().min(2, 'Mínimo 2 caracteres').max(50, 'Máximo 50 caracteres'),
  state: z.string().length(2, 'Estado deve ter 2 caracteres'),
  zipCode: z.string().regex(/^\d{5}-\d{3}$/, 'CEP deve estar no formato: 12345-678'),

  // ===== CONTATO =====
  telefone: phoneSchema.refine((val) => !val || val.trim() !== '', 'Telefone obrigatório'),
  email: emailSchema,
  whatsapp: phoneSchema,
  website: z.string().url('URL inválida').optional(),

  // ===== LEGAL =====
  cnpj: cnpjSchema,
  inscricaoEstadual: z.string().optional(),

  // ===== SÍNDICO =====
  nomeSindico: z.string().min(3, 'Mínimo 3 caracteres').max(100, 'Máximo 100 caracteres'),
  telefoneSindico: phoneSchema.refine((val) => !val || val.trim() !== '', 'Telefone do síndico obrigatório'),
  emailSindico: emailSchema,

  // ===== ESTRUTURA =====
  numeroBlocos: z.number().int().min(1, 'Mínimo 1 bloco').max(100, 'Máximo 100 blocos'),
  andaresPorBloco: z.number().int().min(1, 'Mínimo 1 andar').max(100, 'Máximo 100 andares'),
  vagasGaragem: z.number().int().min(0, 'Não pode ser negativo').max(10000, 'Máximo 10000 vagas'),

  // ===== SEGURANÇA =====
  temPortaria24h: z.boolean(),
  horariosPortaria: z.string().optional(),
  temCameras: z.boolean(),
  areasCameras: z.array(z.string()).optional(),
  empresaVigilancia: z.string().optional(),

  // ===== FINANCEIRO =====
  taxaCondominial: z.number().min(0, 'Não pode ser negativo').max(100000, 'Valor muito alto'),
  diaVencimento: z.number().int().min(1, 'Mínimo dia 1').max(31, 'Máximo dia 31'),
  formasPagamento: z.array(z.string()).min(1, 'Selecione ao menos uma forma de pagamento'),
  banco: z.string().optional(),
  agencia: z.string().optional(),
  contaBancaria: z.string().optional(),

  // ===== CARACTERÍSTICAS =====
  anoConstituicao: z.number().int().min(1900, 'Ano inválido').max(new Date().getFullYear(), 'Ano não pode ser no futuro').optional(),
  anoUltimaReforma: z.date().optional(),
  situacaoPredial: z.enum(['excelente', 'bom', 'regular', 'precario']).optional(),
  amenidades: z.array(z.string()).optional(),
});

export type UpdateCondominiumFormData = z.infer<typeof updateCondominiumSchema>;