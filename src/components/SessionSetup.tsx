import React, { useState } from 'react';
import { Timer, Target } from 'lucide-react';

interface SessionSetupProps {
  onStart: (goal: string, duration: number) => void;
}

export const SessionSetup: React.FC<SessionSetupProps> = ({ onStart }) => {
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState(10); // Default to 10 minutes

  const predefinedDurations = [5, 10, 15, 25, 30, 45, 60];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.trim()) {
      onStart(goal.trim(), duration);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-purple-500/20">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-cyan-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Target className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Start New Session</h2>
          <p className="text-gray-300">Set your focus goal and duration</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-3">
              Session Goal
            </label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="What do you want to accomplish?"
              className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-3">
              Duration (minutes)
            </label>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {predefinedDurations.map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDuration(mins)}
                  className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    duration === mins
                      ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
            <input
              type="range"
              min="5"
              max="120"
              step="5"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full accent-purple-500"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>5 min</span>
              <span className="font-semibold text-purple-400">{duration} minutes</span>
              <span>2 hours</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={!goal.trim()}
            className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 disabled:hover:scale-100 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Timer size={20} />
            <span>Start Session</span>
          </button>
        </form>
      </div>
    </div>
  );
};