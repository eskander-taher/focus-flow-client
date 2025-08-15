import { Session, SessionStats } from '../types';

export const calculateStats = (sessions: Session[]): SessionStats => {
  const completedSessions = sessions.filter(s => s.completed);
  
  const totalSessions = completedSessions.length;
  const totalTime = completedSessions.reduce((sum, session) => sum + session.duration, 0);
  
  // Calculate sessions completed today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const completedToday = completedSessions.filter(session => {
    const sessionDate = new Date(session.startTime);
    sessionDate.setHours(0, 0, 0, 0);
    return sessionDate.getTime() === today.getTime();
  }).length;
  
  // Calculate streaks - now requires 50+ minutes per day
  const sortedSessions = completedSessions.sort((a, b) => 
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );
  
  let currentStreak = 0;
  let longestStreak = 0;
  
  if (sortedSessions.length > 0) {
    // Group sessions by date and sum their durations
    const dailyMinutes = new Map<string, number>();
    sortedSessions.forEach(session => {
      const dateKey = new Date(session.startTime).toDateString();
      dailyMinutes.set(dateKey, (dailyMinutes.get(dateKey) || 0) + session.duration);
    });
    
    // Filter days that meet the 50-minute requirement
    const qualifyingDays = Array.from(dailyMinutes.entries())
      .filter(([_, minutes]) => minutes >= 50)
      .map(([date, _]) => date)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    // Calculate current streak (from today backwards)
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    let streakCount = 0;
    let checkDate = new Date(currentDate);
    
    while (true) {
      const dateKey = checkDate.toDateString();
      if (qualifyingDays.includes(dateKey)) {
        streakCount++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    currentStreak = streakCount;
    
    // Calculate longest streak
    let maxStreak = 0;
    let tempStreak = 0;
    
    for (let i = 0; i < qualifyingDays.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const currentDate = new Date(qualifyingDays[i]);
        const prevDate = new Date(qualifyingDays[i - 1]);
        const daysDiff = Math.floor((prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
          tempStreak++;
        } else {
          maxStreak = Math.max(maxStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    maxStreak = Math.max(maxStreak, tempStreak);
    longestStreak = maxStreak;
  }
  
  return {
    totalSessions,
    totalTime,
    currentStreak,
    longestStreak,
    completedToday
  };
};