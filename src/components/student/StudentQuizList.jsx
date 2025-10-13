import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';
import QuizPreface from './QuizPreface';
import RankingQuiz from './RankingQuiz';
import DecisionChallenge from './DecisionChallenge';
import QuizResults from './QuizResults';

/**
 * Premium Gaming Mission Select Component
 * Displays available and completed missions with futuristic UI
 */

const StudentQuizList = ({ onQuizStateChange }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [myScores, setMyScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showPreface, setShowPreface] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [completedQuizResult, setCompletedQuizResult] = useState(null);
  const [activeTab, setActiveTab] = useState('available');

  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  useEffect(() => {
    fetchQuizzes();
    fetchMyScores();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/quizzes');
      const allQuizzes = response.data.quizzes || response.data.data?.quizzes || [];
      
      const activeQuizzes = allQuizzes.filter(q => 
        q.questions && 
        q.questions.length > 0
      );
      
      setQuizzes(activeQuizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyScores = async () => {
    try {
      const response = await api.get('/scores/my-scores');
      setMyScores(response.data.scores || response.data || []);
    } catch (error) {
      console.error('Error fetching scores:', error);
    }
  };

  const handleStartQuiz = (quiz) => {
    const alreadyCompleted = myScores.some(score => 
      score.quiz?._id === quiz._id || score.quiz === quiz._id
    );

    if (alreadyCompleted) {
      setActiveTab('completed');
      return;
    }

    setSelectedQuiz(quiz);
    setShowPreface(true);
    setShowQuiz(false);
    setShowResults(false);
    setCompletedQuizResult(null);
    
    // Notify parent that quiz is active (hide header)
    if (onQuizStateChange) {
      onQuizStateChange(true);
    }
  };

  const handlePrefaceNext = () => {
    setShowPreface(false);
    setShowQuiz(true);
    
    // Quiz is still active (header stays hidden)
    if (onQuizStateChange) {
      onQuizStateChange(true);
    }
  };

  const handleQuizComplete = (result) => {
    setCompletedQuizResult(result);
    setShowResults(true);
    setShowQuiz(false);
    setShowPreface(false);
    setSelectedQuiz(null);
    fetchMyScores();
    
    // Results screen - keep header hidden
    if (onQuizStateChange) {
      onQuizStateChange(true);
    }
  };

  const handleBackToList = () => {
    setSelectedQuiz(null);
    setShowPreface(false);
    setShowQuiz(false);
    setShowResults(false);
    setCompletedQuizResult(null);
    fetchMyScores();
    
    // Notify parent that quiz is no longer active (show header)
    if (onQuizStateChange) {
      onQuizStateChange(false);
    }
  };

  const isQuizCompleted = (quizId) => {
    return myScores.some(score => 
      score.quiz?._id === quizId || score.quiz === quizId
    );
  };

  const getQuizScore = (quizId) => {
    const score = myScores.find(s => 
      s.quiz?._id === quizId || s.quiz === quizId
    );
    return score;
  };

  if (selectedQuiz && showPreface) {
    return (
      <QuizPreface 
        quiz={selectedQuiz} 
        onNext={handlePrefaceNext}
        onBack={handleBackToList}
      />
    );
  }

  if (selectedQuiz && showQuiz) {
    const isDecisionChallenge = selectedQuiz.title?.toLowerCase().includes('decision') || 
                               selectedQuiz.title?.toLowerCase().includes('challenge') ||
                               selectedQuiz.description?.toLowerCase().includes('decision');
    
    if (isDecisionChallenge) {
      return (
        <DecisionChallenge 
          quiz={selectedQuiz} 
          onComplete={handleQuizComplete}
          onBack={handleBackToList}
        />
      );
    } else {
      return (
        <RankingQuiz 
          quiz={selectedQuiz} 
          onComplete={handleQuizComplete}
          onBack={handleBackToList}
        />
      );
    }
  }

  if (showResults && completedQuizResult) {
    return (
      <QuizResults 
        result={completedQuizResult}
        results={completedQuizResult}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #a855f7 100%)'
    }}>
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-4xl font-black text-gray-800 mb-2">MISSION CONTROL</h2>
                <p className="text-gray-600 text-xl">Select and execute strategic missions</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">Missions Completed</p>
                <p className="text-5xl font-black text-transparent bg-gradient-to-br from-green-600 to-blue-600 bg-clip-text">
                  {myScores.length}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('available')}
                className={`relative py-4 px-8 font-black text-lg transition-all ${
                  activeTab === 'available'
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="relative z-10 flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Available Missions ({quizzes.filter(q => !isQuizCompleted(q._id)).length})
                </span>
                {activeTab === 'available' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`relative py-4 px-8 font-black text-lg transition-all ${
                  activeTab === 'completed'
                    ? 'text-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="relative z-10 flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Completed Missions ({myScores.length})
                </span>
                {activeTab === 'completed' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-blue-600"></div>
                )}
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="animate-slideInBottom" style={{ animationDelay: '0.2s' }}>
            {loading ? (
              <div className="flex flex-col justify-center items-center py-20">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
                <span className="text-gray-700 text-2xl font-bold">Loading missions...</span>
              </div>
            ) : activeTab === 'available' ? (
              // Available Missions
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.filter(q => !isQuizCompleted(q._id)).length === 0 ? (
                  <div className="col-span-full">
                    <div className="bg-white rounded-xl shadow-lg p-20 text-center border-2 border-gray-200">
                      <svg className="w-20 h-20 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-gray-700 text-xl mb-2">No available missions</p>
                      <p className="text-gray-500">Check back later for new strategic challenges</p>
                    </div>
                  </div>
                ) : (
                  quizzes
                    .filter(q => !isQuizCompleted(q._id))
                    .map((quiz, index) => (
                      <div
                        key={quiz._id}
                        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl hover:scale-105 transition-all cursor-pointer border-2 border-gray-200 hover:border-blue-400"
                      >
                        {/* Mission Badge */}
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-black text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {quiz.title}
                            </h3>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                          {quiz.description}
                        </p>

                        {/* Mission Stats */}
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center justify-between text-sm bg-gray-50 border border-gray-200 p-3 rounded-lg">
                            <span className="text-gray-600 flex items-center gap-2">
                              <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                              </svg>
                              Challenges:
                            </span>
                            <span className="font-black text-gray-800">{quiz.questions?.length || 0}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm bg-gray-50 border border-gray-200 p-3 rounded-lg">
                            <span className="text-gray-600 flex items-center gap-2">
                              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                              </svg>
                              No Time Limit:
                            </span>
                            <span className="font-black text-green-600">Strategic</span>
                          </div>
                          <div className="flex items-center justify-between text-sm bg-gray-50 border border-gray-200 p-3 rounded-lg">
                            <span className="text-gray-600 flex items-center gap-2">
                              <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/>
                              </svg>
                              Difficulty:
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-black ${
                              quiz.difficulty === 'Easy' ? 'bg-green-100 text-green-700 border border-green-300' :
                              quiz.difficulty === 'Hard' ? 'bg-red-100 text-red-700 border border-red-300' :
                              'bg-yellow-100 text-yellow-700 border border-yellow-300'
                            }`}>
                              {quiz.difficulty || 'Medium'}
                            </span>
                          </div>
                          {quiz.degree && (
                            <div className="flex items-center justify-between text-sm glass-panel p-3 rounded-lg">
                              <span className="text-white/70">Degree:</span>
                              <span className="font-black text-cyan-400">{quiz.degree}</span>
                            </div>
                          )}
                        </div>

                        {/* Launch Button */}
                        <button
                          onClick={() => handleStartQuiz(quiz)}
                          className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                        >
                          <span className="flex items-center justify-center gap-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            LAUNCH MISSION
                          </span>
                        </button>
                      </div>
                    ))
                )}
              </div>
            ) : (
              // Completed Missions
              <div className="space-y-6">
                {myScores.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-lg p-20 text-center border-2 border-gray-200">
                    <svg className="w-20 h-20 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-700 text-xl mb-4">No completed missions yet</p>
                    <button
                      onClick={() => setActiveTab('available')}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 inline-block"
                    >
                      Start Your First Mission →
                    </button>
                  </div>
                ) : (
                  myScores.map((score, index) => {
                    const quiz = quizzes.find(q => q._id === score.quiz?._id || q._id === score.quiz);
                    const performance = score.totalScore >= 80 ? 'Excellent' :
                                      score.totalScore >= 60 ? 'Good' : 'Complete';
                    
                    return (
                      <div
                        key={score._id}
                        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl hover:scale-[1.02] transition-all border-2 border-gray-200"
                      >
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Score Badge */}
                          <div className="flex-shrink-0">
                            <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex flex-col items-center justify-center shadow-lg">
                              <div className="text-4xl font-black text-white mb-1">
                                {Math.round(score.totalScore)}%
                              </div>
                              <div className="text-white/90 text-sm font-bold uppercase">Score</div>
                            </div>
                          </div>

                          {/* Mission Details */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-2xl font-black text-gray-800 mb-2">
                                  {score.simulationName || quiz?.title || 'Mission'}
                                </h3>
                                <span className={`px-4 py-2 rounded-full text-sm font-black border-2 ${
                                  score.totalScore >= 80 ? 'bg-green-100 text-green-700 border-green-300' :
                                  score.totalScore >= 60 ? 'bg-blue-100 text-blue-700 border-blue-300' :
                                  'bg-purple-100 text-purple-700 border-purple-300'
                                }`}>
                                  {performance}
                                </span>
                              </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                                <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1">Challenges</p>
                                <p className="text-2xl font-black text-gray-800">
                                  {score.answers?.length || score.totalQuestions || 0}
                                </p>
                              </div>
                              {score.accuracy && (
                                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                                  <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1">Accuracy</p>
                                  <p className="text-2xl font-black text-blue-600">
                                    {Math.round(score.accuracy)}%
                                  </p>
                                </div>
                              )}
                              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                                <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1">Status</p>
                                <p className="text-lg font-black text-green-600">
                                  COMPLETE
                                </p>
                              </div>
                              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                                <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1">Date</p>
                                <p className="text-sm font-bold text-gray-800">
                                  {new Date(score.submittedAt || score.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentQuizList;
