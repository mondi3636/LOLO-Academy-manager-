import { GoogleGenAI } from "@google/genai";
import { Player, AttendanceRecord } from '../types';

// Safely initialize the AI client only when needed to avoid early failures if env is missing during load
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is not set. Gemini features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateAnnouncementDraft = async (topic: string, audience: string, tone: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "AI Service Unavailable: Please configure API_KEY.";

  try {
    const prompt = `Write a short, clear, and professional announcement for a badminton academy.
    Topic: ${topic}
    Target Audience: ${audience}
    Tone: ${tone}
    Keep it under 100 words.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate text.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating announcement. Please try again.";
  }
};

export const analyzePlayerProgress = async (player: Player, attendance: AttendanceRecord[]): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "AI Service Unavailable.";

  try {
    // Filter attendance for this player
    const playerRecords = attendance.filter(r => r.playerId === player.id);
    const presentCount = playerRecords.filter(r => r.status === 'PRESENT' || r.status === 'LATE').length;
    const total = playerRecords.length;
    const notes = playerRecords.map(r => r.notes).filter(n => n).join("; ");

    const prompt = `Analyze the progress of a badminton student named ${player.name} (${player.level}).
    Attendance: ${presentCount}/${total} sessions.
    Coach Notes: ${notes || "No specific notes recorded."}
    
    Provide a brief, encouraging summary (max 3 sentences) for the parent, highlighting consistency and areas mentioned in notes.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No analysis available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not analyze progress at this time.";
  }
};