
import React, { useState } from 'react';
import { useStore } from '../store';
import { Card, Button, Input, Select, Badge } from '../components/UI';
import { Trophy, Calendar, MapPin, Medal } from 'lucide-react';
import { Tournament, TournamentResult } from '../types';

export const Tournaments: React.FC = () => {
  const { state, dispatch } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState<string | null>(null); // tournament ID

  const [newTournament, setNewTournament] = useState<Partial<Tournament>>({
    name: '',
    date: '',
    location: '',
  });

  const [newResult, setNewResult] = useState<Partial<TournamentResult>>({
      playerId: '',
      category: 'U13 Singles',
      achievement: 'Participant',
  });

  const handleAddTournament = (e: React.FormEvent) => {
    e.preventDefault();
    const t: Tournament = {
        id: `t${Date.now()}`,
        name: newTournament.name!,
        date: newTournament.date!,
        location: newTournament.location!
    };
    dispatch({ type: 'ADD_TOURNAMENT', payload: t });
    setShowAddModal(false);
  };

  const handleAddResult = (e: React.FormEvent) => {
      e.preventDefault();
      if (!showResultModal) return;
      const res: TournamentResult = {
          id: `r${Date.now()}`,
          tournamentId: showResultModal,
          playerId: newResult.playerId!,
          category: newResult.category!,
          achievement: newResult.achievement as any
      };
      dispatch({ type: 'ADD_RESULT', payload: res });
      setShowResultModal(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tournaments</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <Trophy size={18} className="mr-2 inline" /> Add Tournament
        </Button>
      </div>

      <div className="space-y-6">
        {state.tournaments.map(t => {
            const results = state.tournamentResults.filter(r => r.tournamentId === t.id);
            return (
                <Card key={t.id}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                <Trophy className="mr-2 text-yellow-500" size={24} />
                                {t.name}
                            </h2>
                            <div className="flex space-x-4 mt-1 text-gray-500 text-sm">
                                <span className="flex items-center"><Calendar size={14} className="mr-1"/> {t.date}</span>
                                <span className="flex items-center"><MapPin size={14} className="mr-1"/> {t.location}</span>
                            </div>
                        </div>
                        <Button variant="secondary" className="mt-4 md:mt-0" onClick={() => setShowResultModal(t.id)}>
                            + Add Result
                        </Button>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Player Achievements</h3>
                        {results.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {results.map(r => {
                                    const player = state.players.find(p => p.id === r.playerId);
                                    let color: 'yellow' | 'gray' | 'blue' = 'gray';
                                    if (r.achievement === 'Winner') color = 'yellow';
                                    if (r.achievement === 'Semi-Finalist') color = 'blue';

                                    return (
                                        <div key={r.id} className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 mr-3 overflow-hidden">
                                                    <img src={player?.photoUrl} alt="" className="w-full h-full object-cover"/>
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-sm">{player?.name}</div>
                                                    <div className="text-xs text-gray-500">{r.category}</div>
                                                </div>
                                            </div>
                                            <Badge color={color}>{r.achievement}</Badge>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">No results recorded yet.</p>
                        )}
                    </div>
                </Card>
            );
        })}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Add Tournament</h2>
            <form onSubmit={handleAddTournament}>
              <Input label="Name" value={newTournament.name} onChange={e => setNewTournament({...newTournament, name: e.target.value})} required />
              <Input label="Date" type="date" value={newTournament.date} onChange={e => setNewTournament({...newTournament, date: e.target.value})} required />
              <Input label="Location" value={newTournament.location} onChange={e => setNewTournament({...newTournament, location: e.target.value})} required />
              <div className="mt-6 flex space-x-3">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1">Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showResultModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Add Player Result</h2>
            <form onSubmit={handleAddResult}>
              <Select label="Player" value={newResult.playerId} onChange={e => setNewResult({...newResult, playerId: e.target.value})}>
                  <option value="">Select Player</option>
                  {state.players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </Select>
              <Input label="Category" value={newResult.category} onChange={e => setNewResult({...newResult, category: e.target.value})} placeholder="e.g. U13 Boys Singles" />
              <Select label="Achievement" value={newResult.achievement} onChange={e => setNewResult({...newResult, achievement: e.target.value as any})}>
                  <option value="Participant">Participant</option>
                  <option value="Winner">Winner</option>
                  <option value="Runner-up">Runner-up</option>
                  <option value="Semi-Finalist">Semi-Finalist</option>
              </Select>
              <div className="mt-6 flex space-x-3">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowResultModal(null)}>Cancel</Button>
                <Button type="submit" className="flex-1">Add Result</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
