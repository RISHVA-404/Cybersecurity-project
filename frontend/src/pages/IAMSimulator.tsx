import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AlertCircle, CheckCircle } from 'lucide-react';

const API_URL = 'http://127.0.0.1:8000/api';

export default function IAMSimulator() {
    const [users, setUsers] = useState([]);
    const [assets, setAssets] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedAsset, setSelectedAsset] = useState("");
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        axios.get(`${API_URL}/users`).then(res => setUsers(res.data));
        axios.get(`${API_URL}/assets`).then(res => setAssets(res.data));
    }, []);

    const handleTestAccess = async () => {
        if (!selectedUser || !selectedAsset) return;
        const res = await axios.post(`${API_URL}/iam/evaluate`, {
            user_id: parseInt(selectedUser),
            asset_id: parseInt(selectedAsset)
        });
        setResult(res.data);
    };

    return (
        <div className="p-8 h-full overflow-auto bg-gray-950 text-white">
            <h1 className="text-3xl font-bold mb-2">IAM Simulator</h1>
            <p className="text-gray-400 mb-8">Test role-based access control and least privilege policies.</p>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8 max-w-2xl">
                <h2 className="text-xl font-bold mb-4">Test Access Path</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Select User</label>
                        <select 
                            className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-white"
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                        >
                            <option value="">-- Select User --</option>
                            {users.map((u: any) => (
                                <option key={u.id} value={u.id}>{u.username} ({u.role.name})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Select Target Asset</label>
                        <select 
                            className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-white"
                            value={selectedAsset}
                            onChange={(e) => setSelectedAsset(e.target.value)}
                        >
                            <option value="">-- Select Asset --</option>
                            {assets.map((a: any) => (
                                <option key={a.id} value={a.id}>{a.name} ({a.type})</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button 
                    onClick={handleTestAccess}
                    disabled={!selectedUser || !selectedAsset}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                >
                    Evaluate Access
                </button>
            </div>

            {result && (
                <div className={`p-6 rounded-lg border ${result.decision === 'ALLOW' ? 'bg-emerald-900/20 border-emerald-900/50' : 'bg-red-900/20 border-red-900/50'}`}>
                    <div className="flex items-center gap-3 mb-2">
                        {result.decision === 'ALLOW' ? <CheckCircle className="text-emerald-500" /> : <AlertCircle className="text-red-500" />}
                        <h2 className={`text-xl font-bold ${result.decision === 'ALLOW' ? 'text-emerald-400' : 'text-red-400'}`}>
                            ACCESS {result.decision}
                        </h2>
                    </div>
                    <p className="text-gray-300 mt-2">{result.explanation}</p>
                    <div className="mt-4 bg-gray-950 p-4 rounded text-sm font-mono text-gray-400">
                        <p>User Role: {result.user_role}</p>
                        <p>Required Trust Level: {result.required_trust}</p>
                        <p>Role Clearance: {result.role_clearance}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
