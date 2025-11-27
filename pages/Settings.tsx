
import React, { useState } from 'react';
import { useStore } from '../store';
import { Card, Button, Input } from '../components/UI';
import { Settings as SettingsType } from '../types';
import { Upload } from 'lucide-react';

export const Settings: React.FC = () => {
  const { state, dispatch } = useStore();
  const [formData, setFormData] = useState<SettingsType>(state.settings);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'UPDATE_SETTINGS', payload: formData });
    alert("Settings saved successfully!");
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <Card>
        <form onSubmit={handleSave} className="space-y-6">
            <div className="border-b border-gray-100 pb-4 mb-4">
                <h3 className="text-lg font-bold text-gray-900">Academy Profile</h3>
                <p className="text-sm text-gray-600">This information appears on reports, footers, and the login screen.</p>
            </div>

            <div className="flex flex-col items-center sm:flex-row gap-6 mb-6">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                        {formData.logoUrl ? (
                            <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                        ) : (
                            <span className="text-xs text-gray-400 font-medium">No Logo</span>
                        )}
                    </div>
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-bold text-gray-900 mb-2">Academy Logo</label>
                    <div className="flex items-center space-x-3">
                        <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center shadow-sm">
                            <Upload size={16} className="mr-2" />
                            Upload New Logo
                            <input 
                                type="file" 
                                className="hidden" 
                                accept="image/png, image/jpeg"
                                onChange={handleLogoUpload}
                            />
                        </label>
                        {formData.logoUrl && (
                             <button 
                                type="button"
                                onClick={() => setFormData({...formData, logoUrl: undefined})}
                                className="text-sm text-red-600 font-medium hover:text-red-700"
                             >
                                Remove
                             </button>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Recommended: 200x200px PNG or JPG.</p>
                </div>
            </div>

            <Input 
                label="Academy Name" 
                value={formData.academyName} 
                onChange={e => setFormData({...formData, academyName: e.target.value})} 
            />
            <Input 
                label="Address" 
                value={formData.address} 
                onChange={e => setFormData({...formData, address: e.target.value})} 
            />
            <Input 
                label="Contact Phone" 
                value={formData.contactPhone} 
                onChange={e => setFormData({...formData, contactPhone: e.target.value})} 
            />

            <div className="border-b border-gray-100 pb-4 mb-4 pt-4">
                <h3 className="text-lg font-bold text-gray-900">Defaults & Configuration</h3>
                <p className="text-sm text-gray-600">System-wide operational settings.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Input 
                    label="Default Monthly Fee (MVR)" 
                    type="number"
                    value={formData.defaultMonthlyFee} 
                    onChange={e => setFormData({...formData, defaultMonthlyFee: Number(e.target.value)})} 
                />
                <Input 
                    label="Payment Reminder Day (of month)" 
                    type="number"
                    value={formData.paymentReminderDay} 
                    onChange={e => setFormData({...formData, paymentReminderDay: Number(e.target.value)})} 
                />
            </div>

            <div className="pt-6 flex justify-end">
                <Button type="submit">Save Changes</Button>
            </div>
        </form>
      </Card>

      <div className="text-center text-xs text-gray-400 mt-8">
        LOLO Academy Manager v{state.settings.appVersion}
      </div>
    </div>
  );
};
