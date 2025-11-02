import { Handle, Position, NodeProps } from '@xyflow/react';
import { GitBranch } from 'lucide-react';

export default function ConditionNode({ data, selected }: NodeProps) {
  return (
    <div className={`px-4 py-3 rounded-lg bg-card border-2 border-border shadow-md transition-all min-w-[200px] ${selected ? 'ring-2 ring-ring ring-offset-2 border-accent' : ''}`}>
      <Handle type="target" position={Position.Top} className="!bg-accent !w-3 !h-3 !border-2 !border-background" />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 bg-accent/10 rounded">
          <GitBranch className="h-4 w-4 text-accent" />
        </div>
        <div className="font-semibold text-sm text-foreground">Condição</div>
      </div>
      
      <div className="text-xs text-muted-foreground line-clamp-2">
        {String(data.condition || 'Adicione uma condição')}
      </div>
      
      <div className="flex justify-between mt-3 gap-2">
        <div className="text-[10px] text-muted-foreground">Sim</div>
        <div className="text-[10px] text-muted-foreground">Não</div>
      </div>
      
      <Handle type="source" position={Position.Bottom} id="true" className="!bg-green-500 !w-3 !h-3 !border-2 !border-background !-left-3" />
      <Handle type="source" position={Position.Bottom} id="false" className="!bg-red-500 !w-3 !h-3 !border-2 !border-background !-right-3" />
    </div>
  );
}
