import React, { useEffect, useState } from 'react';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { fetchTopology } from '../services/api';

export default function Topology() {
    const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);

    useEffect(() => {
        fetchTopology().then(data => {
            setNodes(data.nodes);
            setEdges(data.edges);
        });
    }, []);

    return (
        <div className="h-full w-full bg-gray-950 flex flex-col">
            <div className="p-6 border-b border-gray-800">
                <h1 className="text-2xl font-bold text-white">Digital Security Twin</h1>
                <p className="text-gray-400 text-sm mt-1">Interactive map of trust zones and permitted connections.</p>
            </div>
            <div className="flex-1">
                <ReactFlow 
                    nodes={nodes} 
                    edges={edges} 
                    onNodesChange={onNodesChange} 
                    onEdgesChange={onEdgesChange}
                    colorMode="dark"
                    fitView
                >
                    <Background color="#333" gap={16} />
                    <Controls />
                    <MiniMap />
                </ReactFlow>
            </div>
        </div>
    );
}
