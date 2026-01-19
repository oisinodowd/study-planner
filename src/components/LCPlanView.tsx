import { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Brain, 
  Clock, 
  List,
  ArrowRight,
  Hammer
} from 'lucide-react';

export function LCPlanView() {
  const [currentPhase, setCurrentPhase] = useState<'cram' | 'foundation'>('cram');
  const [isAuto, setIsAuto] = useState(true);

  useEffect(() => {
    if (isAuto) {
      const now = new Date();
      const mockEndDate = new Date('2026-02-07'); // Feb 7th is start of Phase 2
      setCurrentPhase(now < mockEndDate ? 'cram' : 'foundation');
    }
  }, [isAuto]);

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-cream-50 mb-2">Leaving Cert 2026 Master Plan</h1>
          <p className="text-midnight-300">
            Strategic, logic-based roadmap to your target grades. Weekday-only focus.
          </p>
        </div>
        
        {/* Phase Toggle Control */}
        <div className="flex items-center gap-2 bg-midnight-900/50 p-1.5 rounded-xl border border-midnight-800">
          <button
            onClick={() => setIsAuto(true)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isAuto ? 'bg-sage-500/20 text-sage-300' : 'text-midnight-400 hover:text-cream-200'
            }`}
          >
            Auto (Date)
          </button>
          <div className="w-px h-4 bg-midnight-800" />
          <button
            onClick={() => { setIsAuto(false); setCurrentPhase('cram'); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              !isAuto && currentPhase === 'cram' ? 'bg-terracotta-500/20 text-terracotta-300' : 'text-midnight-400 hover:text-cream-200'
            }`}
          >
            Phase 1
          </button>
          <button
            onClick={() => { setIsAuto(false); setCurrentPhase('foundation'); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              !isAuto && currentPhase === 'foundation' ? 'bg-sage-500/20 text-sage-300' : 'text-midnight-400 hover:text-cream-200'
            }`}
          >
            Phase 2
          </button>
        </div>
      </header>

      {currentPhase === 'cram' ? <Phase1Content /> : <Phase2Content />}
    </div>
  );
}

function Phase1Content() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Immediate Priority Banner */}
      <div className="bg-gradient-to-r from-terracotta-900/40 to-terracotta-800/20 border border-terracotta-700/50 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-terracotta-500/20 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-terracotta-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-terracotta-100 mb-2">Phase 1: The "Mock Cram" (Jan 17 – Feb 6)</h2>
            <p className="text-terracotta-200/80 mb-4">
              Goal: Maximise marks in the shortest time. Focus on exam technique and banking marks in known chapters.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-midnight-950/50 p-4 rounded-xl border border-terracotta-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-cream-100">Maths</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-terracotta-500/20 text-terracotta-300">Immediate</span>
                </div>
                <p className="text-sm text-midnight-300">Fix <strong className="text-cream-100">Complex Numbers</strong> (De Moivre) & <strong className="text-cream-100">Circle</strong>.</p>
              </div>
              <div className="bg-midnight-950/50 p-4 rounded-xl border border-terracotta-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-cream-100">English</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-terracotta-500/20 text-terracotta-300">Cram</span>
                </div>
                <p className="text-sm text-midnight-300">5 key <strong className="text-cream-100">Macbeth</strong> quotes (Ambition, Kingship).</p>
              </div>
              <div className="bg-midnight-950/50 p-4 rounded-xl border border-terracotta-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-cream-100">Comp. Sci</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-terracotta-500/20 text-terracotta-300">Practice</span>
                </div>
                <p className="text-sm text-midnight-300">2 full <strong className="text-cream-100">Section C (Python)</strong> questions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="bg-midnight-900/50 border border-midnight-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-midnight-800">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-sage-400" />
            <h3 className="text-lg font-semibold text-cream-100">Weekly Schedule: Mock Cram Mode</h3>
          </div>
          <p className="text-sm text-midnight-400 mt-1">Weekdays: 7:30 pm – 10:00 pm (2 subjects, 1h 10m each)</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-midnight-950/50 text-midnight-400 text-sm">
                <th className="p-4 font-medium border-b border-midnight-800">Day</th>
                <th className="p-4 font-medium border-b border-midnight-800">Slot 1 (7:30 – 8:40)</th>
                <th className="p-4 font-medium border-b border-midnight-800">Slot 2 (8:50 – 10:00)</th>
                <th className="p-4 font-medium border-b border-midnight-800">Focus Topic</th>
              </tr>
            </thead>
            <tbody className="text-sm text-cream-200 divide-y divide-midnight-800">
              <tr>
                <td className="p-4 font-medium text-sage-300">Mon</td>
                <td className="p-4">Maths</td>
                <td className="p-4">English</td>
                <td className="p-4 text-midnight-300">Complex Numbers / Macbeth Character</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-sage-300">Tue</td>
                <td className="p-4">Comp. Sci</td>
                <td className="p-4">Maths</td>
                <td className="p-4 text-midnight-300">Python (Files/Lists) / Circle Geometry</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-sage-300">Wed</td>
                <td className="p-4">Business</td>
                <td className="p-4">Religion</td>
                <td className="p-4 text-midnight-300">ABQ (Units 5,6,7) / Search for Meaning</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-sage-300">Thu</td>
                <td className="p-4">Maths</td>
                <td className="p-4">PE</td>
                <td className="p-4 text-midnight-300">Calculus / Physical Activity Project</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-sage-300">Fri</td>
                <td className="p-4">English</td>
                <td className="p-4">Business</td>
                <td className="p-4 text-midnight-300">Ní Chuilleanáin / Ratio Analysis</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Weekend Block */}
      <div className="bg-midnight-900/50 border border-midnight-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-cream-100 mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-sage-400" />
          Weekend High Volume Blocks
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-midnight-950 p-5 rounded-xl border-l-4 border-sage-500">
            <h4 className="font-bold text-sage-300 mb-3">Saturday</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="text-midnight-400 font-mono">10:00</span>
                <span className="text-cream-200">Maths (Paper 1): Complex Numbers & Algebra Qs</span>
              </li>
              <li className="flex gap-3">
                <span className="text-midnight-400 font-mono">14:00</span>
                <span className="text-cream-200">Comp Sci: 2022 Section C run-through</span>
              </li>
              <li className="flex gap-3">
                <span className="text-midnight-400 font-mono">19:00</span>
                <span className="text-cream-200">English: Heaney & Meehan + 1 Intro</span>
              </li>
            </ul>
          </div>
          <div className="bg-midnight-950 p-5 rounded-xl border-l-4 border-terracotta-500">
            <h4 className="font-bold text-terracotta-300 mb-3">Sunday</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="text-midnight-400 font-mono">10:00</span>
                <span className="text-cream-200">Maths (Paper 2): Circle & Trig</span>
              </li>
              <li className="flex gap-3">
                <span className="text-midnight-400 font-mono">14:00</span>
                <span className="text-cream-200">Business: 1 full ABQ (40 mins strict)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-midnight-400 font-mono">19:00</span>
                <span className="text-cream-200">Review weak spots & Plan next week</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Phase2Content() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      {/* Foundation Banner */}
      <div className="bg-gradient-to-r from-sage-900/40 to-sage-800/20 border border-sage-700/50 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-sage-500/20 rounded-xl">
            <Hammer className="w-6 h-6 text-sage-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-sage-100 mb-2">Phase 2: Post-Mock Repair & Foundation (Feb – April)</h2>
            <p className="text-sage-200/80 mb-4">
              Goal: Fix what the Mocks exposed. Build the "H1/H2" layer. Stop cramming, start understanding.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-midnight-950/50 p-4 rounded-xl border border-sage-800/30">
                <h4 className="font-bold text-sage-200 mb-2">Primary Shifts</h4>
                <ul className="space-y-1 text-sm text-midnight-300">
                  <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3"/> New Poet: <span className="text-cream-100">John Donne</span> (Logical/Metaphysical)</li>
                  <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3"/> Maths: Deep dive <span className="text-cream-100">Algebra & Calculus</span> (50% of marks)</li>
                  <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3"/> CS: <span className="text-cream-100">Sorting Algorithms</span> (Bubble/Insertion)</li>
                </ul>
              </div>
              <div className="bg-midnight-950/50 p-4 rounded-xl border border-sage-800/30">
                <h4 className="font-bold text-sage-200 mb-2">Weekends</h4>
                <p className="text-sm text-midnight-300">
                   Shift from volume to <span className="text-cream-100">Depth</span>. 1 full past paper every Saturday morning (rotate subjects).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logic-First Master Checklist (Phase 2) */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-cream-100 flex items-center gap-2">
          <List className="w-5 h-5 text-sage-400" />
          Phase 2 Priorities: The "H1/H2" Layer
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Maths */}
          <div className="bg-midnight-900/30 border border-midnight-800 p-5 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-cream-100">Mathematics (H3)</h4>
              <span className="text-xs bg-sage-500/10 text-sage-300 px-2 py-1 rounded">Target: Logic</span>
            </div>
            <ul className="space-y-2 text-sm text-midnight-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-terracotta-500" />
                <span className="text-cream-200 font-medium">Algebra (Indices, Logs, Inequalities)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-terracotta-500" />
                <span className="text-cream-200 font-medium">Calculus (Diff & Integration)</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-midnight-600" />
                <span>Coordinate Geometry (Map formulas)</span>
              </li>
            </ul>
          </div>

          {/* English */}
          <div className="bg-midnight-900/30 border border-midnight-800 p-5 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-cream-100">English (H2)</h4>
              <span className="text-xs bg-sage-500/10 text-sage-300 px-2 py-1 rounded">Target: Structure</span>
            </div>
            <ul className="space-y-2 text-sm text-midnight-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-terracotta-500" />
                <span className="text-cream-200 font-medium">John Donne (Study 6 poems)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-terracotta-500" />
                <span className="text-cream-200 font-medium">Macbeth: "Disintegration of Mind"</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-midnight-600" />
                <span>Comparative: Cultural Context</span>
              </li>
            </ul>
          </div>

          {/* Computer Science */}
          <div className="bg-midnight-900/30 border border-midnight-800 p-5 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-cream-100">Computer Science (H1)</h4>
              <span className="text-xs bg-sage-500/10 text-sage-300 px-2 py-1 rounded">Target: Code</span>
            </div>
            <ul className="space-y-2 text-sm text-midnight-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-terracotta-500" />
                <span className="text-cream-200 font-medium">Algs: Linear Search, Bubble Sort</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-terracotta-500" />
                <span className="text-cream-200 font-medium">Pandas/CSV Manipulation</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-midnight-600" />
                <span>Von Neumann Architecture</span>
              </li>
            </ul>
          </div>

           {/* Business */}
           <div className="bg-midnight-900/30 border border-midnight-800 p-5 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-cream-100">Business (H2)</h4>
              <span className="text-xs bg-sage-500/10 text-sage-300 px-2 py-1 rounded">Target: Application</span>
            </div>
            <ul className="space-y-2 text-sm text-midnight-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-terracotta-500" />
                <span className="text-cream-200 font-medium">Management & Marketing Qs</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-terracotta-500" />
                <span className="text-cream-200 font-medium">Link Case Study to Theory</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
