
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider, useStore } from './store';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Players } from './pages/Players';
import { Schedule } from './pages/Schedule';
import { Attendance } from './pages/Attendance';
import { Finances } from './pages/Finances';
import { Announcements } from './pages/Announcements';
import { Batches } from './pages/Batches';
import { Leads } from './pages/Leads';
import { Inventory } from './pages/Inventory';
import { Tournaments } from './pages/Tournaments';
import { Coaches } from './pages/Coaches';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { LogoIcon } from './components/UI';

// Login Component defined here for simplicity
const LoginScreen = () => {
  const { login, state } = useStore();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('ADMIN');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || 'demo@lolo.com', role);
  };

  const logoUrl = state.settings.logoUrl;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white">
        <div className="flex flex-col items-center mb-10">
            <div className="w-32 h-32 mb-6 flex items-center justify-center">
              {logoUrl ? (
                   <img src={logoUrl} alt="Academy Logo" className="w-full h-full object-contain drop-shadow-sm" />
              ) : (
                   <LogoIcon className="w-full h-full" />
              )}
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight text-center mb-2">LOLO</h1>
            <h2 className="text-xl font-bold text-gray-600 tracking-wide text-center">ACADEMY MANAGER</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all bg-gray-50 text-black font-medium"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Role</label>
            <select 
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all bg-gray-50 text-black font-medium"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="ADMIN">Administrator</option>
              <option value="COACH">Coach</option>
              <option value="PARENT">Parent</option>
            </select>
          </div>
          <button 
            type="submit" 
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-transform active:scale-[0.98] shadow-xl"
          >
            Sign In
          </button>
        </form>
        
        <div className="mt-8 text-center">
            <p className="text-xs text-gray-400 font-medium">Demo Access: No password required.</p>
        </div>
      </div>
    </div>
  );
};

const AppContent = () => {
    const { state } = useStore();

    if (!state.currentUser) {
        return <LoginScreen />;
    }

    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/batches" element={<Batches />} />
                <Route path="/players" element={<Players />} />
                <Route path="/leads" element={<Leads />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/finances" element={<Finances />} />
                <Route path="/announcements" element={<Announcements />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/tournaments" element={<Tournaments />} />
                <Route path="/coaches" element={<Coaches />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Layout>
    );
};

function App() {
  return (
    <StoreProvider>
      <Router>
        <AppContent />
      </Router>
    </StoreProvider>
  );
}

export default App;
