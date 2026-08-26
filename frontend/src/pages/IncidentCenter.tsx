import React, { useState, useEffect } from 'react';
import { simulateIncident, fetchIncidents, isolateAsset } from '../services/api';
import { AlertCircle, Target, Activity, ShieldAlert } from 'lucide-react';

export default function IncidentCenter() {
    const [result, setResult] = useState<any>(null);
    const [incidents, setIncidents] = useState<any[]>([]);

    const loadIncidents = async () => {
        const data = await fetchIncidents();
        setIncidents([...data]);
    };

    useEffect(() => {
        loadIncidents();
    }, []);

    const handleSimulate = async (scenario: string) => {
        const res = await simulateIncident(scenario);
        setResult(res);
        await loadIncidents();
    };

    const handleIsolate = async (incidentId: number, assetId: number) => {
        await isolateAsset(incidentId, assetId);
        
        if (result && result.incident.id === incidentId) {
            setResult({
                ...result,
                incident: {
                    ...result.incident,
                    status: "MITIGATED"
                },
                blast_radius_analysis: {
                    ...result.blast_radius_analysis,
                    risk_score: 0,
                    total_affected_assets: 0,
                    propagation_paths: []
                }
            });
        }
        await loadIncidents();
    };

    return (
        <div className="p-8 h-full overflow-auto bg-gray-950 text-white">
            <h1 className="text-3xl font-bold mb-2">Incident Simulation Center</h1>
            <p className="text-gray-400 mb-8">Safely simulate attacks to test the Blast Radius Engine.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <button onClick={() => handleSimulate("Compromised Application")} className="p-4 bg-red-900/20 hover:bg-red-900/40 border border-red-900/50 rounded-lg text-left transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                        <Target className="text-red-500" />
                        <h3 className="font-bold text-red-100">Compromised App</h3>
                    </div>
                    <p className="text-xs text-gray-400">Simulate malware on an endpoint.</p>
                </button>
                <button onClick={() => handleSimulate("Privilege Violation")} className="p-4 bg-orange-900/20 hover:bg-orange-900/40 border border-orange-900/50 rounded-lg text-left transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertCircle className="text-orange-500" />
                        <h3 className="font-bold text-orange-100">Privilege Violation</h3>
                    </div>
                    <p className="text-xs text-gray-400">Simulate unauthorized access attempt.</p>
                </button>
                <button onClick={() => handleSimulate("Traffic Anomaly")} className="p-4 bg-blue-900/20 hover:bg-blue-900/40 border border-blue-900/50 rounded-lg text-left transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                        <Activity className="text-blue-500" />
                        <h3 className="font-bold text-blue-100">Traffic Anomaly</h3>
                    </div>
                    <p className="text-xs text-gray-400">Simulate a sudden spike in traffic.</p>
                </button>
            </div>

            {result && (
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 animate-in fade-in slide-in-from-bottom-4">
                    <h2 className="text-xl font-bold mb-4 border-b border-gray-800 pb-2">Analysis Result</h2>
                    
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 mb-2">Incident Details</h3>
                            <p className="text-lg text-white">{result.incident.title}</p>
                            <p className="text-sm text-gray-400 mb-4">{result.incident.description}</p>
                            
                            <div className="bg-gray-950 p-4 rounded border border-gray-800">
                                <p className="text-sm text-gray-500">Status: <span className={`font-mono ${result.incident.status === 'MITIGATED' ? 'text-blue-400' : 'text-emerald-400'}`}>{result.incident.status}</span></p>
                                <p className="text-sm text-gray-500">Severity: <span className="text-red-400 font-mono">{result.incident.severity}</span></p>
                                
                                {result.incident.status !== 'MITIGATED' && (
                                    <button 
                                        onClick={() => handleIsolate(result.incident.id, result.incident.affected_asset_id)}
                                        className="mt-4 px-4 py-2 bg-blue-600/20 border border-blue-500/50 hover:bg-blue-600/40 text-blue-400 rounded text-sm flex items-center gap-2 transition-colors"
                                    >
                                        <ShieldAlert size={16} />
                                        Isolate Asset & Stop Propagation
                                    </button>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-gray-400 mb-2">Blast Radius Engine</h3>
                            <div className="bg-gray-950 p-4 rounded border border-gray-800 mb-4">
                                <p className="text-2xl font-bold text-red-500">{result.blast_radius_analysis.risk_score} <span className="text-sm font-normal text-gray-500">Risk Score</span></p>
                                <p className="text-lg mt-2 text-orange-400">{result.blast_radius_analysis.total_affected_assets} <span className="text-sm text-gray-500">Exposed Assets</span></p>
                            </div>
                            
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Propagation Paths Found</h4>
                            <ul className="text-sm text-gray-300 space-y-1 font-mono">
                                {result.blast_radius_analysis.propagation_paths.slice(0,5).map((path: any, idx: number) => (
                                    <li key={idx} className="flex gap-2">
                                        <span className="text-gray-500">[{path.type}]</span> {path.source} → {path.target}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
