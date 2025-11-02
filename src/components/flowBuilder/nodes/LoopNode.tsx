import { Handle, Position, NodeProps } from '@xyflow/react';
import { Repeat } from 'lucide-react';

export default function LoopNode({ data, selected }: NodeProps) {
  return (
    <div className={`px-4 py-3 rounded-lg bg-card border-2 border-border shadow-md transition-all min-w-[200px] ${selected ? 'ring-2 ring-ring ring-offset-2 border-pink-500' : ''}`}>
      <Handle type="target" position={Position.Top} className="!bg-pink-500 !w-3 !h-3 !border-2 !border-background" />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 bg-pink-500/10 rounded">
          <Repeat className="h-4 w-4 text-pink-500" />
        </div>
        <div className="font-semibold text-sm text-foreground">Loop</div>
      </div>
      
      <div className="text-xs text-muted-foreground line-clamp-2">
        Repetir {String(data.iterations || '3')} vezes
      </div>
      
      <Handle type="source" position={Position.Bottom} id="loop" className="!bg-pink-500 !w-3 !h-3 !border-2 !border-background !-left-3" />
      <Handle type="source" position={Position.Bottom} id="exit" className="!bg-green-500 !w-3 !h-3 !border-2 !border-background !-right-3" />
    </div>
  );
}
