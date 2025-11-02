import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { Node } from '@xyflow/react';

interface NodeConfigPanelProps {
  node: Node | null;
  onClose: () => void;
  onUpdate: (nodeId: string, data: any) => void;
}

export default function NodeConfigPanel({ node, onClose, onUpdate }: NodeConfigPanelProps) {
  if (!node) return null;

  const handleUpdate = (field: string, value: string) => {
    onUpdate(node.id, { ...node.data, [field]: value });
  };

  return (
    <div className="absolute top-0 right-0 w-80 h-full bg-card border-l border-border shadow-lg z-20 overflow-y-auto">
      <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-card">
        <h3 className="font-semibold text-foreground">Configurar Nó</h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {node.type === 'message' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="message">Mensagem</Label>
              <Textarea
                id="message"
                placeholder="Digite a mensagem que será enviada..."
                value={String(node.data.message || '')}
                onChange={(e) => handleUpdate('message', e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="messageType">Tipo de Mensagem</Label>
              <Select value={String(node.data.messageType || 'text')} onValueChange={(value) => handleUpdate('messageType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Texto</SelectItem>
                  <SelectItem value="image">Imagem</SelectItem>
                  <SelectItem value="video">Vídeo</SelectItem>
                  <SelectItem value="audio">Áudio</SelectItem>
                  <SelectItem value="document">Documento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {node.type === 'condition' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="condition">Condição</Label>
              <Input
                id="condition"
                placeholder="Ex: resposta contém 'sim'"
                value={String(node.data.condition || '')}
                onChange={(e) => handleUpdate('condition', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="conditionType">Tipo de Condição</Label>
              <Select value={String(node.data.conditionType || 'contains')} onValueChange={(value) => handleUpdate('conditionType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contains">Contém</SelectItem>
                  <SelectItem value="equals">Igual a</SelectItem>
                  <SelectItem value="notEquals">Diferente de</SelectItem>
                  <SelectItem value="regex">Regex</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="variable">Variável</Label>
              <Input
                id="variable"
                placeholder="Ex: resposta_usuario"
                value={String(node.data.variable || '')}
                onChange={(e) => handleUpdate('variable', e.target.value)}
              />
            </div>
          </>
        )}

        {node.type === 'action' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="actionType">Tipo de Ação</Label>
              <Select value={String(node.data.actionType || 'api')} onValueChange={(value) => handleUpdate('actionType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="api">Chamar API</SelectItem>
                  <SelectItem value="webhook">Webhook</SelectItem>
                  <SelectItem value="database">Salvar no Banco</SelectItem>
                  <SelectItem value="variable">Definir Variável</SelectItem>
                  <SelectItem value="transfer">Transferir para Agente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="action">Configuração</Label>
              <Textarea
                id="action"
                placeholder="Configure a ação..."
                value={String(node.data.action || '')}
                onChange={(e) => handleUpdate('action', e.target.value)}
                rows={4}
              />
            </div>
          </>
        )}

        {(node.type === 'start' || node.type === 'end') && (
          <div className="space-y-2">
            <Label htmlFor="label">Nome do Nó</Label>
            <Input
              id="label"
              placeholder="Nome personalizado"
              value={String(node.data.label || '')}
              onChange={(e) => handleUpdate('label', e.target.value)}
            />
          </div>
        )}

        <div className="pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground space-y-1">
            <div><strong>ID:</strong> {node.id}</div>
            <div><strong>Tipo:</strong> {node.type}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
