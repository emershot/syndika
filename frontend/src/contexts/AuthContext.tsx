import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { User, UserRole } from '@/types/condominium';
import { mockUsers } from '@/data/mockData';
import { AuthContext, AuthContextType } from './authContextObject';
import { authAPI, getStoredUser, getToken } from '@/lib/api';

const STORAGE_KEY = 'syndika_user';
const DEFAULT_TENANT_SLUG = 'demo'; // Tenant padrão para demonstração

/**
 * Validar email com regex simples
 */
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validar senha
 */
function validatePassword(password: string): string | null {
  if (!password || password.trim().length === 0) {
    return 'Senha é obrigatória';
  }
  if (password.length < 3) {
    return 'Senha deve ter pelo menos 3 caracteres';
  }
  return null;
}

export interface LoginError {
  type: 'validation' | 'auth' | 'network';
  message: string;
}

/**
 * AuthProvider - Fornece contexto de autenticação para toda a aplicação
 *
 * Funcionalidades:
 * - Auto-login com JWT ao montar
 * - Login via API com fallback para mock
 * - Logout com limpeza de localStorage
 * - Validação de email/senha
 *
 * @example
 * ```tsx
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * ```
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Inicializar autenticação na mount
   * - Restaurar user do localStorage se houver
   * - Validar token JWT
   * - Fazer auto-login se possível
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = getToken();
        const storedUser = getStoredUser();

        if (token && storedUser) {
          // Token JWT existe - tentar validar com backend
          try {
            const validatedUser = await authAPI.me();
            setUser(validatedUser);
            console.log('[AuthContext] ✅ Auto-login com JWT bem-sucedido');
          } catch (error) {
            console.warn('[AuthContext] ⚠️ Token JWT inválido, fazendo logout');
            authAPI.logout();
            setUser(null);
          }
        } else if (storedUser && !token) {
          // User armazenado mas sem JWT (dev mode ou sessão expirada)
          setUser(storedUser);
          console.log('[AuthContext] ℹ️ Usando dados armazenados (sem JWT)');
        }
      } catch (error) {
        console.error('[AuthContext] ❌ Erro ao inicializar auth:', error);
        authAPI.logout();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login com email e senha
   * - Valida entrada
   * - Tenta API real primeiro
   * - Fallback para mock se API falhar
   */
  const login = useCallback(
    async (
      email: string,
      password: string
    ): Promise<{ success: boolean; error?: string; user?: User }> => {
      try {
        // Validação de entrada
        email = email.trim();

        if (!email) {
          return { success: false, error: 'E-mail é obrigatório' };
        }

        if (!validateEmail(email)) {
          return { success: false, error: 'E-mail inválido' };
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
          return { success: false, error: passwordError };
        }

        // Tentar login via API real
        try {
          console.log('[AuthContext] 🔄 Tentando login via API...');

          const { user: apiUser } = await authAPI.login({
            email,
            password,
            tenantSlug: DEFAULT_TENANT_SLUG,
          });

          setUser(apiUser);
          console.log('[AuthContext] ✅ Login via API bem-sucedido');

          return { success: true, user: apiUser };
        } catch (apiError: any) {
          // API falhou - tentar fallback para mock em desenvolvimento
          const isDevelopment = import.meta.env.DEV;

          if (isDevelopment) {
            console.warn(
              '[AuthContext] ⚠️ API falhou, tentando mock (dev mode)...',
              apiError?.message
            );

            const foundUser = mockUsers.find(
              (u) => u.email.toLowerCase() === email.toLowerCase()
            );

            if (foundUser) {
              setUser(foundUser);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(foundUser));
              console.log('[AuthContext] ✅ Login via mock bem-sucedido (fallback)');

              return { success: true, user: foundUser };
            }
          }

          // API falhou e não temos fallback - retornar erro
          const errorMessage =
            apiError?.response?.data?.message ||
            apiError?.message ||
            'E-mail ou senha incorretos';

          return {
            success: false,
            error: errorMessage,
          };
        }
      } catch (error: any) {
        console.error('[AuthContext] ❌ Erro no login:', error);

        return {
          success: false,
          error: error?.message || 'Erro ao fazer login. Tente novamente.',
        };
      }
    },
    []
  );

  /**
   * Logout - limpa autenticação
   */
  const logout = useCallback(() => {
    authAPI.logout();
    setUser(null);
    console.log('[AuthContext] 👋 Logout realizado');
  }, []);

  /**
   * DEV ONLY: Trocar role para testes
   * Remove em produção
   */
  const switchRole = useCallback((role: UserRole) => {
    if (!import.meta.env.DEV) {
      console.warn('[AuthContext] switchRole() apenas disponível em desenvolvimento');
      return;
    }

    const userWithRole = mockUsers.find((u) => u.role === role);
    if (userWithRole) {
      setUser(userWithRole);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithRole));
      console.log('[AuthContext] 🔄 Role trocada para:', role);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    switchRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Note: `useAuth` hook has been moved to `src/contexts/useAuth.tsx` to keep
// this module exporting only the provider component (react-refresh rule).
