import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  Layers, 
  Calculator, 
  ClipboardList,
  Timer,
  GraduationCap,
  Map
} from 'lucide-react';
import { ViewMode } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const navItems: { id: ViewMode; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'plan', label: 'LC 2026 Plan', icon: Map },
  { id: 'topics', label: 'Topics', icon: BookOpen },
  { id: 'flashcards', label: 'Flashcards', icon: Layers },
  { id: 'tests', label: 'Practice Tests', icon: ClipboardList },
  { id: 'calculator', label: 'Points Calculator', icon: Calculator },
  { id: 'pomodoro', label: 'Pomodoro Timer', icon: Timer },
];

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-midnight-950 border-r border-midnight-800 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-midnight-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sage-500 to-terracotta-500 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold text-cream-50">StudyFlow</h1>
            <p className="text-xs text-midnight-400 font-body">Smart Study Planner</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left
                    font-body text-sm transition-all duration-200
                    ${isActive 
                      ? 'bg-sage-600/20 text-sage-300' 
                      : 'text-midnight-300 hover:bg-midnight-800/50 hover:text-cream-100'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-sage-400' : ''}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-sage-400"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-midnight-800">
        <div className="bg-gradient-to-br from-sage-900/50 to-terracotta-900/30 rounded-xl p-4">
          <p className="text-xs text-cream-200/70 font-body leading-relaxed">
            Leaving Cert 2026
          </p>
          <p className="text-sm text-cream-100 font-body mt-1">
            Stay focused. You've got this.
          </p>
        </div>
      </div>
    </aside>
  );
}
