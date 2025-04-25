"use client"
import React, { useState, useRef, useCallback, useEffect, createRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  Connection,
  Edge,
  Node,
  Panel,
  NodeChange,
  NodePositionChange,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import DownloadButton from '@/components/ui/download-button';
import { ReloadIcon } from "@radix-ui/react-icons"
import { Sidebar } from "@/components/sidebar"
import { saveSearchHistory, loadSearchHistory } from "@/lib/utils"
import { defaultSavedHistory, SavedHistory } from '@/data/savedHistory';
import { XMarkIcon, RocketLaunchIcon, MagnifyingGlassIcon, BookmarkIcon, ClockIcon, ArrowsPointingInIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

import { Alert, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"


export default function IndexPage() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [currentNode, setCurrentNode] = useState<Node<any, string | undefined> | null>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [userInput, setUserInput] = useState("");
  const [submittedUserInput, setSubmittedUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SavedHistory[]>([]);
  const [clickedSave, setClickedSave] = useState(false);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [showAbout, setShowAbout] = useState(false);

  const ref = createRef<HTMLDivElement>();

  const onInit = (reactFlowInstance: any) => setReactFlowInstance(reactFlowInstance);
  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const handleSaveToHistory = () => {
    const newSearchHistory = [{ searchValue: submittedUserInput, results: { nodes, edges } }, ...searchHistory];
    setSearchHistory(newSearchHistory);
    saveSearchHistory(newSearchHistory);
    setUserInput("")
    setSubmittedUserInput("")
    setLoading(false)
    setClickedSave(true);
  };

  useEffect(() => {
    const currentSearchHistory = loadSearchHistory();
    if(currentSearchHistory.length === 0) {
      setSearchHistory(defaultSavedHistory);
    } else {
      setSearchHistory(currentSearchHistory);
      const { nodes: initialNodes, edges: initialEdges } = currentSearchHistory[0].results;
      setNodes(initialNodes);
      setEdges(initialEdges);
      setClickedSave(true);
    }
  }, [setNodes, setEdges]);

  // Custom node movement constraint handler
  const onNodesChangeCustom = useCallback((changes: NodeChange[]) => {
    const constrainedChanges = changes.map(change => {
      // Only constrain position changes
      if (change.type === 'position' && change.position) {
        const posChange = change as NodePositionChange;
        // Constrain x and y to be within a reasonable range
        // Add null checks to handle possibly undefined position
        const newX = Math.max(-300, Math.min(300, posChange.position?.x || 0));
        const newY = Math.max(-300, Math.min(300, posChange.position?.y || 0));
        
        return {
          ...posChange,
          position: { x: newX, y: newY }
        };
      }
      return change;
    });
    
    onNodesChange(constrainedChanges);
  }, [onNodesChange]);

  // Centralize graph with boundaries
  const centerGraphWithBoundaries = useCallback(() => {
    if (reactFlowInstance) {
      // First center the graph
      reactFlowInstance.fitView({ 
        padding: 0.2, 
        includeHiddenNodes: false,
        minZoom: 0.5,  // Don't zoom out too far
        maxZoom: 1.5   // Don't zoom in too far
      });
      
      // Then enforce zoom limits
      if (reactFlowInstance.getZoom() < 0.5) {
        reactFlowInstance.setViewport({ 
          x: reactFlowInstance.getViewport().x,
          y: reactFlowInstance.getViewport().y,
          zoom: 0.5 
        });
      }
    }
  }, [reactFlowInstance]);

  useEffect(() => {
    centerGraphWithBoundaries();
  }, [nodes, edges, centerGraphWithBoundaries]);

  // Modified version of the original effect to constrain node positions
  useEffect(() => {
    if (currentNode) {
      setNodes((prevNodes) => {
        const nodeExists = prevNodes.some(node => node.id === currentNode.id);
        if (!nodeExists) {
          // Constrain the node position before adding
          const constrainedPosition = {
            x: Math.max(-300, Math.min(300, currentNode.position.x)),
            y: Math.max(-300, Math.min(300, currentNode.position.y))
          };
          
          const newNode = { 
            ...currentNode, 
            id: `${currentNode.id}`,
            position: constrainedPosition 
          };
          
          return [...prevNodes, newNode];
        }
        return prevNodes;
      });
    }
  }, [currentNode, setNodes]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userInput) return;
    setSubmittedUserInput(userInput)
    setLoading(true);
    setClickedSave(false);
    setNodes([]);
    setEdges([]);

    try {
      const baseUrl = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000' : 'https://instagraph-fast-api.onrender.com';
      const url = `${baseUrl}/api/get_graph/${encodeURIComponent(userInput)}`;

      const ees = new EventSource(url);
      setEventSource(ees);
      
      let nodeCount = 0;
      const nodePositions: Record<string, {x: number, y: number}> = {};
      
      ees.onmessage = (event) => {
        if (event.data === '[DONE]') {
          setLoading(false);
          ees.close();
          
          // After all nodes are added, make sure the graph is centered
          setTimeout(() => {
            if (reactFlowInstance) {
              reactFlowInstance.fitView({ padding: 0.2 });
            }
          }, 100);
        } else {
            const data = JSON.parse(event.data);
            
            // Constrain node positions to be within a reasonable area
            // Calculate a grid-like position if the node position seems extreme
            if (Math.abs(data.x) > 500 || Math.abs(data.y) > 500) {
              const gridCols = 3;
              const gridRows = Math.ceil(8 / gridCols); // Assuming minimum 8 nodes
              const xPos = (nodeCount % gridCols) * 200 - 200;
              const yPos = Math.floor(nodeCount / gridCols) * 150 - 150;
              
              data.x = xPos;
              data.y = yPos;
            }
            
            // Save position for edge references
            nodePositions[data.id] = { x: data.x, y: data.y };
            nodeCount++;
            
            const current_node = { 
              id: data.id,
              resizing: true,
              position: { x: data.x, y: data.y},
              style: { 
                color: data.stroke,  
                background: data.background, 
                minWidth: '120px',
                width: 'auto',
                maxWidth: '200px',
                padding: '12px',
                borderRadius: '8px',
                border: `2px solid ${data.stroke}`,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                fontSize: '14px',
                fontWeight: '500',
                textAlign: 'center' as const,
                whiteSpace: 'normal' as const,
                overflow: 'visible',
                lineHeight: '1.3',
              }, 
              data: { label: data.label}, 
              draggable: true, 
              selectable: true, 
              deletable: false 
            }
            setCurrentNode(current_node);
            data.adjacencies.forEach((adjacency: { 
                source: string; 
                id: string; 
                target: string; 
                label: string; 
                color: string;
              }) => {
              adjacency.source = data.id;
              setEdges((oldEdges) => addEdge({
                id: `${adjacency.source}_${adjacency.target}`, 
                source: adjacency.source, 
                target: adjacency.target, 
                label: adjacency.label,
                labelStyle: { fill: adjacency.color, fontWeight: 500 },
                style: { stroke: adjacency.color, strokeWidth: 2 },
                animated: true,
              }, oldEdges));
            });
        }
      };

      ees.onerror = (event) => {
        ees.close();
      }

    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
      setLoading(false);
    }
  };

  return (
    <section className="container mx-auto my-8">
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-2xl font-bold">
            Create an AI Generated Knowledge Graph
          </CardTitle>
          <CardDescription className="text-base">
            A knowledge graph offers a non-linear structure to information. Helpful for learning and understanding.
          </CardDescription>
          <div className="mt-2 flex items-center">
            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center text-xs text-muted-foreground" 
              onClick={() => setShowAbout(!showAbout)}
            >
              <InformationCircleIcon className="mr-1 size-4" />
              {showAbout ? 'Hide' : 'About this project'}
            </Button>
          </div>
          
          {showAbout && (
            <div className='mt-2 rounded-md bg-muted/50 p-3 text-xs text-muted-foreground'>
              <p>This project was inspired by <a href="https://twitter.com/yoheinakajima" target="_blank" rel="noopener noreferrer" className="text-primary underline transition-colors hover:text-primary/80">@yoheinakajima</a> creator of <a href="https://instagraph.ai" target="_blank" rel="noopener noreferrer" className="text-primary underline transition-colors hover:text-primary/80">instagraph.ai</a>. <a href="https://twitter.com/yoheinakajima/status/1706848028014068118" target="_blank" rel="noopener noreferrer" className="text-primary transition-colors hover:text-primary/80"><sup>[EX1]</sup></a> <a href="https://twitter.com/yoheinakajima/status/1701351068817301922" target="_blank" rel="noopener noreferrer" className="text-primary transition-colors hover:text-primary/80"><sup>[EX2]</sup></a></p>
              <p className="mt-1">If you have any questions or suggestions, reach out via <a href="https://twitter.com/waseemhnyc" target="_blank" rel="noopener noreferrer" className="text-primary underline transition-colors hover:text-primary/80">Twitter</a> or <a href="https://tally.so#tally-open=mY0676&tally-layout=modal&tally-width=1000&tally-emoji-text=👋&tally-emoji-animation=wave&tally-auto-close=0" className="text-primary underline transition-colors hover:text-primary/80">here</a>. </p> 
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form className='space-y-3' onSubmit={handleSubmit}>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter your search term here (e.g., Quantum Physics, Machine Learning)"
                className="rounded-lg border border-input py-6 pl-10 pr-4 text-base shadow-sm transition-all"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
            </div>
            <div className='flex flex-wrap gap-2'>
              <Button
                type="submit"
                disabled={loading}
                size="sm"
                className="font-medium transition-all"
              >
                {loading ? (
                  <><ReloadIcon className="mr-2 size-4 animate-spin" /> Generating graph...</>
                ) : (
                  <>Generate Graph</>
                )}
              </Button>
              {loading && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  className="font-medium"
                >
                  <XMarkIcon className="mr-1 size-4" /> Cancel
                </Button>
              )}
              <Button
                type="button"
                disabled={loading || nodes.length <= 1 || clickedSave}
                variant="outline"
                size="sm"
                onClick={handleSaveToHistory}
                className="font-medium"
              >
                <BookmarkIcon className="mr-1 size-4" /> Save
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="font-medium lg:hidden"
              >
                <ClockIcon className="mr-1 size-4" /> History
              </Button>
            </div>
          </form>
          
          <div className="mt-6 flex gap-4" ref={ref}>
            {/* Desktop Sidebar */}
            <Sidebar 
              searchHistory={searchHistory} 
              className="hidden w-1/4 rounded-lg border px-2 py-3 lg:block" 
              onHistorySelect={(historyItem) => {
                setNodes(historyItem.results.nodes);
                setEdges(historyItem.results.edges);
                setClickedSave(true);
              }}
            />
            
            {/* Mobile Sidebar */}
            <Transition.Root show={sidebarOpen} as={Fragment}>
              <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
                <Transition.Child
                  as={Fragment}
                  enter="transition-opacity ease-linear duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity ease-linear duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 flex">
                  <Transition.Child
                    as={Fragment}
                    enter="transition ease-in-out duration-300 transform"
                    enterFrom="-translate-x-full"
                    enterTo="translate-x-0"
                    leave="transition ease-in-out duration-300 transform"
                    leaveFrom="translate-x-0"
                    leaveTo="-translate-x-full"
                  >
                    <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-in-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                          <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                            <span className="sr-only">Close sidebar</span>
                            <XMarkIcon className="size-6 text-white" aria-hidden="true" />
                          </button>
                        </div>
                      </Transition.Child>
                      {/* Sidebar component, swap this element with another sidebar if you like */}
                      <Sidebar 
                        searchHistory={searchHistory} 
                        className="w-full rounded-r-lg bg-background shadow-xl" 
                        onHistorySelect={(historyItem) => {
                          setNodes(historyItem.results.nodes);
                          setEdges(historyItem.results.edges);
                          setClickedSave(true);
                          setSidebarOpen(false);
                        }}
                      />
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </Dialog>
            </Transition.Root>
            
            <div className="w-full">
              <div className="h-[700px] w-full overflow-hidden rounded-lg border bg-white shadow-md">
                <ReactFlowProvider>
                  <div className="reactflow-wrapper h-full" ref={reactFlowWrapper}>
                    <ReactFlow
                      nodes={nodes}
                      edges={edges}
                      onNodesChange={onNodesChangeCustom}
                      onEdgesChange={onEdgesChange}
                      onConnect={onConnect}
                      onInit={(instance) => {
                        setReactFlowInstance(instance);
                        // Set initial viewport with limits
                        instance.setViewport({ x: 0, y: 0, zoom: 0.8 });
                      }}
                      fitView
                      fitViewOptions={{ 
                        padding: 0.2, 
                        minZoom: 0.5, 
                        maxZoom: 1.5 
                      }}
                      proOptions={{ hideAttribution: true }}
                      nodesDraggable={true}
                      elementsSelectable={true}
                      zoomOnScroll={true}
                      panOnScroll={true}
                      className="bg-gradient-to-br from-gray-50 to-gray-100"
                      snapToGrid={true}
                      snapGrid={[15, 15]}
                      minZoom={0.5}
                      maxZoom={1.5}
                      defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
                      translateExtent={[[-500, -500], [500, 500]]} // Critical: restrict the panning area
                      onNodeDragStop={() => {
                        setTimeout(() => {
                          if (reactFlowInstance) {
                            centerGraphWithBoundaries();
                          }
                        }, 100);
                      }}
                      onPaneClick={(event) => {
                        // Reset the view if users click in empty areas of the graph
                        if (event.target === event.currentTarget) {
                          centerGraphWithBoundaries();
                        }
                      }}
                    >
                      <Panel position="top-left" className="m-3 flex space-x-2">
                        <DownloadButton disabled={loading || nodes.length <= 1}/>
                        <Button 
                          onClick={() => {
                            if (reactFlowInstance) {
                              reactFlowInstance.fitView({ padding: 0.2, includeHiddenNodes: false });
                            }
                          }}
                          variant="secondary"
                          size="sm"
                          disabled={loading || nodes.length <= 1}
                          className="flex items-center gap-1 shadow-md"
                        >
                          <ArrowsPointingInIcon className="mr-1 size-4" />
                          Reset View
                        </Button>
                      </Panel>
                      <Controls position="top-right" className="m-3 shadow-md" />
                      <MiniMap 
                        nodeStrokeWidth={3} 
                        zoomable 
                        pannable 
                        className="rounded-lg shadow-md" 
                        nodeColor={(node) => {
                          return node.style?.background as string || '#eee';
                        }}
                      />
                      <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e0e0e0" />
                      
                      {!loading && nodes.length === 0 && (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                          <div className="pointer-events-auto rounded-xl bg-white/80 p-6 text-center text-gray-500 shadow-sm backdrop-blur-sm">
                            <RocketLaunchIcon className="mx-auto mb-4 size-12 text-gray-300" />
                            <p className="text-lg font-medium">Enter a topic above to generate a knowledge graph</p>
                            <p className="mt-2 text-sm">Try topics like &quot;Quantum Physics&quot; or &quot;Machine Learning&quot;</p>
                          </div>
                        </div>
                      )}
                    </ReactFlow>
                  </div>
                </ReactFlowProvider>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

