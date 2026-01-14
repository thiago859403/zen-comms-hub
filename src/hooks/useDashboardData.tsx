import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { isDemoAccount, getDemoStats, getDemoPlanInfo, getDemoProfile } from '@/utils/demoData';

interface DashboardStats {
  totalContacts: number;
  contactsReached: number;
  contactsAttended: number;
  conversionRate: number;
  isLoading: boolean;
}

interface PlanInfo {
  name: string;
  startDate: string;
  endDate: string;
  channelsUsed: number;
  channelsLimit: number;
  interactionsUsed: number;
  interactionsLimit: number;
  usersCount: number;
  usersLimit: number;
  lastUpdated: string;
}

interface UserProfile {
  fullName: string;
  email: string;
  avatarInitials: string;
  avatarUrl: string | null;
  organizationName: string;
}

export const useDashboardData = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalContacts: 0,
    contactsReached: 0,
    contactsAttended: 0,
    conversionRate: 0,
    isLoading: true,
  });

  const [planInfo, setPlanInfo] = useState<PlanInfo>({
    name: 'Free',
    startDate: new Date().toLocaleDateString('pt-BR'),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
    channelsUsed: 0,
    channelsLimit: 100,
    interactionsUsed: 0,
    interactionsLimit: 500,
    usersCount: 1,
    usersLimit: 5,
    lastUpdated: new Date().toLocaleString('pt-BR'),
  });

  const [profile, setProfile] = useState<UserProfile>({
    fullName: 'Usuário',
    email: '',
    avatarInitials: 'US',
    avatarUrl: null,
    organizationName: 'Minha Organização',
  });

  // Ref para manter a função fetchData acessível
  const fetchDataRef = useRef<() => Promise<void>>();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Verificar se é conta de demonstração
        const userEmail = user.email;
        if (isDemoAccount(userEmail)) {
          // Retornar dados simulados para conta de demonstração
          const demoStats = getDemoStats();
          const demoPlanInfo = getDemoPlanInfo();
          const demoProfile = getDemoProfile();

          setStats({
            ...demoStats,
            isLoading: false,
          });
          setPlanInfo(demoPlanInfo);
          setProfile(demoProfile);
          return;
        }

        // Fetch user profile com empresa_id
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, email, empresa_id, avatar_url')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setStats(prev => ({ ...prev, isLoading: false }));
          return;
        }

        if (profileData) {
          const fullName = profileData.full_name || user.email?.split('@')[0] || 'Usuário';
          const initials = fullName
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

          let empresaName = 'Minha Organização';
          let empresaId: number | null = null;
          let planoId: number | null = null;

          // Buscar dados da empresa
          if (profileData.empresa_id) {
            empresaId = profileData.empresa_id;
            
            const { data: empresaData, error: empresaError } = await supabase
              .from('empresas')
              .select('nome, plano_id, created_at')
              .eq('id', profileData.empresa_id)
              .single();

            if (!empresaError && empresaData) {
              empresaName = empresaData.nome;
              planoId = empresaData.plano_id;

              // Calcular período (criado até +30 dias ou ciclo mensal)
              const createdAt = new Date(empresaData.created_at);
              const startDate = createdAt.toLocaleDateString('pt-BR');
              const endDate = new Date(createdAt.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR');

              // Buscar dados do plano
              if (planoId) {
                const { data: planoData, error: planoError } = await supabase
                  .from('planos')
                  .select('nome, max_usuarios, limite_mensagens_mes')
                  .eq('id', planoId)
                  .single();

                if (!planoError && planoData) {
                  // Buscar uso de recursos do mês atual
                  const currentMonth = new Date();
                  const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString().split('T')[0];

                  const { data: usoData, error: usoError } = await supabase
                    .from('uso_recursos')
                    .select('mensagens_enviadas')
                    .eq('empresa_id', empresaId)
                    .eq('mes_referencia', monthStart)
                    .single();

                  const mensagensUsadas = usoData?.mensagens_enviadas || 0;

                  // Contar usuários da empresa
                  const { count: usuariosCount, error: usuariosError } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true })
                    .eq('empresa_id', empresaId)
                    .eq('status', 'active');

                  const usuariosAtivos = usuariosCount || 0;

                  setPlanInfo({
                    name: planoData.nome,
                    startDate: startDate,
                    endDate: endDate,
                    channelsUsed: 0, // TODO: implementar contagem de canais ativos
                    channelsLimit: 100, // TODO: buscar do plano se existir
                    interactionsUsed: mensagensUsadas,
                    interactionsLimit: planoData.limite_mensagens_mes || 1000,
                    usersCount: usuariosAtivos,
                    usersLimit: planoData.max_usuarios || 1,
                    lastUpdated: new Date().toLocaleString('pt-BR'),
                  });
                } else {
                  console.error('Error fetching plano:', planoError);
                }
              }

              const newAvatarUrl = profileData.avatar_url || null;
              console.log('Atualizando perfil com avatar_url:', newAvatarUrl);
              setProfile({
                fullName,
                email: profileData.email,
                avatarInitials: initials,
                avatarUrl: newAvatarUrl,
                organizationName: empresaName,
              });

              // Buscar estatísticas (contatos, conversas, mensagens)
              // Buscar conversas da empresa
              const { count: totalConversations, error: convError } = await supabase
                .from('conversations')
                .select('*', { count: 'exact', head: true })
                .eq('empresa_id', empresaId);

              // Buscar conversas atendidas (com assigned_agent_id)
              const { count: attendedConversations, error: attendedError } = await supabase
                .from('conversations')
                .select('*', { count: 'exact', head: true })
                .eq('empresa_id', empresaId)
                .not('assigned_agent_id', 'is', null);

              // Buscar mensagens dos últimos 30 dias através de conversas
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

              // Primeiro buscar IDs das conversas da empresa
              const { data: conversationsData } = await supabase
                .from('conversations')
                .select('id')
                .eq('empresa_id', empresaId);

              const conversationIds = conversationsData?.map(c => c.id) || [];

              // Buscar mensagens dessas conversas
              let totalMessages = 0;
              if (conversationIds.length > 0) {
                const { count, error: messagesError } = await supabase
                  .from('messages')
                  .select('*', { count: 'exact', head: true })
                  .in('conversation_id', conversationIds)
                  .gte('created_at', thirtyDaysAgo.toISOString());
                
                totalMessages = count || 0;
              }

              const reached = totalMessages || 0;
              const attended = attendedConversations || 0;
              const rate = reached > 0 ? (attended / reached) * 100 : 0;

              setStats({
                totalContacts: totalConversations || 0,
                contactsReached: reached,
                contactsAttended: attended,
                conversionRate: Math.round(rate * 10) / 10,
                isLoading: false,
              });
            } else {
              console.error('Error fetching empresa:', empresaError);
              const newAvatarUrl = profileData.avatar_url || null;
              console.log('Atualizando perfil com avatar_url:', newAvatarUrl);
              setProfile({
                fullName,
                email: profileData.email,
                avatarInitials: initials,
                avatarUrl: newAvatarUrl,
                organizationName: empresaName,
              });
              setStats(prev => ({ ...prev, isLoading: false }));
            }
          } else {
            // Usuário sem empresa
            const newAvatarUrl = profileData.avatar_url || null;
            console.log('Atualizando perfil (sem empresa) com avatar_url:', newAvatarUrl);
            setProfile({
              fullName,
              email: profileData.email,
              avatarInitials: initials,
              avatarUrl: newAvatarUrl,
              organizationName: empresaName,
            });
            setStats(prev => ({ ...prev, isLoading: false }));
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setStats(prev => ({ ...prev, isLoading: false }));
      }
    };

    // Atualizar ref com a função atual
    fetchDataRef.current = fetchData;

    fetchData();

    // Listener para atualizar quando o perfil for modificado
    const handleProfileUpdate = () => {
      console.log('Evento profile-updated recebido, recarregando dados...');
      if (fetchDataRef.current) {
        fetchDataRef.current();
      } else {
        console.warn('fetchDataRef.current não está definido');
      }
    };

    window.addEventListener('profile-updated', handleProfileUpdate);

    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate);
    };
  }, [user]);

  return { stats, planInfo, profile };
};
