import { Handle, Position, NodeProps } from '@xyflow/react';
import { MessageSquare } from 'lucide-react';

export default function MessageNode({ data, selected }: NodeProps) {
  return (
    <div className={`px-4 py-3 rounded-lg bg-card border-2 border-border shadow-md transition-all min-w-[200px] ${selected ? 'ring-2 ring-ring ring-offset-2 border-primary' : ''}`}>
      <Handle type="target" position={Position.Top} className="!bg-primary !w-3 !h-3 !border-2 !border-background" />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 bg-primary/10 rounded">
          <MessageSquare className="h-4 w-4 text-primary" />
        </div>
        <div className="font-semibold text-sm text-foreground">Mensagem</div>
      </div>
      
      <div className="text-xs text-muted-foreground line-clamp-2">
        {String(data.message || 'Clique para configurar a mensagem')}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="!bg-primary !w-3 !h-3 !border-2 !border-background" />
    </div>
  );
}
