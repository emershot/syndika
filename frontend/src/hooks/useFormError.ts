import { useCallback } from 'react';
import { ZodError } from 'zod';
import { toast } from '@/hooks/use-toast';

interface FormErrors {
  [key: string]: string;
}

/**
 * Hook personalizado para tratamento de erros de formulário
 * Converte erros do Zod em mensagens amigáveis em português
 */
export function useFormError() {
  /**
   * Processa erro de validação Zod e mostra toast
   */
  const handleZodError = useCallback((error: ZodError) => {
    const errors: FormErrors = {};
    
    // Mapeia erros do Zod para campos específicos
    error.errors.forEach((err) => {
      const path = err.path.join('.');
      errors[path] = err.message;
    });

    // Mostra o primeiro erro no toast
    const firstError = error.errors[0];
    if (firstError) {
      toast({
        title: 'Erro na validação',
        description: firstError.message,
        variant: 'destructive',
      });
    }

    return errors;
  }, []);

  /**
   * Processa erro genérico e mostra toast amigável
   */
  const handleError = useCallback((error: unknown, defaultMessage = 'Algo deu errado') => {
    let message = defaultMessage;

    if (error instanceof ZodError) {
      return handleZodError(error);
    }

    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }

    toast({
      title: 'Erro',
      description: message,
      variant: 'destructive',
    });

    return {};
  }, [handleZodError]);

  /**
   * Processa erro de rede/servidor
   */
  const handleNetworkError = useCallback((error: unknown) => {
    let message = 'Erro de conexão. Verifique sua internet e tente novamente.';

    if (error instanceof Error) {
      if (error.message.includes('network') || error.message.includes('fetch')) {
        message = 'Falha na conexão com o servidor.';
      }
    }

    toast({
      title: 'Erro de Conexão',
      description: message,
      variant: 'destructive',
    });
  }, []);

  /**
   * Processa sucesso de operação
   */
  const handleSuccess = useCallback((message = 'Operação realizada com sucesso!', title = 'Sucesso') => {
    toast({
      title,
      description: message,
    });
  }, []);

  return {
    handleZodError,
    handleError,
    handleNetworkError,
    handleSuccess,
  };
}
