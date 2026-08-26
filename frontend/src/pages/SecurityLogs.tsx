import React, { useState, useEffect } from 'react';
import { Shield, AlertCircle, Info, Filter } from 'lucide-react';

const mockLogs = [
    { id: 101, time: '10:42:05', level: 'CRITICAL', event: 'Unauthorized root access attempt', source: '192.168.1.45', target: 'Database VPC (Cloud)' },
    { id: 102, time: '10:41:12', level: 'INFO', event: 'IAM Role [Student] evaluated for asset [Student Records System]', source: 'IAM Simulator', target: 'Access Denied' },
    { id: 103, time: '10:35:20', level: 'WARNING', event: 'High volume traffic spike detected', source: 'Public Guest Wi-Fi', target: 'Campus DMZ' },
    { id: 104, time: '10:15:00', level: 'INFO', event: 'Kubernetes Pod scaled horizontally', source: 'K8s Cluster', target: 'Application VPC (Cloud)' },
    { id: 105, time: '09:55:11', level: 'WARNING', event: 'Failed MFA challenge', source: 'VPN Gateway', target: 'Faculty Zone' },
    { id: 106, time: '09:30:05', level: 'CRITICAL', event: 'Malware signature matched: Ransom.WannaCry', source: 'Faculty Desktop', target: 'Faculty Zone' },
    { id: 107, time: '09:12:44', level: 'INFO', event: 'Security rule updated (Rule ID: 5)', source: 'Admin Console', target: 'Policy Lab' },
    { id: 108, time: '08:45:00', level: 'INFO', event: 'System booted. Zero-Trust policies loaded.', source: 'System', target: 'All Zones' },
];

const SecurityLogs = () => {
    const [filter, setFilter] = useState('ALL');
    const [logs, setLogs] = useState(mockLogs);

    useEffect(() => {
        if (filter === 'ALL') {
            setLogs(mockLogs);
        } else {
            setLogs(mockLogs.filter(log => log.level === filter));
        }
    }, [filter]);

    const getLevelBadge = (level: string) => {
        switch (level) {
            case 'CRITICAL': return <span className="px-2 py-1 bg-red-900/50 text-red-400 text-xs rounded border border-red-500/30 font-medium">CRITICAL</span>;
            case 'WARNING': return <span className="px-2 py-1 bg-yellow-900/50 text-yellow-400 text-xs rounded border border-yellow-500/30 font-medium">WARNING</span>;
            case 'INFO': return <span className="px-2 py-1 bg-blue-900/50 text-blue-400 text-xs rounded border border-blue-500/30 font-medium">INFO</span>;
            default: return null;
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Audit & Security Logs</h1>
                    <p className="text-gray-400">Real-time telemetry and auditing of hybrid datacenter events.</p>
                </div>
                
                <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded p-1">
                    <Filter size={16} className="text-gray-500 ml-2" />
                    <select 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-transparent text-sm text-gray-300 focus:outline-none p-2 cursor-pointer"
                    >
                        <option value="ALL">All Levels</option>
                        <option value="CRITICAL">Critical</option>
                        <option value="WARNING">Warning</option>
                        <option value="INFO">Info</option>
                    </select>
                </div>
            </div>

            <div className="flex-1 bg-gray-900 border border-gray-800 rounded-lg overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-950/50 border-b border-gray-800">
                            <tr>
                                <th className="px-6 py-4 font-medium">Time</th>
                                <th className="px-6 py-4 font-medium">Level</th>
                                <th className="px-6 py-4 font-medium">Event Description</th>
                                <th className="px-6 py-4 font-medium">Source</th>
                                <th className="px-6 py-4 font-medium">Target</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                                    <td className="px-6 py-4 font-mono text-gray-500">{log.time}</td>
                                    <td className="px-6 py-4">{getLevelBadge(log.level)}</td>
                                    <td className="px-6 py-4 text-gray-300">{log.event}</td>
                                    <td className="px-6 py-4 font-mono text-xs text-emerald-400/70">{log.source}</td>
                                    <td className="px-6 py-4 font-mono text-xs text-blue-400/70">{log.target}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {logs.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500 py-12">
                        <Info size={32} className="mb-2 opacity-50" />
                        <p>No logs found for the selected filter.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SecurityLogs;
