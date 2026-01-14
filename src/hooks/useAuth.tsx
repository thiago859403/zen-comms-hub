import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({
        user: session?.user ?? null,
        isLoading: false,
        isAuthenticated: !!session,
      });
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState({
        user: session?.user ?? null,
        isLoading: false,
        isAuthenticated: !!session,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const checkRole = async (role: 'admin' | 'user' | 'moderator' | 'master'): Promise<boolean> => {
    if (!authState.user) return false;

    try {
      // Verificar role diretamente na tabela profiles (novo modelo)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authState.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        // Fallback: tentar usar a função has_role antiga (user_roles)
        const { data, error } = await supabase.rpc('has_role', {
          _user_id: authState.user.id,
          _role: role as any,
        });

        if (error) {
          console.error('Error checking role (fallback):', error);
          return false;
        }

        return data || false;
      }

      // Verificar se o role do perfil corresponde ao role solicitado
      // Master admins têm acesso a tudo (incluindo quando solicitado 'admin')
      if (profile?.role === role) {
        return true;
      }
      
      // Se o perfil for master, tem acesso a tudo (incluindo páginas que requerem 'admin')
      // Ex: se solicitado 'admin' mas perfil é 'master', permite acesso
      if (profile?.role === 'master') {
        return true;
      }

      // Se não encontrou na coluna role, tentar user_roles como fallback
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: authState.user.id,
        _role: role as any,
      });

      if (error) {
        console.error('Error checking role in user_roles:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('Error in checkRole:', error);
      return false;
    }
  };

  return {
    ...authState,
    signOut,
    checkRole,
  };
};
