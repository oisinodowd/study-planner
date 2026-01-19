import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CalendarView } from './components/CalendarView';
import { TopicsView } from './components/TopicsView';
import { FlashcardsView } from './components/FlashcardsView';
import { PointsCalculator } from './components/PointsCalculator';
import { PracticeTestsView } from './components/PracticeTestsView';
import { PomodoroView } from './components/PomodoroView';
import { LCPlanView } from './components/LCPlanView';
import { AICopilotModal } from './components/ai/AICopilotModal';
import { ViewMode } from './types';

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const { state, dispatch } = useApp();

  const copilotTopic = state.copilotTopicId 
    ? state.topics.find(t => t.id === state.copilotTopicId) 
    : null;

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} />;
      case 'calendar':
        return <CalendarView />;
      case 'plan':
        return <LCPlanView />;
      case 'topics':
        return <TopicsView />;
      case 'flashcards':
        return <FlashcardsView />;
      case 'calculator':
        return <PointsCalculator />;
      case 'tests':
        return <PracticeTestsView />;
      case 'pomodoro':
        return <PomodoroView />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-animated-gradient noise-overlay">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {renderView()}
        </div>
      </main>
      
      {copilotTopic && (
        <AICopilotModal
          topicName={copilotTopic.name}
          onClose={() => dispatch({ type: 'CLOSE_COPILOT' })}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
