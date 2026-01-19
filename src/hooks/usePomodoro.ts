import { useState, useEffect, useCallback, useRef } from 'react';

interface PomodoroState {
  timeRemaining: number;
  isRunning: boolean;
  isBreak: boolean;
  sessionsCompleted: number;
  totalWorkTime: number;
}

interface UsePomodoroOptions {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  onWorkComplete?: () => void;
  onBreakComplete?: () => void;
}

export function usePomodoro(options: UsePomodoroOptions) {
  const {
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    sessionsBeforeLongBreak,
    onWorkComplete,
    onBreakComplete,
  } = options;

  const [state, setState] = useState<PomodoroState>({
    timeRemaining: workDuration * 60,
    isRunning: false,
    isBreak: false,
    sessionsCompleted: 0,
    totalWorkTime: 0,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Create audio context for notification sound
  useEffect(() => {
    // Create a simple beep sound using Web Audio API
    const createBeep = () => {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    };

    audioRef.current = { play: createBeep } as unknown as HTMLAudioElement;
  }, []);

  // Timer logic
  useEffect(() => {
    if (state.isRunning && state.timeRemaining > 0) {
      intervalRef.current = window.setInterval(() => {
        setState(prev => {
          const newTime = prev.timeRemaining - 1;
          const newTotalWorkTime = prev.isBreak ? prev.totalWorkTime : prev.totalWorkTime + 1;
          
          if (newTime <= 0) {
            // Timer completed
            try {
              const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
              const oscillator = audioContext.createOscillator();
              const gainNode = audioContext.createGain();
              oscillator.connect(gainNode);
              gainNode.connect(audioContext.destination);
              oscillator.frequency.value = 800;
              oscillator.type = 'sine';
              gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
              gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
              oscillator.start(audioContext.currentTime);
              oscillator.stop(audioContext.currentTime + 0.5);
            } catch {
              // Audio not available
            }

            if (prev.isBreak) {
              // Break ended, start work
              onBreakComplete?.();
              return {
                ...prev,
                timeRemaining: workDuration * 60,
                isRunning: false,
                isBreak: false,
                totalWorkTime: newTotalWorkTime,
              };
            } else {
              // Work ended, start break
              onWorkComplete?.();
              const newSessionsCompleted = prev.sessionsCompleted + 1;
              const isLongBreak = newSessionsCompleted % sessionsBeforeLongBreak === 0;
              const breakDuration = isLongBreak ? longBreakDuration : shortBreakDuration;
              
              return {
                ...prev,
                timeRemaining: breakDuration * 60,
                isRunning: false,
                isBreak: true,
                sessionsCompleted: newSessionsCompleted,
                totalWorkTime: newTotalWorkTime,
              };
            }
          }
          
          return { ...prev, timeRemaining: newTime, totalWorkTime: newTotalWorkTime };
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning, state.timeRemaining, workDuration, shortBreakDuration, longBreakDuration, sessionsBeforeLongBreak, onWorkComplete, onBreakComplete]);

  const start = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: true }));
  }, []);

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: false }));
  }, []);

  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      timeRemaining: prev.isBreak 
        ? (prev.sessionsCompleted % sessionsBeforeLongBreak === 0 ? longBreakDuration : shortBreakDuration) * 60
        : workDuration * 60,
      isRunning: false,
    }));
  }, [workDuration, shortBreakDuration, longBreakDuration, sessionsBeforeLongBreak]);

  const skip = useCallback(() => {
    setState(prev => {
      if (prev.isBreak) {
        return {
          ...prev,
          timeRemaining: workDuration * 60,
          isRunning: false,
          isBreak: false,
        };
      } else {
        const newSessionsCompleted = prev.sessionsCompleted + 1;
        const isLongBreak = newSessionsCompleted % sessionsBeforeLongBreak === 0;
        const breakDuration = isLongBreak ? longBreakDuration : shortBreakDuration;
        
        return {
          ...prev,
          timeRemaining: breakDuration * 60,
          isRunning: false,
          isBreak: true,
          sessionsCompleted: newSessionsCompleted,
        };
      }
    });
  }, [workDuration, shortBreakDuration, longBreakDuration, sessionsBeforeLongBreak]);

  const resetAll = useCallback(() => {
    setState({
      timeRemaining: workDuration * 60,
      isRunning: false,
      isBreak: false,
      sessionsCompleted: 0,
      totalWorkTime: 0,
    });
  }, [workDuration]);

  // Update time when settings change
  useEffect(() => {
    if (!state.isRunning) {
      setState(prev => ({
        ...prev,
        timeRemaining: prev.isBreak
          ? (prev.sessionsCompleted % sessionsBeforeLongBreak === 0 ? longBreakDuration : shortBreakDuration) * 60
          : workDuration * 60,
      }));
    }
  }, [workDuration, shortBreakDuration, longBreakDuration, sessionsBeforeLongBreak, state.isRunning]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = state.isBreak
    ? 1 - (state.timeRemaining / ((state.sessionsCompleted % sessionsBeforeLongBreak === 0 ? longBreakDuration : shortBreakDuration) * 60))
    : 1 - (state.timeRemaining / (workDuration * 60));

  return {
    ...state,
    formattedTime: formatTime(state.timeRemaining),
    progress,
    start,
    pause,
    reset,
    skip,
    resetAll,
  };
}
