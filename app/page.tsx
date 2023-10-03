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
  Edge
} from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import DownloadButton from '@/components/ui/download-button';
import { ReloadIcon } from "@radix-ui/react-icons"

import { Sidebar } from "@/components/sidebar"
import { saveSearchHistory, loadSearchHistory } from "@/lib/utils"
import { defaultSavedHistory, SavedHistory } from '@/data/savedHistory';

import { XMarkIcon } from '@heroicons/react/24/outline'

const initialNodes = [
  { 
    id: '1', 
    position: { x: 250, y: 250 }, 
    style: { 
      color: 'white',  
      background: '#0077b6', 
      width: '200px',
    }, 
    data: { label: 'Enter a URL or search with text' }, 
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
  const [submittedUserInput, setSubmittedUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = createRef<HTMLDivElement>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SavedHistory[]>([]);
  const [clickedSave, setClickedSave] = useState(false);

  const onInit = (reactFlowInstance: any) => setReactFlowInstance(reactFlowInstance);
  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), []);

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
    }

  }, []);

  const centerGraph = () => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView();
      reactFlowInstance
    }
  };

  useEffect(() => {
    centerGraph();
  }, [nodes, edges]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userInput) return;
    setSubmittedUserInput(userInput)
    setLoading(true);
    setClickedSave(false);
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
    <section className="px-2 md:container grid items-center gap-6 pb-8 pt-6 md:py-6 my-6 border rounded-md">
      <div className="flex flex-col items-start gap-2">
        <div className="text-sm font-semibold tracking-tight">
          Enter a URL or search with text:
        </div>
        <div className='w-full flex flex-wrap items-center'>
          <form className='flex grow gap-2' onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder=""
              className="mr-2 md:mr-6"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <button
                type="submit"
                disabled={loading}
                className={`${buttonVariants({ variant: "default", size: "sm" })} md:mt-0`}
              >
                {loading ? <><ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Loading...</> : "Submit"}
            </button>
            <button
                type="button"
                disabled={loading || nodes.length <= 1 || clickedSave}
                onClick={handleSaveToHistory}
                className={`${buttonVariants({ variant: "secondary", size: "sm" })} md:mt-0`}
              >
                Save
            </button>
            <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className={`${buttonVariants({ variant: "secondary", size: "sm" })} md:mt-0 lg:hidden`}
              >
                History
            </button>
          </form>
        </div>        
      </div>
      <div className="flex justify-between" ref={ref}>
        {/* Desktop Sidebar */}
        <Sidebar 
          searchHistory={searchHistory} 
          className="hidden lg:block w-1/4" 
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
              <div className="fixed inset-0 bg-gray-900/80" />
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
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <Sidebar 
                    searchHistory={searchHistory} 
                    className="w-full bg-white" 
                    onHistorySelect={(historyItem) => {
                      setNodes(historyItem.nodes);
                      setEdges(historyItem.edges);
                      setClickedSave(true);
                    }}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
        <div className="position-absolute w-full h-[700px]">
          <div className="w-full h-[75%] md:h-full">
            <div className="dndflow border shadow-lg rounded-lg md:p-4">
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
                    <DownloadButton disabled={loading || nodes.length <= 1}/>
                    <Controls position={"top-right"}/>
                    <MiniMap nodeStrokeWidth={3} zoomable pannable />
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
