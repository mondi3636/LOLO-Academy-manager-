import React, { useState } from 'react';
import { useStore } from '../store';
import { Card, Button, Input, Select, Badge } from '../components/UI';
import { Plus, Clock, Users, MapPin } from 'lucide-react';
import { Session } from '../types';

export const Schedule: React.FC = () => {
  const { state, dispatch } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSession, setNewSession] = useState<Partial<Session>>({
    date: new Date().toISOString().split('T')[0],
    time: '16:00',
    durationMinutes: 60,
    court: 'Court A',
    capacity: 6,
  });

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    const session: Session = {
        id: `s${Date.now()}`,
        date: newSession.date!,
        time: newSession.time!,
        durationMinutes: newSession.durationMinutes || 60,
        coachId: state.currentUser?.id || 'u1',
        court: newSession.court || 'Court A',
        capacity: newSession.capacity || 6,
        registeredPlayerIds: []
    };
    dispatch({ type: 'ADD_SESSION', payload: session });
    setShowAddModal(false);
  };

  // Group sessions by date
  const groupedSessions = state.sessions.reduce((groups: any, session) => {
    const date = session.date;
    if (!groups[date]) groups[date] = [];
    groups[date].push(session);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedSessions).sort();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus size={18} className="mr-2 inline" /> New Session
        </Button>
      </div>

      <div className="space-y-8">
        {sortedDates.map(date => (
          <div key={date}>
            <h2 className="text-lg font-semibold text-gray-700 mb-4 sticky top-0 bg-gray-50 py-2">
              {new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedSessions[date].map((session: Session) => (
                <Card key={session.id} className="border-l-4 border-l-primary-500">
                  <div className="flex justify-between items-start mb-2">
                    <Badge color="blue">{session.court}</Badge>
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                      {session.durationMinutes} min
                    </span>
                  </div>
                  <div className="flex items-center text-gray-900 font-bold text-lg mb-4">
                    <Clock size={20} className="mr-2 text-primary-600" />
                    {session.time}
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Users size={16} className="mr-2" />
                        <span>Capacity</span>
                      </div>
                      <span className="font-medium">{session.registeredPlayerIds.length} / {session.capacity}</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-primary-500 h-1.5 rounded-full" 
                        style={{ width: `${(session.registeredPlayerIds.length / session.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Schedule Session</h2>
            <form onSubmit={handleAddSession}>
              <Input 
                label="Date" 
                type="date" 
                value={newSession.date} 
                onChange={e => setNewSession({...newSession, date: e.target.value})} 
                required 
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                    label="Time" 
                    type="time" 
                    value={newSession.time} 
                    onChange={e => setNewSession({...newSession, time: e.target.value})} 
                    required 
                />
                <Input 
                    label="Duration (min)" 
                    type="number" 
                    value={newSession.durationMinutes} 
                    onChange={e => setNewSession({...newSession, durationMinutes: parseInt(e.target.value)})} 
                    required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select 
                  label="Court"
                  value={newSession.court}
                  onChange={e => setNewSession({...newSession, court: e.target.value})}
                >
                    <option value="Court A">Court A</option>
                    <option value="Court B">Court B</option>
                    <option value="Court C">Court C</option>
                </Select>
                <Input 
                    label="Capacity" 
                    type="number" 
                    value={newSession.capacity} 
                    onChange={e => setNewSession({...newSession, capacity: parseInt(e.target.value)})} 
                    required 
                />
              </div>
              <div className="mt-6 flex space-x-3">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1">Create</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};