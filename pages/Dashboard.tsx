import React from 'react';
import { useStore } from '../store';
import { Card } from '../components/UI';
import { 
  Users, Calendar, DollarSign, Activity, 
  ArrowUpRight, ArrowDownRight 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const Dashboard: React.FC = () => {
  const { state } = useStore();

  const totalPlayers = state.players.length;
  const activeSessions = state.sessions.length;
  const totalRevenue = state.payments.reduce((acc, curr) => acc + curr.amount, 0);
  const outstandingBalance = state.players.reduce((acc, curr) => acc + (curr.balance < 0 ? Math.abs(curr.balance) : 0), 0);

  // Prepare Chart Data (Revenue by Date)
  const revenueData = state.payments.reduce((acc: any[], payment) => {
    const date = payment.date;
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.amount += payment.amount;
    } else {
      acc.push({ date, amount: payment.amount });
    }
    return acc;
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {trend && (
          <div className={`flex items-center text-xs font-medium mt-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <ArrowUpRight size={14} className="mr-1"/> : <ArrowDownRight size={14} className="mr-1"/>}
            <span>{trend === 'up' ? '+12%' : '-2%'} from last month</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">Welcome back, {state.currentUser?.name}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Players" value={totalPlayers} icon={Users} color="bg-blue-500" trend="up" />
        <StatCard title="Active Sessions" value={activeSessions} icon={Calendar} color="bg-indigo-500" />
        <StatCard title="Total Revenue" value={`$${totalRevenue}`} icon={DollarSign} color="bg-green-500" trend="up" />
        <StatCard title="Outstanding Fees" value={`$${outstandingBalance}`} icon={Activity} color="bg-red-500" trend="down" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Revenue Overview" className="lg:col-span-2">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} prefix="$" />
                <Tooltip 
                  cursor={{fill: '#f3f4f6'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} 
                />
                <Bar dataKey="amount" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Upcoming Sessions">
          <div className="space-y-4">
            {state.sessions.slice(0, 3).map(session => (
              <div key={session.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                <div className="bg-white p-2 rounded border border-gray-100 text-center min-w-[50px]">
                  <div className="text-xs font-bold text-gray-500 uppercase">{new Date(session.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                  <div className="text-lg font-bold text-gray-900">{new Date(session.date).getDate()}</div>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-semibold text-gray-900">{session.court}</h4>
                  <p className="text-xs text-gray-500">{session.time} • {session.durationMinutes} mins</p>
                  <div className="mt-1 flex items-center text-xs text-gray-500">
                    <Users size={12} className="mr-1" />
                    {session.registeredPlayerIds.length} / {session.capacity} Players
                  </div>
                </div>
              </div>
            ))}
            {state.sessions.length === 0 && <p className="text-gray-500 text-sm">No upcoming sessions.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
};