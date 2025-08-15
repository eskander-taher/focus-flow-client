import React, { useState, useEffect, useCallback } from 'react';
import { primeAlarmAudio, playAlarmAudio } from '../utils/alarm';
import { Play, Pause, Square, CheckCircle } from 'lucide-react';

interface TimerProps {
  duration: number;
  onComplete: () => void;
  onStop: () => void;
}

export const Timer: React.FC<TimerProps> = ({ duration, onComplete, onStop }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const totalSeconds = duration * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const tick = useCallback(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        setIsRunning(false);
        playAlarmAudio();
        onComplete();
        return 0;
      }
      return prev - 1;
    });
  }, [onComplete]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(tick, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, tick]);

  const startTimer = async () => {
    setIsRunning(true);
    setIsPaused(false);
    await primeAlarmAudio();
  };

  const pauseTimer = () => {
    setIsRunning(false);
    setIsPaused(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(duration * 60);
    onStop();
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Circular Progress */}
      <div className="relative">
        <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(139, 92, 246, 0.1)"
            strokeWidth="4"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl font-bold text-white mb-2">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div className="text-purple-300 text-lg">
              {isRunning ? 'Focus Time' : isPaused ? 'Paused' : 'Ready'}
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex space-x-4">
        {!isRunning ? (
          <button
            onClick={startTimer}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white p-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <Play size={24} />
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white p-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <Pause size={24} />
          </button>
        )}
        
        <button
          onClick={stopTimer}
          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white p-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <Square size={24} />
        </button>
      </div>

      {timeLeft === 0 && (
        <div className="flex items-center space-x-2 text-green-400 animate-pulse">
          <CheckCircle size={24} />
          <span className="text-lg font-semibold">Session Complete!</span>
        </div>
      )}
    </div>
  );
};