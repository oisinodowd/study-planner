import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  BookOpen, 
  CheckCircle2,
  Plus,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  getSessionsForDate, 
  formatDuration, 
  getSubjectColor,
  generateId
} from '../utils';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday
} from 'date-fns';
import { Subject, ALL_SUBJECTS, StudySession } from '../types';

export function CalendarView() {
  const { state, dispatch } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const selectedDateSessions = selectedDate 
    ? getSessionsForDate(state.sessions, selectedDate)
    : [];

  const handleCompleteSession = (sessionId: string) => {
    dispatch({ type: 'COMPLETE_SESSION', payload: sessionId });
  };

  const handleDeleteSession = (sessionId: string) => {
    dispatch({ type: 'DELETE_SESSION', payload: sessionId });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-midnight-900">
          Study Calendar
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-midnight-100 text-midnight-700 rounded-xl font-body text-sm font-medium hover:bg-midnight-200 transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => {
              setSelectedDate(new Date());
              setShowAddModal(true);
            }}
            className="px-4 py-2 bg-sage-600 text-white rounded-xl font-body text-sm font-medium hover:bg-sage-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Session
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-2xl border border-midnight-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-midnight-100 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-midnight-900">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousMonth}
                className="p-2 hover:bg-midnight-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-midnight-600" />
              </button>
              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-midnight-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-midnight-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 border-b border-midnight-100">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="px-3 py-3 text-center">
                <span className="text-xs font-body font-medium text-midnight-500 uppercase tracking-wider">
                  {day}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              const sessions = getSessionsForDate(state.sessions, day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const hasReview = sessions.some(s => s.isReview && !s.completed);
              const hasSession = sessions.some(s => !s.isReview && !s.completed);
              const allCompleted = sessions.length > 0 && sessions.every(s => s.completed);

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    min-h-[80px] p-2 border-b border-r border-midnight-100 
                    transition-colors text-left relative
                    ${!isCurrentMonth ? 'bg-midnight-50/50' : 'hover:bg-sage-50'}
                    ${isSelected ? 'bg-sage-100 ring-2 ring-sage-500 ring-inset' : ''}
                    ${isToday(day) ? 'bg-cream-100' : ''}
                  `}
                >
                  <span className={`
                    text-sm font-body font-medium
                    ${!isCurrentMonth ? 'text-midnight-300' : 'text-midnight-700'}
                    ${isToday(day) ? 'text-terracotta-600' : ''}
                    ${isSelected ? 'text-sage-700' : ''}
                  `}>
                    {format(day, 'd')}
                  </span>
                  
                  <div className="mt-1 space-y-1">
                    {hasReview && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span className="text-xs text-amber-600 font-body">Review</span>
                      </div>
                    )}
                    {hasSession && (
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-sage-500" />
                        <span className="text-xs text-sage-600 font-body">Study</span>
                      </div>
                    )}
                    {allCompleted && sessions.length > 0 && (
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span className="text-xs text-emerald-600 font-body">Done</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-midnight-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-midnight-100">
            <h3 className="font-display text-lg font-semibold text-midnight-900">
              {selectedDate ? format(selectedDate, 'EEEE, MMM d') : 'Select a Day'}
            </h3>
          </div>
          <div className="p-5">
            {!selectedDate ? (
              <p className="text-sm text-midnight-400 font-body text-center py-8">
                Click on a day to see scheduled sessions
              </p>
            ) : selectedDateSessions.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-10 h-10 text-midnight-300 mx-auto mb-3" />
                <p className="text-sm text-midnight-400 font-body">No sessions scheduled</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 px-4 py-2 bg-sage-600 text-white rounded-xl font-body text-sm font-medium hover:bg-sage-700 transition-colors"
                >
                  Add Session
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateSessions.map((session) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`
                      p-4 rounded-xl border
                      ${session.completed 
                        ? 'bg-emerald-50 border-emerald-200' 
                        : session.isReview 
                          ? 'bg-amber-50 border-amber-200' 
                          : 'bg-midnight-50 border-midnight-100'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-body font-semibold text-midnight-800">
                        {session.topicName}
                      </h4>
                      <button
                        onClick={() => handleDeleteSession(session.id)}
                        className="p-1 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getSubjectColor(session.subject)}`}>
                        {session.subject}
                      </span>
                      <span className="text-xs text-midnight-500 font-body">
                        {formatDuration(session.duration)}
                      </span>
                      {session.isReview && (
                        <span className="text-xs px-2 py-0.5 bg-amber-200 text-amber-700 rounded-full">
                          Review
                        </span>
                      )}
                    </div>
                    {!session.completed ? (
                      <button
                        onClick={() => handleCompleteSession(session.id)}
                        className="w-full px-4 py-2 bg-sage-600 text-white rounded-lg font-body text-sm font-medium hover:bg-sage-700 transition-colors"
                      >
                        Mark Complete
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm font-body">Completed</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddModal && selectedDate && (
        <AddSessionModal
          date={selectedDate}
          topics={state.topics}
          onClose={() => setShowAddModal(false)}
          onAdd={(session) => {
            dispatch({ type: 'ADD_SESSION', payload: session });
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}

interface AddSessionModalProps {
  date: Date;
  topics: { id: string; name: string; subject: Subject }[];
  onClose: () => void;
  onAdd: (session: StudySession) => void;
}

function AddSessionModal({ date, topics, onClose, onAdd }: AddSessionModalProps) {
  const [subject, setSubject] = useState<Subject>('English');
  const [topicName, setTopicName] = useState('');
  const [duration, setDuration] = useState(60);
  const [selectedTopicId, setSelectedTopicId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const name = selectedTopicId 
      ? topics.find(t => t.id === selectedTopicId)?.name || topicName
      : topicName;

    if (!name.trim()) return;

    const session: StudySession = {
      id: generateId(),
      topicId: selectedTopicId || generateId(),
      subject,
      topicName: name,
      scheduledDate: format(date, 'yyyy-MM-dd'),
      duration,
      completed: false,
      isReview: false,
    };

    onAdd(session);
  };

  const existingTopics = topics.filter(t => t.subject === subject);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4"
      >
        <div className="px-6 py-4 border-b border-midnight-100 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-midnight-900">
            Add Study Session
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-midnight-100 rounded-lg">
            <X className="w-5 h-5 text-midnight-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-body font-medium text-midnight-700 mb-2">
              Date
            </label>
            <div className="px-4 py-3 bg-midnight-50 rounded-xl text-midnight-700 font-body">
              {format(date, 'EEEE, MMMM d, yyyy')}
            </div>
          </div>

          <div>
            <label className="block text-sm font-body font-medium text-midnight-700 mb-2">
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value as Subject);
                setSelectedTopicId('');
              }}
              className="w-full px-4 py-3 bg-midnight-50 border border-midnight-200 rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-sage-500"
            >
              {ALL_SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {existingTopics.length > 0 && (
            <div>
              <label className="block text-sm font-body font-medium text-midnight-700 mb-2">
                Existing Topic (optional)
              </label>
              <select
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                className="w-full px-4 py-3 bg-midnight-50 border border-midnight-200 rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-sage-500"
              >
                <option value="">Create new topic</option>
                {existingTopics.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          )}

          {!selectedTopicId && (
            <div>
              <label className="block text-sm font-body font-medium text-midnight-700 mb-2">
                Topic Name
              </label>
              <input
                type="text"
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
                placeholder="e.g., Poetry Analysis"
                className="w-full px-4 py-3 bg-midnight-50 border border-midnight-200 rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-body font-medium text-midnight-700 mb-2">
              Duration: {duration} minutes
            </label>
            <input
              type="range"
              min="15"
              max="180"
              step="15"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full accent-sage-600"
            />
            <div className="flex justify-between text-xs text-midnight-400 font-body mt-1">
              <span>15m</span>
              <span>1h</span>
              <span>2h</span>
              <span>3h</span>
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
              Add Session
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
