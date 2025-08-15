import React, { useState } from 'react';
import { Calendar, Clock, Target, Award, Flame, TrendingUp, X } from 'lucide-react';
import { Session, SessionStats } from '../types';

interface SessionHistoryProps {
  sessions: Session[];
  stats: SessionStats;
  onClearHistory?: () => void;
}

export const SessionHistory: React.FC<SessionHistoryProps> = ({ sessions, stats, onClearHistory }) => {
  const [showAllSessions, setShowAllSessions] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const completedSessions = sessions.filter(s => s.completed);
  
  // Filter sessions by search term
  const filteredSessions = completedSessions.filter(session =>
    session.goal.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.result.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const recentSessions = showAllSessions ? filteredSessions : filteredSessions.slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-500/20 p-2 rounded-lg">
              <Target className="text-purple-400" size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.totalSessions}</div>
              <div className="text-gray-400 text-sm">Total Sessions</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/20">
          <div className="flex items-center space-x-3">
            <div className="bg-cyan-500/20 p-2 rounded-lg">
              <Clock className="text-cyan-400" size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{formatDuration(stats.totalTime)}</div>
              <div className="text-gray-400 text-sm">Total Time</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-orange-500/20">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-500/20 p-2 rounded-lg">
              <Flame className="text-orange-400" size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.currentStreak}</div>
              <div className="text-gray-400 text-sm">Current Streak</div>
              <div className="text-orange-400 text-xs">(50+ min/day)</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-green-500/20">
          <div className="flex items-center space-x-3">
            <div className="bg-green-500/20 p-2 rounded-lg">
              <TrendingUp className="text-green-400" size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.completedToday}</div>
              <div className="text-gray-400 text-sm">Today</div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      {stats.longestStreak > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-yellow-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-500/20 p-2 rounded-lg">
                <Award className="text-yellow-400" size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.longestStreak}</div>
                <div className="text-gray-400 text-sm">Longest Streak</div>
                <div className="text-yellow-400 text-xs">(50+ min/day)</div>
              </div>
            </div>
            
            {onClearHistory && completedSessions.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors px-3 py-2 rounded-lg hover:bg-red-500/10"
                title="Clear all session history"
              >
                Clear History
              </button>
            )}
          </div>
        </div>
      )}

      {/* Streak Info Card */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/20">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-blue-500/20 p-2 rounded-lg">
            <Flame className="text-blue-400" size={20} />
          </div>
          <div>
            <h4 className="text-white font-semibold">Streak System</h4>
            <p className="text-gray-400 text-sm">How streaks work</p>
          </div>
        </div>
        
        <div className="space-y-3 text-sm text-gray-300">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Complete <strong>50+ minutes</strong> of focus work per day</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Multiple sessions on the same day count toward the daily total</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Missing a day or falling below 50 minutes breaks your current streak</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Your longest streak shows your best consecutive day performance</span>
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Calendar className="text-purple-400" size={24} />
            <h3 className="text-xl font-bold text-white">Recent Sessions</h3>
          </div>
          
          {completedSessions.length > 10 && (
            <button
              onClick={() => setShowAllSessions(!showAllSessions)}
              className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
            >
              {showAllSessions ? 'Show Recent' : 'View All'}
            </button>
          )}
        </div>

        {/* Search Input */}
        {completedSessions.length > 0 && (
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search sessions by goal or result..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            {searchTerm && (
              <div className="mt-2 text-sm text-gray-400">
                Found {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        )}

        {/* Daily Progress Indicator */}
        {completedSessions.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-green-500/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-green-500/20 p-2 rounded-lg">
                <TrendingUp className="text-green-400" size={20} />
              </div>
              <div>
                <h4 className="text-white font-semibold">Today's Progress</h4>
                <p className="text-gray-400 text-sm">Progress toward streak qualification</p>
              </div>
            </div>
            
            {(() => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const todaysSessions = completedSessions.filter(session => {
                const sessionDate = new Date(session.startTime);
                sessionDate.setHours(0, 0, 0, 0);
                return sessionDate.getTime() === today.getTime();
              });
              const todaysMinutes = todaysSessions.reduce((sum, session) => sum + session.duration, 0);
              const progress = Math.min((todaysMinutes / 50) * 100, 100);
              const isQualified = todaysMinutes >= 50;
              
              return (
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Focus Time Today</span>
                    <span className="text-white font-semibold">{todaysMinutes} / 50 minutes</span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        isQualified ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-medium ${isQualified ? 'text-green-400' : 'text-blue-400'}`}>
                      {isQualified ? '✅ Streak Qualified!' : `${50 - todaysMinutes} more minutes needed`}
                    </span>
                    <span className="text-gray-400">{Math.round(progress)}%</span>
                  </div>
                  
                  {todaysSessions.length > 0 && (
                    <div className="text-xs text-gray-400">
                      {todaysSessions.length} session{todaysSessions.length !== 1 ? 's' : ''} completed today
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {completedSessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-3 text-lg">No sessions completed yet</div>
            <div className="text-gray-500 text-sm">Start your first session to see your progress here!</div>
            <div className="mt-4 p-4 bg-gray-700/30 rounded-xl border border-gray-600/50">
              <div className="text-gray-400 text-sm">
                <div className="font-medium mb-2">Your stats will show:</div>
                <ul className="text-left space-y-1">
                  <li>• Total sessions completed</li>
                  <li>• Time spent focusing</li>
                  <li>• Current and longest streaks</li>
                  <li>• Daily progress tracking</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/50 hover:border-purple-500/30 transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-1">{session.goal}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>{formatDate(session.startTime)}</span>
                      <span className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{session.duration} min</span>
                      </span>
                    </div>
                  </div>
                  <div className="bg-green-500/20 text-green-400 text-xs font-semibold px-2 py-1 rounded-full">
                    Completed
                  </div>
                </div>
                
                {session.result && (
                  <div className="bg-gray-800/50 rounded-lg p-3 mt-3">
                    <div className="text-gray-300 text-sm leading-relaxed">
                      {session.result}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {completedSessions.length > 10 && (
              <div className="text-center pt-4">
                <button
                  onClick={() => setShowAllSessions(!showAllSessions)}
                  className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                >
                  {showAllSessions ? 'Show Less' : `View All ${completedSessions.length} Sessions`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};