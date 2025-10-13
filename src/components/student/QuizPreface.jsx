import React, { useEffect, useState } from 'react';

/**
 * Mission Briefing Component - Premium Gaming UI
 * Shows before quiz starts with futuristic briefing interface
 */

const QuizPreface = ({ quiz, onNext, onBack }) => {
  const [particlesReady, setParticlesReady] = useState(false);

  useEffect(() => {
    setParticlesReady(true);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #a855f7 100%)'
    }}>
      {/* Animated Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          {onBack && (
            <button
              onClick={onBack}
              className="mb-8 px-4 py-2 text-gray-800 hover:text-black flex items-center transition-all group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Mission Select
            </button>
          )}

          {/* Mission Briefing Header */}
          <div className="text-center mb-12">
            {/* Mission Icon */}
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
              <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>

            {/* Title */}
            <h1 className="text-5xl font-black text-gray-800 tracking-wider mb-6">
              MISSION BRIEFING
            </h1>

            <h2 className="text-3xl font-bold text-blue-600 mb-4">
              {quiz.title}
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              {quiz.description}
            </p>
          </div>

          {/* Course Badge */}
          {quiz.course && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Course Module</p>
                  <p className="text-xl font-bold text-gray-800">
                    {quiz.course.courseName} <span className="text-blue-600">({quiz.course.courseCode})</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Mission Briefing Section */}
          {quiz.preface && quiz.preface.trim() !== '' && (
            <div className="premium-card mb-8 animate-slideInBottom" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-start mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mr-4 neon-glow">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white mb-2">MISSION INTELLIGENCE</h2>
                  <p className="text-white/70">Critical information for mission success</p>
                </div>
              </div>
              <div className="glass-panel p-6 border-2 border-yellow-500/30">
                <p className="text-white/90 whitespace-pre-wrap leading-relaxed text-lg">{quiz.preface}</p>
              </div>
            </div>
          )}

          {/* Mission Parameters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Challenges */}
            <div className="stat-card animate-scaleUp" style={{ animationDelay: '0.4s' }}>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/30 to-purple-600/30 mb-4 inline-block neon-glow">
                <svg className="w-10 h-10 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-5xl font-black text-transparent bg-gradient-to-br from-purple-400 to-purple-600 bg-clip-text mb-2">
                {quiz.questions?.length || 0}
              </div>
              <div className="text-purple-400 font-bold text-xl mb-1">Mission Challenges</div>
              <div className="text-white/60">Strategic decisions to make</div>
            </div>

            {/* Success Threshold */}
            <div className="stat-card animate-scaleUp" style={{ animationDelay: '0.5s' }}>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500/30 to-green-600/30 mb-4 inline-block neon-glow">
                <svg className="w-10 h-10 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-5xl font-black text-transparent bg-gradient-to-br from-green-400 to-green-600 bg-clip-text mb-2">
                {quiz.passingScore || 60}%
              </div>
              <div className="text-green-400 font-bold text-xl mb-1">Success Threshold</div>
              <div className="text-white/60">Minimum score required</div>
            </div>

            {/* Difficulty Level */}
            <div className="stat-card animate-scaleUp" style={{ animationDelay: '0.6s' }}>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500/30 to-red-600/30 mb-4 inline-block neon-glow">
                <svg className="w-10 h-10 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-5xl font-black text-transparent bg-gradient-to-br from-orange-400 to-red-600 bg-clip-text mb-2">
                {quiz.difficulty || 'MED'}
              </div>
              <div className="text-orange-400 font-bold text-xl mb-1">Difficulty Level</div>
              <div className="text-white/60">Mission complexity rating</div>
            </div>
          </div>

          {/* Mission Instructions */}
          <div className="premium-card border-2 border-yellow-400/40 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 mb-8 animate-slideInBottom" style={{ animationDelay: '0.7s' }}>
            <div className="flex items-start">
              <svg className="w-8 h-8 text-yellow-400 mr-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="text-2xl font-black text-yellow-300 mb-4">MISSION PROTOCOLS</h3>
                <ul className="space-y-3 text-white/90 text-lg">
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-3 text-2xl">▸</span>
                    <span>This mission uses <strong className="text-cyan-300">ranking-based challenges</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-3 text-2xl">▸</span>
                    <span>You must <strong className="text-cyan-300">rank strategic options</strong> from highest to lowest priority</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-3 text-2xl">▸</span>
                    <span>Each challenge requires a <strong className="text-cyan-300">written strategic instruction</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-3 text-2xl">▸</span>
                    <span><strong className="text-green-300">NO TIME LIMITS</strong> - Take your time for strategic thinking</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-3 text-2xl">▸</span>
                    <span>Scoring based on <strong className="text-cyan-300">ranking accuracy</strong> (0-100%)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-3 text-2xl">▸</span>
                    <span>Bonus points for <strong className="text-cyan-300">detailed strategic reasoning</strong></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-6">
            {onBack && (
              <button
                onClick={onBack}
                className="px-8 py-4 rounded-xl font-bold text-lg text-white bg-gray-600 hover:bg-gray-700 transition-all shadow-lg hover:scale-105"
              >
                ← Abort Mission
              </button>
            )}
            <button
              onClick={onNext}
              className="px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <span className="flex items-center">
                INITIATE MISSION
                <svg className="w-7 h-7 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPreface;
