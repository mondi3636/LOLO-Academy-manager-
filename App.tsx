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
import { LogoIcon } from './components/UI';

// Login Component defined here for simplicity
const LoginScreen = () => {
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('ADMIN');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || 'demo@lolo.com', role);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 mb-4">
              <LogoIcon className="w-full h-full" />
            </div>
            <h1 className="text-3xl font-bold text-red-600 tracking-wide">LOLO</h1>
            <h2 className="text-lg font-bold text-red-600 tracking-wider mb-1">BADMINTON ACADEMY</h2>
            <p className="text-xs font-bold text-gray-900 tracking-[0.2em] uppercase">Dream to Win</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
              placeholder="admin@lolo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="ADMIN">Admin</option>
              <option value="COACH">Coach</option>
              <option value="PARENT">Parent</option>
            </select>
          </div>
          <button 
            type="submit" 
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
          >
            Sign In
          </button>
        </form>
        <div className="mt-6 text-center text-xs text-gray-400">
            For demo: Any email works.
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
                <Route path="/players" element={<Players />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/finances" element={<Finances />} />
                <Route path="/announcements" element={<Announcements />} />
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