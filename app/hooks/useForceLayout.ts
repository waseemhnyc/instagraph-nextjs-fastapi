import { useEffect, useState, useCallback, useRef } from 'react';
import { useReactFlow, Node, Edge, ReactFlowInstance } from 'reactflow';
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from 'd3-force';

// Define a type that combines D3 force simulation properties with ReactFlow nodes
interface D3Node extends Node {
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  index?: number;
}

// Custom hook for applying force layout to ReactFlow nodes
export const useForceLayout = (
  initialNodes: Node[],
  initialEdges: Edge[],
  strength: number = -100,
  distance: number = 150,
  active: boolean = true
) => {
  const [isRunning, setIsRunning] = useState(false);
  const reactFlowInstance = useReactFlow();
  
  // Run the force layout when requested
  const applyForceLayout = useCallback(() => {
    if (!active || !reactFlowInstance || initialNodes.length < 2) return;
    
    setIsRunning(true);
    
    // Create deep copies to avoid mutating props
    const nodesCopy = JSON.parse(JSON.stringify(initialNodes)) as D3Node[];
    
    // Extract link data for d3-force
    const links = initialEdges.map(edge => ({
      source: edge.source,
      target: edge.target,
      id: edge.id
    }));
    
    // Create the force simulation
    const simulation = forceSimulation(nodesCopy)
      .force('charge', forceManyBody().strength(strength))
      .force('link', forceLink(links).id((d: any) => d.id).distance(distance))
      .force('center', forceCenter(0, 0))
      .force('collision', forceCollide(60).strength(0.7))
      .alpha(0.8)
      .alphaDecay(0.02); // Slower decay for more calculated positions
    
    // Track progress to avoid excessive re-renders
    let tickCount = 0;
    const totalTicks = 100; // Limit total simulation ticks
    
    // On each tick, we'll update node positions internally
    simulation.on('tick', () => {
      tickCount++;
      
      // Only apply positions at the end or at intervals to avoid excessive renders
      if (tickCount >= totalTicks) {
        // Apply the final positions to ReactFlow
        const updatedNodes = initialNodes.map(originalNode => {
          const simNode = nodesCopy.find(n => n.id === originalNode.id);
          if (simNode && simNode.x !== undefined && simNode.y !== undefined) {
            return {
              ...originalNode,
              position: {
                x: simNode.x,
                y: simNode.y
              }
            };
          }
          return originalNode;
        });
        
        reactFlowInstance.setNodes(updatedNodes);
        simulation.stop();
        setIsRunning(false);
      }
    });
    
    // When simulation ends naturally
    simulation.on('end', () => {
      // Apply the final positions to ReactFlow
      const updatedNodes = initialNodes.map(originalNode => {
        const simNode = nodesCopy.find(n => n.id === originalNode.id);
        if (simNode && simNode.x !== undefined && simNode.y !== undefined) {
          return {
            ...originalNode,
            position: {
              x: simNode.x,
              y: simNode.y
            }
          };
        }
        return originalNode;
      });
      
      reactFlowInstance.setNodes(updatedNodes);
      setIsRunning(false);
    });
    
    // Clean up
    return () => {
      simulation.stop();
      setIsRunning(false);
    };
  }, [initialNodes, initialEdges, strength, distance, active, reactFlowInstance]);
  
  // Run layout whenever strength/distance changes or when explicitly triggered
  useEffect(() => {
    if (active && initialNodes.length >= 2) {
      applyForceLayout();
    }
  }, [active, strength, distance]);
  
  return {
    isRunning,
    runLayout: applyForceLayout
  };
}; 