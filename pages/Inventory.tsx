
import React, { useState } from 'react';
import { useStore } from '../store';
import { Card, Button, Input, Select, Badge } from '../components/UI';
import { Plus, Package, AlertTriangle, RefreshCw } from 'lucide-react';
import { InventoryItem } from '../types';

export const Inventory: React.FC = () => {
  const { state, dispatch } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    name: '',
    category: 'Consumable',
    quantity: 0,
    minThreshold: 5,
  });

  const handleUpdateStock = (item: InventoryItem, change: number) => {
    const updated = { ...item, quantity: Math.max(0, item.quantity + change), lastUpdated: new Date().toISOString().split('T')[0] };
    dispatch({ type: 'UPDATE_INVENTORY', payload: updated });
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const item: InventoryItem = {
        id: `inv${Date.now()}`,
        name: newItem.name!,
        category: newItem.category as any,
        quantity: Number(newItem.quantity),
        minThreshold: Number(newItem.minThreshold),
        lastUpdated: new Date().toISOString().split('T')[0]
    };
    dispatch({ type: 'UPDATE_INVENTORY', payload: item }); // Using update for add in this simple reducer
    setShowAddModal(false);
    setNewItem({ category: 'Consumable', quantity: 0, minThreshold: 5 });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Inventory & Equipment</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus size={18} className="mr-2 inline" /> Add Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {state.inventory.map(item => {
            const isLow = item.quantity <= item.minThreshold;
            return (
                <Card key={item.id} className={isLow ? 'border-red-200 bg-red-50' : ''}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="font-bold text-gray-900">{item.name}</h3>
                            <span className="text-xs text-gray-500">{item.category}</span>
                        </div>
                        <Package size={24} className={isLow ? 'text-red-400' : 'text-gray-300'} />
                    </div>
                    
                    <div className="flex items-end justify-between mb-4">
                        <div className="text-3xl font-bold text-gray-800">{item.quantity}</div>
                        {isLow && (
                            <div className="flex items-center text-xs text-red-600 font-bold">
                                <AlertTriangle size={14} className="mr-1" /> Low Stock
                            </div>
                        )}
                    </div>

                    <div className="flex space-x-2">
                        <button 
                            onClick={() => handleUpdateStock(item, -1)}
                            className="flex-1 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium"
                        >
                            - Use
                        </button>
                        <button 
                            onClick={() => handleUpdateStock(item, 1)}
                            className="flex-1 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium"
                        >
                            + Add
                        </button>
                    </div>
                    <div className="mt-2 text-xs text-center text-gray-400">
                        Updated: {item.lastUpdated}
                    </div>
                </Card>
            )
        })}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Add Inventory Item</h2>
            <form onSubmit={handleAddItem}>
              <Input 
                label="Item Name" 
                value={newItem.name} 
                onChange={e => setNewItem({...newItem, name: e.target.value})} 
                required 
              />
              <Select 
                label="Category"
                value={newItem.category}
                onChange={e => setNewItem({...newItem, category: e.target.value as any})}
              >
                  <option value="Consumable">Consumable (Shuttles, Grip)</option>
                  <option value="Equipment">Equipment (Rackets, Nets)</option>
                  <option value="Apparel">Apparel (Shirts, Shoes)</option>
              </Select>
              <div className="grid grid-cols-2 gap-4">
                <Input 
                    label="Current Qty" 
                    type="number"
                    value={newItem.quantity} 
                    onChange={e => setNewItem({...newItem, quantity: Number(e.target.value)})} 
                    required 
                />
                <Input 
                    label="Low Alert Limit" 
                    type="number"
                    value={newItem.minThreshold} 
                    onChange={e => setNewItem({...newItem, minThreshold: Number(e.target.value)})} 
                    required 
                />
              </div>
              
              <div className="mt-6 flex space-x-3">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1">Add Item</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
