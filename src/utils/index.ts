import { 
  SubjectGrade, 
  GRADE_POINTS, 
  MATHS_BONUS_THRESHOLD, 
  MATHS_BONUS_POINTS,
  SRS_INTERVALS,
  StudyTopic,
  StudySession
} from '../types';
import { addDays, format, parseISO, isToday, isTomorrow, startOfDay } from 'date-fns';

// Generate unique IDs
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Calculate LC Points
export const calculatePoints = (grades: SubjectGrade[]): { total: number; breakdown: { subject: string; points: number }[]; bonusApplied: boolean } => {
  // Get all valid grades with points
  const gradesWithPoints = grades
    .filter(g => g.grade !== '')
    .map(g => ({
      subject: g.subject,
      points: GRADE_POINTS[g.grade],
      grade: g.grade
    }))
    .sort((a, b) => b.points - a.points);

  // Take top 6
  const topSix = gradesWithPoints.slice(0, 6);
  
  // Check for maths bonus
  const mathsGrade = grades.find(g => g.subject === 'Maths');
  const bonusApplied = mathsGrade && 
    mathsGrade.grade !== '' && 
    MATHS_BONUS_THRESHOLD.includes(mathsGrade.grade);

  // Calculate total
  let total = topSix.reduce((sum, g) => sum + g.points, 0);
  if (bonusApplied) {
    total += MATHS_BONUS_POINTS;
  }

  return {
    total,
    breakdown: topSix.map(g => ({ subject: g.subject, points: g.points })),
    bonusApplied: bonusApplied || false
  };
};

// Calculate next review date based on review count
export const getNextReviewDate = (reviewCount: number): string => {
  const intervalIndex = Math.min(reviewCount, SRS_INTERVALS.length - 1);
  const daysUntilReview = SRS_INTERVALS[intervalIndex];
  return format(addDays(new Date(), daysUntilReview), 'yyyy-MM-dd');
};

// Schedule review sessions for a topic
export const scheduleReviewSessions = (topic: StudyTopic): StudySession[] => {
  const sessions: StudySession[] = [];
  
  SRS_INTERVALS.forEach((days, index) => {
    if (index >= topic.reviewCount) {
      const reviewDate = addDays(new Date(), days);
      sessions.push({
        id: generateId(),
        topicId: topic.id,
        subject: topic.subject,
        topicName: topic.name,
        scheduledDate: format(reviewDate, 'yyyy-MM-dd'),
        duration: 30,
        completed: false,
        isReview: true,
      });
    }
  });

  return sessions;
};

// Format date for display
export const formatDisplayDate = (dateString: string): string => {
  const date = parseISO(dateString);
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  return format(date, 'EEE, MMM d');
};

// Check if a date is overdue
export const isOverdue = (dateString: string): boolean => {
  const date = startOfDay(parseISO(dateString));
  const today = startOfDay(new Date());
  return date < today;
};

// Get sessions for a specific date
export const getSessionsForDate = (sessions: StudySession[], date: Date): StudySession[] => {
  const dateString = format(date, 'yyyy-MM-dd');
  return sessions.filter(s => s.scheduledDate === dateString);
};

// Get upcoming sessions (next 7 days)
export const getUpcomingSessions = (sessions: StudySession[]): StudySession[] => {
  const today = startOfDay(new Date());
  const weekFromNow = addDays(today, 7);
  
  return sessions
    .filter(s => {
      const sessionDate = parseISO(s.scheduledDate);
      return !s.completed && sessionDate >= today && sessionDate <= weekFromNow;
    })
    .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));
};

// Get overdue sessions
export const getOverdueSessions = (sessions: StudySession[]): StudySession[] => {
  return sessions
    .filter(s => !s.completed && isOverdue(s.scheduledDate))
    .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));
};

// Generate interleaved study plan
export const generateInterleavedPlan = (
  duration: number, 
  subTopics: string[]
): { subTopic: string; duration: number; order: number }[] => {
  if (subTopics.length === 0) return [];
  if (subTopics.length === 1) {
    return [{ subTopic: subTopics[0], duration, order: 0 }];
  }

  const blockDuration = 30; // 30 minute blocks
  const totalBlocks = Math.floor(duration / blockDuration);
  const plan: { subTopic: string; duration: number; order: number }[] = [];

  for (let i = 0; i < totalBlocks; i++) {
    const subTopicIndex = i % subTopics.length;
    plan.push({
      subTopic: subTopics[subTopicIndex],
      duration: blockDuration,
      order: i,
    });
  }

  // Handle remaining time
  const remainingTime = duration % blockDuration;
  if (remainingTime > 0) {
    plan.push({
      subTopic: subTopics[0],
      duration: remainingTime,
      order: totalBlocks,
    });
  }

  return plan;
};

// Format duration for display
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

// Get color for subject
export const getSubjectColor = (subject: string): string => {
  const colors: Record<string, string> = {
    'English': 'bg-blue-500/20 text-blue-700 border-blue-300',
    'Irish': 'bg-emerald-500/20 text-emerald-700 border-emerald-300',
    'Maths': 'bg-purple-500/20 text-purple-700 border-purple-300',
    'Computer Science': 'bg-cyan-500/20 text-cyan-700 border-cyan-300',
    'Business': 'bg-amber-500/20 text-amber-700 border-amber-300',
    'Religion': 'bg-rose-500/20 text-rose-700 border-rose-300',
    'Physical Education': 'bg-orange-500/20 text-orange-700 border-orange-300',
  };
  return colors[subject] || 'bg-gray-500/20 text-gray-700 border-gray-300';
};

// Get solid color for subject
export const getSubjectSolidColor = (subject: string): string => {
  const colors: Record<string, string> = {
    'English': 'bg-blue-500',
    'Irish': 'bg-emerald-500',
    'Maths': 'bg-purple-500',
    'Computer Science': 'bg-cyan-500',
    'Business': 'bg-amber-500',
    'Religion': 'bg-rose-500',
    'Physical Education': 'bg-orange-500',
  };
  return colors[subject] || 'bg-gray-500';
};

// Local storage helpers
const STORAGE_KEY = 'study-planner-data-v2';

export const saveToStorage = (data: unknown): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const loadFromStorage = <T>(defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as T;
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
  }
  return defaultValue;
};
