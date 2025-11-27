
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, Player, Session, AttendanceRecord, Payment, Announcement, User, Batch, Lead, Tournament, TournamentResult, InventoryItem, Settings } from './types';

// --- MOCK DATA ---

const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Coach Mike', email: 'coach@lolo.com', role: 'COACH', avatarUrl: 'https://ui-avatars.com/api/?name=Coach+Mike', phone: '555-1010', hourlyRate: 50 },
  { id: 'u2', name: 'Admin Sarah', email: 'admin@lolo.com', role: 'ADMIN', avatarUrl: 'https://ui-avatars.com/api/?name=Admin+Sarah', phone: '555-2020' },
  { id: 'u3', name: 'Parent John', email: 'parent@lolo.com', role: 'PARENT', avatarUrl: 'https://ui-avatars.com/api/?name=Parent+John' },
  { id: 'u4', name: 'Coach Lisa', email: 'lisa@lolo.com', role: 'COACH', avatarUrl: 'https://ui-avatars.com/api/?name=Coach+Lisa', phone: '555-3030', hourlyRate: 55 },
];

const MOCK_BATCHES: Batch[] = [
  { id: 'b1', name: 'Junior Beginners', sport: 'Badminton', coachId: 'u1', scheduleDescription: 'Mon/Wed 16:00', monthlyFee: 300 },
  { id: 'b2', name: 'Advanced Youth', sport: 'Badminton', coachId: 'u4', scheduleDescription: 'Tue/Thu 16:00', monthlyFee: 450 },
  { id: 'b3', name: 'Adult Volleyball', sport: 'Volleyball', coachId: 'u1', scheduleDescription: 'Fri 20:00', monthlyFee: 200 },
];

const MOCK_PLAYERS: Player[] = [
  { id: 'p1', studentId: 'STU-23001', name: 'Alice Chen', dob: '2012-05-14', contactEmail: 'parent.chen@example.com', contactPhone: '555-0101', guardianName: 'Mrs. Chen', guardianPhone: '555-9999', photoUrl: 'https://ui-avatars.com/api/?name=Alice+Chen&background=random', feeAmount: 300, balance: 0, joinedDate: '2023-01-10', status: 'ACTIVE', batchId: 'b1' },
  { id: 'p2', studentId: 'STU-23002', name: 'Bob Smith', dob: '2014-08-22', contactEmail: 'parent.smith@example.com', contactPhone: '555-0102', guardianName: 'Mr. Smith', guardianPhone: '555-8888', photoUrl: 'https://ui-avatars.com/api/?name=Bob+Smith&background=random', feeAmount: 300, balance: -300, joinedDate: '2023-03-15', status: 'ACTIVE', batchId: 'b1' },
  { id: 'p3', studentId: 'STU-22045', name: 'Charlie Kim', dob: '2011-11-03', contactEmail: 'parent.kim@example.com', contactPhone: '555-0103', photoUrl: 'https://ui-avatars.com/api/?name=Charlie+Kim&background=random', feeAmount: 450, balance: 0, joinedDate: '2022-09-01', status: 'ACTIVE', batchId: 'b2' },
  { id: 'p4', studentId: 'STU-23089', name: 'Diana Prince', dob: '2013-01-30', contactEmail: 'parent.prince@example.com', contactPhone: '555-0104', photoUrl: 'https://ui-avatars.com/api/?name=Diana+Prince&background=random', feeAmount: 300, balance: 150, joinedDate: '2023-06-20', status: 'INACTIVE', batchId: 'b1' },
];

const MOCK_SESSIONS: Session[] = [
  { id: 's1', date: new Date().toISOString().split('T')[0], time: '16:00', durationMinutes: 90, coachId: 'u1', court: 'Court A', capacity: 10, registeredPlayerIds: ['p1', 'p2'], batchId: 'b1' },
  { id: 's2', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], time: '16:00', durationMinutes: 90, coachId: 'u4', court: 'Court B', capacity: 10, registeredPlayerIds: ['p3'], batchId: 'b2' },
];

const MOCK_LEADS: Lead[] = [
  { id: 'l1', name: 'Evan Wright', contact: '555-1234', sportOfInterest: 'Badminton', notes: 'Interested in junior batch', date: '2023-10-20', status: 'NEW' },
  { id: 'l2', name: 'Sarah Connor', contact: '555-5678', sportOfInterest: 'Volleyball', notes: 'Looking for adult classes', date: '2023-10-21', status: 'CONTACTED' },
];

const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: 'a1', sessionId: 's1', playerId: 'p1', status: 'PRESENT', notes: 'Great footwork today.' },
  { id: 'a2', sessionId: 's1', playerId: 'p2', status: 'LATE', notes: 'Forgot racket.' },
];

const MOCK_PAYMENTS: Payment[] = [
  { id: 'pay1', playerId: 'p1', date: '2023-10-01', amount: 300, method: 'TRANSFER', reference: 'TXN123456' },
  { id: 'pay2', playerId: 'p3', date: '2023-10-05', amount: 450, method: 'CASH' },
];

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: 'ann1', title: 'Tournament Registration', message: 'Please register for the City Open by Friday.', date: '2023-10-20', targetAudience: 'ALL', authorId: 'u1' },
];

const MOCK_TOURNAMENTS: Tournament[] = [
  { id: 't1', name: 'City Junior Open', date: '2023-11-15', location: 'Central Sports Hall' },
  { id: 't2', name: 'Winter Cup', date: '2023-12-10', location: 'LOLO Arena' },
];

const MOCK_RESULTS: TournamentResult[] = [
  { id: 'r1', tournamentId: 't1', playerId: 'p3', category: 'U13 Boys Singles', achievement: 'Winner' },
  { id: 'r2', tournamentId: 't1', playerId: 'p1', category: 'U11 Girls Singles', achievement: 'Semi-Finalist' },
];

const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'i1', name: 'Yonex Mavis 350 (Tube)', category: 'Consumable', quantity: 12, minThreshold: 5, lastUpdated: '2023-10-25' },
  { id: 'i2', name: 'Yonex Nanoflare Racket', category: 'Equipment', quantity: 4, minThreshold: 2, lastUpdated: '2023-10-20' },
  { id: 'i3', name: 'LOLO Academy T-Shirt (M)', category: 'Apparel', quantity: 25, minThreshold: 10, lastUpdated: '2023-10-15' },
];

const MOCK_SETTINGS: Settings = {
  academyName: 'LOLO Academy Manager',
  address: '123 Sports Drive, Male City',
  contactPhone: '+960 999-9999',
  defaultMonthlyFee: 300,
  paymentReminderDay: 5,
  appVersion: '1.2.0',
  logoUrl: undefined, // Default to null/undefined to show the default icon
};

// --- REDUCER ---

type Action =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ADD_PLAYER'; payload: Player }
  | { type: 'UPDATE_PLAYER'; payload: Player }
  | { type: 'ADD_BATCH'; payload: Batch }
  | { type: 'ADD_LEAD'; payload: Lead }
  | { type: 'UPDATE_LEAD_STATUS'; payload: { id: string, status: string } }
  | { type: 'ADD_SESSION'; payload: Session }
  | { type: 'ADD_PAYMENT'; payload: Payment }
  | { type: 'ADD_ANNOUNCEMENT'; payload: Announcement }
  | { type: 'UPDATE_ATTENDANCE'; payload: AttendanceRecord }
  | { type: 'DELETE_PLAYER'; payload: string }
  | { type: 'ADD_TOURNAMENT'; payload: Tournament }
  | { type: 'ADD_RESULT'; payload: TournamentResult }
  | { type: 'UPDATE_INVENTORY'; payload: InventoryItem }
  | { type: 'UPDATE_SETTINGS'; payload: Settings };

const initialState: AppState = {
  currentUser: null,
  users: MOCK_USERS,
  players: MOCK_PLAYERS,
  sessions: MOCK_SESSIONS,
  attendance: MOCK_ATTENDANCE,
  payments: MOCK_PAYMENTS,
  announcements: MOCK_ANNOUNCEMENTS,
  batches: MOCK_BATCHES,
  leads: MOCK_LEADS,
  tournaments: MOCK_TOURNAMENTS,
  tournamentResults: MOCK_RESULTS,
  inventory: MOCK_INVENTORY,
  settings: MOCK_SETTINGS,
};

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, currentUser: action.payload };
    case 'LOGOUT':
      return { ...state, currentUser: null };
    case 'ADD_PLAYER':
      return { ...state, players: [...state.players, action.payload] };
    case 'UPDATE_PLAYER':
      return { ...state, players: state.players.map(p => p.id === action.payload.id ? action.payload : p) };
    case 'ADD_BATCH':
      return { ...state, batches: [...state.batches, action.payload] };
    case 'ADD_LEAD':
      return { ...state, leads: [...state.leads, action.payload] };
    case 'UPDATE_LEAD_STATUS':
      return { ...state, leads: state.leads.map(l => l.id === action.payload.id ? { ...l, status: action.payload.status as any } : l) };
    case 'ADD_SESSION':
      return { ...state, sessions: [...state.sessions, action.payload] };
    case 'ADD_PAYMENT':
      const updatedPlayers = state.players.map(p =>
        p.id === action.payload.playerId
          ? { ...p, balance: p.balance + action.payload.amount }
          : p
      );
      return { ...state, payments: [...state.payments, action.payload], players: updatedPlayers };
    case 'ADD_ANNOUNCEMENT':
      return { ...state, announcements: [action.payload, ...state.announcements] };
    case 'UPDATE_ATTENDANCE':
        const exists = state.attendance.find(a => a.sessionId === action.payload.sessionId && a.playerId === action.payload.playerId);
        let newAttendance;
        if (exists) {
            newAttendance = state.attendance.map(a => 
                (a.sessionId === action.payload.sessionId && a.playerId === action.payload.playerId) ? action.payload : a
            );
        } else {
            newAttendance = [...state.attendance, action.payload];
        }
        return { ...state, attendance: newAttendance };
    case 'DELETE_PLAYER':
        return { ...state, players: state.players.filter(p => p.id !== action.payload) };
    case 'ADD_TOURNAMENT':
        return { ...state, tournaments: [...state.tournaments, action.payload] };
    case 'ADD_RESULT':
        return { ...state, tournamentResults: [...state.tournamentResults, action.payload] };
    case 'UPDATE_INVENTORY':
        return { ...state, inventory: state.inventory.map(i => i.id === action.payload.id ? action.payload : i) };
    case 'UPDATE_SETTINGS':
        return { ...state, settings: action.payload };
    default:
      return state;
  }
};

// --- CONTEXT ---

interface StoreContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  login: (email: string, role: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const login = (email: string, role: string) => {
    const user = MOCK_USERS.find(u => u.email === email) || {
        id: 'new-user',
        name: email.split('@')[0],
        email,
        role: role as any,
        avatarUrl: `https://ui-avatars.com/api/?name=${email}`
    };
    dispatch({ type: 'LOGIN', payload: user });
  };

  return (
    <StoreContext.Provider value={{ state, dispatch, login }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};