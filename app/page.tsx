'use client'

import React, { useState, useRef, useCallback } from 'react';
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
  Edge
} from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';

import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const initialNodes = [
    { id: '1', position: { x: 250, y: 250 }, data: { label: 'Raspberry Pi' }, draggable: false, selectable: false, deletable: false },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

export default function IndexPage() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [inputValue, setInputValue] = useState<string>('');

  const onInit = (reactFlowInstance: any) => setReactFlowInstance(reactFlowInstance);

  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), []);

  const onSubmit = async () => {
    try {
      const response = await axios.post('/api/robotIdea', nodes);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-6 my-6 border rounded-md">
      <div className="flex flex-col items-start gap-2">
        <div className="text-sm font-semibold tracking-tight">
          Enter a URL or a string of text:
        </div>
        <div className="w-full flex justify-between items-center">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder=""
            className="mr-3"
          />
          <Link
              rel="noreferrer"
              href={'/'}
              className={buttonVariants({ variant: "default", size: "sm" })}
            >
              Submit
          </Link>
        </div>
      </div>
      <div className="flex justify-between">
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
                              snapToGrid
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

