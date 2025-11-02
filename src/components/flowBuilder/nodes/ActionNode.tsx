import { Handle, Position, NodeProps } from '@xyflow/react';
import { Zap } from 'lucide-react';

export default function ActionNode({ data, selected }: NodeProps) {
  return (
    <div className={`px-4 py-3 rounded-lg bg-card border-2 border-border shadow-md transition-all min-w-[200px] ${selected ? 'ring-2 ring-ring ring-offset-2 border-orange-500' : ''}`}>
      <Handle type="target" position={Position.Top} className="!bg-orange-500 !w-3 !h-3 !border-2 !border-background" />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 bg-orange-500/10 rounded">
          <Zap className="h-4 w-4 text-orange-500" />
        </div>
        <div className="font-semibold text-sm text-foreground">Ação</div>
      </div>
      
      <div className="text-xs text-muted-foreground line-clamp-2">
        {String(data.action || 'Configure a ação')}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="!bg-orange-500 !w-3 !h-3 !border-2 !border-background" />
    </div>
  );
}
