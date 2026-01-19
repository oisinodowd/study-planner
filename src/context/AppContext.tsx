import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { 
  AppState, 
  StudyTopic, 
  StudySession, 
  FlashcardDeck, 
  Flashcard,
  PracticeTest, 
  SubjectGrade, 
  PomodoroSettings,
  ALL_SUBJECTS
} from '../types';
import { saveToStorage, loadFromStorage, generateId, getNextReviewDate } from '../utils';

// Initial state
const defaultPomodoroSettings: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
};

const initialState: AppState = {
  topics: [],
  sessions: [],
  flashcardDecks: [],
  practiceTests: [],
  subjectGrades: ALL_SUBJECTS.map(subject => ({ subject, grade: '' as const })),
  pomodoroSettings: defaultPomodoroSettings,
  copilotTopicId: null,
};

// Action types
type Action =
  | { type: 'SET_STATE'; payload: AppState }
  | { type: 'ADD_TOPIC'; payload: StudyTopic }
  | { type: 'UPDATE_TOPIC'; payload: StudyTopic }
  | { type: 'DELETE_TOPIC'; payload: string }
  | { type: 'ADD_SESSION'; payload: StudySession }
  | { type: 'UPDATE_SESSION'; payload: StudySession }
  | { type: 'DELETE_SESSION'; payload: string }
  | { type: 'COMPLETE_SESSION'; payload: string }
  | { type: 'ADD_DECK'; payload: FlashcardDeck }
  | { type: 'UPDATE_DECK'; payload: FlashcardDeck }
  | { type: 'DELETE_DECK'; payload: string }
  | { type: 'ADD_CARD_TO_DECK'; payload: { deckId: string; card: Flashcard } }
  | { type: 'UPDATE_CARD'; payload: { deckId: string; card: Flashcard } }
  | { type: 'DELETE_CARD'; payload: { deckId: string; cardId: string } }
  | { type: 'ADD_PRACTICE_TEST'; payload: PracticeTest }
  | { type: 'UPDATE_PRACTICE_TEST'; payload: PracticeTest }
  | { type: 'DELETE_PRACTICE_TEST'; payload: string }
  | { type: 'UPDATE_GRADES'; payload: SubjectGrade[] }
  | { type: 'UPDATE_POMODORO_SETTINGS'; payload: PomodoroSettings }
  | { type: 'ADD_FEYNMAN_ENTRY'; payload: { topicId: string; explanation: string } }
  | { type: 'ADD_SELF_QUIZ_ENTRY'; payload: { topicId: string; content: string } }
  | { type: 'UPDATE_TOPIC_NOTES'; payload: { topicId: string; notes: string } }
  | { type: 'OPEN_COPILOT'; payload: string }
  | { type: 'CLOSE_COPILOT' };

// Reducer
function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;

    case 'ADD_TOPIC':
      return { ...state, topics: [...state.topics, action.payload] };

    case 'UPDATE_TOPIC':
      return {
        ...state,
        topics: state.topics.map(t => t.id === action.payload.id ? action.payload : t),
      };
      
    case 'UPDATE_TOPIC_NOTES':
      return {
        ...state,
        topics: state.topics.map(t =>
          t.id === action.payload.topicId
            ? { ...t, notes: action.payload.notes }
            : t
        ),
      };

    case 'DELETE_TOPIC':
      return {
        ...state,
        topics: state.topics.filter(t => t.id !== action.payload),
        sessions: state.sessions.filter(s => s.topicId !== action.payload),
      };

    case 'ADD_SESSION':
      return { ...state, sessions: [...state.sessions, action.payload] };

    case 'UPDATE_SESSION':
      return {
        ...state,
        sessions: state.sessions.map(s => s.id === action.payload.id ? action.payload : s),
      };

    case 'DELETE_SESSION':
      return {
        ...state,
        sessions: state.sessions.filter(s => s.id !== action.payload),
      };

    case 'COMPLETE_SESSION': {
      const session = state.sessions.find(s => s.id === action.payload);
      if (!session) return state;

      const updatedSessions = state.sessions.map(s => 
        s.id === action.payload 
          ? { ...s, completed: true, completedAt: new Date().toISOString() }
          : s
      );

      // Update topic review count and next review date
      const updatedTopics = state.topics.map(t => {
        if (t.id === session.topicId) {
          const newReviewCount = session.isReview ? t.reviewCount + 1 : t.reviewCount;
          return {
            ...t,
            lastStudied: new Date().toISOString(),
            reviewCount: newReviewCount,
            nextReview: getNextReviewDate(newReviewCount),
          };
        }
        return t;
      });

      return { ...state, sessions: updatedSessions, topics: updatedTopics };
    }

    case 'ADD_DECK':
      return { ...state, flashcardDecks: [...state.flashcardDecks, action.payload] };

    case 'UPDATE_DECK':
      return {
        ...state,
        flashcardDecks: state.flashcardDecks.map(d => 
          d.id === action.payload.id ? action.payload : d
        ),
      };

    case 'DELETE_DECK':
      return {
        ...state,
        flashcardDecks: state.flashcardDecks.filter(d => d.id !== action.payload),
      };

    case 'ADD_CARD_TO_DECK':
      return {
        ...state,
        flashcardDecks: state.flashcardDecks.map(d =>
          d.id === action.payload.deckId
            ? { ...d, cards: [...d.cards, action.payload.card] }
            : d
        ),
      };

    case 'UPDATE_CARD':
      return {
        ...state,
        flashcardDecks: state.flashcardDecks.map(d =>
          d.id === action.payload.deckId
            ? {
                ...d,
                cards: d.cards.map(c =>
                  c.id === action.payload.card.id ? action.payload.card : c
                ),
              }
            : d
        ),
      };

    case 'DELETE_CARD':
      return {
        ...state,
        flashcardDecks: state.flashcardDecks.map(d =>
          d.id === action.payload.deckId
            ? { ...d, cards: d.cards.filter(c => c.id !== action.payload.cardId) }
            : d
        ),
      };

    case 'ADD_PRACTICE_TEST':
      return { ...state, practiceTests: [...state.practiceTests, action.payload] };

    case 'UPDATE_PRACTICE_TEST':
      return {
        ...state,
        practiceTests: state.practiceTests.map(t =>
          t.id === action.payload.id ? action.payload : t
        ),
      };

    case 'DELETE_PRACTICE_TEST':
      return {
        ...state,
        practiceTests: state.practiceTests.filter(t => t.id !== action.payload),
      };

    case 'UPDATE_GRADES':
      return { ...state, subjectGrades: action.payload };

    case 'UPDATE_POMODORO_SETTINGS':
      return { ...state, pomodoroSettings: action.payload };

    case 'ADD_FEYNMAN_ENTRY':
      return {
        ...state,
        topics: state.topics.map(t =>
          t.id === action.payload.topicId
            ? {
                ...t,
                feynmanExplanations: [
                  ...t.feynmanExplanations,
                  {
                    id: generateId(),
                    topicId: action.payload.topicId,
                    explanation: action.payload.explanation,
                    createdAt: new Date().toISOString(),
                  },
                ],
              }
            : t
        ),
      };

    case 'ADD_SELF_QUIZ_ENTRY':
      return {
        ...state,
        topics: state.topics.map(t =>
          t.id === action.payload.topicId
            ? {
                ...t,
                selfQuizEntries: [
                  ...t.selfQuizEntries,
                  {
                    id: generateId(),
                    topicId: action.payload.topicId,
                    content: action.payload.content,
                    createdAt: new Date().toISOString(),
                  },
                ],
              }
            : t
        ),
      };

    case 'OPEN_COPILOT':
      return { ...state, copilotTopicId: action.payload };

    case 'CLOSE_COPILOT':
      return { ...state, copilotTopicId: null };

    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
  // Load from storage on initialization (lazy)
  const init = (defaultState: AppState): AppState => {
    try {
      console.log("Attempting to load state from localStorage (lazy)...");
      const saved = loadFromStorage<AppState | null>(null);
      console.log("Loaded saved state:", saved);
      if (saved) {
        return {
          ...defaultState,
          ...saved,
          copilotTopicId: null, // Always start with copilot closed
        };
      }
    } catch (error) {
      console.error("Failed to initialize state:", error);
    }
    return defaultState;
  };

  const [state, dispatch] = useReducer(reducer, initialState, init);

  // Save to storage on state change
  useEffect(() => {
    console.log("Saving state to localStorage:", state);
    saveToStorage(state);
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
