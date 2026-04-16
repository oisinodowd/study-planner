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
  const [currentPhase, setCurrentPhase] = useState<'cram' | 'foundation' | 'stretch'>('stretch');
  const [isAuto, setIsAuto] = useState(true);

  useEffect(() => {
    if (isAuto) {
      const now = new Date();
      const phase2Start = new Date('2026-02-07');
      const phase3Start = new Date('2026-04-15');
      
      if (now < phase2Start) {
        setCurrentPhase('cram');
      } else if (now < phase3Start) {
        setCurrentPhase('foundation');
      } else {
        setCurrentPhase('stretch');
      }
    }
  }, [isAuto]);

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-cream-50 mb-2">Leaving Cert 2026 Master Plan</h1>
          <p className="text-midnight-300">
            Strategic, logic-based roadmap to your target grades. Personalized for Oisin.
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
            Auto
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
          <button
            onClick={() => { setIsAuto(false); setCurrentPhase('stretch'); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              !isAuto && currentPhase === 'stretch' ? 'bg-gold-500/20 text-gold-300' : 'text-midnight-400 hover:text-cream-200'
            }`}
          >
            Phase 3
          </button>
        </div>
      </header>

      {currentPhase === 'cram' && <Phase1Content />}
      {currentPhase === 'foundation' && <Phase2Content />}
      {currentPhase === 'stretch' && <Phase3Content />}
    </div>
  );
}

function Phase3Content() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Final Stretch Banner */}
      <div className="bg-gradient-to-r from-gold-900/40 to-gold-800/20 border border-gold-700/50 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gold-500/20 rounded-xl">
            <Brain className="w-6 h-6 text-gold-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gold-100 mb-2">Phase 3: The Final Stretch (April 21 – June Exams)</h2>
            <p className="text-gold-200/80 mb-4">
              Goal: Peak performance. Aggressive active recall, timed papers, and surgical gap closure. 7 weeks to H1.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-midnight-950/50 p-4 rounded-xl border border-gold-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-cream-100">Maths</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300">High Yield</span>
                </div>
                <p className="text-sm text-midnight-300">Master <strong className="text-cream-100">Probability & Stats</strong> (P2) and <strong className="text-cream-100">Calculus</strong> (P1).</p>
              </div>
              <div className="bg-midnight-950/50 p-4 rounded-xl border border-gold-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-cream-100">Business</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300">ABQ</span>
                </div>
                <p className="text-sm text-midnight-300">Units <strong className="text-cream-100">3, 4, 5</strong> intensive practice. 20% of marks.</p>
              </div>
              <div className="bg-midnight-950/50 p-4 rounded-xl border border-gold-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-cream-100">LC PE</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300">Theory</span>
                </div>
                <p className="text-sm text-midnight-300">Link <strong className="text-cream-100">Biomechanics</strong> to actual performance examples.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Week Roadmap */}
      <div className="bg-midnight-900/50 border border-midnight-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-midnight-800">
          <div className="flex items-center gap-3">
            <List className="w-5 h-5 text-gold-400" />
            <h3 className="text-lg font-semibold text-cream-100">The 7-Week Master Roadmap</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-midnight-950/50 text-midnight-400 text-sm">
                <th className="p-4 font-medium border-b border-midnight-800">Week</th>
                <th className="p-4 font-medium border-b border-midnight-800">Theme</th>
                <th className="p-4 font-medium border-b border-midnight-800">Primary Goal</th>
              </tr>
            </thead>
            <tbody className="text-sm text-cream-200 divide-y divide-midnight-800">
              <tr>
                <td className="p-4 font-medium text-gold-300 whitespace-nowrap">Week 1 (Apr 21)</td>
                <td className="p-4">Foundation</td>
                <td className="p-4 text-midnight-300">Consolidate Unit 3-5 Business & PE Strand 1.</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-gold-300 whitespace-nowrap">Week 2 (Apr 28)</td>
                <td className="p-4">The Core</td>
                <td className="p-4 text-midnight-300">Maths Calculus/Algebra & English Comparative modes.</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-gold-300 whitespace-nowrap">Week 3 (May 5)</td>
                <td className="p-4">Expansion</td>
                <td className="p-4 text-midnight-300">Religion Case Studies & CS Algorithms.</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-gold-300 whitespace-nowrap">Week 4 (May 12)</td>
                <td className="p-4">Active Recall</td>
                <td className="p-4 text-midnight-300">Past Paper "Short Question" blitz across all subjects.</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-gold-300 whitespace-nowrap">Week 5 (May 19)</td>
                <td className="p-4">High Pressure</td>
                <td className="p-4 text-midnight-300">Timed Long Questions (English Paper 2 / Business).</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-gold-300 whitespace-nowrap">Week 6 (May 26)</td>
                <td className="p-4">Gap Closure</td>
                <td className="p-4 text-midnight-300">Traffic Light Review: Focus ONLY on "Red" (weak) topics.</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-gold-300 whitespace-nowrap">Week 7 (June 2)</td>
                <td className="p-4">Pre-Game</td>
                <td className="p-4 text-midnight-300">Light Review, Sleep, and Exam Simulations.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Week-by-Week Breakdown */}
      <div className="bg-midnight-900/50 border border-midnight-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-midnight-800">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gold-400" />
            <h3 className="text-lg font-semibold text-cream-100">Detailed Weekly Breakdown</h3>
          </div>
          <p className="text-sm text-midnight-400 mt-1">Weekday sessions capped at 2.5 hours, weekend sessions as 2 blocks of 2.5–3 hours.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-midnight-950/50 text-midnight-400 text-sm">
                <th className="p-4 font-medium border-b border-midnight-800">Week 1 (Apr 21-27)</th>
                <th className="p-4 font-medium border-b border-midnight-800">Subject & Task</th>
              </tr>
            </thead>
            <tbody className="text-sm text-cream-200 divide-y divide-midnight-800">
              <tr>
                <td className="p-4 font-medium text-gold-300">Monday</td>
                <td className="p-4 text-midnight-300">Business — ABQ Unit 3 practice (2024 & 2023 papers, timed 40 mins each)</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-gold-300">Tuesday</td>
                <td className="p-4 text-midnight-300">Maths P1 — Calculus: Differentiation rules & applications, Rate of Change (1.5 hrs). Solve 5 past questions.</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-gold-300">Wednesday</td>
                <td className="p-4 text-midnight-300">English P2 — Poetry: 1 Poet (e.g., Mahon/Plath). Study 4 poems, plan 3 essay titles. (2.5 hrs)</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-gold-300">Thursday</td>
                <td className="p-4 text-red-400 font-bold">REST DAY — NON-NEGOTIABLE COGNITIVE RECOVERY</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-gold-300">Friday</td>
                <td className="p-4 text-midnight-300">LC PE — Biomechanics: Levers, Force application. Define 10 key terms, create 3 mind maps. (2.5 hrs)</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-gold-300">Saturday (AM)</td>
                <td className="p-4 text-midnight-300">Religion — Christianity: Origins, Jesus' teachings. Case study analysis (1.5 hrs).</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-gold-300">Saturday (PM)</td>
                <td className="p-4 text-midnight-300">Computer Science — Python: Sorting algorithms (Bubble/Insertion). Implement 2 from memory. (1.5 hrs)</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-gold-300">Sunday (AM)</td>
                <td className="p-4 text-midnight-300">Maths P2 — Probability & Statistics: Key formulas, apply to short questions (1.5 hrs).</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-gold-300">Sunday (PM)</td>
                <td className="p-4 text-midnight-300">Business — Long Questions: Management section, plan 2 essay responses. Weekly review. (1.5 hrs)</td>
              </tr>
            </tbody>
          </table>
          {/* Add more weeks here... */}
        </div>
      </div>

      {/* Daily Structure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-midnight-900/50 border border-midnight-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-cream-100 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gold-400" />
            Daily High-Performance Block
          </h3>
          <ul className="space-y-3 text-sm text-midnight-300">
            <li className="flex gap-3"><span className="text-gold-500 font-bold">01</span><span><strong>Ritual (5m):</strong> Phone away. One specific goal.</span></li>
            <li className="flex gap-3"><span className="text-gold-500 font-bold">02</span><span><strong>Sprint 1 (50m):</strong> Deep work. No distractions.</span></li>
            <li className="flex gap-3"><span className="text-gold-500 font-bold">03</span><span><strong>Recovery (10m):</strong> Move. Stretch. Hydrate.</span></li>
            <li className="flex gap-3"><span className="text-gold-500 font-bold">04</span><span><strong>Sprint 2 (50m):</strong> Past paper application.</span></li>
            <li className="flex gap-3"><span className="text-gold-500 font-bold">05</span><span><strong>Review (15m):</strong> The Blurting Method review.</span></li>
          </ul>
        </div>
        
        <div className="bg-midnight-900/50 border border-midnight-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-cream-100 mb-4 flex items-center gap-2">
            <Hammer className="w-5 h-5 text-gold-400" />
            Peak Performance System
          </h3>
          <div className="space-y-4">
            <div className="bg-midnight-950/50 p-3 rounded-lg border border-midnight-800">
              <span className="text-xs font-bold text-gold-500 uppercase tracking-wider">Low Motivation Protocol</span>
              <p className="text-sm text-cream-200 mt-1">If low motivation hits, do 20 mins of low-friction tasks (e.g., Business Short Qs, CS Logic Gates). Keep the habit alive.</p>
            </div>
            <div className="bg-midnight-950/50 p-3 rounded-lg border border-midnight-800">
              <span className="text-xs font-bold text-gold-500 uppercase tracking-wider">Exercise Asset</span>
              <p className="text-sm text-cream-200 mt-1">Physical activity is your competitive advantage. Keep training regularly to clear cortisol (stress hormone) and improve blood flow to the brain.</p>
            </div>
            <div className="bg-midnight-950/50 p-3 rounded-lg border border-midnight-800">
              <span className="text-xs font-bold text-gold-500 uppercase tracking-wider">The "Next Play" Mentality</span>
              <p className="text-sm text-cream-200 mt-1">Don't let a bad session ruin the next. Reset immediately. Eyes on the H1.</p>
            </div>
            <div className="bg-midnight-950/50 p-3 rounded-lg border border-midnight-800">
              <span className="text-xs font-bold text-gold-500 uppercase tracking-wider">Weekly Check-in & Gamification</span>
              <p className="text-sm text-cream-200 mt-1">On Sunday evenings: assess progress (What went well? Where did I slip?). Gamify by assigning points (10 pts/50-min block, 20 pts/timed paper). Aim for 150 pts weekly to earn your Sunday night off.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subject-Specific Exam Technique Guides */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-cream-100 flex items-center gap-2">
          <Hammer className="w-5 h-5 text-gold-400" />
          Subject-Specific Exam Technique Guides
        </h3>
        
        {/* English */}
        <div className="bg-midnight-900/30 border border-midnight-800 p-5 rounded-xl">
          <h4 className="font-bold text-cream-100 mb-2">English: Maximising Marks</h4>
          <ul className="space-y-2 text-sm text-midnight-300">
            <li><strong className="text-cream-200">Comparative Essay:</strong> Avoid plot summary. Use the "PQE" method (Point, Quote, Explain). Quote short snippets (3-5 words). Structure: Intro (thesis), 3-4 body paragraphs (mode-focused, e.g., Cultural Context), Conclusion (reiterate thesis). Correctors want sophisticated analysis, not just recall.</li>
            <li><strong className="text-cream-200">Single Text:</strong> Depth over breadth. Focus on 2-3 key themes/characters. Use strong topic sentences. Integrate quotes seamlessly. Show understanding of literary techniques (symbolism, imagery).</li>
            <li><strong className="text-cream-200">Poetry:</strong> Master 5 poets. Focus on the language, imagery, and theme. Link to broader human experience. Structure: Intro (poet's style, theme), stanza-by-stanza analysis, conclusion (overall impact).</li>
          </ul>
        </div>

        {/* Business */}
        <div className="bg-midnight-900/30 border border-midnight-800 p-5 rounded-xl">
          <h4 className="font-bold text-cream-100 mb-2">Business: Mastering the ABQ</h4>
          <ul className="space-y-2 text-sm text-midnight-300">
            <li><strong className="text-cream-200">Approach:</strong> Highlight key information in the text. Use the exact names of people/companies from the text in your answers. Link theory to the case study explicitly (e.g., "As seen in the text, John exhibits transformational leadership by...").</li>
            <li><strong className="text-cream-200">Timing:</strong> Strict 40 minutes for the ABQ. Practice this to avoid overrunning.</li>
            <li><strong className="text-cream-200">Common Errors:</strong> Not linking answers to the text, simply stating theory without application, poor time management.</li>
            <li><strong className="text-cream-200">Mark Allocation:</strong> Be aware of marks for definitions vs. application. Use the "S.E.E." method (State, Explain, Example) consistently.</li>
          </ul>
        </div>

        {/* Maths */}
        <div className="bg-midnight-900/30 border border-midnight-800 p-5 rounded-xl">
          <h4 className="font-bold text-cream-100 mb-2">Mathematics: Exam Pacing & Strategy</h4>
          <ul className="space-y-2 text-sm text-midnight-300">
            <li><strong className="text-cream-200">Pacing:</strong> Use the 10-minute rule. If you're stuck for more than 10 minutes on a question, move on. Come back later. Attempt every part of every question; partial marks are crucial.</li>
            <li><strong className="text-cream-200">Stuck on a Question:</strong> Write down all relevant formulas from the Log Tables. Draw a diagram if applicable. Check previous parts of the question for clues.</li>
            <li><strong className="text-cream-200">Prioritisation:</strong> Paper 1: Algebra, Calculus. Paper 2: Probability & Statistics, Coordinate Geometry. These carry the most marks.</li>
          </ul>
        </div>

        {/* Computer Science */}
        <div className="bg-midnight-900/30 border border-midnight-800 p-5 rounded-xl">
          <h4 className="font-bold text-cream-100 mb-2">Computer Science: Written Exam Approach</h4>
          <ul className="space-y-2 text-sm text-midnight-300">
            <li><strong className="text-cream-200">What's Tested:</strong> Not just coding. Understanding of computational thinking, algorithms, data structures, computer systems, and societal impact.</li>
            <li><strong className="text-cream-200">Algorithm/Programming Qs:</strong> Explain your logic clearly. Use comments in pseudo-code or Python. Break down complex problems into smaller, manageable steps. Focus on correctness over perfect syntax in written answers.</li>
            <li><strong className="text-cream-200">Common Mistakes:</strong> Overlooking non-coding theory questions, vague explanations, not showing working for algorithm traces.</li>
          </ul>
        </div>

        {/* LC PE */}
        <div className="bg-midnight-900/30 border border-midnight-800 p-5 rounded-xl">
          <h4 className="font-bold text-cream-100 mb-2">LC PE: High-Scoring Answers</h4>
          <ul className="space-y-2 text-sm text-midnight-300">
            <li><strong className="text-cream-200">Performance Analysis:</strong> Link theory directly to performance examples. Use specific terminology (e.g., "positive reinforcement," "arousal regulation"). Describe impact on performance.</li>
            <li><strong className="text-cream-200">Physical Activity for Health:</strong> Discuss benefits (physical, mental, social). Apply to different populations. Use key vocabulary (e.g., "sedentary lifestyle," "cardiovascular health").</li>
            <li><strong className="text-cream-200">Structure:</strong> Clear introduction, well-developed paragraphs with evidence, strong conclusion. Align with marking scheme by hitting all keywords.</li>
          </ul>
        </div>

        {/* Religion */}
        <div className="bg-midnight-900/30 border border-midnight-800 p-5 rounded-xl">
          <h4 className="font-bold text-cream-100 mb-2">Religion: Long Answer Structure</h4>
          <ul className="space-y-2 text-sm text-midnight-300">
            <li><strong className="text-cream-200">Examiner's Expectations:</strong> Critical analysis, not just description. Demonstrate understanding of different perspectives. Use academic language.</li>
            <li><strong className="text-cream-200">Paragraph Structure:</strong> Topic sentence, explanation, evidence (quote from text/theologian), analysis, link back to question.</li>
            <li><strong className="text-cream-200">Using Evidence:</strong> Integrate quotes and references smoothly. Show how evidence supports your point. For World Religions, clearly distinguish between different traditions.</li>
          </ul>
        </div>
      </div>

      {/* Emergency Cramming Protocols */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-cream-100 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-gold-400" />
          Emergency Cramming Protocols (48 Hours Pre-Exam)
        </h3>
        
        {/* Maths Cram */}
        <div className="bg-midnight-900/30 border border-midnight-800 p-5 rounded-xl">
          <h4 className="font-bold text-cream-100 mb-2">Maths: 48-Hour Survival</h4>
          <ul className="space-y-2 text-sm text-midnight-300">
            <li><strong className="text-cream-200">Minimum Topics for H2:</strong> Do not learn new topics. Focus on "guarantee" questions: Complex Numbers (De Moivre), Financial Maths (compound interest, loans), Probability & Statistics (basic theorems, expected value).</li>
            <li><strong className="text-cream-200">Question Types:</strong> Practice 5-10 short questions from each guaranteed topic. Work through full solutions to understand common pitfalls.</li>
            <li><strong className="text-cream-200">What NOT to Waste Time On:</strong> Proofs by induction (unless already mastered), obscure geometry theorems, rarely appearing topics.</li>
            <li><strong className="text-cream-200">Sleep/Nutrition:</strong> Prioritize sleep (7-8 hours). Light, protein-rich meals. Stay hydrated. Avoid heavy meals and excess caffeine which can cause a crash.</li>
          </ul>
        </div>

        {/* English Cram */}
        <div className="bg-midnight-900/30 border border-midnight-800 p-5 rounded-xl">
          <h4 className="font-bold text-cream-100 mb-2">English: 48-Hour Survival</h4>
          <ul className="space-y-2 text-sm text-midnight-300">
            <li><strong className="text-cream-200">Minimum Topics for H2:</strong> Re-read your single text key scenes. Revisit 3 comparative modes. Refresh 3-4 key poems from your studied poets.</li>
            <li><strong className="text-cream-200">Question Types:</strong> Practice essay planning for comparative (theme/issue), single text (character/relationship), and poetry (theme/style). Focus on intros and conclusions.</li>
            <li><strong className="text-cream-200">What NOT to Waste Time On:</strong> Re-reading entire novels/plays, memorising new quotes for every minor character. Focus on versatility.</li>
            <li><strong className="text-cream-200">Sleep/Nutrition:</strong> Consistent sleep. Brain food: fruits, nuts. Light exercise to boost circulation.</li>
          </ul>
        </div>

        {/* Business Cram */}
        <div className="bg-midnight-900/30 border border-midnight-800 p-5 rounded-xl">
          <h4 className="font-bold text-cream-100 mb-2">Business: 48-Hour Survival</h4>
          <ul className="space-y-2 text-sm text-midnight-300">
            <li><strong className="text-cream-200">Minimum Topics for H2:</strong> Master the ABQ format. Review Units 3, 4, 5. Skim through key definitions for short questions.</li>
            <li><strong className="text-cream-200">Question Types:</strong> Practice 2-3 full ABQs under timed conditions. Review short question solutions from the last 5 years.</li>
            <li><strong className="text-cream-200">What NOT to Waste Time On:</strong> Rote memorisation of every single theory. Focus on understanding and application.</li>
            <li><strong className="text-cream-200">Sleep/Nutrition:</strong> Good sleep. Balanced meals. Hydration. Avoid last-minute cramming past a reasonable hour.</li>
          </ul>
        </div>

        {/* Computer Science Cram */}
        <div className="bg-midnight-900/30 border border-midnight-800 p-5 rounded-xl">
          <h4 className="font-bold text-cream-100 mb-2">Computer Science: 48-Hour Survival</h4>
          <ul className="space-y-2 text-sm text-midnight-300">
            <li><strong className="text-cream-200">Minimum Topics for H2:</strong> Revise Python basics (loops, conditions, functions). Review Big O Notation. Key computer architecture concepts (CPU, RAM).</li>
            <li><strong className="text-cream-200">Question Types:</strong> Practice 2-3 full Section C programming questions. Trace simple algorithms by hand.</li>
            <li><strong className="text-cream-200">What NOT to Waste Time On:</strong> Debugging complex personal projects, exploring niche libraries. Stick to core concepts.</li>
            <li><strong className="text-cream-200">Sleep/Nutrition:</strong> Adequate sleep. Stay mentally alert with healthy snacks.</li>
          </ul>
        </div>

        {/* LC PE Cram */}
        <div className="bg-midnight-900/30 border border-midnight-800 p-5 rounded-xl">
          <h4 className="font-bold text-cream-100 mb-2">LC PE: 48-Hour Survival</h4>
          <ul className="space-y-2 text-sm text-midnight-300">
            <li><strong className="text-cream-200">Minimum Topics for H2:</strong> Focus on definitions and practical applications for Biomechanics, Sports Psychology (Arousal, Anxiety), and Diet/Nutrition.</li>
            <li><strong className="text-cream-200">Question Types:</strong> Practice 2-3 long questions by planning key points and vocabulary. Review case studies linking theory to performance.</li>
            <li><strong className="text-cream-200">What NOT to Waste Time On:</strong> Reading lengthy research papers. Focus on concise, clear explanations.</li>
            <li><strong className="text-cream-200">Sleep/Nutrition:</strong> Good sleep. Ensure good energy levels for mental recall.</li>
          </ul>
        </div>

        {/* Religion Cram */}
        <div className="bg-midnight-900/30 border border-midnight-800 p-5 rounded-xl">
          <h4 className="font-bold text-cream-100 mb-2">Religion: 48-Hour Survival</h4>
          <ul className="space-y-2 text-sm text-midnight-300">
            <li><strong className="text-cream-200">Minimum Topics for H2:</strong> Re-read notes on World Religions (Islam, Judaism), Search for Meaning (key philosophers), and Moral Decision Making.</li>
            <li><strong className="text-cream-200">Question Types:</strong> Plan 2-3 long essay answers. Focus on structuring arguments and integrating evidence.</li>
            <li><strong className="text-cream-200">What NOT to Waste Time On:</strong> Deep dives into obscure theological debates. Stick to core curriculum.</li>
            <li><strong className="text-cream-200">Sleep/Nutrition:</strong> Adequate rest. Maintain focus with regular, light meals.</li>
          </ul>
        </div>
      </div>
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
