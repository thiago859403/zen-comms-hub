import { Handle, Position, NodeProps } from '@xyflow/react';
import { Play } from 'lucide-react';

export default function StartNode({ data, selected }: NodeProps) {
  return (
    <div className={`px-6 py-4 rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg transition-all ${selected ? 'ring-2 ring-ring ring-offset-2' : ''}`}>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-full">
          <Play className="h-5 w-5" />
        </div>
        <div>
          <div className="font-semibold text-sm">Início</div>
          <div className="text-xs opacity-90">Ponto de partida do fluxo</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-primary-foreground !w-3 !h-3 !border-2 !border-primary" />
    </div>
  );
}
