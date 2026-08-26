import React, { useState } from 'react';
import { Save, Server, Shield, Bell, Key } from 'lucide-react';

const Settings = () => {
    const [saved, setSaved] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto h-full overflow-y-auto">
            <h1 className="text-3xl font-bold text-white mb-2">Platform Settings</h1>
            <p className="text-gray-400 mb-8">Configure global security parameters, API integrations, and Blast Radius thresholds.</p>

            <form onSubmit={handleSave} className="space-y-8">
                
                {/* Security Engine Settings */}
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <Shield className="text-emerald-500" size={20} />
                        Blast Radius Engine
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Risk Calculation Algorithm</label>
                            <select className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white focus:outline-none focus:border-emerald-500">
                                <option>Standard BFS (Breadth-First Search)</option>
                                <option>Dijkstra's Shortest Path (Trust-Weighted)</option>
                                <option>AI-Predictive Graph Model (Experimental)</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Determines how propagation paths are evaluated during an incident.</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <input type="checkbox" id="auto-isolate" defaultChecked className="w-4 h-4 rounded bg-gray-950 border-gray-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-gray-900" />
                            <label htmlFor="auto-isolate" className="text-sm text-gray-300">
                                Enable Auto-Isolation (Dynamically update Policy Lab rules if Risk Score {'>'} 80)
                            </label>
                        </div>
                    </div>
                </div>

                {/* Hybrid Datacenter Integrations */}
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <Server className="text-blue-500" size={20} />
                        Hybrid Datacenter Integrations
                    </h2>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">AWS Access Key ID</label>
                            <input type="password" defaultValue="AKIAIOSFODNN7EXAMPLE" className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white font-mono text-sm focus:outline-none focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">AWS Secret Access Key</label>
                            <input type="password" defaultValue="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white font-mono text-sm focus:outline-none focus:border-blue-500" />
                        </div>
                        <div className="col-span-2 flex items-center gap-3">
                            <input type="checkbox" id="sync-vpc" defaultChecked className="w-4 h-4 rounded bg-gray-950 border-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900" />
                            <label htmlFor="sync-vpc" className="text-sm text-gray-300">
                                Continuously sync VPC topology and Security Groups from AWS
                            </label>
                        </div>
                    </div>
                </div>

                {/* API & Webhooks */}
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <Bell className="text-purple-500" size={20} />
                        Alerting & Webhooks
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Alert Webhook URL</label>
                            <input type="text" placeholder="https://api.your-company.com/webhook/alerts" className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white font-mono text-sm focus:outline-none focus:border-purple-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Minimum Alert Severity</label>
                            <select className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-white focus:outline-none focus:border-purple-500">
                                <option>CRITICAL & WARNING only</option>
                                <option>ALL events (including INFO)</option>
                                <option>CRITICAL only</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-end gap-4 pb-12">
                    {saved && <span className="text-emerald-400 text-sm font-medium flex items-center gap-1"><Save size={16}/> Configuration Saved</span>}
                    <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded font-medium transition-colors">
                        Save Configuration
                    </button>
                </div>

            </form>
        </div>
    );
};

export default Settings;
