import React, { useState } from 'react';
import ReactFlow, { Background, Controls, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { ShieldAlert, Search } from 'lucide-react';

interface BreachData {
  breach: string;
  domain: string;
}

export default function App() {
  const [query, setQuery] = useState('');
  const = useState<any>(null);
  const [nodes, setNodes] = useState<Node>();
  const [edges, setEdges] = useState<Edge>();
  const [loading, setLoading] = useState(false);

  const handleInvestigation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);

    try {
      // Calls the Vercel serverless Node.js backend
      const response = await fetch(`/api/investigate?target=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data);
      
      const generatedNodes: Node =;
      const generatedEdges: Edge =;
      
      if (data.breaches && data.breaches.length > 0) {
        data.breaches.forEach((breach: BreachData, index: number) => {
          const nodeId = `breach-${index}`;
          
          // Structure the visual nodes for the mind map
          generatedNodes.push({
            id: nodeId,
            position: { x: (index % 3) * 250 + 100, y: Math.floor(index / 3) * 150 + 200 },
            data: { label: `${breach.breach}\n(${breach.domain})` },
            style: { background: '#ef4444', color: 'white', borderRadius: '8px' }
          });
          
          // Connect the nodes back to the central target
          generatedEdges.push({ 
            id: `edge-root-${nodeId}`, 
            source: 'target-root', 
            target: nodeId, 
            animated: true,
            style: { stroke: '#ef4444' }
          });
        });
      } else {
         generatedNodes.push({
            id: 'no-breach',
            position: { x: 400, y: 200 },
            data: { label: 'No breaches found.' },
            style: { background: '#22c55e', color: 'white', borderRadius: '8px' }
         });
         generatedEdges.push({ 
            id: 'edge-root-no-breach', 
            source: 'target-root', 
            target: 'no-breach', 
            animated: true,
            style: { stroke: '#22c55e' }
         });
      }
      
      setNodes(generatedNodes);
      setEdges(generatedEdges);
    } catch (error) {
      console.error("OSINT investigation failed", error);
      alert("Error connecting to the intelligence backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '32px' }}>
        <ShieldAlert size={36} color="#ef4444" />
        Vercel OSINT Platform
      </h1>
      <p style={{ color: '#94a3b8', marginBottom: '30px' }}>
        Enter a target email to aggregate leaked credentials and visualize the digital footprint.
      </p>

      <form onSubmit={handleInvestigation} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <input 
          type="email" 
          value={query} 
          onChange={e => setQuery(e.target.value)} 
          placeholder="Enter target email (e.g., target@example.com)" 
          required 
          style={{ flex: 1, padding: '15px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1e293b', color: 'white', fontSize: '16px' }} 
        />
        <button type="submit" disabled={loading} style={{ padding: '15px 30px', cursor: 'pointer', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 'bold' }}>
          <Search size={20} />
          {loading? 'Executing Pivot...' : 'Run Analysis'}
        </button>
      </form>
      
      {results && (
        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155', marginBottom: '20px' }}>
          <h2 style={{ marginTop: 0, color: '#38bdf8' }}>AI Synthesis Brief</h2>
          <p style={{ lineHeight: '1.6' }}>{results.aiSummary}</p>
        </div>
      )}

      <div style={{ height: '600px', backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155' }}>
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <Background color="#475569" gap={16} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}