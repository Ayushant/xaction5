import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api';
// Toast notifications disabled (silent mode)
const toast = { success: () => {}, error: () => {}, loading: () => {}, info: () => {}, warning: () => {}, promise: () => {}, custom: () => {}, dismiss: () => {} };

/**
 * Reusable Score Edit Modal Component
 * Works for both Admin and College Admin
 */
const AdminScoreEditModal = ({ 
  score, 
  onClose, 
  onSave,
  isCollegeAdmin = false 
}) => {
  const [editingTotalScore, setEditingTotalScore] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingInstruction, setEditingInstruction] = useState(null);
  const [newTotalScore, setNewTotalScore] = useState('');
  const [newQuestionScore, setNewQuestionScore] = useState('');
  const [newInstructionScore, setNewInstructionScore] = useState('');
  const [editReason, setEditReason] = useState('');

  // Determine API endpoints based on user role
  const getEndpoint = (scoreId, action) => {
    if (isCollegeAdmin) {
      return `/college-admin/score-edit/${scoreId}`;
    }
    return `/scores/${scoreId}/edit`;
  };

  const handleEditTotalScore = async () => {
    if (!editReason.trim()) {
      toast.error('Please provide a reason for editing the score');
      return;
    }

    const scoreValue = parseFloat(newTotalScore);
    if (isNaN(scoreValue) || scoreValue < 0 || scoreValue > 100) {
      toast.error('Score must be between 0 and 100');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}${getEndpoint(score._id)}`, {
        newScore: scoreValue,
        reason: editReason
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      toast.success('Total score updated successfully!');
      setEditingTotalScore(false);
      setNewTotalScore('');
      setEditReason('');
      
      if (onSave) onSave();
    } catch (error) {
      console.error('Error updating score:', error);
      toast.error(error.response?.data?.message || 'Failed to update total score');
    }
  };

  const handleEditQuestionScore = async (questionIndex) => {
    if (!editReason.trim()) {
      toast.error('Please provide a reason for editing the score');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}${getEndpoint(score._id)}`, {
        questionIndex,
        newQuestionScore: parseFloat(newQuestionScore),
        reason: editReason
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      toast.success('Question score updated successfully!');
      setEditingQuestion(null);
      setNewQuestionScore('');
      setEditReason('');
      
      if (onSave) onSave();
    } catch (error) {
      console.error('Error updating question score:', error);
      toast.error(error.response?.data?.message || 'Failed to update question score');
    }
  };

  const handleEditInstructionScore = async (questionIndex) => {
    if (!editReason.trim()) {
      toast.error('Please provide a reason for editing the score');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}${getEndpoint(score._id)}`, {
        questionIndex,
        newInstructionScore: parseFloat(newInstructionScore),
        reason: editReason
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      toast.success('Instruction score updated successfully!');
      setEditingInstruction(null);
      setNewInstructionScore('');
      setEditReason('');
      
      if (onSave) onSave();
    } catch (error) {
      console.error('Error updating instruction score:', error);
      toast.error(error.response?.data?.message || 'Failed to update instruction score');
    }
  };

  if (!score) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Edit Quiz Score</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl font-bold leading-none"
            title="Close"
          >
            ×
          </button>
        </div>

        {/* Student & Quiz Info */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 font-medium">Student</p>
              <p className="font-semibold text-gray-900">{score.student?.fullName || 'N/A'}</p>
              <p className="text-sm text-gray-500">{score.student?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Quiz</p>
              <p className="font-semibold text-gray-900">{score.quiz?.title || 'N/A'}</p>
              <p className="text-sm text-gray-500">
                Submitted: {score.submittedAt ? new Date(score.submittedAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div className="text-center bg-white rounded-lg p-3 border-2 border-blue-300">
              <p className="text-sm text-gray-600 font-medium">Total Score</p>
              <p className="text-3xl font-bold text-blue-600">{Math.round(score.totalScore)}%</p>
              <button
                onClick={() => {
                  setEditingTotalScore(true);
                  setNewTotalScore(score.totalScore);
                }}
                className="mt-2 px-3 py-1 bg-orange-600 text-white text-xs rounded-lg hover:bg-orange-700 transition-colors"
              >
                ✏️ Edit Total Score
              </button>
            </div>
          </div>
        </div>

        {/* Edit Total Score Form */}
        {editingTotalScore && (
          <div className="mb-6 p-4 bg-orange-50 border-2 border-orange-300 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <span className="text-orange-600 mr-2">📝</span>
              Edit Total Score
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 w-32">New Score (%):</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={newTotalScore}
                  onChange={(e) => setNewTotalScore(e.target.value)}
                  placeholder="e.g., 85"
                  className="w-32 px-3 py-2 border-2 border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="flex items-start space-x-2">
                <label className="text-sm font-medium text-gray-700 w-32 pt-2">Reason:</label>
                <textarea
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  placeholder="Explain why you're changing the score..."
                  className="flex-1 px-3 py-2 border-2 border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  rows="2"
                  required
                />
              </div>
              <div className="flex space-x-2 pt-2">
                <button
                  onClick={handleEditTotalScore}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors"
                >
                  ✓ Save Total Score
                </button>
                <button
                  onClick={() => {
                    setEditingTotalScore(false);
                    setNewTotalScore('');
                    setEditReason('');
                  }}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 font-semibold transition-colors"
                >
                  ✗ Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Questions & Answers */}
        {score.answers && score.answers.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-gray-800">Questions & Answers:</h4>
            {score.answers.map((answer, index) => (
              <div key={index} className="border-2 border-gray-200 rounded-lg p-5 bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="mb-3">
                  <p className="font-bold text-gray-800 text-lg">Q{index + 1}: {answer.questionText}</p>
                </div>

                {/* Ranking Answer */}
                {answer.selectedRanking && answer.selectedRanking.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Student's Ranking:</p>
                    <div className="space-y-1">
                      {answer.selectedRanking.map((option, idx) => (
                        <div key={idx} className="flex items-center text-sm bg-blue-50 p-2 rounded">
                          <span className="font-semibold mr-2 text-blue-600">{option.rank}.</span>
                          <span>{option.text}</span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-2 text-sm">
                      <span className="font-medium">Ranking Score: </span>
                      <span className={`font-bold ${answer.rankingScore >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                        {answer.rankingScore}%
                      </span>
                    </p>
                  </div>
                )}

                {/* Instruction/Reasoning */}
                {answer.instruction && (
                  <div className="mb-3 p-3 bg-blue-50 rounded border border-blue-200">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm font-medium text-gray-700">Student's Instruction/Reasoning:</p>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-600 mr-2">Instruction Score:</span>
                        <span className="text-sm font-semibold text-blue-600">
                          {answer.instructionScore || 0} / 100
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-800 mt-1 italic">{answer.instruction}</p>
                    
                    {/* Edit Instruction Score */}
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      {editingInstruction === index ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="1"
                              value={newInstructionScore}
                              onChange={(e) => setNewInstructionScore(e.target.value)}
                              placeholder="Score (0-100)"
                              className="w-32 px-2 py-1 border rounded text-sm"
                            />
                            <input
                              type="text"
                              value={editReason}
                              onChange={(e) => setEditReason(e.target.value)}
                              placeholder="Reason for edit"
                              className="flex-1 px-2 py-1 border rounded text-sm"
                            />
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditInstructionScore(index)}
                              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingInstruction(null);
                                setNewInstructionScore('');
                                setEditReason('');
                              }}
                              className="px-3 py-1 bg-gray-400 text-white rounded text-sm hover:bg-gray-500"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingInstruction(index);
                            setNewInstructionScore(answer.instructionScore || 0);
                          }}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        >
                          Edit Instruction Score
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Question Score Edit */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-300">
                  <div>
                    <span className="text-sm font-medium">Points: </span>
                    <span className="text-sm font-semibold text-blue-600">
                      {answer.rankingScore || answer.points || 0}
                    </span>
                  </div>
                  {editingQuestion === index ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        value={newQuestionScore}
                        onChange={(e) => setNewQuestionScore(e.target.value)}
                        placeholder="New score"
                        className="w-20 px-2 py-1 border rounded text-sm"
                      />
                      <input
                        type="text"
                        value={editReason}
                        onChange={(e) => setEditReason(e.target.value)}
                        placeholder="Reason"
                        className="w-48 px-2 py-1 border rounded text-sm"
                      />
                      <button
                        onClick={() => handleEditQuestionScore(index)}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingQuestion(null);
                          setNewQuestionScore('');
                          setEditReason('');
                        }}
                        className="px-3 py-1 bg-gray-400 text-white rounded text-sm hover:bg-gray-500"
                      >
                        Cancel
                        </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingQuestion(index);
                        setNewQuestionScore(answer.rankingScore || answer.points || 0);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Edit Score
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Score Edit History */}
        {score.scoreEdits && score.scoreEdits.length > 0 && (
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-lg mb-3 text-gray-800">Score Edit History:</h4>
            <div className="space-y-2">
              {score.scoreEdits.map((edit, idx) => (
                <div key={idx} className="text-sm border-b border-yellow-200 pb-2 last:border-0">
                  <p className="font-medium">
                    {edit.questionIndex !== undefined 
                      ? `Q${edit.questionIndex + 1} ${edit.editType === 'instruction' ? '(Instruction)' : '(Ranking)'}` 
                      : 'Total Score'}: 
                    {' '}
                    <span className="text-red-600">{edit.oldScore || edit.oldQuestionScore || 0}</span>
                    {' → '}
                    <span className="text-green-600">{edit.newScore || edit.newQuestionScore || 0}</span>
                  </p>
                  <p className="text-gray-600 italic">{edit.reason}</p>
                  <p className="text-xs text-gray-500">
                    {edit.editedAt ? new Date(edit.editedAt).toLocaleString() : 'Unknown date'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminScoreEditModal;
