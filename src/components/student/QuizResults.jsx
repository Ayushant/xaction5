import React, { useEffect, useState } from 'react';

/**
 * Premium Gaming Mission Accomplished Component
 * Celebration screen with particles, animations, and detailed results
 * NO TIME STATS - Focus on strategic achievement
 */

const QuizResults = ({ result, results, onBack, onReturnToDashboard, onRetakeQuiz }) => {
  const data = result || results;
  const [showCelebration, setShowCelebration] = useState(true);
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    // Generate celebration particles
    const newParticles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: i * 0.02,
      color: ['#fbbf24', '#f59e0b', '#06b6d4', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 5)]
    }));
    setParticles(newParticles);

    // Hide celebration after animation
    setTimeout(() => setShowCelebration(false), 3000);
  }, []);
  
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)'
      }}>
        <div className="premium-card text-center">
          <p className="text-white/80 text-xl">No results available.</p>
          {onBack && (
            <button
              onClick={onBack}
              className="mt-6 btn-gaming px-8 py-3"
            >
              ← Back to Mission Select
            </button>
          )}
        </div>
      </div>
    );
  }
  
  const scoreData = data.score || data;
  const {
    totalScore = 0,
    maxScore = 0,
    percentage = data.percentage || 0,
    answers = [],
    quiz = {},
    completedAt = new Date()
  } = scoreData;

  const getPerformance = (percentage) => {
    if (percentage >= 90) return { 
      level: 'LEGENDARY', 
      description: 'Perfect Strategic Execution',
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/20',
      icon: '🏆'
    };
    if (percentage >= 75) return { 
      level: 'EXCELLENT', 
      description: 'Outstanding Performance',
      color: 'text-green-400',
      bg: 'bg-green-500/20',
      icon: '⭐'
    };
    if (percentage >= 60) return { 
      level: 'GOOD', 
      description: 'Solid Strategic Thinking',
      color: 'text-blue-400',
      bg: 'bg-blue-500/20',
      icon: '👍'
    };
    return { 
      level: 'COMPLETE', 
      description: 'Mission Finished',
      color: 'text-purple-400',
      bg: 'bg-purple-500/20',
      icon: '✓'
    };
  };

  const performance = getPerformance(percentage);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)'
    }}>
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Celebration Particles */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute celebration-particle"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                backgroundColor: particle.color,
                animationDelay: `${particle.delay}s`,
                '--tx': `${(Math.random() - 0.5) * 200}vw`,
                '--ty': `${(Math.random() - 0.5) * 200}vh`
              }}
            />
          ))}
        </div>
      )}

      {/* Scan Line */}
      <div className="scan-line"></div>

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Trophy Header */}
          <div className="text-center mb-12 animate-scaleUp">
            <div className="relative w-40 h-40 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div className="absolute -inset-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-2xl opacity-50"></div>
            </div>
            
            <h1 className="text-6xl font-black text-white mb-4 tracking-wider">
              MISSION ACCOMPLISHED!
            </h1>
            <p className="text-2xl text-white/80">
              Strategic Simulation Complete
            </p>
          </div>

          {/* Score Display */}
          <div className="premium-card text-center mb-12 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <div className="score-display mb-6">
              {percentage.toFixed(1)}%
            </div>
            
            <div className="text-2xl text-white/70 mb-8">
              Final Score: <span className="text-white font-bold">{totalScore.toFixed(1)}</span>
            </div>
            
            {/* Performance Badge */}
            <div className={`inline-flex items-center gap-6 px-12 py-6 rounded-2xl ${performance.bg} ${performance.color} font-black text-2xl border-2 border-current/50 neon-glow`}>
              <span className="text-5xl">{performance.icon}</span>
              <div className="text-left">
                <div className="text-4xl mb-1">{performance.level}</div>
                <div className="text-lg opacity-90 font-normal">{performance.description}</div>
              </div>
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" clipRule="evenodd"/>
              </svg>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Your Score */}
            <div className="stat-card animate-scaleUp" style={{ animationDelay: '0.4s' }}>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/30 to-purple-600/30 mb-4 inline-block neon-glow">
                <svg className="w-10 h-10 text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div className="text-5xl font-black text-transparent bg-gradient-to-br from-blue-400 to-purple-600 bg-clip-text mb-3">
                {totalScore.toFixed(1)}
              </div>
              <div className="text-blue-400 font-bold text-xl mb-2">Your Score</div>
              <div className="text-white/60">{percentage.toFixed(1)}% ranking accuracy</div>
            </div>

            {/* Missions Completed */}
            <div className="stat-card animate-scaleUp" style={{ animationDelay: '0.5s' }}>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-600/30 mb-4 inline-block neon-glow">
                <svg className="w-10 h-10 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="text-5xl font-black text-transparent bg-gradient-to-br from-purple-400 to-pink-600 bg-clip-text mb-3">
                {answers.length}
              </div>
              <div className="text-purple-400 font-bold text-xl mb-2">Missions Completed</div>
              <div className="text-white/60">Strategic decisions executed</div>
            </div>

            {/* Strategic Excellence */}
            <div className="stat-card animate-scaleUp" style={{ animationDelay: '0.6s' }}>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500/30 to-cyan-600/30 mb-4 inline-block neon-glow">
                <svg className="w-10 h-10 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-5xl font-black text-transparent bg-gradient-to-br from-green-400 to-cyan-600 bg-clip-text mb-3">
                {answers.filter(a => a.instruction).length}
              </div>
              <div className="text-green-400 font-bold text-xl mb-2">Instructions Given</div>
              <div className="text-white/60">Detailed strategic reasoning</div>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="mb-12 animate-slideInBottom" style={{ animationDelay: '0.7s' }}>
            <h2 className="text-3xl font-black text-white mb-6 flex items-center">
              <svg className="w-8 h-8 text-cyan-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Mission Analysis & Results
            </h2>
            <div className="space-y-6">
              {answers.map((answer, index) => {
                const isRankingQuestion = answer.questionType === 'ranking' && answer.selectedRanking && answer.correctRanking;
                const score = answer.rankingScore || answer.points || 0;
                
                return (
                  <div key={index} className="premium-card border-2 border-purple-400/30 hover:border-purple-400/60 transition-all">
                    {/* Question Header */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="neon-badge">
                          {index + 1}
                        </div>
                        <h3 className="font-black text-2xl text-white">
                          Mission {index + 1}
                        </h3>
                      </div>
                      <div className={`px-6 py-3 rounded-xl font-black text-lg border-2 ${
                        score >= 90 ? 'bg-green-500/20 text-green-300 border-green-400/40 neon-glow' :
                        score >= 75 ? 'bg-blue-500/20 text-blue-300 border-blue-400/40' :
                        score >= 60 ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/40' :
                        'bg-red-500/20 text-red-300 border-red-400/40'
                      }`}>
                        {score.toFixed(1)}%
                      </div>
                    </div>

                    {/* Question Text */}
                    <div className="glass-panel p-6 mb-6">
                      <p className="text-white font-semibold text-lg">{answer.questionText}</p>
                    </div>

                    {isRankingQuestion ? (
                      <>
                        {/* Your Ranking */}
                        <div className="glass-panel p-6 border-2 border-cyan-400/30 mb-6">
                          <h4 className="font-black text-cyan-300 mb-4 flex items-center text-xl">
                            <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                            </svg>
                            Your Strategic Ranking
                          </h4>
                          <div className="space-y-3">
                            {answer.selectedRanking
                              .sort((a, b) => a.rank - b.rank)
                              .map((option, idx) => (
                                <div key={idx} className="flex items-center bg-white/10 rounded-lg p-4 border border-cyan-400/20">
                                  <div className="neon-badge" style={{ width: '2.5rem', height: '2.5rem', fontSize: '1rem' }}>
                                    {option.rank}
                                  </div>
                                  <span className="text-white ml-4 text-lg">{option.text}</span>
                                </div>
                              ))}
                          </div>
                        </div>

                        {/* Your Instruction */}
                        <div className="glass-panel p-6 border-2 border-purple-400/30">
                          <h4 className="font-black text-purple-300 mb-3 flex items-center text-xl">
                            <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Your Strategic Explanation
                          </h4>
                          <p className="text-white/90 leading-relaxed text-lg italic">{answer.instruction}</p>
                        </div>
                      </>
                    ) : (
                      <div className="glass-panel p-6">
                        <p className="text-sm text-white/60 mb-2">Your Answer:</p>
                        <p className="text-white font-semibold text-lg">{answer.selectedAnswer || answer.selectedOption}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Performance Insights */}
          <div className="premium-card border-2 border-blue-400/50 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 mb-12 animate-fadeIn" style={{ animationDelay: '0.8s' }}>
            <h3 className="text-2xl font-black text-blue-300 mb-6 flex items-center">
              <svg className="w-8 h-8 mr-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
              </svg>
              Performance Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="glass-panel p-6 border border-green-400/30">
                <p className="text-green-300 font-black mb-4 flex items-center text-xl">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  Strengths
                </p>
                <ul className="text-white/80 space-y-2 text-lg">
                  {percentage >= 90 && <li className="flex items-start"><span className="text-green-400 mr-2">▸</span>Exceptional ranking accuracy!</li>}
                  {percentage >= 75 && percentage < 90 && <li className="flex items-start"><span className="text-green-400 mr-2">▸</span>Strong overall performance</li>}
                  {answers.filter(a => a.instruction && a.instruction.length > 50).length > 0 && (
                    <li className="flex items-start"><span className="text-green-400 mr-2">▸</span>Detailed strategic explanations</li>
                  )}
                  {answers.filter(a => (a.rankingScore || a.points || 0) >= 90).length > 0 && (
                    <li className="flex items-start"><span className="text-green-400 mr-2">▸</span>Perfect scores on {answers.filter(a => (a.rankingScore || a.points || 0) >= 90).length} mission(s)</li>
                  )}
                  {answers.every(a => a.instruction) && <li className="flex items-start"><span className="text-green-400 mr-2">▸</span>All instructions completed</li>}
                </ul>
              </div>

              {/* Growth Areas */}
              <div className="glass-panel p-6 border border-orange-400/30">
                <p className="text-orange-300 font-black mb-4 flex items-center text-xl">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  Growth Opportunities
                </p>
                <ul className="text-white/80 space-y-2 text-lg">
                  {percentage < 75 && <li className="flex items-start"><span className="text-orange-400 mr-2">▸</span>Review ranking criteria and practice</li>}
                  {answers.filter(a => (a.rankingScore || a.points || 0) < 60).length > 0 && (
                    <li className="flex items-start"><span className="text-orange-400 mr-2">▸</span>{answers.filter(a => (a.rankingScore || a.points || 0) < 60).length} mission(s) need attention</li>
                  )}
                  {answers.filter(a => !a.instruction || a.instruction.length < 30).length > 0 && (
                    <li className="flex items-start"><span className="text-orange-400 mr-2">▸</span>Provide more detailed explanations</li>
                  )}
                  {percentage < 60 && <li className="flex items-start"><span className="text-orange-400 mr-2">▸</span>Focus on strategic thinking patterns</li>}
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fadeIn" style={{ animationDelay: '0.9s' }}>
            <button
              onClick={onBack || onReturnToDashboard}
              className="btn-gaming px-12 py-5 text-xl group"
            >
              <span className="flex items-center justify-center">
                <svg className="w-7 h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Return to Command Center
              </span>
            </button>
            {onRetakeQuiz && (
              <button
                onClick={onRetakeQuiz}
                className="px-12 py-5 rounded-xl font-bold text-xl text-white bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 transition-all border border-white/20 hover:scale-105 flex items-center justify-center gap-3"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retry Mission
              </button>
            )}
          </div>

          {/* Completion Details */}
          <div className="mt-12 text-center text-white/50 text-sm animate-fadeIn" style={{ animationDelay: '1s' }}>
            <p>Mission completed on {new Date(completedAt).toLocaleString()}</p>
            <p className="mt-2">All data has been securely transmitted to command</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
