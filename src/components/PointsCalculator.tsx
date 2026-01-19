import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Award, TrendingUp, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculatePoints, getSubjectColor } from '../utils';
import { Grade, GRADE_POINTS } from '../types';

const GRADES: Grade[] = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8'];

export function PointsCalculator() {
  const { state, dispatch } = useApp();

  const result = useMemo(() => {
    return calculatePoints(state.subjectGrades);
  }, [state.subjectGrades]);

  const handleGradeChange = (subject: string, grade: Grade) => {
    const newGrades = state.subjectGrades.map(sg =>
      sg.subject === subject ? { ...sg, grade } : sg
    );
    dispatch({ type: 'UPDATE_GRADES', payload: newGrades });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const maxPoints = 625;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-midnight-900">
            LC Points Calculator
          </h1>
          <p className="text-midnight-500 font-body mt-1">
            Calculate your Leaving Certificate points
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="col-span-2">
          <div className="bg-white rounded-2xl border border-midnight-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-midnight-100">
              <h2 className="font-display text-lg font-semibold text-midnight-900">
                Enter Your Grades
              </h2>
              <p className="text-sm text-midnight-500 font-body mt-1">
                Select your expected or achieved grade for each subject
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {state.subjectGrades.map((sg) => {
                  const points = sg.grade ? GRADE_POINTS[sg.grade] : 0;
                  const isInTopSix = result.breakdown.some(b => b.subject === sg.subject);
                  const isMathsBonus = sg.subject === 'Maths' && result.bonusApplied;

                  return (
                    <motion.div
                      key={sg.subject}
                      variants={itemVariants}
                      className={`
                        flex items-center gap-4 p-4 rounded-xl border transition-all
                        ${isInTopSix 
                          ? 'bg-sage-50 border-sage-200' 
                          : 'bg-midnight-50 border-midnight-100'
                        }
                      `}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-body font-semibold text-midnight-800">
                            {sg.subject}
                          </h3>
                          {isInTopSix && (
                            <Star className="w-4 h-4 text-sage-500 fill-sage-500" />
                          )}
                          {isMathsBonus && (
                            <span className="text-xs px-2 py-0.5 bg-terracotta-100 text-terracotta-700 rounded-full font-body">
                              +25 Bonus
                            </span>
                          )}
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full border mt-1 inline-block ${getSubjectColor(sg.subject)}`}>
                          Higher Level
                        </span>
                      </div>

                      <select
                        value={sg.grade}
                        onChange={(e) => handleGradeChange(sg.subject, e.target.value as Grade)}
                        className="px-4 py-2 bg-white border border-midnight-200 rounded-xl font-body text-midnight-700 focus:outline-none focus:ring-2 focus:ring-sage-500 min-w-[100px]"
                      >
                        <option value="">--</option>
                        {GRADES.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>

                      <div className="w-16 text-right">
                        <span className="font-display font-semibold text-midnight-800">
                          {points}
                        </span>
                        <span className="text-xs text-midnight-500 font-body block">
                          points
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6">
          <div className="bg-gradient-to-br from-sage-600 to-sage-700 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sage-100 font-body text-sm">Total Points</p>
                <p className="font-display text-4xl font-bold">{result.total}</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm font-body text-sage-100 mb-1">
                <span>Progress</span>
                <span>{Math.round((result.total / maxPoints) * 100)}%</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(result.total / maxPoints) * 100}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
              <p className="text-xs text-sage-200 font-body mt-1 text-right">
                Max: {maxPoints}
              </p>
            </div>

            {result.bonusApplied && (
              <div className="bg-white/10 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-body">
                    Maths Bonus Applied: +25 points
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-midnight-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-midnight-100">
              <h3 className="font-display text-lg font-semibold text-midnight-900">
                Top 6 Subjects
              </h3>
            </div>
            <div className="p-5">
              {result.breakdown.length === 0 ? (
                <p className="text-sm text-midnight-400 font-body text-center py-4">
                  Enter grades to see breakdown
                </p>
              ) : (
                <div className="space-y-3">
                  {result.breakdown.map((item, index) => (
                    <div
                      key={item.subject}
                      className="flex items-center justify-between p-3 bg-midnight-50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-sage-200 text-sage-700 flex items-center justify-center text-xs font-body font-medium">
                          {index + 1}
                        </span>
                        <span className="font-body text-midnight-700">{item.subject}</span>
                      </div>
                      <span className="font-display font-semibold text-midnight-800">
                        {item.points}
                      </span>
                    </div>
                  ))}
                  {result.bonusApplied && (
                    <div className="flex items-center justify-between p-3 bg-terracotta-50 rounded-xl border border-terracotta-200">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-terracotta-200 text-terracotta-700 flex items-center justify-center text-xs font-body font-medium">
                          +
                        </span>
                        <span className="font-body text-terracotta-700">Maths Bonus</span>
                      </div>
                      <span className="font-display font-semibold text-terracotta-700">
                        25
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-midnight-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-midnight-100">
              <h3 className="font-display text-lg font-semibold text-midnight-900">
                Points Reference
              </h3>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-4 gap-2">
                {GRADES.map((grade) => (
                  <div
                    key={grade}
                    className="text-center p-2 bg-midnight-50 rounded-lg"
                  >
                    <span className="font-body font-medium text-midnight-700 block">
                      {grade}
                    </span>
                    <span className="text-sm text-midnight-500 font-body">
                      {GRADE_POINTS[grade]}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-midnight-400 font-body mt-3 text-center">
                H6 or higher in Maths = +25 bonus points
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
