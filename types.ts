
export type Role = 'ADMIN' | 'COACH' | 'PARENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  phone?: string;
  hourlyRate?: number; // For coaches
}

export type SportType = 'Badminton' | 'Volleyball' | 'Other';

export interface Batch {
  id: string;
  name: string;
  sport: SportType;
  coachId: string;
  scheduleDescription: string; // e.g., "Mon/Wed 16:00"
  monthlyFee: number;
}

export interface Player {
  id: string;
  studentId: string; // Unique visible ID
  name: string;
  dob: string;
  contactEmail: string;
  contactPhone: string; // Student's phone
  guardianName?: string; // Parent/Guardian Name
  guardianPhone?: string; // Parent/Guardian Phone
  photoUrl: string;
  feeAmount: number; // Can override batch fee
  balance: number;
  joinedDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  batchId?: string; // Linked to a Batch
}

export type LeadStatus = 'NEW' | 'CONTACTED' | 'CONVERTED' | 'DROPPED';

export interface Lead {
  id: string;
  name: string;
  contact: string;
  sportOfInterest: SportType;
  notes: string;
  date: string;
  status: LeadStatus;
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
  batchId?: string; // Optional link to a batch
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
  targetAudience: 'ALL' | 'COACHES' | 'PARENTS' | 'BATCH'; // Added BATCH
  authorId: string;
}

// --- NEW TYPES ---

export interface Tournament {
  id: string;
  name: string;
  date: string;
  location: string;
}

export interface TournamentResult {
  id: string;
  tournamentId: string;
  playerId: string;
  category: string; // e.g., "U13 Singles"
  achievement: 'Winner' | 'Runner-up' | 'Semi-Finalist' | 'Participant';
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Equipment' | 'Consumable' | 'Apparel';
  quantity: number;
  minThreshold: number; // For low stock alerts
  lastUpdated: string;
}

export interface Settings {
  academyName: string;
  address: string;
  contactPhone: string;
  defaultMonthlyFee: number;
  paymentReminderDay: number; // Day of month
  appVersion: string;
  logoUrl?: string; // New field for custom logo
}

export interface AppState {
  currentUser: User | null;
  users: User[]; // All users (admins, coaches)
  players: Player[];
  sessions: Session[];
  attendance: AttendanceRecord[];
  payments: Payment[];
  announcements: Announcement[];
  batches: Batch[];
  leads: Lead[];
  tournaments: Tournament[]; // New
  tournamentResults: TournamentResult[]; // New
  inventory: InventoryItem[]; // New
  settings: Settings; // New
}