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
import { Loader2 } from "lucide-react";

interface ApiKey {
  id: number;
  provider: string;
  key_name: string;
  is_active: boolean;
  is_default: boolean;
}

interface ActiveKeySelectorProps {
  provider: string;
  value?: number | null;
  onChange?: (keyId: number | null) => void;
  disabled?: boolean;
}

const providerLabels: Record<string, string> = {
  openai: 'OpenAI',
  claude: 'Claude',
  anthropic: 'Anthropic',
  google: 'Google',
  other: 'Outro',
};

export const ActiveKeySelector = ({
  provider,
  value,
  onChange,
  disabled = false,
}: ActiveKeySelectorProps) => {
  const { empresaId } = useAuth();
  const { empresa } = useEmpresa();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (empresaId) {
      loadApiKeys();
    }
  }, [empresaId, provider]);

  const loadApiKeys = async () => {
    if (!empresaId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('api_keys')
        .select('id, provider, key_name, is_active, is_default')
        .eq('empresa_id', empresaId)
        .eq('provider', provider)
        .eq('is_active', true)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      setApiKeys((data as ApiKey[]) || []);

      // Se não há valor selecionado e há uma chave padrão, selecionar automaticamente
      if (!value && data && data.length > 0) {
        const defaultKey = data.find((k: ApiKey) => k.is_default);
        if (defaultKey && onChange) {
          onChange(defaultKey.id);
        } else if (data.length === 1 && onChange) {
          // Se há apenas uma chave, selecionar automaticamente
          onChange(data[0].id);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar chaves:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Carregando chaves...</span>
      </div>
    );
  }

  if (apiKeys.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Nenhuma chave ativa para {providerLabels[provider] || provider}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Select
        value={value?.toString() || ''}
        onValueChange={(val) => onChange?.(val ? parseInt(val) : null)}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma chave" />
        </SelectTrigger>
        <SelectContent>
          {apiKeys.map((key) => (
            <SelectItem key={key.id} value={key.id.toString()}>
              <div className="flex items-center gap-2">
                <span>{key.key_name}</span>
                {key.is_default && (
                  <Badge variant="default" className="text-xs">Padrão</Badge>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {apiKeys.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {apiKeys.length} chave(s) disponível(is) para {providerLabels[provider] || provider}
        </p>
      )}
    </div>
  );
};
