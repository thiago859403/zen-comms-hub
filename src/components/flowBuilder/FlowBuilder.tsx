import { useCallback, useState, useRef, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  ReactFlowProvider,
  useReactFlow,
  MiniMap,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import StartNode from './nodes/StartNode';
import MessageNode from './nodes/MessageNode';
import ConditionNode from './nodes/ConditionNode';
import ActionNode from './nodes/ActionNode';
import EndNode from './nodes/EndNode';
import DelayNode from './nodes/DelayNode';
import WebhookNode from './nodes/WebhookNode';
import InputNode from './nodes/InputNode';
import HttpNode from './nodes/HttpNode';
import VariableNode from './nodes/VariableNode';
import LoopNode from './nodes/LoopNode';
import FlowToolbar from './FlowToolbar';
import NodeConfigPanel from './NodeConfigPanel';
import { useToast } from '@/hooks/use-toast';

const nodeTypes = {
  start: StartNode,
  message: MessageNode,
  condition: ConditionNode,
  action: ActionNode,
  end: EndNode,
  delay: DelayNode,
  webhook: WebhookNode,
  input: InputNode,
  http: HttpNode,
  variable: VariableNode,
  loop: LoopNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'start',
    position: { x: 250, y: 50 },
    data: { label: 'Início' },
  },
];

function FlowBuilderContent() {
  const { toast } = useToast();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
  const [history, setHistory] = useState<{ nodes: Node[], edges: Edge[] }[]>([{ nodes: initialNodes, edges: [] }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const reactFlowInstance = useReactFlow();
  const nodeIdCounter = useRef(2);

  const saveToHistory = useCallback(() => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ nodes, edges });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [nodes, edges, history, historyIndex]);

  const onSave = useCallback(() => {
    const flow = reactFlowInstance.toObject();
    console.log('Flow saved:', flow);
    
    toast({
      title: "Fluxo salvo!",
      description: `O fluxo foi salvo com sucesso com ${nodes.length} nós e ${edges.length} conexões.`,
    });
  }, [reactFlowInstance, nodes, edges, toast]);

  const onUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex, setNodes, setEdges]);

  const onRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex, setNodes, setEdges]);

  const onZoomIn = useCallback(() => {
    reactFlowInstance.zoomIn();
  }, [reactFlowInstance]);

  const onZoomOut = useCallback(() => {
    reactFlowInstance.zoomOut();
  }, [reactFlowInstance]);

  const onFitView = useCallback(() => {
    reactFlowInstance.fitView({ padding: 0.2 });
  }, [reactFlowInstance]);

  const onDeleteSelected = useCallback(() => {
    if (selectedNodes.length === 0) return;
    
    const selectedIds = selectedNodes.map(n => n.id);
    setNodes((nds) => nds.filter((node) => !selectedIds.includes(node.id)));
    setEdges((eds) => eds.filter((edge) => !selectedIds.includes(edge.source) && !selectedIds.includes(edge.target)));
    setSelectedNode(null);
    setSelectedNodes([]);
    saveToHistory();
    
    toast({
      title: "Nós deletados",
      description: `${selectedNodes.length} nó(s) foram removidos do fluxo.`,
    });
  }, [selectedNodes, setNodes, setEdges, toast, saveToHistory]);

  const onDuplicateSelected = useCallback(() => {
    if (selectedNodes.length === 0) return;
    
    const newNodes = selectedNodes.map((node) => ({
      ...node,
      id: `${nodeIdCounter.current++}`,
      position: {
        x: node.position.x + 50,
        y: node.position.y + 50,
      },
      selected: false,
    }));
    
    setNodes((nds) => [...nds, ...newNodes]);
    saveToHistory();
    
    toast({
      title: "Nós duplicados",
      description: `${selectedNodes.length} nó(s) foram duplicados.`,
    });
  }, [selectedNodes, setNodes, toast, saveToHistory]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: 'hsl(var(--primary))' } }, eds));
      saveToHistory();
    },
    [setEdges, saveToHistory]
  );

  const onAddNode = useCallback((type: string) => {
    const newNode: Node = {
      id: `${nodeIdCounter.current++}`,
      type,
      position: { 
        x: Math.random() * 400 + 100, 
        y: Math.random() * 400 + 100 
      },
      data: { 
        label: type.charAt(0).toUpperCase() + type.slice(1),
        message: '',
        condition: '',
        action: '',
      },
    };
    setNodes((nds) => [...nds, newNode]);
    saveToHistory();
    
    toast({
      title: "Nó adicionado",
      description: `Um nó do tipo "${type}" foi adicionado ao fluxo.`,
    });
  }, [setNodes, toast, saveToHistory]);

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onSelectionChange = useCallback((params: any) => {
    setSelectedNodes(params.nodes || []);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const onUpdateNode = useCallback((nodeId: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) => (node.id === nodeId ? { ...node, data } : node))
    );
    saveToHistory();
  }, [setNodes, saveToHistory]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') {
          e.preventDefault();
          onSave();
        } else if (e.key === 'z') {
          e.preventDefault();
          onUndo();
        } else if (e.key === 'y') {
          e.preventDefault();
          onRedo();
        } else if (e.key === 'd') {
          e.preventDefault();
          onDuplicateSelected();
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodes.length > 0 && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          onDeleteSelected();
        }
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        onZoomIn();
      } else if (e.key === '-') {
        e.preventDefault();
        onZoomOut();
      } else if (e.key === 'f') {
        e.preventDefault();
        onFitView();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodes, onSave, onUndo, onRedo, onDeleteSelected, onDuplicateSelected, onZoomIn, onZoomOut, onFitView]);

  return (
    <div className="relative w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        fitView
        className="bg-background"
        deleteKeyCode={null}
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={16} 
          size={1}
          color="hsl(var(--muted-foreground))"
          className="opacity-20"
        />
        <Controls 
          className="!bg-card !border-border !shadow-md"
          showInteractive={false}
        />
        <MiniMap
          className="!bg-card !border-border"
          nodeColor={(node) => {
            switch (node.type) {
              case 'start': return 'hsl(var(--primary))';
              case 'message': return 'hsl(var(--primary))';
              case 'condition': return 'hsl(var(--accent))';
              case 'action': return '#f97316';
              case 'end': return 'hsl(var(--destructive))';
              case 'delay': return '#3b82f6';
              case 'webhook': return '#a855f7';
              case 'input': return '#06b6d4';
              case 'http': return '#6366f1';
              case 'variable': return '#eab308';
              case 'loop': return '#ec4899';
              default: return 'hsl(var(--muted))';
            }
          }}
          maskColor="hsl(var(--background) / 0.7)"
        />
      </ReactFlow>

      <FlowToolbar
        onAddNode={onAddNode}
        onSave={onSave}
        onUndo={onUndo}
        onRedo={onRedo}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onFitView={onFitView}
        onDeleteSelected={onDeleteSelected}
        onDuplicateSelected={onDuplicateSelected}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        hasSelection={selectedNodes.length > 0}
      />

      <NodeConfigPanel
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onUpdate={onUpdateNode}
      />
    </div>
  );
}

export default function FlowBuilder() {
  return (
    <ReactFlowProvider>
      <FlowBuilderContent />
    </ReactFlowProvider>
  );
}
