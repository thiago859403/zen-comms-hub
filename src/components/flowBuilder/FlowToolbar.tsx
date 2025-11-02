import { Button } from '@/components/ui/button';
import { MessageSquare, GitBranch, Zap, Play, CircleStop, Save, Undo, Redo, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface FlowToolbarProps {
  onAddNode: (type: string) => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export default function FlowToolbar({ 
  onAddNode, 
  onSave, 
  onUndo, 
  onRedo,
  onZoomIn,
  onZoomOut,
  onFitView,
  canUndo,
  canRedo 
}: FlowToolbarProps) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-card border border-border rounded-lg shadow-elevated p-2 flex items-center gap-1">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAddNode('start')}
          title="Adicionar nó de início"
          className="h-9 w-9 p-0"
        >
          <Play className="h-4 w-4 text-primary" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAddNode('message')}
          title="Adicionar mensagem"
          className="h-9 w-9 p-0"
        >
          <MessageSquare className="h-4 w-4 text-primary" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAddNode('condition')}
          title="Adicionar condição"
          className="h-9 w-9 p-0"
        >
          <GitBranch className="h-4 w-4 text-accent" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAddNode('action')}
          title="Adicionar ação"
          className="h-9 w-9 p-0"
        >
          <Zap className="h-4 w-4 text-orange-500" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAddNode('end')}
          title="Adicionar nó final"
          className="h-9 w-9 p-0"
        >
          <CircleStop className="h-4 w-4 text-destructive" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          title="Desfazer"
          className="h-9 w-9 p-0"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          title="Refazer"
          className="h-9 w-9 p-0"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomIn}
          title="Aumentar zoom"
          className="h-9 w-9 p-0"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomOut}
          title="Diminuir zoom"
          className="h-9 w-9 p-0"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onFitView}
          title="Ajustar visualização"
          className="h-9 w-9 p-0"
        >
          <Maximize className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <Button
        variant="default"
        size="sm"
        onClick={onSave}
        className="h-9"
      >
        <Save className="h-4 w-4 mr-2" />
        Salvar
      </Button>
    </div>
  );
}
