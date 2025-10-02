//Josh Andrei Aguiluz
import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { 
    BookOpen, BarChart, Users, TrendingUp, Plus, Edit, Trash2, 
    Search, Calendar, MapPin, Award, Target, CheckCircle, Clock,
    FileText, Share2, Eye, MessageCircle, Heart, X, Save, Camera
} from 'lucide-react';

// --- HELPER COMPONENTS ---

const StatCard = ({ icon, value, label, bgColor, trend }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border">
        <div className="flex items-center gap-4">
            <div className={`${bgColor} p-3 rounded-lg`}>{icon}</div>
            <div className="flex-1">
                <p className="text-3xl font-bold">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
                {trend && <p className="text-xs text-green-600 font-semibold mt-1">↑ {trend}</p>}
            </div>
        </div>
    </div>
);

const TabButton = ({ id, label, icon, activeTab, setActiveTab, badge }) => (
    <button
        onClick={() => setActiveTab(id)}
        className={`relative flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
            activeTab === id
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100'
        }`}
    >
        {icon}
        {label}
        {badge && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {badge}
            </span>
        )}
    </button>
);

// --- QUEST FORM MODAL ---
const QuestModal = ({ quest, onClose, onSave }) => {
    const [formData, setFormData] = useState(quest || {
        title: '',
        category: 'Gardening & Planting',
        difficulty: 'Medium',
        points: 50,
        description: '',
        location: '',
        date: '',
        maxParticipants: 50,
        requirements: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(quest?.image_url || null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (e) => setPreviewUrl(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, photo: selectedFile });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h3 className="text-2xl font-bold">{quest ? 'Edit Quest' : 'Create New Quest'}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Quest Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., Campus Tree Planting"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option>Gardening & Planting</option>
                                <option>Recycling & Waste</option>
                                <option>Energy Conservation</option>
                                <option>Water Conservation</option>
                                <option>Education & Awareness</option>
                                <option>Transportation</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Difficulty</label>
                            <select
                                value={formData.difficulty}
                                onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option>Easy</option>
                                <option>Medium</option>
                                <option>Hard</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Points Reward</label>
                            <input
                                type="number"
                                required
                                value={formData.points}
                                onChange={(e) => setFormData({...formData, points: parseInt(e.target.value)})}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Max Participants</label>
                            <input
                                type="number"
                                required
                                value={formData.maxParticipants}
                                onChange={(e) => setFormData({...formData, maxParticipants: parseInt(e.target.value)})}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Location</label>
                            <input
                                type="text"
                                required
                                value={formData.location}
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="e.g., HAU Main Campus"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">Duration</label>
                            <input
                                type="text"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({...formData, date: e.target.value})}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="e.g., 1 week"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Description</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            rows="4"
                            placeholder="Describe the quest objectives and activities..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Requirements</label>
                        <textarea
                            value={formData.requirements}
                            onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            rows="3"
                            placeholder="List any requirements or materials needed..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Quest Image</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="quest-image-upload"
                            />
                            <label 
                                htmlFor="quest-image-upload" 
                                className="cursor-pointer block text-center"
                            >
                                {previewUrl ? (
                                    <div className="space-y-2">
                                        <img 
                                            src={previewUrl} 
                                            alt="Quest preview" 
                                            className="max-h-32 mx-auto rounded-lg"
                                        />
                                        <p className="text-sm text-green-600">Click to change image</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                                            <Camera className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <p className="text-sm text-gray-600">Click to upload quest image</p>
                                        <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition font-semibold flex items-center justify-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            {quest ? 'Update Quest' : 'Create Quest'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border rounded-lg hover:bg-gray-50 transition font-semibold"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- COMMUNITY POST MODAL ---
const PostModal = ({ post, onClose, onSave }) => {
    const [formData, setFormData] = useState(post || {
        title: '',
        category: 'Updates',
        content: '',
        tags: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h3 className="text-2xl font-bold">{post ? 'Edit Post' : 'Create New Post'}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Post Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., Tips for Sustainable Living"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option>Updates</option>
                            <option>Environmental Tips</option>
                            <option>Success Stories</option>
                            <option>Events</option>
                            <option>News</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Content</label>
                        <textarea
                            required
                            value={formData.content}
                            onChange={(e) => setFormData({...formData, content: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            rows="8"
                            placeholder="Write your post content here..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Tags (comma-separated)</label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({...formData, tags: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., sustainability, recycling, climate"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Post Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Optional: Upload an image for this post</p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition font-semibold flex items-center justify-center gap-2"
                        >
                            <Share2 className="w-5 h-5" />
                            {post ? 'Update Post' : 'Publish Post'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border rounded-lg hover:bg-gray-50 transition font-semibold"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- OVERVIEW TAB ---
const OverviewTab = ({ quests, posts, setActiveTab }) => {
    const activeQuests = quests.filter(q => q.isActive).length;
    const totalParticipants = quests.reduce((sum, q) => sum + (q.completions?.length || 0), 0);
    const totalPoints = quests.reduce((sum, q) => sum + q.points, 0);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    icon={<BookOpen className="w-6 h-6 text-green-500" />} 
                    value={activeQuests} 
                    label="Active Quests" 
                    bgColor="bg-green-50"
                    trend="12% this month"
                />
                <StatCard 
                    icon={<Users className="w-6 h-6 text-blue-500" />} 
                    value={totalParticipants} 
                    label="Total Participants" 
                    bgColor="bg-blue-50"
                    trend="8% this week"
                />
                <StatCard 
                    icon={<Award className="w-6 h-6 text-yellow-500" />} 
                    value={totalPoints} 
                    label="Points Awarded" 
                    bgColor="bg-yellow-50"
                />
                <StatCard 
                    icon={<TrendingUp className="w-6 h-6 text-purple-500" />} 
                    value="95%" 
                    label="Success Rate" 
                    bgColor="bg-purple-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg border">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">Quick Actions</h3>
                    </div>
                    <div className="space-y-3">
                        <button 
                            onClick={() => setActiveTab('quests')}
                            className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-green-50 transition-colors border"
                        >
                            <div className="bg-green-100 p-3 rounded-lg">
                                <Plus className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="text-left flex-1">
                                <p className="font-semibold">Create Quest</p>
                                <p className="text-xs text-gray-500">Add a new environmental quest</p>
                            </div>
                        </button>
                        <button 
                            onClick={() => setActiveTab('community')}
                            className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-blue-50 transition-colors border"
                        >
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="text-left flex-1">
                                <p className="font-semibold">Create Post</p>
                                <p className="text-xs text-gray-500">Share updates with community</p>
                            </div>
                        </button>
                        <button 
                            onClick={() => setActiveTab('analytics')}
                            className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-purple-50 transition-colors border"
                        >
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <BarChart className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="text-left flex-1">
                                <p className="font-semibold">View Analytics</p>
                                <p className="text-xs text-gray-500">Check quest performance</p>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border">
                    <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 py-2">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                            <div className="flex-1">
                                <p className="font-semibold text-sm">Quest Completed</p>
                                <p className="text-xs text-gray-500">Campus Tree Planting finished</p>
                            </div>
                            <p className="text-xs text-gray-400">2h ago</p>
                        </div>
                        <div className="flex items-start gap-3 py-2">
                            <Users className="w-5 h-5 text-blue-500 mt-1" />
                            <div className="flex-1">
                                <p className="font-semibold text-sm">New Participants</p>
                                <p className="text-xs text-gray-500">12 students joined your quest</p>
                            </div>
                            <p className="text-xs text-gray-400">5h ago</p>
                        </div>
                        <div className="flex items-start gap-3 py-2">
                            <Heart className="w-5 h-5 text-red-500 mt-1" />
                            <div className="flex-1">
                                <p className="font-semibold text-sm">Post Engagement</p>
                                <p className="text-xs text-gray-500">Your post received 45 likes</p>
                            </div>
                            <p className="text-xs text-gray-400">1d ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- QUESTS TAB ---
const QuestsTab = ({ quests, setQuests }) => {
    const [showModal, setShowModal] = useState(false);
    const [editingQuest, setEditingQuest] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSaveQuest = async (questData) => {
        try {
            const token = localStorage.getItem('token');
            
            // Use FormData if there's a photo, otherwise use JSON
            if (questData.photo) {
                const formData = new FormData();
                formData.append('title', questData.title);
                formData.append('description', questData.description);
                formData.append('category', questData.category);
                formData.append('difficulty', questData.difficulty);
                formData.append('points', questData.points);
                formData.append('duration', questData.date);
                formData.append('location', questData.location);
                formData.append('objectives', JSON.stringify([questData.description]));
                formData.append('submissionRequirements', JSON.stringify(questData.requirements ? [questData.requirements] : ['Photo proof required']));
                formData.append('maxParticipants', questData.maxParticipants);
                formData.append('photo', questData.photo);

                const response = await fetch('http://localhost:5000/api/quests', {
                    method: 'POST',
                    headers: {
                        'x-auth-token': token
                    },
                    body: formData
                });
                
                if (!response.ok) throw new Error('Failed to create quest');
                const newQuest = await response.json();
                setQuests([newQuest, ...quests]);
            } else {
                const payload = {
                    title: questData.title,
                    description: questData.description,
                    category: questData.category,
                    difficulty: questData.difficulty,
                    points: questData.points,
                    duration: questData.date,
                    location: questData.location,
                    objectives: [questData.description],
                    submissionRequirements: questData.requirements ? [questData.requirements] : ['Photo proof required'],
                    maxParticipants: questData.maxParticipants
                };

                if (editingQuest) {
                    const response = await fetch(`http://localhost:5000/api/quests/${editingQuest._id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-auth-token': token
                        },
                        body: JSON.stringify(payload)
                    });
                    
                    if (!response.ok) throw new Error('Failed to update quest');
                    const updatedQuest = await response.json();
                    setQuests(quests.map(q => q._id === editingQuest._id ? updatedQuest : q));
                } else {
                    const response = await fetch('http://localhost:5000/api/quests', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-auth-token': token
                        },
                        body: JSON.stringify(payload)
                    });
                    
                    if (!response.ok) throw new Error('Failed to create quest');
                    const newQuest = await response.json();
                    setQuests([newQuest, ...quests]);
                }
            }
            
            setShowModal(false);
            setEditingQuest(null);
        } catch (error) {
            console.error('Error saving quest:', error);
            alert('Failed to save quest. Please try again.');
        }
    };

    const handleDeleteQuest = async (id) => {
        if (!confirm('Are you sure you want to delete this quest?')) return;
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/quests/${id}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': token
                }
            });
            
            if (!response.ok) throw new Error('Failed to delete quest');
            setQuests(quests.filter(q => q._id !== id));
        } catch (error) {
            console.error('Error deleting quest:', error);
            alert('Failed to delete quest. You may not have permission.');
        }
    };

    const filteredQuests = quests.filter(q => 
        q.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h3 className="text-xl font-bold">Quest Management</h3>
                        <p className="text-sm text-gray-500">Create and manage your environmental quests</p>
                    </div>
                    <button 
                        onClick={() => {
                            setEditingQuest(null);
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-semibold"
                    >
                        <Plus className="w-4 h-4" />
                        Create Quest
                    </button>
                </div>

                <div className="mb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search quests..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredQuests.length === 0 ? (
                        <div className="text-center py-12">
                            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No quests found. Create your first quest!</p>
                        </div>
                    ) : (
                        filteredQuests.map(quest => (
                            <div key={quest._id} className="border rounded-xl p-5 hover:shadow-md transition">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <h4 className="text-lg font-bold">{quest.title}</h4>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                quest.isActive 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}>
                                                {quest.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                            <span className={`text-xs font-semibold px-2 py-1 rounded ${
                                                quest.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                                quest.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {quest.difficulty}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                                            <span className="flex items-center gap-1">
                                                <Target className="w-4 h-4" />
                                                {quest.category}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Award className="w-4 h-4" />
                                                {quest.points} points
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                {quest.completions?.length || 0} participants
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {quest.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {quest.duration}
                                            </span>
                                        </div>
                                        {quest.description && (
                                            <p className="text-sm text-gray-600 line-clamp-2">{quest.description}</p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => {
                                                setEditingQuest(quest);
                                                setShowModal(true);
                                            }}
                                            className="p-2 hover:bg-blue-50 rounded-lg transition border border-blue-200"
                                        >
                                            <Edit className="w-5 h-5 text-blue-600" />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteQuest(quest._id)}
                                            className="p-2 hover:bg-red-50 rounded-lg transition border border-red-200"
                                        >
                                            <Trash2 className="w-5 h-5 text-red-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {showModal && (
                <QuestModal
                    quest={editingQuest}
                    onClose={() => {
                        setShowModal(false);
                        setEditingQuest(null);
                    }}
                    onSave={handleSaveQuest}
                />
            )}
        </div>
    );
};

// --- COMMUNITY TAB ---
const CommunityTab = ({ posts, setPosts }) => {
    const [showModal, setShowModal] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSavePost = async (postData) => {
        try {
            const token = localStorage.getItem('token');
            
            if (editingPost) {
                // For updates, use JSON for now
                const payload = {
                    title: postData.title,
                    content: postData.content,
                    category: postData.category,
                    tags: postData.tags.split(',').map(t => t.trim()).filter(t => t)
                };

                const response = await fetch(`http://localhost:5000/api/posts/${editingPost._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    },
                    body: JSON.stringify(payload)
                });
                
                if (!response.ok) throw new Error('Failed to update post');
                const updatedPost = await response.json();
                setPosts(posts.map(p => p._id === editingPost._id ? updatedPost : p));
            } else {
                // For new posts, use FormData to handle file uploads
                const formData = new FormData();
                formData.append('title', postData.title);
                formData.append('content', postData.content);
                formData.append('category', postData.category);
                formData.append('tags', JSON.stringify(postData.tags.split(',').map(t => t.trim()).filter(t => t)));
                
                if (postData.image) {
                    formData.append('image', postData.image);
                }

                const response = await fetch('http://localhost:5000/api/posts', {
                    method: 'POST',
                    headers: {
                        'x-auth-token': token
                    },
                    body: formData
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.msg || 'Failed to create post');
                }
                const newPost = await response.json();
                setPosts([newPost, ...posts]);
            }
            
            setShowModal(false);
            setEditingPost(null);
        } catch (error) {
            console.error('Error saving post:', error);
            alert(`Failed to save post: ${error.message}`);
        }
    };

    const handleDeletePost = async (id) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5000/api/posts/${id}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': token
                }
            });
            setPosts(posts.filter(p => p._id !== id));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const filteredPosts = posts.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h3 className="text-xl font-bold">Community Content</h3>
                        <p className="text-sm text-gray-500">Manage your blog posts and community updates</p>
                    </div>
                    <button 
                        onClick={() => {
                            setEditingPost(null);
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-semibold"
                    >
                        <Plus className="w-4 h-4" />
                        Create Post
                    </button>
                </div>

                <div className="mb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredPosts.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No posts found. Create your first post!</p>
                        </div>
                    ) : (
                        filteredPosts.map(post => (
                            <div key={post._id} className="border rounded-xl p-5 hover:shadow-md transition">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <h4 className="text-lg font-bold">{post.title}</h4>
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                                {post.category}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.content}</p>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(post.created_at).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-4 h-4" />
                                                {post.views} views
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Heart className="w-4 h-4" />
                                                {post.likes?.length || 0} likes
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MessageCircle className="w-4 h-4" />
                                                {post.comments?.length || 0} comments
                                            </span>
                                        </div>
                                        {post.tags && post.tags.length > 0 && (
                                            <div className="flex gap-2 mt-2 flex-wrap">
                                                {post.tags.map((tag, idx) => (
                                                    <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => {
                                                setEditingPost({...post, tags: post.tags?.join(', ') || ''});
                                                setShowModal(true);
                                            }}
                                            className="p-2 hover:bg-blue-50 rounded-lg transition border border-blue-200"
                                        >
                                            <Edit className="w-5 h-5 text-blue-600" />
                                        </button>
                                        <button 
                                            onClick={() => handleDeletePost(post._id)}
                                            className="p-2 hover:bg-red-50 rounded-lg transition border border-red-200"
                                        >
                                            <Trash2 className="w-5 h-5 text-red-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {showModal && (
                <PostModal
                    post={editingPost}
                    onClose={() => {
                        setShowModal(false);
                        setEditingPost(null);
                    }}
                    onSave={handleSavePost}
                />
            )}
        </div>
    );
};

// --- ANALYTICS TAB ---
const AnalyticsTab = ({ quests }) => {
    const totalQuests = quests.length;
    const activeQuests = quests.filter(q => q.isActive).length;
    const completedQuests = quests.filter(q => !q.isActive).length;
    const totalParticipants = quests.reduce((sum, q) => sum + (q.completions?.length || 0), 0);
    const avgParticipants = totalQuests > 0 ? Math.round(totalParticipants / totalQuests) : 0;

    const categoryStats = {};
    quests.forEach(q => {
        categoryStats[q.category] = (categoryStats[q.category] || 0) + 1;
    });

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md border">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-500">Total Quests</p>
                        <BookOpen className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold">{totalQuests}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        {activeQuests} active, {completedQuests} completed
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-500">Total Participants</p>
                        <Users className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-3xl font-bold">{totalParticipants}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        Avg {avgParticipants} per quest
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-500">Completion Rate</p>
                        <TrendingUp className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className="text-3xl font-bold">
                        {totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0}%
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        {completedQuests} of {totalQuests} quests
                    </p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border">
                <h3 className="text-xl font-bold mb-4">Quest Categories Distribution</h3>
                <div className="space-y-3">
                    {Object.entries(categoryStats).map(([category, count]) => (
                        <div key={category} className="flex items-center gap-3">
                            <div className="w-32 text-sm font-semibold text-gray-700">{category}</div>
                            <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                                <div 
                                    className="bg-green-500 h-full rounded-full flex items-center justify-end pr-3 text-white text-sm font-semibold"
                                    style={{ width: `${(count / totalQuests) * 100}%` }}
                                >
                                    {count}
                                </div>
                            </div>
                            <div className="w-16 text-sm text-gray-500 text-right">
                                {Math.round((count / totalQuests) * 100)}%
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border">
                <h3 className="text-xl font-bold mb-4">Top Performing Quests</h3>
                <div className="space-y-3">
                    {quests
                        .sort((a, b) => (b.completions?.length || 0) - (a.completions?.length || 0))
                        .slice(0, 5)
                        .map((quest, idx) => (
                            <div key={quest._id} className="flex items-center gap-4 p-3 border rounded-lg">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-700">
                                    {idx + 1}
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold">{quest.title}</p>
                                    <p className="text-sm text-gray-500">{quest.category}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-green-600">{quest.completions?.length || 0}</p>
                                    <p className="text-xs text-gray-500">participants</p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

// --- DAILY MANAGEMENT TAB ---
const DailyTab = () => {
    const [dailyQuest, setDailyQuest] = useState(null);
    const [dailyChallenge, setDailyChallenge] = useState(null);
    const [showQuestModal, setShowQuestModal] = useState(false);
    const [showChallengeModal, setShowChallengeModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDailyContent();
    }, []);

    const fetchDailyContent = async () => {
        try {
            // Fetch today's quest
            const questRes = await fetch('http://localhost:5000/api/daily/quest');
            const questData = await questRes.json();
            setDailyQuest(questData.quest);

            // Fetch today's challenge
            const challengeRes = await fetch('http://localhost:5000/api/daily/challenge');
            const challengeData = await challengeRes.json();
            setDailyChallenge(challengeData.challenge);
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching daily content:', error);
            setLoading(false);
        }
    };

    const handleCreateDailyQuest = async (questData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/daily/quest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(questData)
            });

            if (response.ok) {
                const newQuest = await response.json();
                setDailyQuest(newQuest);
                setShowQuestModal(false);
                alert('Daily quest created successfully!');
            } else {
                const error = await response.json();
                alert(error.msg || 'Failed to create daily quest');
            }
        } catch (error) {
            console.error('Error creating daily quest:', error);
            alert('Network error. Please try again.');
        }
    };

    const handleCreateDailyChallenge = async (challengeData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/daily/challenge', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(challengeData)
            });

            if (response.ok) {
                const newChallenge = await response.json();
                setDailyChallenge(newChallenge);
                setShowChallengeModal(false);
                alert('Daily challenge created successfully!');
            } else {
                const error = await response.json();
                alert(error.msg || 'Failed to create daily challenge');
            }
        } catch (error) {
            console.error('Error creating daily challenge:', error);
            alert('Network error. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Today's Quest Section */}
            <div className="bg-white p-6 rounded-xl shadow-md border">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Today's Quest</h3>
                    {!dailyQuest && (
                        <button 
                            onClick={() => setShowQuestModal(true)}
                            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                        >
                            <Plus className="w-4 h-4" />
                            Create Daily Quest
                        </button>
                    )}
                </div>
                
                {dailyQuest ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-bold text-green-800 mb-2">{dailyQuest.title}</h4>
                        <p className="text-green-700 text-sm mb-2">{dailyQuest.description}</p>
                        <div className="flex items-center gap-4 text-xs text-green-600">
                            <span>Category: {dailyQuest.category}</span>
                            <span>Points: {dailyQuest.points}</span>
                            <span>Difficulty: {dailyQuest.difficulty}</span>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p>No daily quest created for today</p>
                    </div>
                )}
            </div>

            {/* Today's Community Challenge Section */}
            <div className="bg-white p-6 rounded-xl shadow-md border">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Today's Community Challenge</h3>
                    {!dailyChallenge && (
                        <button 
                            onClick={() => setShowChallengeModal(true)}
                            className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
                        >
                            <Plus className="w-4 h-4" />
                            Create Daily Challenge
                        </button>
                    )}
                </div>
                
                {dailyChallenge ? (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <h4 className="font-bold text-purple-800 mb-2">{dailyChallenge.title}</h4>
                        <p className="text-purple-700 text-sm">{dailyChallenge.content}</p>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p>No community challenge created for today</p>
                    </div>
                )}
            </div>

            {/* Daily Quest Modal */}
            {showQuestModal && (
                <QuestModal 
                    onClose={() => setShowQuestModal(false)}
                    onSave={handleCreateDailyQuest}
                />
            )}

            {/* Daily Challenge Modal */}
            {showChallengeModal && (
                <PostModal 
                    onClose={() => setShowChallengeModal(false)}
                    onSave={handleCreateDailyChallenge}
                />
            )}
        </div>
    );
};

// --- MAIN PARTNER DASHBOARD ---
const PartnerDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const { user, logout } = useUser();

    const [quests, setQuests] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Protect against unauthorized access and pending role requests
        if (!user) return;
        
        if (user.role !== 'partner') {
            alert('Access denied. Partner privileges required.');
            logout();
            window.location.href = '/';
            return;
        }
        
        // Block access if user has pending role request (they're still technically 'user' role)
        if (user.requested_role && !user.is_approved) {
            alert('Your partner application is still pending approval. Redirecting to dashboard.');
            window.location.href = '/dashboard';
            return;
        }
        
        if (user.role === 'partner' && user.is_approved) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // Fetch quests
            const questsRes = await fetch('http://localhost:5000/api/quests', {
                headers: { 'x-auth-token': token }
            });
            const questsData = await questsRes.json();
            const userQuests = questsData.filter(q => q.createdBy?._id === user?._id || q.createdBy === user?._id);
            setQuests(userQuests);

            // Fetch posts
            const postsRes = await fetch('http://localhost:5000/api/posts', {
                headers: { 'x-auth-token': token }
            });
            const postsData = await postsRes.json();
            const userPosts = postsData.filter(p => p.author?._id === user?._id || p.author === user?._id);
            setPosts(userPosts);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="pt-24 text-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (user.role !== 'partner' && user.role !== 'admin') {
        return (
            <div className="pt-24 text-center">
                <p className="text-red-600 font-semibold">Access Denied. Partner or Admin privileges required.</p>
            </div>
        );
    }

    return (
        <div className="font-sans bg-gray-50 text-gray-800 min-h-screen">
            <main className="container mx-auto px-4 pt-24 pb-12">
                {/* Header */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-3xl font-bold text-gray-800">Partner Dashboard</h2>
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                                    Partner
                                </span>
                            </div>
                            <p className="text-gray-500">Welcome back, {user.username}! Manage your environmental initiatives.</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white p-2 rounded-xl shadow-md border inline-flex items-center gap-2 mb-8">
                    <TabButton id="overview" label="Overview" icon={<BarChart className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="quests" label="My Quests" icon={<BookOpen className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} badge={quests.filter(q => q.isActive).length} />
                    <TabButton id="community" label="Community" icon={<FileText className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="daily" label="Daily Content" icon={<Calendar className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="analytics" label="Analytics" icon={<TrendingUp className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && <OverviewTab quests={quests} posts={posts} setActiveTab={setActiveTab} />}
                {activeTab === 'quests' && <QuestsTab quests={quests} setQuests={setQuests} />}
                {activeTab === 'community' && <CommunityTab posts={posts} setPosts={setPosts} />}
                {activeTab === 'daily' && <DailyTab />}
                {activeTab === 'analytics' && <AnalyticsTab quests={quests} />}
            </main>
        </div>
    );
};

export default PartnerDashboard;

