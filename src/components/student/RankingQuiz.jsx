import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { API_URL } from '../../config/api';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import axios from 'axios';

/**
 * Premium Gaming Ranking Quiz Component
 * NO TIMER - Strategic thinking focused
 * Features: Drag-and-drop ranking, futuristic UI, particle effects
 */

// Sortable Item Component with Premium Gaming UI
function SortableItem({ id, rank, text }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center p-5 bg-white/90 backdrop-blur-sm border-2 rounded-xl cursor-move group transition-all shadow-md ${
        isDragging
          ? 'scale-105 z-50 border-blue-500 shadow-lg'
          : 'border-purple-200 hover:border-purple-300 hover:shadow-lg'
      }`}
      {...attributes}
      {...listeners}
    >
      {/* Rank Badge */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl transition-all ${
        isDragging 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'bg-blue-500 text-white'
      }`}>
        <span className="font-black">{rank}</span>
      </div>

      {/* Option Text */}
      <div className="flex-1 ml-4">
        <p className="text-gray-800 font-semibold text-lg">{text}</p>
      </div>

      {/* Drag Handle Icon */}
      <svg className="w-7 h-7 text-blue-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </div>
  );
}

const RankingQuiz = ({ quiz, onComplete, onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [rankedOptions, setRankedOptions] = useState([]);
  const [instruction, setInstruction] = useState('');
  const [allAnswers, setAllAnswers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStrategicOptions, setShowStrategicOptions] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Helper function to count words
  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Initialize ranked options for current question
  useEffect(() => {
    if (currentQuestion) {
      const options = currentQuestion.options.map((opt, index) => ({
        id: `option-${index}`,
        text: opt.text,
        rank: index + 1
      }));
      setRankedOptions(options);
      setInstruction('');
      setShowStrategicOptions(false);
    }
  }, [currentQuestionIndex, currentQuestion]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setRankedOptions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        
        return newItems.map((item, index) => ({
          ...item,
          rank: index + 1
        }));
      });
    }
  };

  const handleViewStrategicOptions = () => {
    setShowStrategicOptions(true);
  };

  const handleNext = () => {
    if (!instruction || instruction.trim().length === 0) {
      alert('⚠️ Please provide your strategic instruction before proceeding');
      return;
    }

    const wordCount = countWords(instruction);
    if (wordCount < 20) {
      alert(`⚠️ Instruction must be at least 20 words (current: ${wordCount} words)`);
      return;
    }

    if (wordCount > 100) {
      alert(`⚠️ Instruction must not exceed 100 words (current: ${wordCount} words)`);
      return;
    }

    const cleanedRanking = rankedOptions.map(option => ({
      text: option.text,
      rank: option.rank
    }));
    
    const answer = {
      questionId: currentQuestion._id,
      questionText: currentQuestion.text,
      selectedRanking: cleanedRanking,
      instruction: instruction.trim()
    };

    const updatedAnswers = [...allAnswers];
    updatedAnswers[currentQuestionIndex] = answer;
    setAllAnswers(updatedAnswers);

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit(updatedAnswers);
    }
  };

  const handleSubmit = async (answers) => {
    setIsSubmitting(true);
    
    const cleanedAnswers = answers.map(answer => ({
      questionId: answer.questionId,
      questionText: answer.questionText,
      selectedRanking: answer.selectedRanking.map(option => ({
        text: option.text,
        rank: option.rank
      })),
      instruction: answer.instruction
    }));
    
    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        quizId: quiz._id,
        answers: cleanedAnswers
      };
      
      const response = await axios.post(
        `${API_URL}/scores/submit`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (onComplete) {
        onComplete(response.data.data);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit quiz';
      alert(`❌ ${errorMessage}`);
      setIsSubmitting(false);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)'
      }}>
        <div className="gaming-spinner"></div>
      </div>
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
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          {onBack && (
            <button
              onClick={onBack}
              className="mb-6 px-4 py-2 text-gray-800 hover:text-black flex items-center transition-all group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Mission Select
            </button>
          )}

          {/* Progress Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold text-gray-800">Mission Progress</span>
              <span className="text-lg font-bold text-blue-600">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <div className="flex justify-between mt-3">
              {Array.from({ length: totalQuestions }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 mx-1 h-2 rounded-full transition-all ${
                    i < currentQuestionIndex 
                      ? 'bg-green-500' 
                      : i === currentQuestionIndex
                      ? 'bg-blue-500 animate-pulse'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Mission Header */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border-2 border-purple-200">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <div className="text-center">
                  <div className="text-4xl font-black text-white mb-1">
                    {currentQuestionIndex + 1}
                  </div>
                  <div className="text-sm text-white/90">of {totalQuestions}</div>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <h1 className="text-3xl font-black text-gray-800">
                    MISSION CHALLENGE {currentQuestionIndex + 1}
                  </h1>
                </div>
                <div className="flex items-center gap-6 text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                    </svg>
                    <span className="font-semibold">Strategic Decision</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                    </svg>
                    <span className="font-semibold text-green-600">No Time Limit - Think Strategically</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Question Text */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {currentQuestion.text}
            </h2>
          </div>

          {/* Points Section */}
          {currentQuestion.points && currentQuestion.points.length > 0 && (
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border-2 border-purple-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-purple-700">Constraints</h3>
                  <p className="text-gray-600">Critical information points (read-only)</p>
                </div>
                <div className="px-5 py-2 bg-purple-100 rounded-full border border-purple-300">
                  <span className="text-purple-700 font-black text-base">IMPORTANT</span>
                </div>
              </div>
              <div className="space-y-4">
                {currentQuestion.points.map((point, index) => (
                  <div key={index} className="bg-gray-50/80 backdrop-blur-sm border border-purple-200 rounded-lg p-6 flex items-start gap-5 hover:border-purple-300 transition-all">
                    <div className="w-14 h-14 bg-purple-500 text-white rounded-lg flex items-center justify-center font-black text-xl flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-900 leading-relaxed flex-1 text-xl font-bold">
                      {point.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* View Strategic Options Button */}
          {!showStrategicOptions && (
            <div className="flex justify-center mb-8">
              <button
                onClick={handleViewStrategicOptions}
                className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <span className="flex items-center">
                  <svg className="w-7 h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  VIEW STRATEGIC OPTIONS
                </span>
              </button>
            </div>
          )}

          {/* Strategic Options Section */}
          {showStrategicOptions && (
            <div>
              {/* Ranking Instructions */}
              <div className="bg-blue-50/80 backdrop-blur-sm border-2 border-blue-300 rounded-xl p-6 mb-8">
                <div className="flex items-start gap-4">
                  <svg className="w-8 h-8 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-xl font-black text-blue-800 mb-2">RANKING PROTOCOL</p>
                    <p className="text-gray-700 text-lg">
                      Drag and drop options to rank them from <strong className="text-green-600">highest priority (1st)</strong> to <strong className="text-orange-600">lowest priority (last)</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Drag and Drop Ranking */}
              <div className="mb-8">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={rankedOptions.map(opt => opt.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-4">
                      {rankedOptions.map((option) => (
                        <SortableItem
                          key={option.id}
                          id={option.id}
                          rank={option.rank}
                          text={option.text}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>

              {/* Instruction Field */}
              <div className="bg-yellow-50/80 backdrop-blur-sm border-2 border-yellow-300 rounded-xl p-6 mb-8">
                <label className="block">
                  <div className="flex items-center gap-3 mb-4">
                    <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <span className="text-2xl font-black text-yellow-800">
                        Your Strategic Reason<span className="text-red-600">*</span>
                      </span>
                      <p className="text-gray-700 text-sm mt-1">
                        Explain your ranking choice (20-100 words required)
                      </p>
                    </div>
                  </div>
                  <textarea
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    placeholder="Provide your strategic reasoning for this ranking decision..."
                    className="w-full px-6 py-4 bg-white/90 backdrop-blur-sm border-2 border-purple-200 rounded-xl text-gray-800 placeholder-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all min-h-40 resize-y text-lg"
                    required
                  />
                </label>
                <div className="mt-4 flex justify-between text-base">
                  <p className={`font-bold ${
                    countWords(instruction) < 20 ? 'text-red-600' : 
                    countWords(instruction) > 100 ? 'text-red-600' : 
                    'text-green-600'
                  }`}>
                    Word count: {countWords(instruction)} (min: 20, max: 100)
                  </p>
                  <p className="text-gray-600">
                    {instruction.length} characters
                  </p>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center gap-4 justify-center">
                <button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="px-12 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex-1 max-w-md"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Submitting...
                    </span>
                  ) : currentQuestionIndex === totalQuestions - 1 ? (
                    <span className="flex items-center justify-center">
                      COMPLETE MISSION
                      <svg className="w-7 h-7 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Next Challenge
                      <svg className="w-7 h-7 ml-3 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RankingQuiz;
