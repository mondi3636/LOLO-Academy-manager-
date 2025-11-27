
import React, { useState } from 'react';
import { useStore } from '../store';
import { Card, Button, Input, Select, Badge } from '../components/UI';
import { DollarSign, Plus, CreditCard } from 'lucide-react';
import { Payment } from '../types';

export const Finances: React.FC = () => {
  const { state, dispatch } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPayment, setNewPayment] = useState<Partial<Payment>>({
    playerId: state.players[0]?.id || '',
    amount: 0,
    method: 'CASH',
    date: new Date().toISOString().split('T')[0],
  });

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const payment: Payment = {
        id: `pay${Date.now()}`,
        playerId: newPayment.playerId!,
        amount: Number(newPayment.amount),
        method: newPayment.method as any,
        date: newPayment.date!,
        reference: newPayment.reference
    };
    dispatch({ type: 'ADD_PAYMENT', payload: payment });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Finances</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus size={18} className="mr-2 inline" /> Record Payment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card title="Recent Transactions">
                <div className="overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr className="text-xs text-gray-500 uppercase">
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Player</th>
                                <th className="px-6 py-3">Method</th>
                                <th className="px-6 py-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[...state.payments].reverse().map(payment => {
                                const player = state.players.find(p => p.id === payment.playerId);
                                return (
                                    <tr key={payment.id}>
                                        <td className="px-6 py-4 text-sm text-gray-600">{payment.date}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{player?.name || 'Unknown'}</td>
                                        <td className="px-6 py-4">
                                            <Badge color="gray">{payment.method}</Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-green-600">
                                            +MVR {payment.amount}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>

        <div className="space-y-6">
            <Card title="Fee Status">
                <div className="space-y-4">
                    {state.players.map(player => (
                        <div key={player.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center">
                                <div className={`w-2 h-2 rounded-full mr-2 ${player.balance < 0 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                <span className="text-sm font-medium text-gray-900">{player.name}</span>
                            </div>
                            <span className={`text-sm font-bold ${player.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {player.balance < 0 ? `-MVR ${Math.abs(player.balance)}` : `MVR ${player.balance}`}
                            </span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Record Payment</h2>
            <form onSubmit={handleAddPayment}>
              <Select 
                label="Player"
                value={newPayment.playerId}
                onChange={e => setNewPayment({...newPayment, playerId: e.target.value})}
              >
                  {state.players.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
              </Select>
              <div className="grid grid-cols-2 gap-4">
                <Input 
                    label="Amount (MVR)" 
                    type="number" 
                    value={newPayment.amount} 
                    onChange={e => setNewPayment({...newPayment, amount: e.target.value as any})} 
                    required 
                />
                <Input 
                    label="Date" 
                    type="date" 
                    value={newPayment.date} 
                    onChange={e => setNewPayment({...newPayment, date: e.target.value})} 
                    required 
                />
              </div>
              <Select 
                label="Method"
                value={newPayment.method}
                onChange={e => setNewPayment({...newPayment, method: e.target.value as any})}
              >
                  <option value="CASH">Cash</option>
                  <option value="TRANSFER">Bank Transfer</option>
                  <option value="CARD">Card</option>
              </Select>
              <Input 
                    label="Reference / Note" 
                    value={newPayment.reference || ''} 
                    onChange={e => setNewPayment({...newPayment, reference: e.target.value})} 
                />
              <div className="mt-6 flex space-x-3">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1">Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
