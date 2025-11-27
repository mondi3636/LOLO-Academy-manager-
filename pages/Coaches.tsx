
import React from 'react';
import { useStore } from '../store';
import { Card, Badge } from '../components/UI';
import { UserCheck, Calendar, DollarSign, Briefcase } from 'lucide-react';

export const Coaches: React.FC = () => {
  const { state } = useStore();
  const coaches = state.users.filter(u => u.role === 'COACH' || u.role === 'ADMIN');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Coaches Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {coaches.map(coach => {
            // Calculate stats
            const sessions = state.sessions.filter(s => s.coachId === coach.id);
            const totalHours = sessions.reduce((acc, s) => acc + (s.durationMinutes / 60), 0);
            const estimatedPay = totalHours * (coach.hourlyRate || 0);

            return (
                <Card key={coach.id}>
                    <div className="flex items-center space-x-4 mb-6">
                        <img src={coach.avatarUrl} alt={coach.name} className="w-16 h-16 rounded-full object-cover border-2 border-primary-500" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{coach.name}</h2>
                            <div className="flex space-x-2 mt-1">
                                <Badge color="blue">{coach.role}</Badge>
                                <span className="text-sm text-gray-500">{coach.email}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                        <div className="text-center p-2 border-r border-gray-200">
                            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Sessions Taken</div>
                            <div className="text-xl font-bold text-gray-900">{sessions.length}</div>
                        </div>
                        <div className="text-center p-2">
                             <div className="text-xs text-gray-500 uppercase font-bold mb-1">Hours Logged</div>
                             <div className="text-xl font-bold text-gray-900">{totalHours.toFixed(1)}</div>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <div className="flex items-center text-gray-600">
                            <Briefcase size={16} className="mr-2" />
                            <span className="text-sm">Rate: MVR {coach.hourlyRate || 0}/hr</span>
                        </div>
                        <div className="flex items-center font-bold text-green-600 text-lg">
                            <DollarSign size={18} className="mr-1" />
                            MVR {estimatedPay.toFixed(2)}
                        </div>
                    </div>
                </Card>
            );
        })}
      </div>
    </div>
  );
};
