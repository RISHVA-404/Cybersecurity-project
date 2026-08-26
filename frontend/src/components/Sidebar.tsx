import { Link, useLocation } from 'react-router-dom';
import { Shield, Activity, Network, ShieldAlert, FileText, Settings, Users } from 'lucide-react';

export default function Sidebar() {
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', path: '/', icon: <Activity size={20} /> },
        { name: 'Security Twin', path: '/topology', icon: <Network size={20} /> },
        { name: 'Policy Lab', path: '/policy-lab', icon: <Shield size={20} /> },
        { name: 'IAM Simulator', path: '/iam', icon: <Users size={20} /> },
        { name: 'Incident Center', path: '/incidents', icon: <ShieldAlert size={20} /> },
        { name: 'Security Logs', path: '/logs', icon: <FileText size={20} /> },
        { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
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
