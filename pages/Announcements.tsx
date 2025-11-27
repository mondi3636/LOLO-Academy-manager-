import React, { useState } from 'react';
import { useStore } from '../store';
import { Card, Button, Input, Select, Badge } from '../components/UI';
import { Bell, Sparkles, Send } from 'lucide-react';
import { generateAnnouncementDraft } from '../services/gemini';
import { Announcement } from '../types';

export const Announcements: React.FC = () => {
  const { state, dispatch } = useStore();
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('ALL');
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setIsGenerating(true);
    const draft = await generateAnnouncementDraft(topic, audience, 'Professional and Encouraging');
    setGeneratedText(draft);
    setIsGenerating(false);
  };

  const handlePost = () => {
    if (!generatedText) return;
    const announcement: Announcement = {
        id: `ann${Date.now()}`,
        title: topic || 'New Announcement',
        message: generatedText,
        date: new Date().toISOString().split('T')[0],
        targetAudience: audience as any,
        authorId: state.currentUser?.id || 'admin'
    };
    dispatch({ type: 'ADD_ANNOUNCEMENT', payload: announcement });
    setTopic('');
    setGeneratedText('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
        
        <Card title="Create New Announcement">
            <div className="space-y-4">
                <Input 
                    label="Topic / Key Points" 
                    placeholder="e.g., Holiday schedule changes, Tournament fees due..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                />
                <Select 
                    label="Target Audience"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                >
                    <option value="ALL">All Users</option>
                    <option value="PARENTS">Parents Only</option>
                    <option value="COACHES">Coaches Only</option>
                </Select>
                
                <div className="flex justify-end">
                    <Button 
                        variant="secondary" 
                        onClick={handleGenerate} 
                        disabled={isGenerating || !topic}
                        className="flex items-center"
                    >
                        <Sparkles size={16} className={`mr-2 ${isGenerating ? 'animate-spin' : 'text-purple-600'}`} />
                        {isGenerating ? 'Drafting...' : 'Draft with AI'}
                    </Button>
                </div>

                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message Content</label>
                    <textarea 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                        value={generatedText}
                        onChange={(e) => setGeneratedText(e.target.value)}
                        placeholder="Type manually or use AI to generate..."
                    ></textarea>
                </div>

                <Button className="w-full flex justify-center items-center" onClick={handlePost} disabled={!generatedText}>
                    <Send size={18} className="mr-2" /> Post Announcement
                </Button>
            </div>
        </Card>
      </div>

      <div className="space-y-6 lg:mt-14">
        <h2 className="text-lg font-semibold text-gray-700">Recent Posts</h2>
        <div className="space-y-4">
            {state.announcements.map(ann => (
                <Card key={ann.id} className="relative overflow-visible">
                    <div className="absolute top-4 right-4">
                        <Badge color={ann.targetAudience === 'ALL' ? 'blue' : 'yellow'}>{ann.targetAudience}</Badge>
                    </div>
                    <div className="mb-2">
                        <span className="text-xs text-gray-500">{ann.date}</span>
                        <h3 className="font-bold text-gray-900 text-lg">{ann.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                        {ann.message}
                    </p>
                </Card>
            ))}
            {state.announcements.length === 0 && (
                <div className="text-center text-gray-400 py-10">No announcements yet.</div>
            )}
        </div>
      </div>
    </div>
  );
};