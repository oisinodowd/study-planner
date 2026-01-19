import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Settings,
  Coffee,
  Brain,
  X,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { usePomodoro } from '../hooks/usePomodoro';

export function PomodoroView() {
  const { state, dispatch } = useApp();
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const {
    formattedTime,
    isRunning,
    isBreak,
    sessionsCompleted,
    totalWorkTime,
    progress,
    start,
    pause,
    reset,
    skip,
    resetAll,
  } = usePomodoro({
    workDuration: state.pomodoroSettings.workDuration,
    shortBreakDuration: state.pomodoroSettings.shortBreakDuration,
    longBreakDuration: state.pomodoroSettings.longBreakDuration,
    sessionsBeforeLongBreak: state.pomodoroSettings.sessionsBeforeLongBreak,
  });

  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference * (1 - progress);

  const formatTotalTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="font-display text-3xl font-semibold text-midnight-900">
          Pomodoro Timer
        </h1>
        <p className="text-midnight-500 font-body mt-1">
          Stay focused with timed work sessions
        </p>
      </div>

      {/* Timer Circle */}
      <div className="flex justify-center">
        <div className="relative">
          <svg width="320" height="320" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="160"
              cy="160"
              r="140"
              fill="none"
              stroke="#e3e8ea"
              strokeWidth="12"
            />
            {/* Progress circle */}
            <motion.circle
              cx="160"
              cy="160"
              r="140"
              fill="none"
              stroke={isBreak ? '#dd7a54' : '#627362'}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5 }}
            />
          </svg>
          
          {/* Timer Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`
              w-16 h-16 rounded-2xl flex items-center justify-center mb-4
              ${isBreak ? 'bg-terracotta-100' : 'bg-sage-100'}
            `}>
              {isBreak ? (
                <Coffee className={`w-8 h-8 ${isBreak ? 'text-terracotta-600' : 'text-sage-600'}`} />
              ) : (
                <Brain className={`w-8 h-8 ${isBreak ? 'text-terracotta-600' : 'text-sage-600'}`} />
              )}
            </div>
            <span className="font-display text-6xl font-bold text-midnight-900">
              {formattedTime}
            </span>
            <span className={`
              text-lg font-body font-medium mt-2
              ${isBreak ? 'text-terracotta-600' : 'text-sage-600'}
            `}>
              {isBreak ? 'Break Time' : 'Focus Time'}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={reset}
          className="p-4 bg-midnight-100 text-midnight-600 rounded-2xl hover:bg-midnight-200 transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
        
        <button
          onClick={isRunning ? pause : start}
          className={`
            p-6 rounded-full text-white transition-all transform hover:scale-105
            ${isBreak 
              ? 'bg-gradient-to-br from-terracotta-500 to-terracotta-600 shadow-lg shadow-terracotta-500/30' 
              : 'bg-gradient-to-br from-sage-500 to-sage-600 shadow-lg shadow-sage-500/30'
            }
          `}
        >
          {isRunning ? (
            <Pause className="w-10 h-10" />
          ) : (
            <Play className="w-10 h-10 ml-1" />
          )}
        </button>

        <button
          onClick={skip}
          className="p-4 bg-midnight-100 text-midnight-600 rounded-2xl hover:bg-midnight-200 transition-colors"
          title="Skip"
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-midnight-100 shadow-sm p-5 text-center">
          <p className="text-3xl font-display font-bold text-midnight-900">
            {sessionsCompleted}
          </p>
          <p className="text-sm text-midnight-500 font-body mt-1">Sessions Done</p>
        </div>
        <div className="bg-white rounded-2xl border border-midnight-100 shadow-sm p-5 text-center">
          <p className="text-3xl font-display font-bold text-midnight-900">
            {formatTotalTime(totalWorkTime)}
          </p>
          <p className="text-sm text-midnight-500 font-body mt-1">Total Focus</p>
        </div>
        <div className="bg-white rounded-2xl border border-midnight-100 shadow-sm p-5 text-center">
          <p className="text-3xl font-display font-bold text-midnight-900">
            {state.pomodoroSettings.sessionsBeforeLongBreak - (sessionsCompleted % state.pomodoroSettings.sessionsBeforeLongBreak)}
          </p>
          <p className="text-sm text-midnight-500 font-body mt-1">Until Long Break</p>
        </div>
      </div>

      {/* Settings Button */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="flex items-center gap-2 px-4 py-2 bg-midnight-100 text-midnight-700 rounded-xl font-body text-sm font-medium hover:bg-midnight-200 transition-colors"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          Sound {soundEnabled ? 'On' : 'Off'}
        </button>
        <button
          onClick={() => setShowSettings(true)}
          className="flex items-center gap-2 px-4 py-2 bg-midnight-100 text-midnight-700 rounded-xl font-body text-sm font-medium hover:bg-midnight-200 transition-colors"
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>
        <button
          onClick={resetAll}
          className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-xl font-body text-sm font-medium hover:bg-red-200 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset All
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-br from-midnight-800 to-midnight-900 rounded-2xl p-6 text-white">
        <h3 className="font-display text-lg font-semibold mb-3">How It Works</h3>
        <div className="grid grid-cols-2 gap-4 text-sm font-body">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-sage-500/20 flex items-center justify-center flex-shrink-0">
              <Brain className="w-4 h-4 text-sage-400" />
            </div>
            <div>
              <p className="font-medium text-cream-100">Focus Session</p>
              <p className="text-midnight-300">{state.pomodoroSettings.workDuration} minutes of focused work</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-terracotta-500/20 flex items-center justify-center flex-shrink-0">
              <Coffee className="w-4 h-4 text-terracotta-400" />
            </div>
            <div>
              <p className="font-medium text-cream-100">Short Break</p>
              <p className="text-midnight-300">{state.pomodoroSettings.shortBreakDuration} minutes to rest</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Coffee className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="font-medium text-cream-100">Long Break</p>
              <p className="text-midnight-300">{state.pomodoroSettings.longBreakDuration} minutes after {state.pomodoroSettings.sessionsBeforeLongBreak} sessions</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="font-medium text-cream-100">Repeat</p>
              <p className="text-midnight-300">Continue the cycle</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          settings={state.pomodoroSettings}
          onClose={() => setShowSettings(false)}
          onSave={(settings) => {
            dispatch({ type: 'UPDATE_POMODORO_SETTINGS', payload: settings });
            setShowSettings(false);
          }}
        />
      )}
    </div>
  );
}

interface SettingsModalProps {
  settings: {
    workDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    sessionsBeforeLongBreak: number;
  };
  onClose: () => void;
  onSave: (settings: SettingsModalProps['settings']) => void;
}

function SettingsModal({ settings, onClose, onSave }: SettingsModalProps) {
  const [workDuration, setWorkDuration] = useState(settings.workDuration);
  const [shortBreakDuration, setShortBreakDuration] = useState(settings.shortBreakDuration);
  const [longBreakDuration, setLongBreakDuration] = useState(settings.longBreakDuration);
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(settings.sessionsBeforeLongBreak);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      workDuration,
      shortBreakDuration,
      longBreakDuration,
      sessionsBeforeLongBreak,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4"
      >
        <div className="px-6 py-4 border-b border-midnight-100 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-midnight-900">
            Timer Settings
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-midnight-100 rounded-lg">
            <X className="w-5 h-5 text-midnight-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-body font-medium text-midnight-700 mb-2">
              Focus Duration: {workDuration} minutes
            </label>
            <input
              type="range"
              min="15"
              max="60"
              step="5"
              value={workDuration}
              onChange={(e) => setWorkDuration(Number(e.target.value))}
              className="w-full accent-sage-600"
            />
            <div className="flex justify-between text-xs text-midnight-400 font-body mt-1">
              <span>15m</span>
              <span>30m</span>
              <span>45m</span>
              <span>60m</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-body font-medium text-midnight-700 mb-2">
              Short Break: {shortBreakDuration} minutes
            </label>
            <input
              type="range"
              min="3"
              max="15"
              step="1"
              value={shortBreakDuration}
              onChange={(e) => setShortBreakDuration(Number(e.target.value))}
              className="w-full accent-terracotta-500"
            />
            <div className="flex justify-between text-xs text-midnight-400 font-body mt-1">
              <span>3m</span>
              <span>10m</span>
              <span>15m</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-body font-medium text-midnight-700 mb-2">
              Long Break: {longBreakDuration} minutes
            </label>
            <input
              type="range"
              min="10"
              max="30"
              step="5"
              value={longBreakDuration}
              onChange={(e) => setLongBreakDuration(Number(e.target.value))}
              className="w-full accent-purple-500"
            />
            <div className="flex justify-between text-xs text-midnight-400 font-body mt-1">
              <span>10m</span>
              <span>20m</span>
              <span>30m</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-body font-medium text-midnight-700 mb-2">
              Sessions Before Long Break: {sessionsBeforeLongBreak}
            </label>
            <input
              type="range"
              min="2"
              max="6"
              step="1"
              value={sessionsBeforeLongBreak}
              onChange={(e) => setSessionsBeforeLongBreak(Number(e.target.value))}
              className="w-full accent-midnight-500"
            />
            <div className="flex justify-between text-xs text-midnight-400 font-body mt-1">
              <span>2</span>
              <span>4</span>
              <span>6</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-midnight-100 text-midnight-700 rounded-xl font-body font-medium hover:bg-midnight-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-sage-600 text-white rounded-xl font-body font-medium hover:bg-sage-700 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
