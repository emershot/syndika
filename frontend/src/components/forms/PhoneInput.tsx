import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, AlertCircle, CheckCircle2 } from 'lucide-react';
import { maskPhone, isValidPhone, getPhoneType, cleanPhone } from '@/lib/phoneUtils';

export interface PhoneInputProps {
  id?: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
  showValidation?: boolean;
  icon?: React.ReactNode;
}

/**
 * Componente especializado para input de telefone brasileiro
 * 
 * Funcionalidades:
 * - Máscara automática enquanto digita
 * - Validação em tempo real
 * - Suporta formatos: (11) 99999-9999, 11 99999-9999, 119999999999
 * - Visual feedback (ícone de validação)
 * - Hint com sugestão de formato
 * - Diferencia celular (11 dígitos) de fixo (10 dígitos)
 * 
 * Exemplos de uso:
 * ```tsx
 * <PhoneInput
 *   label="Telefone"
 *   value={phone}
 *   onChange={setPhone}
 *   required
 *   showValidation
 * />
 * 
 * <PhoneInput
 *   label="Celular"
 *   value={mobile}
 *   onChange={setMobile}
 *   error={phoneError}
 *   hint="Use o celular para WhatsApp"
 * />
 * ```
 */
export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      id,
      label,
      placeholder = '(11) 99999-9999',
      value,
      onChange,
      onBlur,
      error,
      required,
      disabled,
      hint,
      showValidation,
      icon = <Phone className="h-4 w-4" />,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const cleaned = cleanPhone(value);
    const isValid = cleaned.length > 0 && isValidPhone(value);
    const phoneType = getPhoneType(value);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const masked = maskPhone(e.target.value);
      onChange(masked);
    }, [onChange]);

    const handleFocus = useCallback(() => {
      setIsFocused(true);
    }, []);

    const handleBlur = useCallback(() => {
      setIsFocused(false);
      onBlur?.();
    }, [onBlur]);

    // Status da validação
    const getStatusIcon = () => {
      if (!showValidation || cleaned.length === 0) return null;

      if (isValid) {
        return (
          <div className="flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span className="text-xs text-success font-medium">
              {phoneType === 'celular' ? '📱 Celular' : '☎️ Fixo'}
            </span>
          </div>
        );
      }

      return (
        <div className="flex items-center gap-1">
          <AlertCircle className="h-4 w-4 text-destructive" />
        </div>
      );
    };

    return (
      <div className="space-y-2">
        {label && (
          <div className="flex items-center gap-2">
            <Label htmlFor={id} className="text-sm font-medium">
              {label}
              {required && <span className="text-destructive">*</span>}
            </Label>
            {getStatusIcon()}
          </div>
        )}

        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {icon}
          </div>
          <Input
            ref={ref}
            id={id}
            type="tel"
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            className={`
              pl-10 font-mono text-sm
              ${error ? 'border-destructive focus-visible:ring-destructive' : ''}
              ${isValid && showValidation ? 'border-success focus-visible:ring-success' : ''}
              transition-colors
            `}
            autoComplete="tel"
            inputMode="tel"
            maxLength={15}
          />
        </div>

        {/* Hint e Erro */}
        <div className="space-y-1">
          {error && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {error}
            </p>
          )}
          {!error && hint && (
            <p className="text-xs text-muted-foreground">{hint}</p>
          )}
          {!error && !hint && cleaned.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {isValid ? (
                <>
                  ✓ Telefone válido
                  {phoneType === 'celular' && ' (com WhatsApp)'}
                </>
              ) : (
                '✗ Formato inválido'
              )}
            </p>
          )}
        </div>

        {/* Placeholder de ajuda durante digitação */}
        {isFocused && cleaned.length > 0 && cleaned.length < 10 && (
          <div className="text-xs text-muted-foreground px-3 py-2 bg-muted rounded-sm font-mono">
            {maskPhone(cleaned)}
            <span className="text-muted-foreground/50">
              {cleaned.length < 2 ? '(XX) XXXXX-XXXX' : ''}
              {cleaned.length >= 2 && cleaned.length < 7 ? 'XXXXX-XXXX' : ''}
              {cleaned.length >= 7 && cleaned.length < 10 ? '-XXXX' : ''}
              {cleaned.length >= 10 && cleaned.length < 11 ? 'X' : ''}
            </span>
          </div>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;
