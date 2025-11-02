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

        {node.type === 'delay' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="delayType">Tipo de Espera</Label>
              <Select value={String(node.data.delayType || 'seconds')} onValueChange={(value) => handleUpdate('delayType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seconds">Segundos</SelectItem>
                  <SelectItem value="minutes">Minutos</SelectItem>
                  <SelectItem value="hours">Horas</SelectItem>
                  <SelectItem value="days">Dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="delayValue">Tempo</Label>
              <Input
                id="delayValue"
                type="number"
                placeholder="5"
                value={String(node.data.delayValue || '')}
                onChange={(e) => handleUpdate('delayValue', e.target.value)}
              />
            </div>
          </>
        )}

        {node.type === 'webhook' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="webhookUrl">URL do Webhook</Label>
              <Input
                id="webhookUrl"
                placeholder="https://..."
                value={String(node.data.webhookUrl || '')}
                onChange={(e) => handleUpdate('webhookUrl', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhookMethod">Método</Label>
              <Select value={String(node.data.webhookMethod || 'POST')} onValueChange={(value) => handleUpdate('webhookMethod', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhookBody">Body (JSON)</Label>
              <Textarea
                id="webhookBody"
                placeholder='{"key": "value"}'
                value={String(node.data.webhookBody || '')}
                onChange={(e) => handleUpdate('webhookBody', e.target.value)}
                rows={4}
              />
            </div>
          </>
        )}

        {node.type === 'input' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="inputVariable">Nome da Variável</Label>
              <Input
                id="inputVariable"
                placeholder="Ex: nome_usuario"
                value={String(node.data.inputVariable || '')}
                onChange={(e) => handleUpdate('inputVariable', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inputType">Tipo de Entrada</Label>
              <Select value={String(node.data.inputType || 'text')} onValueChange={(value) => handleUpdate('inputType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Texto</SelectItem>
                  <SelectItem value="number">Número</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Telefone</SelectItem>
                  <SelectItem value="date">Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="inputPrompt">Mensagem de Solicitação</Label>
              <Textarea
                id="inputPrompt"
                placeholder="Digite sua pergunta ao usuário..."
                value={String(node.data.inputPrompt || '')}
                onChange={(e) => handleUpdate('inputPrompt', e.target.value)}
                rows={3}
              />
            </div>
          </>
        )}

        {node.type === 'http' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="httpUrl">URL</Label>
              <Input
                id="httpUrl"
                placeholder="https://api.example.com/endpoint"
                value={String(node.data.url || '')}
                onChange={(e) => handleUpdate('url', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="httpMethod">Método HTTP</Label>
              <Select value={String(node.data.method || 'GET')} onValueChange={(value) => handleUpdate('method', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="httpHeaders">Headers (JSON)</Label>
              <Textarea
                id="httpHeaders"
                placeholder='{"Authorization": "Bearer token"}'
                value={String(node.data.headers || '')}
                onChange={(e) => handleUpdate('headers', e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="httpBody">Body (JSON)</Label>
              <Textarea
                id="httpBody"
                placeholder='{"data": "value"}'
                value={String(node.data.body || '')}
                onChange={(e) => handleUpdate('body', e.target.value)}
                rows={3}
              />
            </div>
          </>
        )}

        {node.type === 'variable' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="variableName">Nome da Variável</Label>
              <Input
                id="variableName"
                placeholder="Ex: contador"
                value={String(node.data.variableName || '')}
                onChange={(e) => handleUpdate('variableName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="variableValue">Valor</Label>
              <Input
                id="variableValue"
                placeholder="Ex: 0"
                value={String(node.data.variableValue || '')}
                onChange={(e) => handleUpdate('variableValue', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="variableOperation">Operação</Label>
              <Select value={String(node.data.variableOperation || 'set')} onValueChange={(value) => handleUpdate('variableOperation', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="set">Definir (=)</SelectItem>
                  <SelectItem value="add">Adicionar (+=)</SelectItem>
                  <SelectItem value="subtract">Subtrair (-=)</SelectItem>
                  <SelectItem value="multiply">Multiplicar (*=)</SelectItem>
                  <SelectItem value="divide">Dividir (/=)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {node.type === 'loop' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="loopType">Tipo de Loop</Label>
              <Select value={String(node.data.loopType || 'fixed')} onValueChange={(value) => handleUpdate('loopType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Número Fixo</SelectItem>
                  <SelectItem value="condition">Condição</SelectItem>
                  <SelectItem value="array">Iterar Array</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="iterations">Iterações</Label>
              <Input
                id="iterations"
                type="number"
                placeholder="3"
                value={String(node.data.iterations || '')}
                onChange={(e) => handleUpdate('iterations', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loopVariable">Variável do Loop</Label>
              <Input
                id="loopVariable"
                placeholder="Ex: i"
                value={String(node.data.loopVariable || '')}
                onChange={(e) => handleUpdate('loopVariable', e.target.value)}
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
