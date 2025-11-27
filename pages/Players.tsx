import React, { useState } from 'react';
import { useStore } from '../store';
import { Card, Button, Input, Select, Badge } from '../components/UI';
import { Plus, Search, Mail, Phone, MoreVertical } from 'lucide-react';
import { analyzePlayerProgress } from '../services/gemini';
import { Player } from '../types';

export const Players: React.FC = () => {
  const { state, dispatch } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // New Player Form State
  const [newPlayer, setNewPlayer] = useState<Partial<Player>>({
    name: '',
    dob: '',
    contactEmail: '',
    contactPhone: '',
    feeAmount: 150,
    level: 'Beginner',
  });

  const filteredPlayers = state.players.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    const player: Player = {
        id: `p${Date.now()}`,
        name: newPlayer.name || 'Unknown',
        dob: newPlayer.dob || '2000-01-01',
        contactEmail: newPlayer.contactEmail || '',
        contactPhone: newPlayer.contactPhone || '',
        photoUrl: `https://ui-avatars.com/api/?name=${newPlayer.name}&background=random`,
        feeAmount: newPlayer.feeAmount || 0,
        balance: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        level: (newPlayer.level as any) || 'Beginner',
    };
    dispatch({ type: 'ADD_PLAYER', payload: player });
    setShowAddModal(false);
    setNewPlayer({ feeAmount: 150, level: 'Beginner' });
  };

  const handleAnalyze = async (player: Player) => {
    setSelectedPlayer(player);
    setAiAnalysis(null);
    setIsAnalyzing(true);
    const result = await analyzePlayerProgress(player, state.attendance);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Players</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus size={18} className="mr-2 inline" /> Add Player
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search players by name or email..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlayers.map(player => (
          <Card key={player.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <img src={player.photoUrl} alt={player.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h3 className="font-semibold text-gray-900">{player.name}</h3>
                  <Badge color={
                    player.level === 'Advanced' ? 'green' : 
                    player.level === 'Intermediate' ? 'blue' : 'gray'
                  }>{player.level}</Badge>
                </div>
              </div>
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={() => handleAnalyze(player)}
              >
                 {/* Reusing icons as action trigger for demo */}
                <MoreVertical size={20} />
              </button>
            </div>
            
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Mail size={16} className="mr-2 text-gray-400" />
                {player.contactEmail}
              </div>
              <div className="flex items-center">
                <Phone size={16} className="mr-2 text-gray-400" />
                {player.contactPhone}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
              <div>
                <span className="text-gray-500">Balance:</span>
                <span className={`ml-1 font-semibold ${player.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ${player.balance}
                </span>
              </div>
              <button className="text-primary-600 hover:text-primary-700 font-medium">View Profile</button>
            </div>
          </Card>
        ))}
      </div>

      {/* Analysis Modal */}
      {selectedPlayer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold mb-4">Progress Analysis: {selectedPlayer.name}</h2>
            {isAnalyzing ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            ) : (
              <div className="prose prose-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
                {aiAnalysis}
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <Button variant="secondary" onClick={() => setSelectedPlayer(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Player Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">New Player Registration</h2>
            <form onSubmit={handleAddPlayer}>
              <Input 
                label="Full Name" 
                value={newPlayer.name} 
                onChange={e => setNewPlayer({...newPlayer, name: e.target.value})} 
                required 
              />
              <Input 
                label="Date of Birth" 
                type="date" 
                value={newPlayer.dob} 
                onChange={e => setNewPlayer({...newPlayer, dob: e.target.value})} 
                required 
              />
              <Input 
                label="Parent Email" 
                type="email" 
                value={newPlayer.contactEmail} 
                onChange={e => setNewPlayer({...newPlayer, contactEmail: e.target.value})} 
                required 
              />
              <Input 
                label="Parent Phone" 
                type="tel" 
                value={newPlayer.contactPhone} 
                onChange={e => setNewPlayer({...newPlayer, contactPhone: e.target.value})} 
                required 
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Monthly Fee ($)" 
                  type="number" 
                  value={newPlayer.feeAmount} 
                  onChange={e => setNewPlayer({...newPlayer, feeAmount: parseInt(e.target.value)})} 
                  required 
                />
                <Select 
                  label="Level"
                  value={newPlayer.level}
                  onChange={e => setNewPlayer({...newPlayer, level: e.target.value as any})}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </Select>
              </div>
              <div className="mt-6 flex space-x-3">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1">Register Player</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};