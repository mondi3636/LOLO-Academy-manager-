
import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  Users, Calendar, CheckSquare, DollarSign, Bell, 
  LogOut, Menu, X, LayoutDashboard, Layers, UserPlus,
  Trophy, Package, FileBarChart, Settings, Award, UserCheck
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
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
      active 
        ? 'bg-gray-900 text-white shadow-md' 
        : 'text-gray-600 hover:bg-gray-100 hover:text-black'
    }`}
  >
    <Icon size={18} className={active ? 'text-white' : 'text-gray-500'} />
    <span>{label}</span>
  </Link>
);

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { state, dispatch } = useStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filter menu items based on role if needed. Assuming ADMIN sees all.
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/batches', icon: Layers, label: 'Groups & Batches' },
    { to: '/players', icon: Users, label: 'Players' },
    { to: '/leads', icon: UserPlus, label: 'Enquiries / Leads' },
    { to: '/attendance', icon: CheckSquare, label: 'Attendance' },
    { to: '/schedule', icon: Calendar, label: 'Schedule' },
    { to: '/coaches', icon: UserCheck, label: 'Coaches' }, 
    { to: '/finances', icon: DollarSign, label: 'Fees & Payments' },
    { to: '/tournaments', icon: Trophy, label: 'Tournaments' }, 
    { to: '/inventory', icon: Package, label: 'Inventory' }, 
    { to: '/reports', icon: FileBarChart, label: 'Reports' }, 
    { to: '/announcements', icon: Bell, label: 'Announcements' },
    { to: '/settings', icon: Settings, label: 'Settings' }, 
  ];

  const logoUrl = state.settings.logoUrl;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden text-gray-900 font-sans">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col shadow-xl lg:shadow-none
      `}>
        <div className="flex items-center space-x-3 p-6 border-b border-gray-100">
           {logoUrl ? (
                <img src={logoUrl} alt="Academy Logo" className="w-10 h-10 object-contain" />
           ) : (
                <LogoIcon className="w-10 h-10 flex-shrink-0" />
           )}
          <div className="flex flex-col">
            <span className="text-xl font-black text-gray-900 leading-none tracking-tight">LOLO</span>
            <span className="text-xs font-bold text-gray-500 tracking-wider mt-1">ACADEMY MANAGER</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden text-gray-500 absolute right-4 hover:text-black"
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

        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center p-3 mb-3 bg-white border border-gray-200 rounded-xl shadow-sm">
            <img 
              src={state.currentUser?.avatarUrl || "https://via.placeholder.com/40"} 
              alt="User" 
              className="w-10 h-10 rounded-full object-cover border border-gray-100"
            />
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-bold text-gray-900 truncate">{state.currentUser?.name}</p>
              <p className="text-xs text-gray-500 truncate capitalize font-medium">{state.currentUser?.role}</p>
            </div>
          </div>
          <button
            onClick={() => dispatch({ type: 'LOGOUT' })}
            className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-bold text-red-600 bg-white border border-red-100 rounded-xl hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} className="mr-2" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 text-gray-900"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center space-x-2">
            {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-8 h-8 object-contain" />
            ) : (
                <LogoIcon className="w-8 h-8" />
            )}
            <span className="font-bold text-gray-900">LOLO ACADEMY</span>
          </div>
          <div className="w-8" /> {/* Spacer */}
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth pb-20 bg-gray-50">
          {children}
        </div>

        {/* Footer */}
        <div className="w-full bg-white border-t border-gray-200 p-4 text-center text-xs text-gray-500 font-medium">
            <p className="text-gray-900 font-bold mb-1">{state.settings.academyName}</p>
            <p>{state.settings.contactPhone} &bull; {state.settings.address}</p>
        </div>
      </main>
    </div>
  );
};
