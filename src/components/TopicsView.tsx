import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  BookOpen, 
  Clock, 
  Brain,
  ChevronDown,
  ChevronRight,
  X,
  Calendar,
  Trash2,
  Lightbulb,
  Clipboard,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  generateId, 
  getSubjectColor, 
  formatDisplayDate,
  getNextReviewDate,
  generateInterleavedPlan
} from '../utils';
import { Subject, ALL_SUBJECTS, StudyTopic, StudySession } from '../types';
import { format } from 'date-fns';

export function TopicsView() {
  const { state, dispatch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState<Subject | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [showFeynmanModal, setShowFeynmanModal] = useState<string | null>(null);
  const [showQuizModal, setShowQuizModal] = useState<string | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState<string | null>(null);

  const filteredTopics = state.topics.filter(topic => {
    const matchesSearch = topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === 'all' || topic.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const groupedTopics = filteredTopics.reduce((acc, topic) => {
    if (!acc[topic.subject]) acc[topic.subject] = [];
    acc[topic.subject].push(topic);
    return acc;
  }, {} as Record<Subject, StudyTopic[]>);

  const handleDeleteTopic = (topicId: string) => {
    if (confirm('Delete this topic and all associated sessions?')) {
      dispatch({ type: 'DELETE_TOPIC', payload: topicId });
    }
  };
  
  const handleNoteChange = (topicId: string, notes: string) => {
    dispatch({ type: 'UPDATE_TOPIC_NOTES', payload: { topicId, notes } });
  };

  const handleAskAI = (topicId: string) => {
    dispatch({ type: 'OPEN_COPILOT', payload: topicId });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-midnight-900">
          Study Topics
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-sage-600 text-white rounded-xl font-body text-sm font-medium hover:bg-sage-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Topic
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-midnight-200 rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-sage-500"
          />
        </div>
        <select
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value as Subject | 'all')}
          className="px-4 py-3 bg-white border border-midnight-200 rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-sage-500"
        >
          <option value="all">All Subjects</option>
          {ALL_SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Topics List */}
      {filteredTopics.length === 0 ? (
        <div className="bg-white rounded-2xl border border-midnight-100 shadow-sm p-12 text-center">
          <BookOpen className="w-16 h-16 text-midnight-300 mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold text-midnight-800 mb-2">
            No Topics Yet
          </h3>
          <p className="text-midnight-500 font-body mb-6">
            Start by adding your first study topic
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-sage-600 text-white rounded-xl font-body font-medium hover:bg-sage-700 transition-colors"
          >
            Add Your First Topic
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedTopics).map(([subject, topics]) => (
            <div key={subject} className="bg-white rounded-2xl border border-midnight-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-midnight-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-body border ${getSubjectColor(subject)}`}>
                    {subject}
                  </span>
                  <span className="text-sm text-midnight-500 font-body">
                    {topics.length} topic{topics.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <div className="divide-y divide-midnight-100">
                {topics.map((topic) => (
                  <TopicItem
                    key={topic.id}
                    topic={topic}
                    isExpanded={expandedTopic === topic.id}
                    onToggle={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
                    onDelete={() => handleDeleteTopic(topic.id)}
                    onFeynman={() => setShowFeynmanModal(topic.id)}
                    onQuiz={() => setShowQuizModal(topic.id)}
                    onSchedule={() => setShowScheduleModal(topic.id)}
                    onNoteChange={handleNoteChange}
                    onAskAI={() => handleAskAI(topic.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddTopicModal
          onClose={() => setShowAddModal(false)}
          onAdd={(topic) => {
            dispatch({ type: 'ADD_TOPIC', payload: topic });
            setShowAddModal(false);
          }}
        />
      )}

      {showFeynmanModal && (
        <FeynmanModal
          topic={state.topics.find(t => t.id === showFeynmanModal)!}
          onClose={() => setShowFeynmanModal(null)}
          onSave={(explanation) => {
            dispatch({ 
              type: 'ADD_FEYNMAN_ENTRY', 
              payload: { topicId: showFeynmanModal, explanation } 
            });
            setShowFeynmanModal(null);
          }}
        />
      )}

      {showQuizModal && (
        <SelfQuizModal
          topic={state.topics.find(t => t.id === showQuizModal)!}
          onClose={() => setShowQuizModal(null)}
          onSave={(content) => {
            dispatch({ 
              type: 'ADD_SELF_QUIZ_ENTRY', 
              payload: { topicId: showQuizModal, content } 
            });
            setShowQuizModal(null);
          }}
        />
      )}

      {showScheduleModal && (
        <ScheduleSessionModal
          topic={state.topics.find(t => t.id === showScheduleModal)!}
          onClose={() => setShowScheduleModal(null)}
          onSchedule={(session) => {
            dispatch({ type: 'ADD_SESSION', payload: session });
            setShowScheduleModal(false);
          }}
        />
      )}
    </div>
  );
}

interface TopicItemProps {
  topic: StudyTopic;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onFeynman: () => void;
  onQuiz: () => void;
  onSchedule: () => void;
  onNoteChange: (topicId: string, notes: string) => void;
  onAskAI: () => void;
}

function TopicItem({ topic, isExpanded, onToggle, onDelete, onFeynman, onQuiz, onSchedule, onNoteChange, onAskAI }: TopicItemProps) {
  return (
    <div className="px-6 py-4">
      <div className="flex items-center gap-4">
        <button onClick={onToggle} className="p-1 hover:bg-midnight-100 rounded-lg transition-colors">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-midnight-500" />
          ) : (
            <ChevronRight className="w-5 h-5 text-midnight-500" />
          )}
        </button>
        <div className="flex-1">
          <h4 className="font-body font-semibold text-midnight-800">{topic.name}</h4>
          <div className="flex items-center gap-4 mt-1">
            {topic.nextReview && (
              <span className="text-xs text-amber-600 font-body flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Review: {formatDisplayDate(topic.nextReview)}
              </span>
            )}
            <span className="text-xs text-midnight-400 font-body">
              {topic.reviewCount} review{topic.reviewCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onSchedule}
            className="p-2 hover:bg-sage-100 rounded-lg transition-colors"
            title="Schedule Study Session"
          >
            <Calendar className="w-5 h-5 text-sage-600" />
          </button>
          <button
            onClick={onQuiz}
            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
            title="Test Knowledge"
          >
            <Brain className="w-5 h-5 text-blue-600" />
          </button>
          <button
            onClick={onFeynman}
            className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
            title="Feynman Technique"
          >
            <Lightbulb className="w-5 h-5 text-purple-600" />
          </button>
          <button
            onClick={onAskAI}
            className="p-2 hover:bg-terracotta-100 rounded-lg transition-colors"
            title="Ask AI Copilot"
          >
            <MessageSquare className="w-5 h-5 text-terracotta-600" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
            title="Delete Topic"
          >
            <Trash2 className="w-5 h-5 text-red-500" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pl-10 space-y-4">
              {/* Notes Section */}
              <div>
                <h5 className="text-sm font-body font-medium text-midnight-700 mb-2 flex items-center gap-2">
                    <Clipboard className="w-4 h-4 text-green-500" />
                    My Notes
                </h5>
                <textarea
                    value={topic.notes || ''}
                    onChange={(e) => onNoteChange(topic.id, e.target.value)}
                    placeholder="Add your notes for this topic..."
                    rows={5}
                    className="w-full text-sm p-3 bg-green-50 rounded-lg border border-green-200 font-body focus:outline-none focus:ring-1 focus:ring-green-500 resize-none"
                />
              </div>

              {/* Feynman Explanations */}
              {topic.feynmanExplanations.length > 0 && (
                <div>
                  <h5 className="text-sm font-body font-medium text-midnight-700 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-purple-500" />
                    Feynman Explanations
                  </h5>
                  <div className="space-y-2">
                    {topic.feynmanExplanations.slice(-3).map((entry) => (
                      <div key={entry.id} className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                        <p className="text-sm text-midnight-700 font-body">{entry.explanation}</p>
                        <p className="text-xs text-midnight-400 mt-2 font-body">
                          {formatDisplayDate(entry.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Self Quiz Entries */}
              {topic.selfQuizEntries.length > 0 && (
                <div>
                  <h5 className="text-sm font-body font-medium text-midnight-700 mb-2 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-blue-500" />
                    Self-Quiz Entries
                  </h5>
                  <div className="space-y-2">
                    {topic.selfQuizEntries.slice(-3).map((entry) => (
                      <div key={entry.id} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-sm text-midnight-700 font-body whitespace-pre-wrap">{entry.content}</p>
                        <p className="text-xs text-midnight-400 mt-2 font-body">
                          {formatDisplayDate(entry.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface AddTopicModalProps {
  onClose: () => void;
  onAdd: (topic: StudyTopic) => void;
}

function AddTopicModal({ onClose, onAdd }: AddTopicModalProps) {
  const [subject, setSubject] = useState<Subject>('English');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const topic: StudyTopic = {
      id: generateId(),
      subject,
      name: name.trim(),
      description: description.trim() || undefined,
      createdAt: new Date().toISOString(),
      reviewCount: 0,
      nextReview: getNextReviewDate(0),
      feynmanExplanations: [],
      selfQuizEntries: [],
    };

    onAdd(topic);
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
            Add New Topic
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
              Topic Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Poetry Analysis, Differentiation"
              className="w-full px-4 py-3 bg-midnight-50 border border-midnight-200 rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-sage-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-body font-medium text-midnight-700 mb-2">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief notes about this topic..."
              rows={3}
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
              Add Topic
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

interface FeynmanModalProps {
  topic: StudyTopic;
  onClose: () => void;
  onSave: (explanation: string) => void;
}

function FeynmanModal({ topic, onClose, onSave }: FeynmanModalProps) {
  const [explanation, setExplanation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!explanation.trim()) return;
    onSave(explanation.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4"
      >
        <div className="px-6 py-4 border-b border-midnight-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-midnight-900">
                Feynman Technique
              </h3>
              <p className="text-sm text-midnight-500 font-body">{topic.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-midnight-100 rounded-lg">
            <X className="w-5 h-5 text-midnight-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
            <p className="text-sm text-purple-800 font-body">
              Explain <strong>{topic.name}</strong> in the simplest terms possible, 
              as if teaching it to someone who has never heard of it. 
              This helps identify gaps in your understanding.
            </p>
          </div>

          <div>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Start explaining..."
              rows={10}
              className="w-full px-4 py-3 bg-midnight-50 border border-midnight-200 rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-sage-500 resize-none"
              autoFocus
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-midnight-100 text-midnight-700 rounded-xl font-body font-medium hover:bg-midnight-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl font-body font-medium hover:bg-purple-700 transition-colors"
            >
              Save Explanation
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

interface SelfQuizModalProps {
  topic: StudyTopic;
  onClose: () => void;
  onSave: (content: string) => void;
}

function SelfQuizModal({ topic, onClose, onSave }: SelfQuizModalProps) {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSave(content.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4"
      >
        <div className="px-6 py-4 border-b border-midnight-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Brain className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-midnight-900">
                Test Your Knowledge
              </h3>
              <p className="text-sm text-midnight-500 font-body">{topic.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-midnight-100 rounded-lg">
            <X className="w-5 h-5 text-midnight-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <p className="text-sm text-blue-800 font-body">
              Without looking at your notes, write everything you remember about <strong>{topic.name}</strong>.
              This active recall practice strengthens your memory.
            </p>
          </div>

          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write everything you remember..."
              rows={10}
              className="w-full px-4 py-3 bg-midnight-50 border border-midnight-200 rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-sage-500 resize-none"
              autoFocus
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-midnight-100 text-midnight-700 rounded-xl font-body font-medium hover:bg-midnight-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-body font-medium hover:bg-blue-700 transition-colors"
            >
              Save Entry
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

interface ScheduleSessionModalProps {
  topic: StudyTopic;
  onClose: () => void;
  onSchedule: (session: StudySession) => void;
}

function ScheduleSessionModal({ topic, onClose, onSchedule }: ScheduleSessionModalProps) {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [duration, setDuration] = useState(60);
  const [useInterleaving, setUseInterleaving] = useState(false);
  const [subTopics, setSubTopics] = useState(['', '']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const session: StudySession = {
      id: generateId(),
      topicId: topic.id,
      subject: topic.subject,
      topicName: topic.name,
      scheduledDate: date,
      duration,
      completed: false,
      isReview: false,
      interleavedPlan: useInterleaving && subTopics.filter(s => s.trim()).length >= 2
        ? generateInterleavedPlan(duration, subTopics.filter(s => s.trim())).map((block) => ({
            id: generateId(),
            ...block,
          }))
        : undefined,
    };

    onSchedule(session);
  };

  const interleavedPreview = useInterleaving && subTopics.filter(s => s.trim()).length >= 2
    ? generateInterleavedPlan(duration, subTopics.filter(s => s.trim()))
    : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="px-6 py-4 border-b border-midnight-100 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-midnight-900">
              Schedule Study Session
            </h3>
            <p className="text-sm text-midnight-500 font-body">{topic.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-midnight-100 rounded-lg">
            <X className="w-5 h-5 text-midnight-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-body font-medium text-midnight-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
              className="w-full px-4 py-3 bg-midnight-50 border border-midnight-200 rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-sage-500"
            />
          </div>

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
          </div>

          <div className="border-t border-midnight-100 pt-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={useInterleaving}
                onChange={(e) => setUseInterleaving(e.target.checked)}
                className="w-5 h-5 rounded border-midnight-300 text-sage-600 focus:ring-sage-500"
              />
              <div>
                <span className="font-body font-medium text-midnight-700">
                  Use Interleaving
                </span>
                <p className="text-xs text-midnight-500 font-body">
                  Mix different sub-topics for better learning
                </p>
              </div>
            </label>
          </div>

          {useInterleaving && (
            <div className="space-y-3">
              <label className="block text-sm font-body font-medium text-midnight-700">
                Sub-topics to interleave
              </label>
              {subTopics.map((st, index) => (
                <input
                  key={index}
                  type="text"
                  value={st}
                  onChange={(e) => {
                    const newSubTopics = [...subTopics];
                    newSubTopics[index] = e.target.value;
                    setSubTopics(newSubTopics);
                  }}
                  placeholder={`Sub-topic ${index + 1}`}
                  className="w-full px-4 py-2 bg-midnight-50 border border-midnight-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-sage-500"
                />
              ))}
              <button
                type="button"
                onClick={() => setSubTopics([...subTopics, ''])}
                className="text-sm text-sage-600 font-body hover:text-sage-700"
              >
                + Add another sub-topic
              </button>

              {interleavedPreview && (
                <div className="bg-sage-50 rounded-xl p-4 border border-sage-200">
                  <h4 className="text-sm font-body font-medium text-sage-800 mb-2">
                    Suggested Plan
                  </h4>
                  <div className="space-y-1">
                    {interleavedPreview.map((block, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm font-body text-sage-700">
                        <span className="w-6 text-sage-500">{i + 1}.</span>
                        <span>{block.subTopic}</span>
                        <span className="text-sage-500">({block.duration}m)</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

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
              Schedule
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
