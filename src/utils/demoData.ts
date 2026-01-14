/**
 * Dados simulados para a conta de demonstração
 * Email: Nuviaadmcloud859402@nuvia.com
 */

export const DEMO_ACCOUNT_EMAIL = 'Nuviaadmcloud859402@nuvia.com';

export interface DemoStats {
  totalContacts: number;
  contactsReached: number;
  contactsAttended: number;
  conversionRate: number;
}

export interface DemoPlanInfo {
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

export interface DemoProfile {
  fullName: string;
  email: string;
  avatarInitials: string;
  avatarUrl: string | null;
  organizationName: string;
}

/**
 * Gera dados simulados de estatísticas do dashboard
 */
export const getDemoStats = (): DemoStats => {
  return {
    totalContacts: 2847,
    contactsReached: 2156,
    contactsAttended: 1843,
    conversionRate: 85.5,
  };
};

/**
 * Gera dados simulados do plano
 */
export const getDemoPlanInfo = (): DemoPlanInfo => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 15);
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 15);

  return {
    name: 'Business',
    startDate: startDate.toLocaleDateString('pt-BR'),
    endDate: endDate.toLocaleDateString('pt-BR'),
    channelsUsed: 3,
    channelsLimit: 5,
    interactionsUsed: 15234,
    interactionsLimit: 50000,
    usersCount: 8,
    usersLimit: 15,
    lastUpdated: new Date().toLocaleString('pt-BR'),
  };
};

/**
 * Gera dados simulados do perfil
 */
export const getDemoProfile = (): DemoProfile => {
  return {
    fullName: 'Nuvia Demo',
    email: DEMO_ACCOUNT_EMAIL,
    avatarInitials: 'ND',
    avatarUrl: null,
    organizationName: 'Nuvia Customer Cloud - Demonstração',
  };
};

/**
 * Verifica se o email fornecido é a conta de demonstração
 */
export const isDemoAccount = (email: string | undefined | null): boolean => {
  return email?.toLowerCase() === DEMO_ACCOUNT_EMAIL.toLowerCase();
};

/**
 * Gera dados simulados para gráficos de volume de disparos e atendimentos
 */
export const getDemoChartData = () => {
  const days = 30;
  const data = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Valores simulados com variação realista
    const baseDisparos = 150 + Math.sin(i / 5) * 30 + Math.random() * 40;
    const baseAtendimentos = baseDisparos * (0.75 + Math.random() * 0.2);
    
    data.push({
      date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      disparos: Math.round(baseDisparos),
      atendimentos: Math.round(baseAtendimentos),
    });
  }
  
  return data;
};

/**
 * Gera dados simulados para distribuição geográfica
 */
export const getDemoGeographicData = () => {
  return [
    { state: 'SP', disparos: 1250, atendimentos: 1050 },
    { state: 'RJ', disparos: 680, atendimentos: 580 },
    { state: 'MG', disparos: 450, atendimentos: 380 },
    { state: 'RS', disparos: 320, atendimentos: 270 },
    { state: 'PR', disparos: 280, atendimentos: 240 },
    { state: 'SC', disparos: 180, atendimentos: 150 },
    { state: 'BA', disparos: 220, atendimentos: 185 },
    { state: 'GO', disparos: 150, atendimentos: 128 },
    { state: 'PE', disparos: 140, atendimentos: 115 },
    { state: 'CE', disparos: 120, atendimentos: 102 },
  ];
};

/**
 * Dados simulados para Analytics/KPIs
 */
export interface DemoAnalyticsKPIs {
  mensagens: { value: number; change: number; period: string };
  usuariosAtivos: { value: number; change: number; period: string };
  taxaConversao: { value: number; change: number; period: string };
  tempoResposta: { value: number; change: number; period: string };
  satisfacao: { value: number; totalAvaliacoes: number };
  roi: { value: number; description: string };
}

export const getDemoAnalyticsKPIs = (): DemoAnalyticsKPIs => {
  return {
    mensagens: { value: 45200, change: 20, period: 'vs mês anterior' },
    usuariosAtivos: { value: 8429, change: 12, period: 'esta semana' },
    taxaConversao: { value: 24.8, change: 3.2, period: 'vs semana passada' },
    tempoResposta: { value: 2.4, change: -0.3, period: 'vs ontem' },
    satisfacao: { value: 4.7, totalAvaliacoes: 892 },
    roi: { value: 340, description: 'Retorno sobre investimento' },
  };
};

/**
 * Dados simulados para performance por canal
 */
export interface DemoChannelPerformance {
  channel: string;
  messages: number;
  rate: number;
}

export const getDemoChannelPerformance = (): DemoChannelPerformance[] => {
  return [
    { channel: 'WhatsApp', messages: 28500, rate: 92 },
    { channel: 'Messenger', messages: 12300, rate: 88 },
    { channel: 'Instagram', messages: 4400, rate: 85 },
  ];
};

/**
 * Dados simulados para performance de chatbots
 */
export interface DemoChatbotPerformance {
  name: string;
  score: number;
  interactions: number;
}

export const getDemoChatbotPerformance = (): DemoChatbotPerformance[] => {
  return [
    { name: 'Atendimento Comercial', score: 96, interactions: 12500 },
    { name: 'Suporte Técnico', score: 94, interactions: 8200 },
    { name: 'FAQ Automático', score: 91, interactions: 15300 },
  ];
};

/**
 * Dados simulados para heatmap de horários (7 dias x 24 horas)
 */
export const getDemoHeatmapData = () => {
  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const data: Array<{ day: string; hour: number; value: number }> = [];

  days.forEach((day, dayIndex) => {
    hours.forEach((hour) => {
      // Simular picos durante horário comercial (9h-18h) e dias úteis
      let baseValue = 20;
      if (dayIndex < 5) { // Dias úteis
        if (hour >= 9 && hour <= 18) {
          baseValue = 80 + Math.sin((hour - 9) / 9 * Math.PI) * 40;
        }
      } else { // Fim de semana
        baseValue = 30 + Math.random() * 30;
      }
      
      data.push({
        day,
        hour,
        value: Math.round(baseValue + Math.random() * 20),
      });
    });
  });

  return data;
};

/**
 * Dados simulados para funil de engajamento
 */
export interface DemoFunnelData {
  stage: string;
  value: number;
  percentage: number;
}

export const getDemoFunnelData = (): DemoFunnelData[] => {
  return [
    { stage: 'Mensagens Recebidas', value: 45200, percentage: 100 },
    { stage: 'Mensagens Lidas', value: 39500, percentage: 87.4 },
    { stage: 'Respostas', value: 28900, percentage: 63.9 },
    { stage: 'Conversas Atendidas', value: 21500, percentage: 47.6 },
    { stage: 'Conversões', value: 11200, percentage: 24.8 },
  ];
};
