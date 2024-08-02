"use client"
import React, { useState, useRef, useCallback, useEffect, createRef, Fragment } from 'react'
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
} from 'reactflow'
import 'reactflow/dist/style.css'

import { Dialog, Transition } from '@headlessui/react'
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import DownloadButton from '@/components/ui/download-button'
import { ReloadIcon } from "@radix-ui/react-icons"
import { Sidebar } from "@/components/sidebar"
import { SavedHistory, defaultSavedHistory } from '@/data/savedHistory'
import { XMarkIcon, RocketLaunchIcon } from '@heroicons/react/24/outline'
import { saveChat, getChatsHistory, getUser } from "./actions"
import { Chat, ChatNode, ChatEdge } from '@/lib/types'

import { Alert, AlertTitle } from "@/components/ui/alert"

export default function IndexPage() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [currentNode, setCurrentNode] = useState<Node<any, string | undefined> | null>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)
  const [userInput, setUserInput] = useState("")
  const [submittedUserInput, setSubmittedUserInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchHistory, setSearchHistory] = useState<SavedHistory[]>([])
  const [clickedSave, setClickedSave] = useState(false)
  const [eventSource, setEventSource] = useState<EventSource | null>(null)

  const ref = createRef<HTMLDivElement>()

  const onInit = useCallback((instance: any) => setReactFlowInstance(instance), [])
  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [])

  useEffect(() => {
    const loadChatHistory = async () => {
      const chatHistory = await getChatsHistory()
      if ('error' in chatHistory) {
        setSearchHistory(defaultSavedHistory)
      } else {
        setSearchHistory(chatHistory.length === 0 ? defaultSavedHistory : chatHistory)
      }
    }
    loadChatHistory()
  }, [])

  const centerGraph = useCallback(() => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView()
    }
  }, [reactFlowInstance])

  useEffect(() => {
    centerGraph()
  }, [nodes, edges, centerGraph])

  useEffect(() => {
    if (currentNode) {
      setNodes((prevNodes) => {
        const nodeExists = prevNodes.some(node => node.id === currentNode.id)
        if (!nodeExists) {
          const newNode = { ...currentNode, id: `${currentNode.id}` }
          return [...prevNodes, newNode]
        }
        return prevNodes
      })
    }
  }, [currentNode])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!userInput) return
    setSubmittedUserInput(userInput)
    setLoading(true)
    setClickedSave(false)
    setNodes([])
    setEdges([])

    let currentNodes: ChatNode[] = []
    let currentEdges: ChatEdge[] = []

    try {
      const baseUrl = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000' : 'https://instagraph-fast-api.onrender.com'
      const url = `${baseUrl}/api/get_graph/${encodeURIComponent(userInput)}`

      const ees = new EventSource(url)
      setEventSource(ees)

      ees.onmessage = async (event) => {
        if (event.data === '[DONE]') {
          setLoading(false)
          ees.close()

          const chatId = generateChatId()
          const user = await fetchCurrentUser()

          if (user) {
            const chat: Chat = {
              id: chatId,
              searchValue: userInput,
              results: { nodes: currentNodes, edges: currentEdges },
              userId: user.id
            }

            await saveChat(chat)
            setSearchHistory((prevHistory) => [{ searchValue: userInput, results: { nodes: currentNodes, edges: currentEdges }, id: chatId }, ...prevHistory])
          }
        } else {
          const data = JSON.parse(event.data)
          const current_node = {
            id: data.id,
            resizing: true,
            position: { x: data.x, y: data.y },
            style: {
              color: data.stroke,
              background: data.background,
              width: '100px',
            },
            data: { label: data.label },
            draggable: true,
            selectable: false,
            deletable: false
          }
          setCurrentNode(current_node)
          currentNodes = [...currentNodes, current_node]

          data.adjacencies.forEach((adjacency: {
            source: string
            id: string
            target: string
            label: string
          }) => {
            adjacency.source = data.id
            const newEdge = {
              id: `${adjacency.source}_${adjacency.target}`,
              source: adjacency.source,
              target: adjacency.target,
              label: adjacency.label,
            }
            setEdges((oldEdges) => addEdge(newEdge, oldEdges))
            currentEdges = [...currentEdges, newEdge]
          })
        }
      }

      ees.onerror = (event) => {
        ees.close()
      }

    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  const generateChatId = (): string => {
    return crypto.randomUUID()
  }

  const handleCancel = () => {
    if (eventSource) {
      eventSource.close()
      setEventSource(null)
      setLoading(false)
    }
  }

  const fetchChatHistory = async () => {
    const chatHistory = await getChatsHistory()
    return chatHistory
  }

  const fetchCurrentUser = async () => {
    const user = await getUser()
    return user
  }

  return (
    <section className="px-2 md:container grid items-center gap-6 pb-8 pt-6 md:py-6 my-6 border rounded-md">
      <div className="flex flex-col items-start gap-2">
        <p className='text-lg font-bold'>Create an AI Generated Knowledge Graph!</p>
        <Alert>
          <RocketLaunchIcon className="h-4 w-4" />
          <AlertTitle>A knowledge graph offers a non-linear structure to information. Helpful for learning and understanding.</AlertTitle>
        </Alert>
        <div className='text-xs pb-3'>
          <p>This project was inspired by <a href="https://twitter.com/yoheinakajima" target="_blank" rel="noopener noreferrer" className="underline text-blue-400">@yoheinakajima</a> creator of <a href="https://instagraph.ai" target="_blank" rel="noopener noreferrer" className="underline text-blue-400">instagraph.ai</a>. <a href="https://twitter.com/yoheinakajima/status/1706848028014068118" target="_blank" rel="noopener noreferrer" className=" text-blue-400"><sup>[EX1]</sup></a> <a href="https://twitter.com/yoheinakajima/status/1701351068817301922" target="_blank" rel="noopener noreferrer" className="text-blue-400"><sup>[EX2]</sup></a></p>
          <p>If you have any questions or suggestions, reach out via <a href="https://twitter.com/waseemhnyc" target="_blank" rel="noopener noreferrer" className="underline text-blue-400">Twitter</a> or <a href="https://tally.so#tally-open=mY0676&tally-layout=modal&tally-width=1000&tally-emoji-text=👋&tally-emoji-animation=wave&tally-auto-close=0" className="underline text-blue-400">here</a>. </p>
        </div>
        <div className="text-sm font-semibold tracking-tight">
          Search:
        </div>
        <div className='w-full items-center'>
          <form className='flex flex-col' onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Enter your search term here"
              className="mr-2 md:mr-6 w-full"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <div className='flex pt-2 gap-2'>
              <button
                type="submit"
                disabled={loading}
                className={`${buttonVariants({ variant: "default", size: "sm" })} md:mt-0`}
              >
                {loading ? <><ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Loading...</> : "Search"}
              </button>
              <button
                type="button"
                disabled={!loading}
                onClick={handleCancel}
                className={`${buttonVariants({ variant: "secondary", size: "sm" })} md:mt-0`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className={`${buttonVariants({ variant: "secondary", size: "sm" })} md:mt-0`}
              >
                History
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="flex justify-between" ref={ref}>
        <Sidebar
          searchHistory = { searchHistory }
          className="hidden lg:block w-1/4"
          onHistorySelect={(historyItem) => {
            setNodes(historyItem.results.nodes)
            setEdges(historyItem.results.edges)
            setClickedSave(true)
          }}
          setSearchHistory={setSearchHistory}
        />
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
                  <Sidebar
                    searchHistory = { searchHistory }
                    className="w-full bg-white"
                    onHistorySelect={(historyItem) => {
                      setNodes(historyItem.nodes)
                      setEdges(historyItem.edges)
                      setClickedSave(true)
                    }}
                    setSearchHistory={setSearchHistory}
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
                    <DownloadButton disabled={loading || nodes.length <= 1} />
                    <Controls position={"top-right"} />
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
