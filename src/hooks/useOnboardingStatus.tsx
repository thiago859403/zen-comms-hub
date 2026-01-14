import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { isDemoAccount } from '@/utils/demoData';

export type OnboardingStatus = 'pending' | 'in-progress' | 'done';

export interface OnboardingItemStatus {
  id: string;
  title: string;
  description: string;
  status: OnboardingStatus;
  action?: () => void;
}

// Remover a exportação duplicada da interface

export const useOnboardingStatus = () => {
  const { user } = useAuth();
  const [statuses, setStatuses] = useState<OnboardingItemStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStatuses = async () => {
      if (!user) {
        // Se não há usuário, definir status padrão (todos pending)
        setStatuses([
          {
            id: 'add-team',
            title: 'Adicionar equipe',
            description: 'Prepare-se para atender seus clientes',
            status: 'pending',
          },
          {
            id: 'import-contacts',
            title: 'Importar base de contatos',
            description: 'Conecte dados e conheça melhor seu público',
            status: 'pending',
          },
          {
            id: 'send-message',
            title: 'Disparar mensagem',
            description: 'Atraia mais clientes com mensagens multicanais',
            status: 'pending',
          },
        ]);
        setIsLoading(false);
        return;
      }

      try {
        // Verificar se é conta de demonstração
        const userEmail = user.email;
        if (isDemoAccount(userEmail)) {
          // Retornar status simulados para conta de demonstração (todos concluídos)
          setStatuses([
            {
              id: 'add-team',
              title: 'Adicionar equipe',
              description: 'Prepare-se para atender seus clientes',
              status: 'done',
            },
            {
              id: 'import-contacts',
              title: 'Importar base de contatos',
              description: 'Conecte dados e conheça melhor seu público',
              status: 'done',
            },
            {
              id: 'send-message',
              title: 'Disparar mensagem',
              description: 'Atraia mais clientes com mensagens multicanais',
              status: 'done',
            },
          ]);
          setIsLoading(false);
          return;
        }

        // Buscar empresa_id do perfil
        const { data: profileData } = await supabase
          .from('profiles')
          .select('empresa_id')
          .eq('id', user.id)
          .single();

        // Se não há empresa_id, definir status padrão (todos pending)
        if (!profileData?.empresa_id) {
          setStatuses([
            {
              id: 'add-team',
              title: 'Adicionar equipe',
              description: 'Prepare-se para atender seus clientes',
              status: 'pending',
            },
            {
              id: 'import-contacts',
              title: 'Importar base de contatos',
              description: 'Conecte dados e conheça melhor seu público',
              status: 'pending',
            },
            {
              id: 'send-message',
              title: 'Disparar mensagem',
              description: 'Atraia mais clientes com mensagens multicanais',
              status: 'pending',
            },
          ]);
          setIsLoading(false);
          return;
        }

        const empresaId = profileData.empresa_id;

        // 1. Verificar se há mais de 1 usuário na empresa (equipe adicionada)
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('empresa_id', empresaId)
          .eq('status', 'active');

        const hasTeam = (usersCount || 0) > 1;

        // 2. Verificar se há contatos/conversas (contatos importados)
        const { count: contactsCount } = await supabase
          .from('conversations')
          .select('*', { count: 'exact', head: true })
          .eq('empresa_id', empresaId);

        const hasContacts = (contactsCount || 0) > 0;

        // 3. Verificar se há mensagens enviadas (disparo de mensagem)
        // Verificar mensagens através de conversas da empresa
        const { data: conversations } = await supabase
          .from('conversations')
          .select('id')
          .eq('empresa_id', empresaId)
          .limit(1);

        let hasSentMessages = false;
        if (conversations && conversations.length > 0) {
          const { count: messagesCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('sender_type', 'user')
            .in('conversation_id', conversations.map(c => c.id));

          hasSentMessages = (messagesCount || 0) > 0;
        }

        setStatuses([
          {
            id: 'add-team',
            title: 'Adicionar equipe',
            description: 'Prepare-se para atender seus clientes',
            status: hasTeam ? 'done' : 'pending',
          },
          {
            id: 'import-contacts',
            title: 'Importar base de contatos',
            description: 'Conecte dados e conheça melhor seu público',
            status: hasContacts ? 'done' : 'pending',
          },
          {
            id: 'send-message',
            title: 'Disparar mensagem',
            description: 'Atraia mais clientes com mensagens multicanais',
            status: hasSentMessages ? 'done' : 'pending',
          },
        ]);

        setIsLoading(false);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // Em caso de erro, definir status padrão (todos pending)
        setStatuses([
          {
            id: 'add-team',
            title: 'Adicionar equipe',
            description: 'Prepare-se para atender seus clientes',
            status: 'pending',
          },
          {
            id: 'import-contacts',
            title: 'Importar base de contatos',
            description: 'Conecte dados e conheça melhor seu público',
            status: 'pending',
          },
          {
            id: 'send-message',
            title: 'Disparar mensagem',
            description: 'Atraia mais clientes com mensagens multicanais',
            status: 'pending',
          },
        ]);
        setIsLoading(false);
      }
    };

    checkStatuses();
  }, [user]);

  return { statuses, isLoading };
};
