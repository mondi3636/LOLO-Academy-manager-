export type Role = 'ADMIN' | 'COACH' | 'PARENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export interface Player {
  id: string;
  name: string;
  dob: string;
  contactEmail: string;
  contactPhone: string;
  photoUrl: string;
  feeAmount: number;
  balance: number;
  joinedDate: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Session {
  id: string;
  date: string; // ISO Date string YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  coachId: string;
  court: string;
  capacity: number;
  registeredPlayerIds: string[];
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'EXCUSED' | 'LATE';

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  playerId: string;
  status: AttendanceStatus;
  notes?: string;
}

export type PaymentMethod = 'CASH' | 'TRANSFER' | 'CARD';

export interface Payment {
  id: string;
  playerId: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  reference?: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
  targetAudience: 'ALL' | 'COACHES' | 'PARENTS';
  authorId: string;
}

export interface AppState {
  currentUser: User | null;
  players: Player[];
  sessions: Session[];
  attendance: AttendanceRecord[];
  payments: Payment[];
  announcements: Announcement[];
}