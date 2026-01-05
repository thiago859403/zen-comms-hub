import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

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
    organizationName: 'Minha Organização',
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, email, plan, org_id')
          .eq('id', user.id)
          .single();

        if (profileData) {
          const fullName = profileData.full_name || user.email?.split('@')[0] || 'Usuário';
          const initials = fullName
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

          // Fetch organization name
          let orgName = 'Minha Organização';
          if (profileData.org_id) {
            const { data: orgData } = await supabase
              .from('organizations')
              .select('name')
              .eq('id', profileData.org_id)
              .single();
            if (orgData) {
              orgName = orgData.name;
            }
          }

          setProfile({
            fullName,
            email: profileData.email,
            avatarInitials: initials,
            organizationName: orgName,
          });

          // Update plan info based on profile
          if (profileData.plan) {
            setPlanInfo(prev => ({
              ...prev,
              name: profileData.plan === 'free' ? 'Free' : 
                    profileData.plan === 'pro' ? 'Pro' : 
                    profileData.plan === 'expert' ? 'Expert' : profileData.plan,
            }));
          }
        }

        // Fetch conversations stats
        const { count: totalConversations } = await supabase
          .from('conversations')
          .select('*', { count: 'exact', head: true });

        const { count: attendedConversations } = await supabase
          .from('conversations')
          .select('*', { count: 'exact', head: true })
          .not('assigned_agent_id', 'is', null);

        // Fetch messages stats
        const { count: totalMessages } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true });

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

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setStats(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchData();
  }, [user]);

  return { stats, planInfo, profile };
};
