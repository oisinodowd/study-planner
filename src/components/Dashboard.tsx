import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Target, 
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Flame
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  getUpcomingSessions, 
  getOverdueSessions, 
  formatDisplayDate, 
  formatDuration,
  getSubjectColor,
  getSubjectSolidColor
} from '../utils';
import { format } from 'date-fns';
import { ViewMode, StudySession } from '../types';

interface DashboardProps {
  onNavigate: (view: ViewMode) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { state, dispatch } = useApp();
  const upcomingSessions = getUpcomingSessions(state.sessions);
  const overdueSessions = getOverdueSessions(state.sessions);
  
  const todaySessions = upcomingSessions.filter(
    s => s.scheduledDate === format(new Date(), 'yyyy-MM-dd')
  );

  const completedToday = state.sessions.filter(
    s => s.completed && s.completedAt?.startsWith(format(new Date(), 'yyyy-MM-dd'))
  ).length;

  const totalTopics = state.topics.length;
  const totalFlashcards = state.flashcardDecks.reduce((sum, deck) => sum + deck.cards.length, 0);

  const studyStreak = 3;

  const handleCompleteSession = (sessionId: string) => {
    dispatch({ type: 'COMPLETE_SESSION', payload: sessionId });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-midnight-900">
            Welcome Back
          </h1>
          <p className="text-midnight-500 font-body mt-1">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-terracotta-100 px-4 py-2 rounded-full">
          <Flame className="w-5 h-5 text-terracotta-600" />
          <span className="font-body font-medium text-terracotta-700">
            {studyStreak} day streak
          </span>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-4 gap-4">
        <StatCard
          icon={Calendar}
          label="Today's Sessions"
          value={todaySessions.length}
          color="sage"
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed Today"
          value={completedToday}
          color="emerald"
        />
        <StatCard
          icon={BookOpen}
          label="Study Topics"
          value={totalTopics}
          color="blue"
        />
        <StatCard
          icon={Target}
          label="Flashcards"
          value={totalFlashcards}
          color="purple"
        />
      </motion.div>

      {overdueSessions.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-body font-semibold text-red-800">
              {overdueSessions.length} Overdue Review{overdueSessions.length !== 1 ? 's' : ''}
            </h3>
            <p className="text-sm text-red-600">
              You have sessions that need to be rescheduled or completed
            </p>
          </div>
          <button
            onClick={() => onNavigate('calendar')}
            className="px-4 py-2 bg-red-600 text-white rounded-xl font-body text-sm font-medium hover:bg-red-700 transition-colors"
          >
            View All
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="col-span-2">
          <div className="bg-white rounded-2xl border border-midnight-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-midnight-100 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-midnight-900">
                Today's Schedule
              </h2>
              <button
                onClick={() => onNavigate('calendar')}
                className="text-sm text-sage-600 hover:text-sage-700 font-body flex items-center gap-1"
              >
                View Calendar <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              {todaySessions.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-midnight-300 mx-auto mb-3" />
                  <p className="text-midnight-500 font-body">No sessions scheduled for today</p>
                  <button
                    onClick={() => onNavigate('topics')}
                    className="mt-4 px-4 py-2 bg-sage-600 text-white rounded-xl font-body text-sm font-medium hover:bg-sage-700 transition-colors"
                  >
                    Create Study Session
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {todaySessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      onComplete={() => handleCompleteSession(session.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6">
          <div className="bg-gradient-to-br from-sage-600 to-sage-700 rounded-2xl p-6 text-white">
            <h3 className="font-display text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <QuickActionButton
                icon={BookOpen}
                label="Add New Topic"
                onClick={() => onNavigate('topics')}
              />
              <QuickActionButton
                icon={Target}
                label="Review Flashcards"
                onClick={() => onNavigate('flashcards')}
              />
              <QuickActionButton
                icon={Clock}
                label="Start Pomodoro"
                onClick={() => onNavigate('pomodoro')}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-midnight-100 shadow-sm">
            <div className="px-5 py-4 border-b border-midnight-100">
              <h3 className="font-display text-lg font-semibold text-midnight-900">
                Upcoming Reviews
              </h3>
            </div>
            <div className="p-5">
              {upcomingSessions.filter(s => s.isReview).length === 0 ? (
                <p className="text-sm text-midnight-400 font-body text-center py-4">
                  No upcoming reviews
                </p>
              ) : (
                <div className="space-y-3">
                  {upcomingSessions
                    .filter(s => s.isReview)
                    .slice(0, 5)
                    .map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center gap-3 p-3 bg-midnight-50 rounded-xl"
                      >
                        <div className={`w-2 h-2 rounded-full ${getSubjectSolidColor(session.subject)}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-midnight-800 truncate font-body">
                            {session.topicName}
                          </p>
                          <p className="text-xs text-midnight-500 font-body">
                            {formatDisplayDate(session.scheduledDate)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: number; 
  color: 'sage' | 'emerald' | 'blue' | 'purple';
}) {
  const colorClasses = {
    sage: 'bg-sage-100 text-sage-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="bg-white rounded-2xl border border-midnight-100 shadow-sm p-5">
      <div className={`w-10 h-10 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-display font-semibold text-midnight-900">{value}</p>
      <p className="text-sm text-midnight-500 font-body">{label}</p>
    </div>
  );
}

function SessionCard({ 
  session, 
  onComplete 
}: { 
  session: StudySession; 
  onComplete: () => void;
}) {
  return (
    <div className={`
      flex items-center gap-4 p-4 rounded-xl border
      ${session.isReview ? 'bg-amber-50 border-amber-200' : 'bg-midnight-50 border-midnight-100'}
    `}>
      <div className={`
        w-12 h-12 rounded-xl flex items-center justify-center
        ${session.isReview ? 'bg-amber-200' : 'bg-sage-200'}
      `}>
        {session.isReview ? (
          <Clock className="w-6 h-6 text-amber-700" />
        ) : (
          <BookOpen className="w-6 h-6 text-sage-700" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-body font-semibold text-midnight-800 truncate">
            {session.topicName}
          </h4>
          {session.isReview && (
            <span className="px-2 py-0.5 bg-amber-200 text-amber-800 text-xs rounded-full font-body">
              Review
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1">
          <span className={`text-xs px-2 py-0.5 rounded-full border ${getSubjectColor(session.subject)}`}>
            {session.subject}
          </span>
          <span className="text-xs text-midnight-500 font-body">
            {formatDuration(session.duration)}
          </span>
        </div>
      </div>
      <button
        onClick={onComplete}
        className="px-4 py-2 bg-sage-600 text-white rounded-xl font-body text-sm font-medium hover:bg-sage-700 transition-colors"
      >
        Complete
      </button>
    </div>
  );
}

function QuickActionButton({ 
  icon: Icon, 
  label, 
  onClick 
}: { 
  icon: React.ElementType; 
  label: string; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
    >
      <Icon className="w-5 h-5" />
      <span className="font-body text-sm">{label}</span>
      <ArrowRight className="w-4 h-4 ml-auto" />
    </button>
  );
}
