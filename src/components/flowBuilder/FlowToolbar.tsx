import { Button } from '@/components/ui/button';
import { MessageSquare, GitBranch, Zap, Play, CircleStop, Save, Undo, Redo, ZoomIn, ZoomOut, Maximize, Clock, Webhook, KeyboardIcon, Globe, Variable, Repeat, Trash2, Copy } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FlowToolbarProps {
  onAddNode: (type: string) => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onDeleteSelected: () => void;
  onDuplicateSelected: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hasSelection: boolean;
}

export default function FlowToolbar({ 
  onAddNode, 
  onSave, 
  onUndo, 
  onRedo,
  onZoomIn,
  onZoomOut,
  onFitView,
  onDeleteSelected,
  onDuplicateSelected,
  canUndo,
  canRedo,
  hasSelection
}: FlowToolbarProps) {
  return (
    <TooltipProvider>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-card border border-border rounded-lg shadow-elevated p-2 flex items-center gap-1">
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={() => onAddNode('start')} className="h-9 w-9 p-0">
                <Play className="h-4 w-4 text-primary" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Nó de Início</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={() => onAddNode('message')} className="h-9 w-9 p-0">
                <MessageSquare className="h-4 w-4 text-primary" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Enviar Mensagem</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={() => onAddNode('input')} className="h-9 w-9 p-0">
                <KeyboardIcon className="h-4 w-4 text-cyan-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Capturar Entrada</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={() => onAddNode('condition')} className="h-9 w-9 p-0">
                <GitBranch className="h-4 w-4 text-accent" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Condição</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={() => onAddNode('action')} className="h-9 w-9 p-0">
                <Zap className="h-4 w-4 text-orange-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ação</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={() => onAddNode('delay')} className="h-9 w-9 p-0">
                <Clock className="h-4 w-4 text-blue-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Aguardar</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={() => onAddNode('http')} className="h-9 w-9 p-0">
                <Globe className="h-4 w-4 text-indigo-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>HTTP Request</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={() => onAddNode('webhook')} className="h-9 w-9 p-0">
                <Webhook className="h-4 w-4 text-purple-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Webhook</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={() => onAddNode('variable')} className="h-9 w-9 p-0">
                <Variable className="h-4 w-4 text-yellow-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Definir Variável</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={() => onAddNode('loop')} className="h-9 w-9 p-0">
                <Repeat className="h-4 w-4 text-pink-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Loop</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={() => onAddNode('end')} className="h-9 w-9 p-0">
                <CircleStop className="h-4 w-4 text-destructive" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Nó Final</TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onDuplicateSelected} disabled={!hasSelection} className="h-9 w-9 p-0">
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Duplicar (Ctrl+D)</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onDeleteSelected} disabled={!hasSelection} className="h-9 w-9 p-0">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Deletar (Del)</TooltipContent>
          </Tooltip>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onUndo} disabled={!canUndo} className="h-9 w-9 p-0">
                <Undo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Desfazer (Ctrl+Z)</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onRedo} disabled={!canRedo} className="h-9 w-9 p-0">
                <Redo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Refazer (Ctrl+Y)</TooltipContent>
          </Tooltip>
        </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onZoomIn} className="h-9 w-9 p-0">
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom In (+)</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onZoomOut} className="h-9 w-9 p-0">
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom Out (-)</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onFitView} className="h-9 w-9 p-0">
                <Maximize className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ajustar (F)</TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="default" size="sm" onClick={onSave} className="h-9">
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </TooltipTrigger>
          <TooltipContent>Salvar Fluxo (Ctrl+S)</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
