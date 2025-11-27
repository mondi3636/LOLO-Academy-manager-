import React, { useState } from 'react';
import { useStore } from '../store';
import { Card, Button, Badge } from '../components/UI';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { AttendanceStatus } from '../types';

export const Attendance: React.FC = () => {
  const { state, dispatch } = useStore();
  const [selectedSessionId, setSelectedSessionId] = useState<string>(state.sessions[0]?.id || '');

  const session = state.sessions.find(s => s.id === selectedSessionId);
  
  if (!session) return <div className="p-8 text-center text-gray-500">No sessions available to take attendance.</div>;

  const getStatus = (playerId: string): AttendanceStatus | undefined => {
    return state.attendance.find(a => a.sessionId === session.id && a.playerId === playerId)?.status;
  };

  const handleAttendance = (playerId: string, status: AttendanceStatus) => {
    dispatch({
        type: 'UPDATE_ATTENDANCE',
        payload: {
            id: `att_${session.id}_${playerId}`,
            sessionId: session.id,
            playerId,
            status,
            notes: '' 
        }
    });
  };

  // For demo, we assume all players are "registered" if not explicitly in list, 
  // or just show registered ones. Let's show registered + allow adding. 
  // Simplified: Show all players for now to simulate an open session or assume all are registered.
  // In a real app, we filter by `session.registeredPlayerIds`.
  const playersToList = state.players.filter(p => session.registeredPlayerIds.includes(p.id) || true); // Showing all for demo interactions

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <select 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            value={selectedSessionId}
            onChange={(e) => setSelectedSessionId(e.target.value)}
        >
            {state.sessions.map(s => (
                <option key={s.id} value={s.id}>
                    {s.date} @ {s.time} ({s.court})
                </option>
            ))}
        </select>
      </div>

      <Card>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-gray-100 text-sm text-gray-500">
                        <th className="px-6 py-4 font-medium">Player</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {playersToList.map(player => {
                        const status = getStatus(player.id);
                        return (
                            <tr key={player.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <img src={player.photoUrl} alt="" className="w-8 h-8 rounded-full mr-3" />
                                        <span className="font-medium text-gray-900">{player.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {status ? (
                                        <Badge color={
                                            status === 'PRESENT' ? 'green' :
                                            status === 'ABSENT' ? 'red' : 'yellow'
                                        }>{status}</Badge>
                                    ) : (
                                        <span className="text-gray-400 text-sm">Not Marked</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button 
                                        onClick={() => handleAttendance(player.id, 'PRESENT')}
                                        className={`p-2 rounded-full hover:bg-green-100 ${status === 'PRESENT' ? 'text-green-600 bg-green-50' : 'text-gray-400'}`}
                                        title="Present"
                                    >
                                        <CheckCircle size={20} />
                                    </button>
                                    <button 
                                        onClick={() => handleAttendance(player.id, 'LATE')}
                                        className={`p-2 rounded-full hover:bg-yellow-100 ${status === 'LATE' ? 'text-yellow-600 bg-yellow-50' : 'text-gray-400'}`}
                                        title="Late"
                                    >
                                        <Clock size={20} />
                                    </button>
                                    <button 
                                        onClick={() => handleAttendance(player.id, 'ABSENT')}
                                        className={`p-2 rounded-full hover:bg-red-100 ${status === 'ABSENT' ? 'text-red-600 bg-red-50' : 'text-gray-400'}`}
                                        title="Absent"
                                    >
                                        <XCircle size={20} />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
      </Card>
    </div>
  );
};