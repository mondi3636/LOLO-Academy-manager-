
import React from 'react';
import { useStore } from '../store';
import { Card } from '../components/UI';
import { 
  Users, Layers, DollarSign, Activity, 
  UserCheck, AlertCircle 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Dashboard: React.FC = () => {
  const { state } = useStore();

  const totalPlayers = state.players.length;
  const activeGroups = state.batches.length;
  
  // Today's Attendance Calculation
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysSessions = state.sessions.filter(s => s.date === todayStr);
  const todaysSessionIds = todaysSessions.map(s => s.id);
  const todaysAttendanceCount = state.attendance.filter(a => todaysSessionIds.includes(a.sessionId) && a.status === 'PRESENT').length;

  const pendingFeesCount = state.players.filter(p => p.balance < 0).length;
  const totalPendingAmount = state.players.reduce((acc, curr) => acc + (curr.balance < 0 ? Math.abs(curr.balance) : 0), 0);

  // Revenue Data for Chart
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

  const StatCard = ({ title, value, subtext, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
      </div>
      <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Home Dashboard</h1>
        <div className="text-sm text-gray-500">Welcome back, {state.currentUser?.name}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            title="Total Players" 
            value={totalPlayers} 
            subtext="Registered Students" 
            icon={Users} 
            color="bg-blue-500" 
        />
        <StatCard 
            title="Active Groups" 
            value={activeGroups} 
            subtext="Batches running"
            icon={Layers} 
            color="bg-indigo-500" 
        />
        <StatCard 
            title="Today's Attendance" 
            value={todaysAttendanceCount} 
            subtext="Students Present today"
            icon={UserCheck} 
            color="bg-green-500" 
        />
        <StatCard 
            title="Pending Fees" 
            value={`MVR ${totalPendingAmount}`} 
            subtext={`${pendingFeesCount} students pending`}
            icon={AlertCircle} 
            color="bg-red-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Revenue Overview" className="lg:col-span-2">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} tickFormatter={(val) => `MVR ${val}`} />
                <Tooltip 
                  cursor={{fill: '#f3f4f6'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                  formatter={(value: any) => [`MVR ${value}`, 'Revenue']} 
                />
                <Bar dataKey="amount" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Today's Sessions">
            <div className="space-y-4">
            {todaysSessions.length > 0 ? todaysSessions.map(session => (
              <div key={session.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                <div className="bg-white p-2 rounded border border-gray-100 text-center min-w-[50px]">
                  <div className="text-lg font-bold text-gray-900">{session.time}</div>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-semibold text-gray-900">{session.court}</h4>
                  <p className="text-xs text-gray-500">{session.durationMinutes} mins • Coach: {state.users.find(u=>u.id===session.coachId)?.name}</p>
                </div>
              </div>
            )) : (
                <p className="text-gray-500 text-sm">No sessions scheduled for today.</p>
            )}
            
            <div className="pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Upcoming Tomorrow</h4>
                {state.sessions.filter(s => {
                    const d = new Date(); d.setDate(d.getDate() + 1);
                    return s.date === d.toISOString().split('T')[0];
                }).map(session => (
                    <div key={session.id} className="text-sm text-gray-700 flex justify-between">
                        <span>{session.time} - {session.court}</span>
                    </div>
                ))}
            </div>
            </div>
        </Card>
      </div>
    </div>
  );
};
