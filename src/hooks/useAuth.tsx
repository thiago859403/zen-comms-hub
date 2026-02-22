import { useState, useEffect, createContext, useContext, useCallback, useRef, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { setSentryContext, clearSentryContext } from '@/lib/sentryContext';
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js';

interface Empresa {
  id: number;
  nome: string;
  plano_id: number | null;
  status: string;
  is_active: boolean;
}

interface Profile {
  empresa_id: number | null;
  role: 'master' | 'admin' | 'user';
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  empresaId: number | null;
  empresa: Empresa | null;
  profile: Profile | null;
  planName: string | null;
}

interface AuthContextValue extends AuthState {
  signOut: () => Promise<void>;
  checkRole: (role: 'admin' | 'user' | 'moderator' | 'master') => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Estado persistente usando sessionStorage para sobreviver a HMR
const AUTH_STATE_KEY = 'nuvia_auth_state';
const getPersistedState = (): AuthState | null => {
  try {
    const stored = sessionStorage.getItem(AUTH_STATE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Não restaurar user completo, será recarregado via getSession
      return parsed;
    }
  } catch {
    // Ignorar erros de parsing
  }
  return null;
};

const persistState = (state: AuthState) => {
  try {
    // Persistir apenas flags, não o user completo (segurança)
    sessionStorage.setItem(AUTH_STATE_KEY, JSON.stringify({
      isAuthenticated: state.isAuthenticated,
      empresaId: state.empresaId,
    }));
  } catch {
    // Ignorar erros de storage
  }
};

// Estado global para persistir entre remontagens do React
let globalSubscription: { unsubscribe: () => void } | null = null;

// Hook para consumir o context
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider que gerencia o estado de autenticação
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Verificar se há estado persistido (indica que usuário estava autenticado)
  const persistedState = getPersistedState();
  
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    // Sempre mostrar loading inicialmente enquanto verifica sessão
    isLoading: true,
    // Se há estado persistido indicando autenticação, assumir autenticado
    // Isso evita redirect para /auth enquanto verifica a sessão
    isAuthenticated: persistedState?.isAuthenticated || false,
    empresaId: persistedState?.empresaId || null,
    empresa: null,
    profile: null,
    planName: null,
  });
  
  const navigate = useNavigate();
  const isInitialized = useRef(false);
  const fetchingRef = useRef(false);
  
  // Persistir estado quando autenticado
  useEffect(() => {
    if (authState.isAuthenticated && !authState.isLoading) {
      persistState(authState);
    }
  }, [authState]);

  // Função para buscar profile e empresa - memoizada para evitar recriação
  const fetchProfileAndEmpresa = useCallback(async (
    userId: string,
    retryCount = 0
  ): Promise<{ empresaId: number | null; empresa: Empresa | null; profile: Profile | null; planName: string | null }> => {
    const maxRetries = 2;
    const retryDelay = 400;

    try {
      let profileData = null;
      let profileError = null;

      for (let attempt = 0; attempt <= retryCount && attempt <= maxRetries; attempt++) {

        const result = await supabase
          .from('profiles')
          .select('empresa_id, role')
          .eq('id', userId)
          .single();

        profileData = result.data;
        profileError = result.error;

        if (profileData && !profileError) {
          break;
        }

        // Retry apenas para "not found"
        if (profileError?.code === 'PGRST116' && attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
          continue;
        }

        break;
      }

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('[AuthProvider] Profile error', { 
          code: profileError.code, 
          message: profileError.message 
        });
        return { empresaId: null, empresa: null, profile: null, planName: null };
      }

      if (!profileData) {
        console.warn('[AuthProvider] Profile not found after retries');
        return { empresaId: null, empresa: null, profile: null, planName: null };
      }

      const empresaId = profileData.empresa_id || null;
      const profile: Profile = {
        empresa_id: profileData.empresa_id,
        role: (profileData.role || 'user') as 'master' | 'admin' | 'user',
      };

      let empresa: Empresa | null = null;
      let planName: string | null = null;
      if (empresaId) {
        const { data: empresaData, error: empresaError } = await supabase
          .from('empresas')
          .select('id, nome, plano_id, status, is_active')
          .eq('id', empresaId)
          .single();

        if (!empresaError && empresaData) {
          empresa = {
            id: empresaData.id,
            nome: empresaData.nome,
            plano_id: empresaData.plano_id,
            status: empresaData.status,
            is_active: empresaData.is_active,
          };

          // Buscar nome do plano (lightweight) para contexto Sentry
          if (empresaData.plano_id) {
            const { data: planoData, error: planoError } = await supabase
              .from('planos')
              .select('nome')
              .eq('id', empresaData.plano_id)
              .single();

            if (planoError) {
              console.warn('[AuthProvider] Plano query error', {
                code: planoError.code,
                message: planoError.message,
                plano_id: empresaData.plano_id,
              });
            }
            planName = planoData?.nome ?? null;
          }
        } else if (empresaError) {
          console.warn('[AuthProvider] Empresa error', { 
            code: empresaError.code, 
            message: empresaError.message 
          });
        }
      }

      return { empresaId, empresa, profile, planName };
    } catch (error) {
      console.error('[AuthProvider] Exception in fetchProfileAndEmpresa', {
        message: error instanceof Error ? error.message : String(error),
      });
      return { empresaId: null, empresa: null, profile: null, planName: null };
    }
  }, []);

  // Handler para mudanças de autenticação
  const handleAuthChange = useCallback(async (
    event: AuthChangeEvent,
    session: Session | null
  ) => {

    // Evitar chamadas duplicadas enquanto está buscando
    if (fetchingRef.current && event !== 'SIGNED_OUT') {
      return;
    }

    // SIGNED_OUT: limpar estado imediatamente
    if (event === 'SIGNED_OUT' || !session?.user) {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        empresaId: null,
        empresa: null,
        profile: null,
        planName: null,
      });
      return;
    }

    // Tem sessão válida - IMPORTANTE: Setar isAuthenticated:true e isLoading:true ANTES de buscar dados
    // Isso evita que o ProtectedRoute redirecione enquanto buscamos o profile
    fetchingRef.current = true;
    
    setAuthState(prev => ({
      ...prev,
      user: session.user,
      isLoading: true, // Manter loading enquanto busca profile
      isAuthenticated: true, // IMPORTANTE: Já autenticado!
    }));
    
    try {
      // Usar retry apenas no primeiro carregamento (pode ser após signup)
      const retryCount = !isInitialized.current ? 2 : 0;
      const { empresaId, empresa, profile, planName } = await fetchProfileAndEmpresa(
        session.user.id, 
        retryCount
      );

      setAuthState({
        user: session.user,
        isLoading: false,
        isAuthenticated: true,
        empresaId,
        empresa,
        profile,
        planName,
      });
      
      isInitialized.current = true;
    } catch (error) {
      console.error('[AuthProvider] Error handling auth change', {
        message: error instanceof Error ? error.message : String(error),
      });
      
      // Mesmo com erro, finalizar loading mas manter autenticado
      setAuthState({
        user: session.user,
        isLoading: false,
        isAuthenticated: true,
        empresaId: null,
        empresa: null,
        profile: null,
        planName: null,
      });
    } finally {
      fetchingRef.current = false;
    }
  }, [fetchProfileAndEmpresa]);

  // Effect principal - roda apenas uma vez na montagem
  useEffect(() => {
    
    let isMounted = true;
    let initialSessionHandled = false;
    
    // Registrar listener para mudanças (incluindo INITIAL_SESSION)
    // O onAuthStateChange é a fonte primária de verdade
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        
        if (!isMounted) return;
        
        // Marcar que INITIAL_SESSION foi processado
        if (event === 'INITIAL_SESSION') {
          initialSessionHandled = true;
        }
        
        // Processar todos os eventos
        handleAuthChange(event, session);
      }
    );
    
    // Guardar subscription globalmente
    globalSubscription = subscription;

    // Fallback: se após 500ms não recebemos INITIAL_SESSION, verificar manualmente
    const fallbackTimeout = setTimeout(async () => {
      if (!isMounted || initialSessionHandled) return;
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!isMounted || initialSessionHandled) return;
      
      
      handleAuthChange('INITIAL_SESSION', session);
    }, 500);

    // Cleanup
    return () => {
      isMounted = false;
      clearTimeout(fallbackTimeout);
      // NÃO fazer unsubscribe na desmontagem para evitar perda de eventos
      // subscription.unsubscribe();
    };
  }, [handleAuthChange]);

  // Timeout de segurança (fallback)
  useEffect(() => {
    if (!authState.isLoading) return;

    const timeoutId = setTimeout(() => {
      if (authState.isLoading) {
        console.warn('[AuthProvider] Safety timeout (6s) - forcing resolution');
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
        }));
      }
    }, 6000);

    return () => clearTimeout(timeoutId);
  }, [authState.isLoading]);

  // Atualizar Sentry context reativamente sempre que user/empresa/empresaId/planName mudarem
  // Usa empresaId como fallback para tenant_id quando empresa ainda não carregou
  useEffect(() => {
    if (!authState.user) {
      clearSentryContext();
      return;
    }

    // Tenant: empresa completa se disponível, senão fallback com empresaId
    const tenant = authState.empresa
      ? {
          id: authState.empresa.id,
          name: authState.empresa.nome,
          status: authState.empresa.status,
        }
      : authState.empresaId
        ? {
            id: authState.empresaId,
            name: 'unknown',
            status: 'unknown',
          }
        : null;

    // Plan: dados completos se empresa carregou, senão fallback com planName
    const plan = authState.empresa?.plano_id
      ? {
          id: authState.empresa.plano_id,
          name: authState.planName ?? 'unknown',
        }
      : authState.planName
        ? {
            id: null,
            name: authState.planName,
          }
        : null;

    setSentryContext({
      user: {
        id: authState.user.id,
        email: authState.user.email,
        name: authState.user.user_metadata?.full_name as string | undefined,
      },
      tenant,
      plan,
    });
  }, [authState.user, authState.empresa, authState.empresaId, authState.planName]);

  const signOut = useCallback(async () => {
    clearSentryContext(); // Limpar contexto multi-tenant no Sentry
    await supabase.auth.signOut();
    navigate('/auth');
  }, [navigate]);

  const checkRole = useCallback(async (role: 'admin' | 'user' | 'moderator' | 'master'): Promise<boolean> => {
    if (!authState.user) return false;

    // Verificar role no profile (mais rápido)
    if (authState.profile) {
      if (role === 'master' && authState.profile.role === 'master') return true;
      if (role === 'admin' && (authState.profile.role === 'admin' || authState.profile.role === 'master')) return true;
      if (role === 'user' && authState.profile.role) return true;
    }

    // Fallback para função RPC
    try {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: authState.user.id,
        _role: role as any,
      });

      if (error) {
        console.error('[AuthProvider] Error checking role:', error);
        return false;
      }

      return data || false;
    } catch {
      return false;
    }
  }, [authState.user, authState.profile]);

  const value: AuthContextValue = {
    ...authState,
    signOut,
    checkRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
