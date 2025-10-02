import React, { useState } from 'react';
import {
    ChevronLeft, TreePine, Award, Clock, Users, MapPin, CheckCircle, Upload, XCircle, Heart,
    ClipboardList, Camera, AlertTriangle, UploadCloud, FileText, Sprout
} from 'lucide-react';

// --- HELPER COMPONENTS ---

// Reusable Stat Component
const StatItem = ({ icon, value, label, iconColor }) => (
    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
        <div className={`p-2 rounded-lg ${iconColor}`}>{icon}</div>
        <div>
            <p className="text-xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    </div>
);

// Quest Submission Form Component
const QuestSubmissionForm = ({ questId, onSubmissionSuccess, existingSubmission }) => {
    const [file, setFile] = useState(null);
    const [reflection, setReflection] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // --- CHANGE: Minimum word count constant removed ---

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // --- CHANGE: Minimum word count validation removed ---
        
        if (!file) {
            alert('Please upload a photo as proof of completion.');
            return;
        }

        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('reflection_text', reflection);
            formData.append('photo', file);

            const response = await fetch(`http://localhost:5000/api/quests/${questId}/submit`, {
                method: 'POST',
                headers: {
                    'x-auth-token': token
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                setIsSubmitted(true);
                if (onSubmissionSuccess) {
                    onSubmissionSuccess();
                }
            } else {
                alert(data.msg || 'Failed to submit quest. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting quest:', error);
            alert('Network error. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- CHANGE: Submission is ready if reflection has any content and a file is present ---
    const isSubmissionReady = reflection.trim().length > 0 && file;

    // Check if submission already exists
    if (existingSubmission) {
        const statusColors = {
            'pending': 'bg-yellow-50 border-yellow-300 text-yellow-800',
            'approved': 'bg-green-50 border-green-300 text-green-800',
            'rejected': 'bg-red-50 border-red-300 text-red-800'
        };
        const statusColor = statusColors[existingSubmission.status] || statusColors['pending'];
        
        return (
            <div className={`${statusColor} border p-6 rounded-xl text-center`}>
                <Clock className="w-12 h-12 mx-auto mb-3" />
                <h4 className="text-xl font-bold mb-2">Quest {existingSubmission.status === 'pending' ? 'In Progress' : existingSubmission.status === 'approved' ? 'Completed' : 'Submission Rejected'}</h4>
                <p className="mb-2">
                    {existingSubmission.status === 'pending' && 'Your submission is being reviewed by the Quest Master.'}
                    {existingSubmission.status === 'approved' && 'Congratulations! Your quest has been approved and points awarded.'}
                    {existingSubmission.status === 'rejected' && `Your submission was rejected. Reason: ${existingSubmission.rejection_reason || 'No reason provided'}`}
                </p>
                <p className="text-sm opacity-75">Submitted on {new Date(existingSubmission.submitted_at).toLocaleDateString()}</p>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="bg-green-50 border border-green-300 p-6 rounded-xl text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h4 className="text-xl font-bold text-green-800 mb-2">Quest Submitted!</h4>
                <p className="text-green-700">Your evidence has been sent to the Quest Master for review. You'll receive your points soon!</p>
                <button 
                    onClick={() => setIsSubmitted(false)}
                    className="mt-4 text-green-600 font-semibold hover:underline"
                >
                    Submit Another Quest
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-green-600" />
                Proof Submission
            </h3>

            {/* 1. Reflection Textarea */}
            <div>
                {/* --- CHANGE: Updated label to remove word count mention --- */}
                <label htmlFor="reflection" className="block text-sm font-semibold mb-2 text-gray-700">
                    Reflection on Reforestation
                </label>
                <textarea
                    id="reflection"
                    name="reflection"
                    rows="4"
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="Share your thoughts on the impact of this quest..."
                    className="w-full p-3 border rounded-xl focus:ring-green-500 focus:border-green-500"
                    required
                ></textarea>
                {/* --- CHANGE: Word count display removed --- */}
            </div>
            
            {/* 2. File Upload */}
            <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Upload Photo/Video Proof (Geo-tagged evidence)
                </label>
                <div className="flex items-center space-x-2">
                    <input
                        type="file"
                        id="proof-file"
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <label 
                        htmlFor="proof-file" 
                        className="flex-1 cursor-pointer bg-green-500 text-white py-3 px-4 rounded-xl font-semibold text-center hover:bg-green-600 transition-colors"
                    >
                        <span className='flex items-center justify-center gap-2'>
                            <Upload className="w-5 h-5" />
                            {file ? file.name : 'Choose File'}
                        </span>
                    </label>
                    {file && (
                        <button onClick={() => setFile(null)} type="button" className="p-2 text-red-500 hover:text-red-700">
                            <XCircle className="w-6 h-6" />
                        </button>
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Max 5MB. Must clearly show the completed action.</p>
            </div>

            <button
                type="submit"
                className={`w-full flex justify-center items-center gap-2 py-3 rounded-xl text-lg font-bold transition-colors ${
                    isSubmissionReady && !isSubmitting
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
                disabled={!isSubmissionReady || isSubmitting}
            >
                <CheckCircle className="w-5 h-5" />
                {isSubmitting ? 'Submitting...' : 'Submit Quest for Review'}
            </button>
        </form>
    );
};


// --- MAIN PAGE COMPONENT ---

const QuestDetailsPage = ({ quest, onBack, onSubmissionSuccess, userRole }) => {
    // Fallback and Destructuring with Mock Data from QuestsPage
    const { 
        title, description, difficulty, points, duration, participants, 
        color, icon, category: propCategory, location: propLocation 
    } = quest;
    
    // Check if user is admin or partner (view-only mode)
    const isViewOnly = userRole === 'admin' || userRole === 'partner';

    const category = propCategory || "General Quest";
    const location = propLocation || "HAU Campus";
    
    // --- CHANGE: Process objectives to remove the word count from the text ---
    // This will dynamically remove "(50-word)" from any objective text that contains it.
    const originalObjectives = quest.objectives || ["Complete the primary task as outlined in the quest description.", "Document your progress with photo evidence.", "Submit a reflection on the experience."];
    const objectives = originalObjectives.map(obj => obj.replace(/a short \(50-word\) /i, 'a '));

    const submissionRequirements = quest.submissionRequirements || ["One high-resolution photo/video.","A log or text summary of your results.","Adherence to HAU Eco-Quest guidelines."];
    
    // Determine quest status based on user's submission
    const getQuestStatus = () => {
        // This would need to be passed from the parent component or fetched
        // For now, we'll use the quest status if provided
        if (quest.submissionStatus === 'approved') return 'Completed';
        if (quest.submissionStatus === 'pending') return 'Under Review';
        if (quest.submissionStatus === 'rejected') return 'Rejected';
        return 'In Progress';
    };
    
    const status = getQuestStatus();

    // Determine status styling
    let statusStyle = 'bg-gray-100 text-gray-700';
    if (status === 'In Progress') {
        statusStyle = 'bg-blue-100 text-blue-700';
    } else if (status === 'Completed') {
        statusStyle = 'bg-green-100 text-green-700';
    } else if (status === 'Under Review') {
        statusStyle = 'bg-yellow-100 text-yellow-700';
    } else if (status === 'Rejected') {
        statusStyle = 'bg-red-100 text-red-700';
    }
    
    // Determine difficulty styling
    const difficultyStyles = {
        Easy: 'bg-green-100 text-green-600',
        Medium: 'bg-yellow-100 text-yellow-600',
        Hard: 'bg-red-100 text-red-600',
    };
    const diffStyle = difficultyStyles[difficulty] || difficultyStyles.Medium;

    return (
        <div className="font-sans bg-gray-50 text-gray-800 min-h-screen">
            <main className="container mx-auto px-4 pt-24 pb-12">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-green-600 font-semibold mb-6 hover:text-green-700 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Back to All Quests
                    </button>

                    {/* Quest Header and Stats */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100 mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-xl bg-green-100">
                                    {/* Using a generic icon if the prop doesn't pass a valid element */}
                                    {icon || <TreePine className="w-8 h-8 text-green-700" />}
                                </div>
                                <div>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${diffStyle} mr-2`}>
                                        {difficulty}
                                    </span>
                                    <span className="text-sm text-gray-500">{category}</span>
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-red-500 transition-colors">
                                <Heart className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">{title}</h1>
                        <p className="text-gray-600 mb-6">{description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <StatItem 
                                icon={<Award className="w-5 h-5 text-yellow-500" />} 
                                value={`${points}`} 
                                label="Reward Points"
                                iconColor="bg-yellow-100"
                            />
                            <StatItem 
                                icon={<Clock className="w-5 h-5 text-blue-500" />} 
                                value={duration} 
                                label="Estimated Time"
                                iconColor="bg-blue-100"
                            />
                            <StatItem 
                                icon={<Users className="w-5 h-5 text-purple-500" />} 
                                value={participants} 
                                label="Participants"
                                iconColor="bg-purple-100"
                            />
                             <StatItem 
                                icon={<MapPin className="w-5 h-5 text-red-500" />} 
                                value={location.split(' ')[0]} 
                                label="Location"
                                iconColor="bg-red-100"
                            />
                        </div>

                        {/* Status Bar: Now shows In Progress automatically */}
                        <div className={`p-3 rounded-xl text-sm font-semibold flex items-center justify-between ${statusStyle}`}>
                            <span>Current Status:</span>
                            <span className="flex items-center gap-1">
                                {status === 'In Progress' ? <Sprout className="w-4 h-4" /> : <ClipboardList className="w-4 h-4" />}
                                {status}
                            </span>
                        </div>
                        
                        {/* ACCEPT QUEST BUTTON REMOVED AS REQUESTED */}

                    </div>

                    {/* --- Single Column Content (Objectives, Requirements, Submission) --- */}
                    <div className="space-y-8"> 
                        {/* 1. Quest Objectives */}
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <ClipboardList className="w-5 h-5 text-primary-green" />
                                Quest Objectives
                            </h3>
                            <ul className="space-y-3">
                                {objectives.map((obj, index) => (
                                    <li key={index} className="flex items-start gap-3 text-gray-700">
                                        <CheckCircle className="w-5 h-5 mt-1 text-green-500 flex-shrink-0" />
                                        <span>{obj}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* 2. Submission Requirements */}
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Camera className="w-5 h-5 text-blue-500" />
                                Submission Requirements
                            </h3>
                            <ul className="space-y-3">
                                {submissionRequirements.map((req, index) => (
                                    <li key={index} className="flex items-start gap-3 text-gray-700">
                                        <AlertTriangle className="w-5 h-5 mt-1 text-red-500 flex-shrink-0" />
                                        <span>{req}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* 3. Quest Submission Form or View-Only Message */}
                        <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100">
                            {isViewOnly ? (
                                <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl text-center">
                                    <Eye className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                                    <h4 className="text-xl font-bold text-blue-800 mb-2">View Only Mode</h4>
                                    <p className="text-blue-700">
                                        As {userRole === 'admin' ? 'an administrator' : 'a partner'}, you can view this quest but cannot participate. 
                                        Your role is to monitor progress and {userRole === 'admin' ? 'approve submissions' : 'create quests'}.
                                    </p>
                                    <div className="mt-4 grid grid-cols-2 gap-4">
                                        <div className="bg-white p-3 rounded-lg">
                                            <p className="text-2xl font-bold text-blue-600">{participants || 0}</p>
                                            <p className="text-sm text-gray-600">Total Participants</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg">
                                            <p className="text-2xl font-bold text-green-600">{points}</p>
                                            <p className="text-sm text-gray-600">Points Reward</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <QuestSubmissionForm 
                                    questId={quest._id} 
                                    onSubmissionSuccess={onSubmissionSuccess}
                                    existingSubmission={quest.existingSubmission}
                                />
                            )}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

export default QuestDetailsPage;

