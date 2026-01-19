import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  ClipboardList, 
  TrendingUp,
  Calendar,
  X,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateId, getSubjectColor } from '../utils';
import { Subject, ALL_SUBJECTS, PracticeTest } from '../types';
import { format } from 'date-fns';

export function PracticeTestsView() {
  const { state, dispatch } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterSubject, setFilterSubject] = useState<Subject | 'all'>('all');

  const filteredTests = state.practiceTests
    .filter(test => filterSubject === 'all' || test.subject === filterSubject)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleDeleteTest = (testId: string) => {
    if (confirm('Delete this practice test record?')) {
      dispatch({ type: 'DELETE_PRACTICE_TEST', payload: testId });
    }
  };

  // Calculate statistics
  const stats = {
    totalTests: state.practiceTests.length,
    averageScore: state.practiceTests.length > 0
      ? Math.round(
          state.practiceTests.reduce((sum, t) => sum + (t.score / t.maxScore) * 100, 0) / 
          state.practiceTests.length
        )
      : 0,
    thisWeek: state.practiceTests.filter(t => {
      const testDate = new Date(t.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return testDate >= weekAgo;
    }).length,
  };

  // Group by subject for chart
  const subjectStats = ALL_SUBJECTS.map(subject => {
    const tests = state.practiceTests.filter(t => t.subject === subject);
    const avgScore = tests.length > 0
      ? Math.round(tests.reduce((sum, t) => sum + (t.score / t.maxScore) * 100, 0) / tests.length)
      : 0;
    return { subject, count: tests.length, avgScore };
  }).filter(s => s.count > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-midnight-900">
          Practice Test Log
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-sage-600 text-white rounded-xl font-body text-sm font-medium hover:bg-sage-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Log Test
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-midnight-100 shadow-sm p-5">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
            <ClipboardList className="w-5 h-5" />
          </div>
          <p className="text-2xl font-display font-semibold text-midnight-900">{stats.totalTests}</p>
          <p className="text-sm text-midnight-500 font-body">Total Tests</p>
        </div>
        <div className="bg-white rounded-2xl border border-midnight-100 shadow-sm p-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-2xl font-display font-semibold text-midnight-900">{stats.averageScore}%</p>
          <p className="text-sm text-midnight-500 font-body">Average Score</p>
        </div>
        <div className="bg-white rounded-2xl border border-midnight-100 shadow-sm p-5">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
            <Calendar className="w-5 h-5" />
          </div>
          <p className="text-2xl font-display font-semibold text-midnight-900">{stats.thisWeek}</p>
          <p className="text-sm text-midnight-500 font-body">This Week</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Test Log */}
        <div className="col-span-2">
          <div className="bg-white rounded-2xl border border-midnight-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-midnight-100 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-midnight-900">
                Test History
              </h2>
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value as Subject | 'all')}
                className="px-3 py-2 bg-midnight-50 border border-midnight-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-sage-500"
              >
                <option value="all">All Subjects</option>
                {ALL_SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="p-6">
              {filteredTests.length === 0 ? (
                <div className="text-center py-8">
                  <ClipboardList className="w-12 h-12 text-midnight-300 mx-auto mb-3" />
                  <p className="text-midnight-500 font-body mb-4">No tests logged yet</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-sage-600 text-white rounded-xl font-body text-sm font-medium hover:bg-sage-700 transition-colors"
                  >
                    Log Your First Test
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTests.map((test) => (
                    <TestCard
                      key={test.id}
                      test={test}
                      onDelete={() => handleDeleteTest(test.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Subject Performance */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-midnight-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-midnight-100">
              <h3 className="font-display text-lg font-semibold text-midnight-900">
                Performance by Subject
              </h3>
            </div>
            <div className="p-5">
              {subjectStats.length === 0 ? (
                <p className="text-sm text-midnight-400 font-body text-center py-4">
                  No data yet
                </p>
              ) : (
                <div className="space-y-4">
                  {subjectStats.map((stat) => (
                    <div key={stat.subject}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-body text-midnight-700">{stat.subject}</span>
                        <span className="text-sm font-body font-medium text-midnight-800">
                          {stat.avgScore}%
                        </span>
                      </div>
                      <div className="h-2 bg-midnight-100 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${
                            stat.avgScore >= 70 ? 'bg-emerald-500' :
                            stat.avgScore >= 50 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.avgScore}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <p className="text-xs text-midnight-400 font-body mt-1">
                        {stat.count} test{stat.count !== 1 ? 's' : ''}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-gradient-to-br from-terracotta-500 to-terracotta-600 rounded-2xl p-6 text-white">
            <h3 className="font-display text-lg font-semibold mb-3">Study Tip</h3>
            <p className="text-sm font-body text-terracotta-100 leading-relaxed">
              Regular practice tests are one of the most effective study methods. 
              They help identify weak areas and improve long-term retention through 
              active recall.
            </p>
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddTestModal
          onClose={() => setShowAddModal(false)}
          onAdd={(test) => {
            dispatch({ type: 'ADD_PRACTICE_TEST', payload: test });
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}

function TestCard({ test, onDelete }: { test: PracticeTest; onDelete: () => void }) {
  const percentage = Math.round((test.score / test.maxScore) * 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 p-4 bg-midnight-50 rounded-xl border border-midnight-100"
    >
      <div className={`
        w-14 h-14 rounded-xl flex items-center justify-center font-display font-bold text-lg
        ${percentage >= 70 ? 'bg-emerald-100 text-emerald-700' :
          percentage >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}
      `}>
        {percentage}%
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-body font-semibold text-midnight-800 truncate">{test.topic}</h4>
        <div className="flex items-center gap-3 mt-1">
          <span className={`text-xs px-2 py-0.5 rounded-full border ${getSubjectColor(test.subject)}`}>
            {test.subject}
          </span>
          <span className="text-xs text-midnight-500 font-body">
            {format(new Date(test.date), 'MMM d, yyyy')}
          </span>
          <span className="text-xs text-midnight-500 font-body">
            {test.score}/{test.maxScore}
          </span>
        </div>
        {test.notes && (
          <p className="text-xs text-midnight-500 font-body mt-2 truncate">{test.notes}</p>
        )}
      </div>
      <button
        onClick={onDelete}
        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
      >
        <Trash2 className="w-4 h-4 text-red-500" />
      </button>
    </motion.div>
  );
}

interface AddTestModalProps {
  onClose: () => void;
  onAdd: (test: PracticeTest) => void;
}

function AddTestModal({ onClose, onAdd }: AddTestModalProps) {
  const [subject, setSubject] = useState<Subject>('English');
  const [topic, setTopic] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [score, setScore] = useState('');
  const [maxScore, setMaxScore] = useState('100');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !score || !maxScore) return;

    const test: PracticeTest = {
      id: generateId(),
      subject,
      topic: topic.trim(),
      date,
      score: Number(score),
      maxScore: Number(maxScore),
      notes: notes.trim() || undefined,
    };

    onAdd(test);
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
            Log Practice Test
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-midnight-100 rounded-lg">
            <X className="w-5 h-5 text-midnight-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-body font-medium text-midnight-700 mb-2">
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as Subject)}
              className="w-full px-4 py-3 bg-midnight-50 border border-midnight-200 rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-sage-500"
            >
              {ALL_SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-body font-medium text-midnight-700 mb-2">
              Topic / Test Name
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Chapter 5 Quiz, Mock Exam Paper 1"
              className="w-full px-4 py-3 bg-midnight-50 border border-midnight-200 rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-sage-500"
            />
          </div>

          <div>
            <label className="block text-sm font-body font-medium text-midnight-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={format(new Date(), 'yyyy-MM-dd')}
              className="w-full px-4 py-3 bg-midnight-50 border border-midnight-200 rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-sage-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-body font-medium text-midnight-700 mb-2">
                Score
              </label>
              <input
                type="number"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="85"
                min="0"
                className="w-full px-4 py-3 bg-midnight-50 border border-midnight-200 rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
            <div>
              <label className="block text-sm font-body font-medium text-midnight-700 mb-2">
                Max Score
              </label>
              <input
                type="number"
                value={maxScore}
                onChange={(e) => setMaxScore(e.target.value)}
                placeholder="100"
                min="1"
                className="w-full px-4 py-3 bg-midnight-50 border border-midnight-200 rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-body font-medium text-midnight-700 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any observations or areas to improve..."
              rows={2}
              className="w-full px-4 py-3 bg-midnight-50 border border-midnight-200 rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-sage-500 resize-none"
            />
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
              Save Test
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
