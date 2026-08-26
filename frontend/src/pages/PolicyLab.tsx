import React, { useEffect, useState } from 'react';
import { fetchRules, updateRuleAction } from '../services/api';

export default function PolicyLab() {
    const [rules, setRules] = useState([]);
    
    useEffect(() => {
        loadRules();
    }, []);

    const loadRules = () => {
        fetchRules().then(setRules);
    };

    const toggleRule = async (ruleId: number, currentAction: string) => {
        const newAction = currentAction === 'ALLOW' ? 'DENY' : 'ALLOW';
        await updateRuleAction(ruleId, newAction);
        loadRules();
    };

    return (
        <div className="p-8 h-full overflow-auto bg-gray-950 text-white">
            <h1 className="text-3xl font-bold mb-2">Security Policy Lab</h1>
            <p className="text-gray-400 mb-8">Modify security rules and see their immediate impact on the network's Blast Radius.</p>

            <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-800 text-gray-400 text-sm">
                        <tr>
                            <th className="p-4">Source Zone ID</th>
                            <th className="p-4">Destination Zone ID</th>
                            <th className="p-4">Protocol</th>
                            <th className="p-4">Port</th>
                            <th className="p-4">Priority</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rules.map((rule: any) => (
                            <tr key={rule.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                                <td className="p-4">Zone {rule.source_zone_id}</td>
                                <td className="p-4">Zone {rule.dest_zone_id}</td>
                                <td className="p-4 font-mono">{rule.protocol}</td>
                                <td className="p-4 font-mono">{rule.port}</td>
                                <td className="p-4">{rule.priority}</td>
                                <td className="p-4">
                                    <button 
                                        onClick={() => toggleRule(rule.id, rule.action)}
                                        className={`px-3 py-1 rounded text-xs font-bold w-24 ${
                                            rule.action === 'ALLOW' 
                                                ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-900' 
                                                : 'bg-red-900/50 text-red-400 border border-red-900'
                                        }`}
                                    >
                                        {rule.action}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 bg-blue-900/20 border border-blue-900/50 p-6 rounded-lg">
                <h3 className="text-blue-400 font-bold mb-2">What-If Security Simulator</h3>
                <p className="text-sm text-gray-300">
                    Try changing a critical rule (e.g., Guest to DB) to ALLOW, then navigate to the Incident Center or Topology view to see how it expands the blast radius of potential attacks.
                </p>
            </div>
        </div>
    );
}
