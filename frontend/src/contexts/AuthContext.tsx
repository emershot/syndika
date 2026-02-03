import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole } from '@/types/condominium';
import { mockUsers } from '@/data/mockData';
import { AuthContext, AuthContextType } from './authContextObject';
import { authAPI, getStoredUser, getToken } from '@/lib/api';

const STORAGE_KEY = 'syndika_user';
const DEFAULT_TENANT_SLUG = 'esperanca'; // Tenant padrão para desenvolvimento

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore user from localStorage on mount + auto-login com JWT
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Verifica se tem token JWT salvo
        const token = getToken();
        const storedUser = getStoredUser();

        if (token && storedUser) {
          // Tenta validar token com backend
          try {
            const validatedUser = await authAPI.me();
            setUser(validatedUser);
            console.log('[AuthContext] Auto-login com JWT bem-sucedido');
          } catch (error) {
            console.warn('[AuthContext] Token JWT inválido, fazendo logout');
            authAPI.logout();
            setUser(null);
          }
        } else if (storedUser && !token) {
          // Tem user mas não tem token (migração de mock para API)
          // Mantém user mock temporariamente
          setUser(storedUser);
          console.log('[AuthContext] Usando dados mock (sem JWT)');
        }
      } catch (error) {
        console.error('[AuthContext] Erro ao inicializar auth:', error);
        authAPI.logout();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> => {
    try {
      // Validação básica
      if (!email || !password) {
        return { success: false, error: 'E-mail e senha são obrigatórios' };
      }

      if (password.length < 3) {
        return { success: false, error: 'Senha deve ter pelo menos 3 caracteres' };
      }

      // Tenta login via API real
      try {
        console.log('[AuthContext] Tentando login via API...');
        
        const { user: apiUser } = await authAPI.login({
          email,
          password,
          tenantSlug: DEFAULT_TENANT_SLUG,
        });

        setUser(apiUser);
        console.log('[AuthContext] Login via API bem-sucedido');
        
        return { success: true, user: apiUser };
      } catch (apiError: any) {
        console.warn('[AuthContext] Login via API falhou, tentando mock...', apiError);

        // Fallback para mock se API não estiver disponível
        const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (foundUser) {
          setUser(foundUser);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(foundUser));
          console.log('[AuthContext] Login via mock bem-sucedido (fallback)');
          
          return { success: true, user: foundUser };
        }

        // Se nem API nem mock funcionaram
        return { 
          success: false, 
          error: apiError.message || 'E-mail ou senha incorretos' 
        };
      }
    } catch (error: any) {
      console.error('[AuthContext] Erro no login:', error);
      return { 
        success: false, 
        error: error.message || 'Erro ao fazer login. Tente novamente.' 
      };
    }
  };

  const logout = () => {
    // Logout via API (limpa localStorage)
    authAPI.logout();
    setUser(null);
    console.log('[AuthContext] Logout realizado');
  };

  // Demo function to switch between roles (apenas para desenvolvimento)
  const switchRole = (role: UserRole) => {
    const userWithRole = mockUsers.find(u => u.role === role);
    if (userWithRole) {
      setUser(userWithRole);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithRole));
      console.log('[AuthContext] Role trocada para:', role);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Note: `useAuth` hook has been moved to `src/contexts/useAuth.tsx` to keep
// this module exporting only the provider component (react-refresh rule).
