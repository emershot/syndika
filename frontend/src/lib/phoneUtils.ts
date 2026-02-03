/**
 * Utilitários para formatação, validação e manipulação de números de telefone brasileiros
 */

/**
 * Aceita múltiplos formatos de telefone brasileiro:
 * - (11) 99999-9999
 * - (11) 9999-9999
 * - 11 99999-9999
 * - 11 9999-9999
 * - 119999999999
 * - 1199999999
 */

/**
 * Remove caracteres especiais do telefone
 * @param phone - Número de telefone com formatação
 * @returns Apenas dígitos
 */
export function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Formata telefone para padrão brasileiro
 * Aceita: 10 ou 11 dígitos
 * Retorna: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 * @param phone - Número de telefone (apenas dígitos ou com formatação)
 * @returns Telefone formatado ou vazio se inválido
 */
export function formatPhone(phone: string): string {
  const cleaned = cleanPhone(phone);

  // Validar quantidade de dígitos (10 ou 11)
  if (cleaned.length !== 10 && cleaned.length !== 11) {
    return '';
  }

  // Formatar: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
  if (cleaned.length === 11) {
    // Com 9º dígito (celular)
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }

  // Sem 9º dígito (fixo)
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
}

/**
 * Valida se o telefone está em um formato aceito
 * @param phone - Número de telefone
 * @returns true se válido, false caso contrário
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = cleanPhone(phone);

  // Deve ter 10 ou 11 dígitos
  if (cleaned.length !== 10 && cleaned.length !== 11) {
    return false;
  }

  // DDD (primeiros 2 dígitos) deve estar entre 11 e 99
  const areaCode = parseInt(cleaned.slice(0, 2), 10);
  if (areaCode < 11 || areaCode > 99) {
    return false;
  }

  // Segundo dígito deve ser 2-5 (fixo) ou 6-9 (celular)
  const secondDigit = parseInt(cleaned[2], 10);
  if (secondDigit < 2 || secondDigit > 9) {
    return false;
  }

  // Não pode ter todos os dígitos iguais
  if (/^(\d)\1{9,}$/.test(cleaned)) {
    return false;
  }

  return true;
}

/**
 * Máscara de entrada para telefone
 * Formata enquanto o usuário digita
 * @param phone - Valor do input
 * @returns Valor formatado
 */
export function maskPhone(phone: string): string {
  const cleaned = cleanPhone(phone);

  // Limitar a 11 dígitos
  const limited = cleaned.slice(0, 11);

  // Aplicar máscara enquanto digita
  if (limited.length === 0) return '';
  if (limited.length <= 2) return `(${limited}`;
  if (limited.length <= 7) return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
  return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
}

/**
 * Tipo de telefone (celular ou fixo)
 */
export type PhoneType = 'celular' | 'fixo' | 'invalido';

/**
 * Identifica o tipo de telefone
 * @param phone - Número de telefone
 * @returns Tipo do telefone
 */
export function getPhoneType(phone: string): PhoneType {
  const cleaned = cleanPhone(phone);

  if (cleaned.length === 11) {
    return 'celular';
  }

  if (cleaned.length === 10) {
    return 'fixo';
  }

  return 'invalido';
}

/**
 * Formata múltiplos telefones
 * @param phones - Array de telefones
 * @returns Array de telefones formatados
 */
export function formatMultiplePhones(phones: string[]): string[] {
  return phones.map(formatPhone).filter((p) => p.length > 0);
}

/**
 * Extrai DDD (área) do telefone
 * @param phone - Número de telefone
 * @returns DDD (2 dígitos) ou vazio
 */
export function extractAreaCode(phone: string): string {
  const cleaned = cleanPhone(phone);
  if (cleaned.length >= 2) {
    return cleaned.slice(0, 2);
  }
  return '';
}

/**
 * Compara dois telefones ignorando formatação
 * @param phone1 - Primeiro telefone
 * @param phone2 - Segundo telefone
 * @returns true se são iguais
 */
export function comparePhones(phone1: string, phone2: string): boolean {
  return cleanPhone(phone1) === cleanPhone(phone2);
}

/**
 * Cria link WhatsApp para um telefone
 * @param phone - Número de telefone
 * @param message - Mensagem inicial (opcional)
 * @returns URL do WhatsApp
 */
export function getWhatsAppLink(phone: string, message?: string): string {
  const cleaned = cleanPhone(phone);
  if (!isValidPhone(cleaned)) {
    return '';
  }

  // Adicionar código do país (Brasil)
  const fullNumber = `55${cleaned}`;
  const encoded = message ? encodeURIComponent(message) : '';

  return `https://wa.me/${fullNumber}${encoded ? `?text=${encoded}` : ''}`;
}

/**
 * Cria link de chamada para um telefone
 * @param phone - Número de telefone
 * @returns URL de chamada (tel:)
 */
export function getCallLink(phone: string): string {
  const cleaned = cleanPhone(phone);
  if (!isValidPhone(cleaned)) {
    return '';
  }

  return `tel:+55${cleaned}`;
}

/**
 * Cria link de SMS para um telefone
 * @param phone - Número de telefone
 * @param message - Mensagem (opcional)
 * @returns URL de SMS (sms:)
 */
export function getSMSLink(phone: string, message?: string): string {
  const cleaned = cleanPhone(phone);
  if (!isValidPhone(cleaned)) {
    return '';
  }

  return `sms:+55${cleaned}${message ? `?body=${encodeURIComponent(message)}` : ''}`;
}
