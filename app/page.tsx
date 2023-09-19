"use client"
import React, { useState, useRef, useCallback, useEffect, createRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Panel,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  Connection,
  Edge
} from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';
import { useScreenshot, createFileName } from 'use-react-screenshot';

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ReloadIcon } from "@radix-ui/react-icons"

const initialNodes = [
  { 
    id: '1', 
    position: { x: 250, y: 250 }, 
    style: { color: 'white',  background: '#0077b6'}, 
    data: { label: '👋 Welcome. Enter a URL or text above.' }, 
    draggable: false, 
    selectable: false, 
    deletable: false 
  },
];

export default function IndexPage() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, takeScreenshot] = useScreenshot({
    type: "image/jpeg",
    quality: 1.0
  });
  const ref = createRef<HTMLDivElement>();

  const onInit = (reactFlowInstance: any) => setReactFlowInstance(reactFlowInstance);
  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), []);

  const download = (image: string | undefined) => {
    if (image) {
      const link = document.createElement('a');
      link.href = image;
      link.download = createFileName('jpeg','graph');
      link.click();
    }
  };

  const handleDownload = () => {
    if (!loading && nodes.length > 1) {
      takeScreenshot(ref.current).then(download);
    }
  };

  const centerGraph = () => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView();
    }
  };

  useEffect(() => {
    centerGraph();
  }, [nodes]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const initialNodes = [
      { id: '1', position: { x: 250, y: 250 }, style: { color: 'white',  background: '#0077b6'}, data: { label: 'Hang tight...' }, draggable: false, selectable: false, deletable: false },
    ];
    setNodes(initialNodes);
    try {
      const response = await axios.post("/api/get_graph_data", { user_input: userInput });
      setNodes(response.data.elements.nodes);
      setEdges(response.data.elements.edges);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-6 my-6 border rounded-md">
      <div className="flex flex-col items-start gap-2">
        <div className="text-sm font-semibold tracking-tight">
          Enter a URL or text:
        </div>
        <form className='w-full flex justify-between items-center gap-2' onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder=""
            className="mr-6"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button
              type="submit"
              disabled={loading}
              className={buttonVariants({ variant: "default", size: "sm" })}
            >
              {loading ? <><ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Loading...</> : "Submit"}
          </button>
          <button
              type="button"
              disabled={loading || nodes.length <= 1}
              onClick={handleDownload}
              className={buttonVariants({ variant: "secondary", size: "sm" })}
            >
              Download
          </button>
          </form>
      </div>
      <div className="flex justify-between" ref={ref}>
          <div className="position-absolute w-full h-[700px]">
              <div className="w-full h-full">
                  <div className="dndflow border shadow-lg rounded-lg p-4">
                      <ReactFlowProvider>
                        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                            <ReactFlow
                                nodes={nodes}
                                edges={edges}
                                onNodesChange={onNodesChange}
                                onEdgesChange={onEdgesChange}
                                onConnect={onConnect}
                                onInit={onInit}
                                fitView
                            >
                              <Controls />
                              <MiniMap />
                              <Background variant={BackgroundVariant.Lines} gap={15} size={1} />
                            </ReactFlow>
                        </div>
                      </ReactFlowProvider>
                  </div>
              </div>
          </div>
      </div>
    </section>
  )
}

