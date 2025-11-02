import { Handle, Position, NodeProps } from '@xyflow/react';
import { CircleStop } from 'lucide-react';

export default function EndNode({ data, selected }: NodeProps) {
  return (
    <div className={`px-6 py-4 rounded-lg bg-gradient-to-br from-destructive to-destructive/80 text-destructive-foreground shadow-lg transition-all ${selected ? 'ring-2 ring-ring ring-offset-2' : ''}`}>
      <Handle type="target" position={Position.Top} className="!bg-destructive-foreground !w-3 !h-3 !border-2 !border-destructive" />
      
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-full">
          <CircleStop className="h-5 w-5" />
        </div>
        <div>
          <div className="font-semibold text-sm">Fim</div>
          <div className="text-xs opacity-90">Encerra o fluxo</div>
        </div>
      </div>
    </div>
  );
}
