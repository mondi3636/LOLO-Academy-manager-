import React, { useState } from 'react';
import { useStore } from '../store';
import { Card, Button, Input, Select, Badge } from '../components/UI';
import { Plus, Phone, ArrowRight, UserPlus, Check } from 'lucide-react';
import { Lead } from '../types';

const LeadCard: React.FC<{ 
    lead: Lead; 
    onUpdateStatus: (id: string, status: string) => void; 
    onConvertToStudent: (lead: Lead) => void 
}> = ({ lead, onUpdateStatus, onConvertToStudent }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-3">
        <div className="flex justify-between items-start">
            <div>
                <h4 className="font-bold text-gray-900">{lead.name}</h4>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Phone size={12} className="mr-1" /> {lead.contact}
                </div>
            </div>
            <Badge color={lead.sportOfInterest === 'Badminton' ? 'green' : 'red'}>{lead.sportOfInterest}</Badge>
        </div>
        <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">{lead.notes || 'No notes'}</p>
        <div className="mt-3 flex justify-end space-x-2">
            {lead.status === 'NEW' && (
                <Button variant="secondary" className="px-2 py-1 text-xs" onClick={() => onUpdateStatus(lead.id, 'CONTACTED')}>
                    Mark Contacted
                </Button>
            )}
            {lead.status !== 'CONVERTED' && (
                <Button className="px-2 py-1 text-xs" onClick={() => onConvertToStudent(lead)}>
                    <UserPlus size={14} className="mr-1 inline" /> Enroll
                </Button>
            )}
            {lead.status === 'CONVERTED' && (
                <span className="text-green-600 text-xs font-bold flex items-center">
                    <Check size={14} className="mr-1" /> Enrolled
                </span>
            )}
        </div>
    </div>
);

export const Leads: React.FC = () => {
  const { state, dispatch } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLead, setNewLead] = useState<Partial<Lead>>({
    name: '',
    contact: '',
    sportOfInterest: 'Badminton',
    notes: '',
  });

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    const lead: Lead = {
        id: `l${Date.now()}`,
        name: newLead.name!,
        contact: newLead.contact!,
        sportOfInterest: newLead.sportOfInterest as any,
        notes: newLead.notes || '',
        date: new Date().toISOString().split('T')[0],
        status: 'NEW'
    };
    dispatch({ type: 'ADD_LEAD', payload: lead });
    setShowAddModal(false);
    setNewLead({ sportOfInterest: 'Badminton', notes: '' });
  };

  const updateStatus = (id: string, status: string) => {
      dispatch({ type: 'UPDATE_LEAD_STATUS', payload: { id, status } });
  };

  const convertToStudent = (lead: Lead) => {
      // Logic to open student modal pre-filled would go here
      // For now, we'll just mark as converted and alert
      updateStatus(lead.id, 'CONVERTED');
      alert(`Please go to Students page to add ${lead.name} formally. (Feature simplified for demo)`);
  };

  const leadsByStatus = {
      NEW: state.leads.filter(l => l.status === 'NEW'),
      CONTACTED: state.leads.filter(l => l.status === 'CONTACTED'),
      CONVERTED: state.leads.filter(l => l.status === 'CONVERTED'),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Enquiries & Leads</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus size={18} className="mr-2 inline" /> Add Enquiry
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          {/* New Column */}
          <div className="bg-gray-100 p-4 rounded-xl">
              <h3 className="font-bold text-gray-700 mb-4 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span> New ({leadsByStatus.NEW.length})
              </h3>
              {leadsByStatus.NEW.map(lead => (
                  <LeadCard 
                    key={lead.id} 
                    lead={lead} 
                    onUpdateStatus={updateStatus} 
                    onConvertToStudent={convertToStudent} 
                  />
              ))}
          </div>

          {/* Contacted Column */}
          <div className="bg-gray-100 p-4 rounded-xl">
              <h3 className="font-bold text-gray-700 mb-4 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span> Contacted ({leadsByStatus.CONTACTED.length})
              </h3>
              {leadsByStatus.CONTACTED.map(lead => (
                  <LeadCard 
                    key={lead.id} 
                    lead={lead} 
                    onUpdateStatus={updateStatus} 
                    onConvertToStudent={convertToStudent} 
                  />
              ))}
          </div>

          {/* Converted Column */}
          <div className="bg-gray-100 p-4 rounded-xl">
              <h3 className="font-bold text-gray-700 mb-4 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> Converted ({leadsByStatus.CONVERTED.length})
              </h3>
              {leadsByStatus.CONVERTED.map(lead => (
                  <LeadCard 
                    key={lead.id} 
                    lead={lead} 
                    onUpdateStatus={updateStatus} 
                    onConvertToStudent={convertToStudent} 
                  />
              ))}
          </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">New Enquiry</h2>
            <form onSubmit={handleAddLead}>
              <Input 
                label="Name" 
                value={newLead.name} 
                onChange={e => setNewLead({...newLead, name: e.target.value})} 
                required 
              />
              <Input 
                label="Contact (Phone/Viber)" 
                value={newLead.contact} 
                onChange={e => setNewLead({...newLead, contact: e.target.value})} 
                required 
              />
              <Select 
                label="Sport of Interest"
                value={newLead.sportOfInterest}
                onChange={e => setNewLead({...newLead, sportOfInterest: e.target.value as any})}
              >
                  <option value="Badminton">Badminton</option>
                  <option value="Volleyball">Volleyball</option>
                  <option value="Other">Other</option>
              </Select>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  value={newLead.notes}
                  onChange={e => setNewLead({...newLead, notes: e.target.value})}
                ></textarea>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1">Save Lead</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};