import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useEmpresa } from "@/hooks/useEmpresa";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Bot } from "lucide-react";

interface AgenteIA {
  id: number;
  nome: string;
  status: string;
}

interface AgentSelectorProps {
  conversationId: string;
  value?: number | null;
  onChange?: (agenteId: number | null) => void;
  disabled?: boolean;
}

export const AgentSelector = ({
  conversationId,
  value,
  onChange,
  disabled = false,
}: AgentSelectorProps) => {
  const { empresaId } = useAuth();
  const { empresa } = useEmpresa();
  const [agentes, setAgentes] = useState<AgenteIA[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentAgente, setCurrentAgente] = useState<number | null>(value || null);

  useEffect(() => {
    if (empresaId) {
      loadAgentes();
      loadCurrentAgente();
    }
  }, [empresaId, conversationId]);

  useEffect(() => {
    if (value !== undefined) {
      setCurrentAgente(value);
    }
  }, [value]);

  const loadAgentes = async () => {
    if (!empresaId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('agentes_ia')
        .select('id, nome, status')
        .eq('empresa_id', empresaId)
        .eq('status', 'active')
        .order('nome', { ascending: true });

      if (error) throw error;

      setAgentes((data as AgenteIA[]) || []);
    } catch (error) {
      console.error('Erro ao carregar agentes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentAgente = async () => {
    if (!conversationId) return;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('agente_id')
        .eq('id', conversationId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao carregar agente da conversa:', error);
        return;
      }

      if (data?.agente_id) {
        setCurrentAgente(data.agente_id);
        if (onChange) {
          onChange(data.agente_id);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar agente atual:', error);
    }
  };

  const handleChange = async (agenteId: string) => {
    const newAgenteId = agenteId === 'none' ? null : parseInt(agenteId);
    setCurrentAgente(newAgenteId);

    // Atualizar conversa
    if (conversationId) {
      try {
        const { error } = await supabase
          .from('conversations')
          .update({ agente_id: newAgenteId })
          .eq('id', conversationId);

        if (error) throw error;
      } catch (error) {
        console.error('Erro ao atualizar agente da conversa:', error);
        // Reverter mudança em caso de erro
        setCurrentAgente(value || null);
      }
    }

    if (onChange) {
      onChange(newAgenteId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Carregando agentes...</span>
      </div>
    );
  }

  if (agentes.length === 0) {
    return (
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <Bot className="h-4 w-4" />
        <span>Nenhum agente ativo disponível</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Select
        value={currentAgente?.toString() || 'none'}
        onValueChange={handleChange}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione um agente" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Nenhum agente</SelectItem>
          {agentes.map((agente) => (
            <SelectItem key={agente.id} value={agente.id.toString()}>
              <div className="flex items-center gap-2">
                <Bot className="h-3 w-3" />
                <span>{agente.nome}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {currentAgente && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="text-xs">
            Agente atribuído
          </Badge>
          <span>
            {agentes.find((a) => a.id === currentAgente)?.nome}
          </span>
        </div>
      )}
    </div>
  );
};
