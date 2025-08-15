import { Session } from '../types';

const STORAGE_KEY = 'productivity_sessions';

export const saveSessions = (sessions: Session[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
};

export const loadSessions = (): Session[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    const sessions = JSON.parse(stored);
    
    // Validate that sessions is an array
    if (!Array.isArray(sessions)) {
      console.warn('Invalid sessions data in localStorage, resetting to empty array');
      return [];
    }
    
    // Validate and parse each session
    const validSessions = sessions.map((session: any) => {
      try {
        const startTime = new Date(session.startTime);
        const endTime = new Date(session.endTime);
        
        // Check if dates are valid
        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
          console.warn('Invalid date in session, skipping:', session);
          return null;
        }
        
        return {
          id: session.id || generateId(),
          goal: session.goal || 'Unknown Goal',
          duration: typeof session.duration === 'number' ? session.duration : 0,
          result: session.result || '',
          startTime,
          endTime,
          completed: Boolean(session.completed)
        };
      } catch (error) {
        console.warn('Error parsing session, skipping:', error, session);
        return null;
      }
    }).filter((session): session is Session => session !== null); // Remove null sessions and type guard
    
    return validSessions;
  } catch (error) {
    console.error('Error loading sessions from localStorage:', error);
    return [];
  }
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const clearStoredSessions = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // ignore
  }
};

export const exportSessions = (): string => {
  const sessions = loadSessions();
  const dataStr = JSON.stringify(sessions, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `focusflow-sessions-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
  return dataStr;
};

export const importSessions = (jsonData: string): Session[] => {
  try {
    const sessions = JSON.parse(jsonData);
    
    if (!Array.isArray(sessions)) {
      throw new Error('Invalid data format: expected an array of sessions');
    }
    
    // Validate each session
    const validSessions = sessions.map((session: any) => {
      if (!session.goal || typeof session.duration !== 'number') {
        throw new Error('Invalid session data: missing goal or duration');
      }
      
      return {
        id: session.id || generateId(),
        goal: session.goal,
        duration: session.duration,
        result: session.result || '',
        startTime: new Date(session.startTime || Date.now()),
        endTime: new Date(session.endTime || Date.now()),
        completed: Boolean(session.completed)
      };
    });
    
    return validSessions;
  } catch (error) {
    console.error('Error importing sessions:', error);
    throw error;
  }
};