export interface Session {
  id: string;
  goal: string;
  duration: number; // in minutes
  result: string;
  startTime: Date;
  endTime: Date;
  completed: boolean;
}

export interface SessionStats {
  totalSessions: number;
  totalTime: number;
  currentStreak: number;
  longestStreak: number;
  completedToday: number;
}