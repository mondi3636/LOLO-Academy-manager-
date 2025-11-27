
import React from 'react';
import { useStore } from '../store';
import { Card } from '../components/UI';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export const Reports: React.FC = () => {
  const { state } = useStore();

  // Data for Attendance Rate Chart (by Batch)
  const batchAttendance = state.batches.map(batch => {
    const sessions = state.sessions.filter(s => s.batchId === batch.id).map(s => s.id);
    if (sessions.length === 0) return { name: batch.name, rate: 0 };
    
    const records = state.attendance.filter(a => sessions.includes(a.sessionId));
    const present = records.filter(a => a.status === 'PRESENT').length;
    // Basic rate calculation: present / total records (assuming absent records are created)
    // Or simpler: just raw present count for now if total student count varies
    const rate = records.length > 0 ? Math.round((present / records.length) * 100) : 0;
    return { name: batch.name, rate };
  });

  // Data for Revenue by Month
  const paymentsByMonth = state.payments.reduce((acc: any, p) => {
      const month = p.date.substring(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + p.amount;
      return acc;
  }, {});
  const revenueData = Object.keys(paymentsByMonth).map(m => ({ name: m, amount: paymentsByMonth[m] }));

  // Player Status Pie Chart
  const activeCount = state.players.filter(p => p.status === 'ACTIVE').length;
  const inactiveCount = state.players.filter(p => p.status === 'INACTIVE').length;
  const statusData = [
      { name: 'Active', value: activeCount },
      { name: 'Inactive', value: inactiveCount }
  ];
  const COLORS = ['#22c55e', '#9ca3af'];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Attendance Rate by Batch (%)">
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={batchAttendance}>
                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Bar dataKey="rate" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>

        <Card title="Monthly Revenue">
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `MVR ${val}`} />
                        <Tooltip formatter={(value: any) => [`MVR ${value}`, 'Revenue']} />
                        <Bar dataKey="amount" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>

        <Card title="Player Retention">
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {statusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </Card>

        <Card title="Summary Stats">
            <div className="space-y-4">
                <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Total Coaches</span>
                    <span className="font-bold">{state.users.filter(u => u.role === 'COACH').length}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Total Tournaments</span>
                    <span className="font-bold">{state.tournaments.length}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">Low Stock Items</span>
                    <span className="font-bold text-red-600">{state.inventory.filter(i => i.quantity <= i.minThreshold).length}</span>
                </div>
            </div>
        </Card>
      </div>
    </div>
  );
};
