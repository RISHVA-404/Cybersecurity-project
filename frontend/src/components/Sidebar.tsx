import { Link, useLocation } from 'react-router-dom';
import { Shield, Activity, Network, ShieldAlert, FileText, Settings, Users, Server, AlertTriangle } from 'lucide-react';

export default function Sidebar() {
    const location = useLocation();

    const menuItems = [
        { path: '/', name: 'Dashboard', icon: <Activity size={20} /> },
        { path: '/topology', name: 'Security Twin', icon: <Network size={20} /> },
        { path: '/deploy', name: 'Asset Deployment', icon: <Server size={20} /> },
        { path: '/policy-lab', name: 'Policy Lab', icon: <Shield size={20} /> },
        { path: '/iam', name: 'IAM Simulator', icon: <Users size={20} /> },
        { path: '/incidents', name: 'Incident Center', icon: <ShieldAlert size={20} /> },
        { path: '/logs', name: 'Security Logs', icon: <FileText size={20} /> },
        { path: '/settings', name: 'Settings', icon: <Settings size={20} /> },
    ];

    return (
        <div className="w-64 bg-gray-900 text-white flex flex-col h-screen border-r border-gray-800">
            <div className="p-6">
                <h1 className="text-xl font-bold flex items-center gap-2 text-emerald-400">
                    <Shield className="text-emerald-500" />
                    SentinelMesh
                </h1>
                <p className="text-xs text-gray-500 mt-1">Adaptive Security Platform</p>
            </div>
            <nav className="flex-1 mt-4">
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex items-center gap-3 px-6 py-3 hover:bg-gray-800 transition-colors ${
                                    location.pathname === item.path ? 'bg-gray-800 border-l-4 border-emerald-500' : 'border-l-4 border-transparent'
                                }`}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}
