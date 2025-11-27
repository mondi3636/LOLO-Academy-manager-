
import React, { useState } from 'react';
import { useStore } from '../store';
import { Card, Button, Input, Select, Badge } from '../components/UI';
import { Plus, Users, Calendar, DollarSign, Activity } from 'lucide-react';
import { Batch } from '../types';

export const Batches: React.FC = () => {
  const { state, dispatch } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBatch, setNewBatch] = useState<Partial<Batch>>({
    name: '',
    sport: 'Badminton',
    scheduleDescription: '',
    monthlyFee: 300,
  });

  const handleAddBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const batch: Batch = {
        id: `b${Date.now()}`,
        name: newBatch.name!,
        sport: newBatch.sport as any,
        coachId: state.currentUser?.id || 'u1',
        scheduleDescription: newBatch.scheduleDescription!,
        monthlyFee: Number(newBatch.monthlyFee),
    };
    dispatch({ type: 'ADD_BATCH', payload: batch });
    setShowAddModal(false);
    setNewBatch({ sport: 'Badminton', monthlyFee: 300 });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Batches & Groups</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus size={18} className="mr-2 inline" /> Create Batch
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.batches.map(batch => {
          const studentCount = state.players.filter(p => p.batchId === batch.id && p.status === 'ACTIVE').length;
          const coachName = state.currentUser?.id === batch.coachId ? 'You' : 'Coach';

          return (
            <Card key={batch.id} className="hover:shadow-md transition-shadow relative overflow-hidden">
               <div className={`absolute top-0 left-0 w-1 h-full ${batch.sport === 'Badminton' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
               <div className="pl-2">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                        <Badge color={batch.sport === 'Badminton' ? 'green' : 'red'}>{batch.sport}</Badge>
                        <h3 className="text-xl font-bold text-gray-900 mt-2">{batch.name}</h3>
                    </div>
                    <div className="text-right">
                        <span className="block text-2xl font-bold text-gray-900">MVR {batch.monthlyFee}</span>
                        <span className="text-xs text-gray-500">per month</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center text-gray-600 text-sm">
                        <Calendar size={16} className="mr-2" />
                        {batch.scheduleDescription || "No schedule set"}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                        <Users size={16} className="mr-2" />
                        {studentCount} Active Students
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                        <Activity size={16} className="mr-2" />
                        Coach: {coachName}
                    </div>
                  </div>
               </div>
            </Card>
          );
        })}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Create New Batch</h2>
            <form onSubmit={handleAddBatch}>
              <Input 
                label="Batch Name" 
                placeholder="e.g. Under-15 Advanced"
                value={newBatch.name} 
                onChange={e => setNewBatch({...newBatch, name: e.target.value})} 
                required 
              />
              <Select 
                label="Sport"
                value={newBatch.sport}
                onChange={e => setNewBatch({...newBatch, sport: e.target.value as any})}
              >
                  <option value="Badminton">Badminton</option>
                  <option value="Volleyball">Volleyball</option>
                  <option value="Other">Other</option>
              </Select>
              <Input 
                label="Schedule Description" 
                placeholder="e.g. Mon/Wed/Fri 16:00"
                value={newBatch.scheduleDescription} 
                onChange={e => setNewBatch({...newBatch, scheduleDescription: e.target.value})} 
                required 
              />
              <Input 
                label="Monthly Fee (MVR)" 
                type="number"
                value={newBatch.monthlyFee} 
                onChange={e => setNewBatch({...newBatch, monthlyFee: Number(e.target.value)})} 
                required 
              />
              
              <div className="mt-6 flex space-x-3">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1">Create Batch</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
