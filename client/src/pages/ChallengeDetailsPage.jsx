//Josh Andrei Aguiluz
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, CheckCircle, Clock, MapPin, Users, Trophy, Camera, FileText, X } from 'lucide-react';
import { useUser } from '../context/UserContext';

const ChallengeDetailsPage = ({ onPageChange, challengeId }) => {
  const { user } = useUser();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submissionData, setSubmissionData] = useState({
    reflection: '',
    photo: null,
    previewUrl: null
  });
  const [submitting, setSubmitting] = useState(false);
  const [existingSubmission, setExistingSubmission] = useState(null);

  // Debug existing submission state
  useEffect(() => {
    console.log('Existing submission state changed:', existingSubmission);
  }, [existingSubmission]);

  useEffect(() => {
    if (challengeId && user) {
      fetchChallengeDetails();
    }
  }, [challengeId, user]);

  const fetchChallengeDetails = async () => {
    try {
      const response = await fetch(`/api/challenges/${challengeId}`);
      const data = await response.json();
      setChallenge(data);
      
      // Check if user has already submitted to this challenge
      if (user) {
        const submissionResponse = await fetch(`/api/challenges/${challengeId}/submissions/check`, {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        });
        if (submissionResponse.ok) {
          const submissionData = await submissionResponse.json();
          console.log('Existing submission found:', submissionData);
          setExistingSubmission(submissionData);
        } else {
          console.log('No existing submission found');
          setExistingSubmission(null);
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching challenge details:', error);
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSubmissionData(prev => ({
        ...prev,
        photo: file,
        previewUrl: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      onPageChange('login');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('reflection', submissionData.reflection);
      formData.append('photo', submissionData.photo);
      formData.append('challengeId', challengeId);

      const token = localStorage.getItem('token');
      const response = await fetch('/api/challenges/submit', {
        method: 'POST',
        headers: {
          'x-auth-token': token
        },
        body: formData
      });

      if (response.ok) {
        alert('Challenge submission successful! Your submission is under review.');
        // Refresh submission status instead of redirecting
        await fetchChallengeDetails();
        // Reset form
        setSubmissionData({
          reflection: '',
          photo: null,
          previewUrl: null
        });
      } else {
        const errorData = await response.json();
        alert(errorData.msg || 'Failed to submit challenge');
      }
    } catch (error) {
      console.error('Error submitting challenge:', error);
      alert('Failed to submit challenge');
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-600 mb-4">Challenge Not Found</h1>
          <button 
            onClick={() => onPageChange('community')}
            className="bg-green-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-green-600 text-sm sm:text-base"
          >
            Back to Community
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans bg-gray-50 text-gray-900 min-h-screen">
      <main className="pt-16 sm:pt-20 pb-8 sm:pb-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <button 
              onClick={() => onPageChange('community')}
              className="flex items-center gap-2 text-green-600 font-semibold hover:text-green-700 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              Back to Community
            </button>
          </div>

          {/* Challenge Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{challenge.title}</h1>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold self-start sm:self-auto">
                    Community Challenge
                  </span>
                </div>
                <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">{challenge.description}</p>
                
                {/* Badge Display */}
                {challenge.badge_url && (
                  <div className="mb-4 p-3 sm:p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <img 
                        src={challenge.badge_url} 
                        alt="Challenge Badge" 
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-800 text-sm sm:text-base">Earn This Badge</h4>
                        <p className="text-xs sm:text-sm text-gray-600">{challenge.badgeTitle || 'Challenge Badge'}</p>
                      </div>
                    </div>
                  </div>
                )}
              
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                  <div className="bg-green-50 p-3 sm:p-4 rounded-lg text-center">
                    <div className="text-lg sm:text-2xl font-bold text-green-600 mb-1">{challenge.points || 0}</div>
                    <div className="text-xs font-semibold text-gray-600">Reward Points</div>
                  </div>
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-lg text-center">
                    <div className="text-lg sm:text-2xl font-bold text-blue-600 mb-1">{challenge.duration || '2-3 weeks'}</div>
                    <div className="text-xs font-semibold text-gray-600">Duration</div>
                  </div>
                  <div className="bg-purple-50 p-3 sm:p-4 rounded-lg text-center">
                    <div className="text-lg sm:text-2xl font-bold text-purple-600 mb-1">{challenge.participants?.length || 0}</div>
                    <div className="text-xs font-semibold text-gray-600">Participants</div>
                  </div>
                  <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg text-center">
                    <div className="text-lg sm:text-2xl font-bold text-yellow-600 mb-1">HAU</div>
                    <div className="text-xs font-semibold text-gray-600">Location</div>
                  </div>
                </div>
            </div>
          </div>

            {/* Progress Bar */}
            <div className="mb-4 sm:mb-6">
              <div className="flex justify-between text-xs sm:text-sm font-bold mb-3">
                <span className="text-green-700">Progress</span>
                <span className="text-green-700">{challenge.current_progress || 0} / {challenge.target}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 sm:h-4 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(((challenge.current_progress || 0) / challenge.target) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                <span className="font-bold text-green-800 text-base sm:text-lg">Current Status: In Progress</span>
              </div>
              <p className="text-sm sm:text-base text-green-700">
                {challenge.participants?.length || 0} eco-warriors are actively participating in this challenge!
              </p>
            </div>
          </div>



          {/* Existing Submission Status */}
          {user && user.role === 'user' && existingSubmission && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Your Submission Status</h2>
              {existingSubmission.status === 'pending' && (
                <div className="bg-yellow-50 border-yellow-200 text-yellow-800 p-3 sm:p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-semibold text-sm sm:text-base">Submission Under Review</span>
                  </div>
                  <p className="text-xs sm:text-sm">Your challenge submission is currently being reviewed by our team. You cannot submit again until it's approved or rejected.</p>
                </div>
              )}
              {existingSubmission.status === 'approved' && (
                <div className="bg-green-50 border-green-200 text-green-800 p-3 sm:p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-semibold text-sm sm:text-base">Submission Approved!</span>
                  </div>
                  <p className="text-xs sm:text-sm">Congratulations! Your challenge submission has been approved and you've earned your badge!</p>
                </div>
              )}
              {existingSubmission.status === 'rejected' && (
                <div className="bg-red-50 border-red-200 text-red-800 p-3 sm:p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-semibold text-sm sm:text-base">Submission Rejected</span>
                  </div>
                  <p className="text-xs sm:text-sm mb-3">Your submission was rejected. You can submit again with improved documentation.</p>
                  <button
                    onClick={() => {
                      setSubmissionData({
                        reflection: '',
                        photo: null,
                        previewUrl: null
                      });
                      setExistingSubmission(null);
                    }}
                    className="bg-green-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-600 transition text-sm sm:text-base"
                  >
                    Submit Again
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Submission Form */}
          {user && user.role === 'user' && !existingSubmission && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Submit Your Challenge</h2>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Reflection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reflection
                </label>
                <textarea
                  value={submissionData.reflection}
                  onChange={(e) => setSubmissionData(prev => ({ ...prev, reflection: e.target.value }))}
                  placeholder="Share your thoughts on the impact of this challenge..."
                  className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                  rows="4"
                  required
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Photo Proof (Geo-tagged evidence)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="challenge-photo-upload"
                    required
                  />
                  <label 
                    htmlFor="challenge-photo-upload" 
                    className="cursor-pointer block"
                  >
                    {submissionData.previewUrl ? (
                      <div className="space-y-3 sm:space-y-4">
                        <img 
                          src={submissionData.previewUrl} 
                          alt="Challenge proof preview" 
                          className="max-h-32 sm:max-h-48 mx-auto rounded-lg"
                        />
                        <p className="text-xs sm:text-sm text-green-600">Click to change photo</p>
                      </div>
                    ) : (
                      <div className="space-y-3 sm:space-y-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                          <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-base sm:text-lg font-semibold text-gray-700">Choose File</p>
                          <p className="text-xs sm:text-sm text-gray-500">Max 5MB. Must clearly show the completed action.</p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !submissionData.reflection || !submissionData.photo || (existingSubmission && existingSubmission.status === 'pending')}
                className="w-full bg-green-500 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg hover:bg-green-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (existingSubmission && existingSubmission.status === 'pending') ? (
                  <>
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                    Submission Under Review
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    Submit Challenge for Review
                  </>
                )}
              </button>
            </form>
          </div>
        )}

          {/* Not logged in message */}
          {!user && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 sm:p-8 text-center">
              <h3 className="text-xl sm:text-2xl font-black text-yellow-800 mb-3">Login Required</h3>
              <p className="text-base sm:text-lg text-yellow-700 mb-4 sm:mb-6">You need to be logged in to participate in this challenge.</p>
              <button 
                onClick={() => onPageChange('login')}
                className="bg-green-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl hover:bg-green-600 font-bold text-base sm:text-lg"
              >
                Login to Participate
              </button>
            </div>
          )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChallengeDetailsPage;
