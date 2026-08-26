import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Topology from './pages/Topology';
import IncidentCenter from './pages/IncidentCenter';
import PolicyLab from './pages/PolicyLab';
import IAMSimulator from './pages/IAMSimulator';
import AssetManager from './pages/AssetManager';
import SecurityLogs from './pages/SecurityLogs';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="flex h-screen overflow-hidden bg-gray-950">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/topology" element={<Topology />} />
            <Route path="/policy-lab" element={<PolicyLab />} />
            <Route path="/incidents" element={<IncidentCenter />} />
            <Route path="/iam" element={<IAMSimulator />} />
            <Route path="/deploy" element={<AssetManager />} />
            <Route path="/logs" element={<SecurityLogs />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
