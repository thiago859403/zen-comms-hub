import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Empresa {
  id: number;
  nome: string;
  plano_id: number | null;
  contexto_ia: Record<string, any>;
  stripe_customer_id: string | null;
  status: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Plano {
  id: number;
  nome: string;
  preco_mensal: number;
  max_usuarios: number;
  max_agentes: number;
  limite_mensagens_mes: number;
  features: Record<string, any>;
  is_active: boolean;
}

interface EmpresaWithPlano extends Empresa {
  plano: Plano | null;
}

export const useEmpresa = () => {
  const { empresaId, isAuthenticated } = useAuth();
  const [empresa, setEmpresa] = useState<EmpresaWithPlano | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Query para buscar empresa e plano
  const { data, error, refetch } = useQuery({
    queryKey: ['empresa', empresaId],
    queryFn: async () => {
      if (!empresaId || !isAuthenticated) return null;

      // Buscar empresa
      const { data: empresaData, error: empresaError } = await supabase
        .from('empresas')
        .select('*')
        .eq('id', empresaId)
        .single();

      if (empresaError) throw empresaError;
      if (!empresaData) return null;

      // Buscar plano se tiver plano_id
      let plano: Plano | null = null;
      if (empresaData.plano_id) {
        const { data: planoData, error: planoError } = await supabase
          .from('planos')
          .select('*')
          .eq('id', empresaData.plano_id)
          .single();

        if (!planoError && planoData) {
          plano = {
            id: planoData.id,
            nome: planoData.nome,
            preco_mensal: parseFloat(planoData.preco_mensal.toString()),
            max_usuarios: planoData.max_usuarios,
            max_agentes: planoData.max_agentes,
            limite_mensagens_mes: planoData.limite_mensagens_mes,
            features: planoData.features || {},
            is_active: planoData.is_active,
          };
        }
      }

      return {
        ...empresaData,
        plano,
      } as EmpresaWithPlano;
    },
    enabled: !!empresaId && isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });

  useEffect(() => {
    if (data !== undefined) {
      setEmpresa(data);
      setIsLoading(false);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      console.error('Error fetching empresa:', error);
      setIsLoading(false);
    }
  }, [error]);

  return {
    empresa,
    isLoading,
    error,
    refetch,
  };
};
