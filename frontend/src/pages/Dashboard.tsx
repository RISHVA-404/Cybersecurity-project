import React, { useEffect, useState } from 'react';
import { ShieldAlert, ShieldCheck, Activity, Target } from 'lucide-react';
import { fetchIncidents } from '../services/api';

export default function Dashboard() {
    const [incidents, setIncidents] = useState([]);

    useEffect(() => {
        fetchIncidents().then(setIncidents);
    }, []);

    return (
        <div className="p-8 h-full overflow-auto bg-gray-950 text-white">
            <h1 className="text-3xl font-bold mb-8">Security Operations Center</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                    <div className="flex items-center gap-4">
                        <div className="bg-emerald-900/50 p-3 rounded-full text-emerald-500">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Security Score</p>
                            <h2 className="text-2xl font-bold text-emerald-400">92/100</h2>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                    <div className="flex items-center gap-4">
                        <div className="bg-red-900/50 p-3 rounded-full text-red-500">
                            <ShieldAlert size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Active Incidents</p>
                            <h2 className="text-2xl font-bold text-red-400">{incidents.length}</h2>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-900/50 p-3 rounded-full text-blue-500">
                            <Target size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Protected Assets</p>
                            <h2 className="text-2xl font-bold text-white">7</h2>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                    <div className="flex items-center gap-4">
                        <div className="bg-purple-900/50 p-3 rounded-full text-purple-500">
                            <Activity size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Segmentation Rules</p>
                            <h2 className="text-2xl font-bold text-white">6</h2>
                        </div>
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-bold mb-4">Recent Security Events</h2>
            <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-800 text-gray-400 text-sm">
                        <tr>
                            <th className="p-4">Time</th>
                            <th className="p-4">Severity</th>
                            <th className="p-4">Event Title</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {incidents.slice(0, 5).map((inc: any) => (
                            <tr key={inc.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                                <td className="p-4 text-sm text-gray-400">{new Date(inc.timestamp).toLocaleString()}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                        inc.severity === 'High' ? 'bg-red-900/50 text-red-400' :
                                        inc.severity === 'Medium' ? 'bg-orange-900/50 text-orange-400' :
                                        'bg-blue-900/50 text-blue-400'
                                    }`}>
                                        {inc.severity}
                                    </span>
                                </td>
                                <td className="p-4">{inc.title}</td>
                                <td className="p-4">
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">{inc.status}</span>
                                </td>
                            </tr>
                        ))}
                        {incidents.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">No active incidents</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
