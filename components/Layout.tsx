import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  Users, Calendar, CheckSquare, DollarSign, Bell, 
  LogOut, Menu, X, LayoutDashboard 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { LogoIcon } from './UI';

interface LayoutProps {
  children: React.ReactNode;
}

const SidebarItem = ({ to, icon: Icon, label, active, onClick }: any) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      active 
        ? 'bg-primary-100 text-primary-900 font-medium' 
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    <Icon size={20} />
    <span>{label}</span>
  </Link>
);

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { state, dispatch } = useStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/players', icon: Users, label: 'Players' },
    { to: '/schedule', icon: Calendar, label: 'Schedule' },
    { to: '/attendance', icon: CheckSquare, label: 'Attendance' },
    { to: '/finances', icon: DollarSign, label: 'Finances' },
    { to: '/announcements', icon: Bell, label: 'Announcements' },
  ];

  // Filter nav items based on role if needed (simplified for demo)
  const role = state.currentUser?.role;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center space-x-3 p-6 border-b border-gray-100">
            <LogoIcon className="w-10 h-10 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-red-600 leading-none tracking-tight">LOLO</span>
              <span className="text-xs font-bold text-gray-900 tracking-wider">ACADEMY</span>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden text-gray-500 absolute right-4"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <SidebarItem 
                key={item.to}
                {...item} 
                active={location.pathname === item.to}
                onClick={() => setIsMobileMenuOpen(false)}
              />
            ))}
          </div>

          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center p-3 mb-3 bg-gray-50 rounded-lg">
              <img 
                src={state.currentUser?.avatarUrl || "https://via.placeholder.com/40"} 
                alt="User" 
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-gray-900 truncate">{state.currentUser?.name}</p>
                <p className="text-xs text-gray-500 truncate capitalize">{state.currentUser?.role}</p>
              </div>
            </div>
            <button
              onClick={() => dispatch({ type: 'LOGOUT' })}
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 text-gray-600"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-red-600">LOLO</span>
            <span className="font-bold text-gray-900">ACADEMY</span>
          </div>
          <div className="w-8" /> {/* Spacer */}
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
};