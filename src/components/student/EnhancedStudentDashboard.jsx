import React, { useState } from 'react';
import StudentQuizList from './StudentQuizList';
import SimulationQuiz from './SimulationQuiz';
import { QuizProvider } from '../../context/QuizContext';
import SimulationLockModal from '../SimulationLockModal';

const EnhancedStudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('quizzes'); // 'quizzes' or 'simulation'
  const [simulationStarted, setSimulationStarted] = useState(false);
  const [isQuizActive, setIsQuizActive] = useState(false);
  
  const studentInfo = {
    name: localStorage.getItem('fullName') || 'Student',
    college: localStorage.getItem('college') || localStorage.getItem('userCollege') || 'College',
    email: localStorage.getItem('userEmail') || localStorage.getItem('email') || ''
  };
  
  const userCollege = localStorage.getItem('userCollege') || localStorage.getItem('college');

  const handleStartSimulation = () => {
    setSimulationStarted(true);
  };

  const handleQuizStateChange = (isActive) => {
    setIsQuizActive(isActive);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700">
      {/* Simulation Lock Modal */}
      <SimulationLockModal userCollege={userCollege} />
      
      {/* Header - Hidden when quiz is active */}
      {!isQuizActive && (
        <div className="bg-white/10 backdrop-blur-sm shadow-lg border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white">Student Dashboard</h1>
                <p className="text-white/80 mt-1">Welcome back, {studentInfo.name}</p>
                <p className="text-sm text-white/60">{studentInfo.college}</p>
              </div>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/login';
                }}
                className="px-4 py-2 bg-red-600/80 text-white rounded-lg hover:bg-red-600 transition-all backdrop-blur-sm border border-red-500/50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${!isQuizActive ? 'mt-6' : ''}`}>
        <div className={`${!isQuizActive ? 'bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20' : ''}`}>
          {/* Tab Navigation - Hidden when quiz is active */}
          {!isQuizActive && (
            <div className="border-b border-white/20">
              <nav className="flex -mb-px">
                <button
                  onClick={() => {
                    setActiveTab('quizzes');
                    setSimulationStarted(false);
                  }}
                  className={`py-4 px-6 font-medium text-sm border-b-2 transition-all ${
                    activeTab === 'quizzes'
                      ? 'border-purple-400 text-purple-300 bg-white/5'
                      : 'border-transparent text-white/70 hover:text-white hover:border-white/30 hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                    </svg>
                    My Quizzes
                  </span>
                </button>
              </nav>
            </div>
          )}

          <div className={`${!isQuizActive ? 'p-6' : ''}`}>
            <StudentQuizList onQuizStateChange={handleQuizStateChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedStudentDashboard;

