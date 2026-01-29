import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

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
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    empresaId: null,
    empresa: null,
    profile: null,
  });
  const navigate = useNavigate();

  const fetchProfileAndEmpresa = async (userId: string) => {
    try {
      // Buscar perfil com empresa_id
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('empresa_id, role')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return { empresaId: null, empresa: null, profile: null };
      }

      const empresaId = profileData?.empresa_id || null;
      const profile = profileData ? {
        empresa_id: profileData.empresa_id,
        role: profileData.role as 'master' | 'admin' | 'user',
      } : null;

      // Se tiver empresa_id, buscar dados da empresa
      let empresa: Empresa | null = null;
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
        }
      }

      return { empresaId, empresa, profile };
    } catch (error) {
      console.error('Error fetching profile and empresa:', error);
      return { empresaId: null, empresa: null, profile: null };
    }
  };

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { empresaId, empresa, profile } = await fetchProfileAndEmpresa(session.user.id);
        setAuthState({
          user: session.user,
          isLoading: false,
          isAuthenticated: true,
          empresaId,
          empresa,
          profile,
        });
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          empresaId: null,
          empresa: null,
          profile: null,
        });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { empresaId, empresa, profile } = await fetchProfileAndEmpresa(session.user.id);
        setAuthState({
          user: session.user,
          isLoading: false,
          isAuthenticated: true,
          empresaId,
          empresa,
          profile,
        });
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          empresaId: null,
          empresa: null,
          profile: null,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const checkRole = async (role: 'admin' | 'user' | 'moderator' | 'master'): Promise<boolean> => {
    if (!authState.user) return false;

    // Primeiro verificar role no profile (mais rápido)
    if (authState.profile) {
      if (role === 'master' && authState.profile.role === 'master') return true;
      if (role === 'admin' && (authState.profile.role === 'admin' || authState.profile.role === 'master')) return true;
      if (role === 'user' && authState.profile.role) return true;
    }

    // Fallback para função RPC (compatibilidade)
    const { data, error } = await supabase.rpc('has_role', {
      _user_id: authState.user.id,
      _role: role as any,
    });

    if (error) {
      console.error('Error checking role:', error);
      return false;
    }

    return data || false;
  };

  return {
    ...authState,
    signOut,
    checkRole,
  };
};
