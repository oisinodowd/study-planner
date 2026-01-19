// Core Types for Smart Study Planner

export type Subject = 
  | 'English'
  | 'Irish'
  | 'Maths'
  | 'Computer Science'
  | 'Business'
  | 'Religion'
  | 'Physical Education';

export type Grade = 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6' | 'H7' | 'H8' | '';

export interface SubjectGrade {
  subject: Subject;
  grade: Grade;
}

export interface StudyTopic {
  id: string;
  subject: Subject;
  name: string;
  description?: string;
  createdAt: string;
  lastStudied?: string;
  nextReview?: string;
  reviewCount: number;
  feynmanExplanations: FeynmanEntry[];
  selfQuizEntries: SelfQuizEntry[];
  notes?: string;
}

export interface FeynmanEntry {
  id: string;
  topicId: string;
  explanation: string;
  createdAt: string;
}

export interface SelfQuizEntry {
  id: string;
  topicId: string;
  content: string;
  createdAt: string;
}

export interface StudySession {
  id: string;
  topicId: string;
  subject: Subject;
  topicName: string;
  scheduledDate: string;
  scheduledTime?: string;
  duration: number; // in minutes
  completed: boolean;
  completedAt?: string;
  isReview: boolean;
  interleavedPlan?: InterleavedBlock[];
}

export interface InterleavedBlock {
  id: string;
  subTopic: string;
  duration: number;
  order: number;
}

export interface Flashcard {
  id: string;
  deckId: string;
  front: string;
  back: string;
  createdAt: string;
  lastReviewed?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface FlashcardDeck {
  id: string;
  subject: Subject;
  name: string;
  description?: string;
  createdAt: string;
  cards: Flashcard[];
}

export interface PracticeTest {
  id: string;
  subject: Subject;
  topic: string;
  date: string;
  score: number;
  maxScore: number;
  notes?: string;
}

export interface PomodoroSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
}

export interface AppState {
  topics: StudyTopic[];
  sessions: StudySession[];
  flashcardDecks: FlashcardDeck[];
  practiceTests: PracticeTest[];
  subjectGrades: SubjectGrade[];
  pomodoroSettings: PomodoroSettings;
  copilotTopicId: string | null;
}

export type ViewMode = 'dashboard' | 'calendar' | 'topics' | 'flashcards' | 'calculator' | 'tests' | 'pomodoro' | 'plan';

// Points calculation
export const GRADE_POINTS: Record<Grade, number> = {
  'H1': 100,
  'H2': 88,
  'H3': 77,
  'H4': 66,
  'H5': 56,
  'H6': 46,
  'H7': 37,
  'H8': 0,
  '': 0,
};

export const MATHS_BONUS_THRESHOLD: Grade[] = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
export const MATHS_BONUS_POINTS = 25;

// Spaced repetition intervals (in days)
export const SRS_INTERVALS = [1, 3, 7, 16, 35];

export const ALL_SUBJECTS: Subject[] = [
  'English',
  'Irish',
  'Maths',
  'Computer Science',
  'Business',
  'Religion',
  'Physical Education',
];
