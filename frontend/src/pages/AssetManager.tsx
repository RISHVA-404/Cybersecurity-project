import React, { useState, useEffect } from 'react';
import { fetchZones, addAsset } from '../services/api';

const AssetManager = () => {
    const [zones, setZones] = useState<any[]>([]);
    const [name, setName] = useState('');
    const [type, setType] = useState('Server');
    const [criticality, setCriticality] = useState('5');
    const [zoneId, setZoneId] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const loadZones = async () => {
            const data = await fetchZones();
            setZones(data);
            if (data.length > 0) {
                setZoneId(data[0].id.toString());
            }
        };
        loadZones();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !zoneId) return;

        await addAsset(name, type, parseInt(criticality), parseInt(zoneId));
        
        setSuccessMessage(`Successfully deployed ${name} to the network!`);
        setName('');
        
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    return (
        <div className="p-8 max-w-4xl">
            <h1 className="text-3xl font-bold text-white mb-2">Deploy New Asset</h1>
            <p className="text-gray-400 mb-8">
                Simulate provisioning a new workload into the hybrid datacenter. Once deployed, 
                you can view it in the Security Twin and simulate cyberattacks against it.
            </p>

            <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-900/30 border border-green-500/50 rounded text-green-400">
                        {successMessage}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Asset Name</label>
                        <input 
                            type="text" 
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., HR Database, Machine Learning Node"
                            className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white focus:outline-none focus:border-emerald-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Target Trust Zone (VPC)</label>
                        <select 
                            value={zoneId}
                            onChange={(e) => setZoneId(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white focus:outline-none focus:border-emerald-500"
                        >
                            {zones.map(z => (
                                <option key={z.id} value={z.id}>{z.name} (Trust Level: {z.trust_level})</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Asset Type</label>
                        <select 
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white focus:outline-none focus:border-emerald-500"
                        >
                            <option value="Server">Server / VM</option>
                            <option value="Container">Kubernetes Pod</option>
                            <option value="Database">Database Cluster</option>
                            <option value="Endpoint">User Endpoint</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Criticality Score (1-10)</label>
                        <input 
                            type="number" 
                            min="1" max="10"
                            value={criticality}
                            onChange={(e) => setCriticality(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-800 flex justify-end">
                    <button 
                        type="submit"
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium transition-colors"
                    >
                        Deploy to Architecture
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AssetManager;
