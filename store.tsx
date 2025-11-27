import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, Player, Session, AttendanceRecord, Payment, Announcement, User } from './types';

// --- MOCK DATA ---
const MOCK_PLAYERS: Player[] = [
  { id: 'p1', name: 'Alice Chen', dob: '2012-05-14', contactEmail: 'parent.chen@example.com', contactPhone: '555-0101', photoUrl: 'https://picsum.photos/200?random=1', feeAmount: 150, balance: 0, joinedDate: '2023-01-10', level: 'Intermediate' },
  { id: 'p2', name: 'Bob Smith', dob: '2014-08-22', contactEmail: 'parent.smith@example.com', contactPhone: '555-0102', photoUrl: 'https://picsum.photos/200?random=2', feeAmount: 120, balance: -120, joinedDate: '2023-03-15', level: 'Beginner' },
  { id: 'p3', name: 'Charlie Kim', dob: '2011-11-03', contactEmail: 'parent.kim@example.com', contactPhone: '555-0103', photoUrl: 'https://picsum.photos/200?random=3', feeAmount: 180, balance: 0, joinedDate: '2022-09-01', level: 'Advanced' },
  { id: 'p4', name: 'Diana Prince', dob: '2013-01-30', contactEmail: 'parent.prince@example.com', contactPhone: '555-0104', photoUrl: 'https://picsum.photos/200?random=4', feeAmount: 150, balance: 150, joinedDate: '2023-06-20', level: 'Intermediate' },
];

const MOCK_SESSIONS: Session[] = [
  { id: 's1', date: '2023-10-25', time: '16:00', durationMinutes: 90, coachId: 'u1', court: 'Court A', capacity: 6, registeredPlayerIds: ['p1', 'p2', 'p3'] },
  { id: 's2', date: '2023-10-27', time: '16:00', durationMinutes: 90, coachId: 'u1', court: 'Court B', capacity: 6, registeredPlayerIds: ['p1', 'p4'] },
  { id: 's3', date: '2023-10-30', time: '17:00', durationMinutes: 60, coachId: 'u2', court: 'Court A', capacity: 4, registeredPlayerIds: ['p2', 'p3'] },
];

const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: 'a1', sessionId: 's1', playerId: 'p1', status: 'PRESENT', notes: 'Great footwork today.' },
  { id: 'a2', sessionId: 's1', playerId: 'p2', status: 'LATE', notes: 'Forgot racket.' },
  { id: 'a3', sessionId: 's1', playerId: 'p3', status: 'PRESENT', notes: 'Excellent smashes.' },
];

const MOCK_PAYMENTS: Payment[] = [
  { id: 'pay1', playerId: 'p1', date: '2023-10-01', amount: 150, method: 'TRANSFER', reference: 'TXN123456' },
  { id: 'pay2', playerId: 'p3', date: '2023-10-05', amount: 180, method: 'CASH' },
];

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: 'ann1', title: 'Tournament Registration', message: 'Please register for the City Open by Friday.', date: '2023-10-20', targetAudience: 'ALL', authorId: 'u1' },
];

const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Coach Mike', email: 'coach@lolo.com', role: 'COACH', avatarUrl: 'https://picsum.photos/100?random=10' },
  { id: 'u2', name: 'Admin Sarah', email: 'admin@lolo.com', role: 'ADMIN', avatarUrl: 'https://picsum.photos/100?random=11' },
  { id: 'u3', name: 'Parent John', email: 'parent@lolo.com', role: 'PARENT', avatarUrl: 'https://picsum.photos/100?random=12' },
];

// --- REDUCER ---

type Action =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ADD_PLAYER'; payload: Player }
  | { type: 'ADD_SESSION'; payload: Session }
  | { type: 'ADD_PAYMENT'; payload: Payment }
  | { type: 'ADD_ANNOUNCEMENT'; payload: Announcement }
  | { type: 'UPDATE_ATTENDANCE'; payload: AttendanceRecord }
  | { type: 'DELETE_PLAYER'; payload: string };

const initialState: AppState = {
  currentUser: null,
  players: MOCK_PLAYERS,
  sessions: MOCK_SESSIONS,
  attendance: MOCK_ATTENDANCE,
  payments: MOCK_PAYMENTS,
  announcements: MOCK_ANNOUNCEMENTS,
};

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, currentUser: action.payload };
    case 'LOGOUT':
      return { ...state, currentUser: null };
    case 'ADD_PLAYER':
      return { ...state, players: [...state.players, action.payload] };
    case 'ADD_SESSION':
      return { ...state, sessions: [...state.sessions, action.payload] };
    case 'ADD_PAYMENT':
      // Update player balance as well
      const updatedPlayers = state.players.map(p =>
        p.id === action.payload.playerId
          ? { ...p, balance: p.balance + action.payload.amount } // Assume positive balance means prepaid credit, logic can vary
          : p
      );
      return { ...state, payments: [...state.payments, action.payload], players: updatedPlayers };
    case 'ADD_ANNOUNCEMENT':
      return { ...state, announcements: [action.payload, ...state.announcements] };
    case 'UPDATE_ATTENDANCE':
        // Check if exists, update, else add
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
    // Mock login logic
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