//Josh Andrei Aguiluz
import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { Users, BookOpen, BarChart, Shield, CheckCircle, XCircle, Edit, Trash2, Plus, Search, Filter, Calendar, MapPin, Award, X, Save } from 'lucide-react';

// --- HELPER COMPONENTS ---

const StatCard = ({ icon, value, label, bgColor }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border">
        <div className="flex items-center gap-4">
            <div className={`${bgColor} p-3 rounded-lg`}>{icon}</div>
            <div>
                <p className="text-3xl font-bold">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
            </div>
        </div>
    </div>
);

const QuickAction = ({ icon, title, subtitle, onClick }) => (
    <button onClick={onClick} className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border w-full text-left">
        <div className="bg-gray-100 p-3 rounded-lg">{icon}</div>
        <div className="flex-1">
            <p className="font-semibold">{title}</p>
            <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
    </button>
);

const ActivityItem = ({ icon, title, subtitle, time }) => (
    <div className="flex items-start gap-3 py-3 border-b last:border-b-0">
        <div className="mt-1">{icon}</div>
        <div className="flex-1">
            <p className="font-semibold text-sm">{title}</p>
            <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        <p className="text-xs text-gray-400">{time}</p>
    </div>
);

const TabButton = ({ id, label, icon, activeTab, setActiveTab }) => (
    <button
        onClick={() => setActiveTab(id)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
            activeTab === id
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100'
        }`}
    >
        {icon}
        {label}
    </button>
);

// --- OVERVIEW TAB ---
const OverviewTab = ({ stats, setActiveTab }) => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={<Users className="w-6 h-6 text-blue-500" />} value={stats.totalUsers} label="Total Users" bgColor="bg-blue-50" />
            <StatCard icon={<BookOpen className="w-6 h-6 text-green-500" />} value={stats.activeQuests} label="Active Quests" bgColor="bg-green-50" />
            <StatCard icon={<Shield className="w-6 h-6 text-yellow-500" />} value={stats.pendingPartners} label="Pending Requests" bgColor="bg-yellow-50" />
            <StatCard icon={<BarChart className="w-6 h-6 text-purple-500" />} value="98%" label="System Health" bgColor="bg-purple-50" />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <QuickAction 
                    icon={<Users className="w-6 h-6 text-blue-500" />} 
                    title="Manage Users" 
                    subtitle="View and manage user accounts"
                    onClick={() => setActiveTab('users')}
                />
                <QuickAction 
                    icon={<BookOpen className="w-6 h-6 text-green-500" />} 
                    title="Manage Quests" 
                    subtitle="Create and edit quests"
                    onClick={() => setActiveTab('quests')}
                />
                <QuickAction 
                    icon={<BarChart className="w-6 h-6 text-purple-500" />} 
                    title="View Analytics" 
                    subtitle="System performance metrics"
                    onClick={() => setActiveTab('analytics')}
                />
                <QuickAction 
                    icon={<Calendar className="w-6 h-6 text-orange-500" />} 
                    title="Create Daily Quest" 
                    subtitle="Set today's featured quest"
                    onClick={() => setActiveTab('daily')}
                />
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border">
            <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
            <div>
                <ActivityItem 
                    icon={<Users className="w-5 h-5 text-blue-500" />}
                    title="New user registered"
                    subtitle="Recent sign up"
                    time="Recent"
                />
                <ActivityItem 
                    icon={<CheckCircle className="w-5 h-5 text-green-500" />}
                    title="Quest completed"
                    subtitle="User activity"
                    time="Recent"
                />
                <ActivityItem 
                    icon={<Shield className="w-5 h-5 text-yellow-500" />}
                    title="Partner approved"
                    subtitle="Partnership confirmed"
                    time="Recent"
                />
            </div>
        </div>
    </div>
);

// --- USER PROFILE MODAL ---
const UserProfileModal = ({ user, onClose }) => {
    if (!user) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h3 className="text-2xl font-bold">User Profile</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-10 h-10 text-white" />
                        </div>
                        <h4 className="text-2xl font-bold">{user.username}</h4>
                        <p className="text-gray-500">{user.email}</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
                            user.role === 'partner' 
                                ? 'bg-purple-100 text-purple-700' 
                                : user.role === 'admin'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-blue-100 text-blue-700'
                        }`}>
                            {user.role}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-semibold text-sm text-gray-600 mb-1">Eco Score</h5>
                            <p className="text-2xl font-bold text-green-600">{user.eco_score || 0}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-semibold text-sm text-gray-600 mb-1">Points</h5>
                            <p className="text-2xl font-bold text-blue-600">{user.points || 0}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h5 className="font-semibold text-sm text-gray-600 mb-2">Profile Information</h5>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">HAU Affiliation:</span>
                                    <span className="font-semibold">{user.hau_affiliation || 'Not specified'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Avatar Theme:</span>
                                    <span className="font-semibold">{user.avatar_theme || 'Default'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Header Theme:</span>
                                    <span className="font-semibold">{user.header_theme || 'Default'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Approval Status:</span>
                                    <span className={`font-semibold ${user.is_approved ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {user.is_approved ? 'Approved' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h5 className="font-semibold text-sm text-gray-600 mb-2">Activity</h5>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Quests Completed:</span>
                                    <span className="font-semibold">{user.questsCompleted?.length || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Member Since:</span>
                                    <span className="font-semibold">{new Date(user.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- USERS TAB ---
const UsersTab = ({ users, pendingPartners, onApprove, onReject, onDeleteUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || 
                          (filterRole === 'student' && u.role === 'user') ||
                          (filterRole === 'partner' && u.role === 'partner');
        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-8">
            {/* Pending Role Approvals (Partner & Admin) */}
            {pendingPartners.length > 0 && (
                <div className="bg-yellow-50 border-2 border-yellow-200 p-6 rounded-2xl">
                    <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-6 h-6 text-yellow-600" />
                        <h3 className="text-xl font-bold text-yellow-900">Pending Role Requests ({pendingPartners.length})</h3>
                    </div>
                    <div className="space-y-3">
                        {pendingPartners.map(request => (
                            <div key={request._id} className="bg-white p-4 rounded-lg flex items-center justify-between">
                                <div>
                                    <p className="font-semibold">{request.username}</p>
                                    <p className="text-sm text-gray-500">{request.email}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                            request.requested_role === 'admin' 
                                                ? 'bg-red-100 text-red-700' 
                                                : 'bg-purple-100 text-purple-700'
                                        }`}>
                                            Requested: {request.requested_role === 'admin' ? 'Admin' : 'Partner'}
                                        </span>
                                        <p className="text-xs text-gray-400">Applied: {new Date(request.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => onApprove(request._id)}
                                        className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Approve
                                    </button>
                                    <button 
                                        onClick={() => onReject(request._id)}
                                        className="flex items-center gap-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* User Management Table */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">User Management</h3>
                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="all">All Roles</option>
                            <option value="student">Students</option>
                            <option value="partner">Partners</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Role</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Points</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Joined</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user._id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-semibold">{user.username}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            user.role === 'partner' 
                                                ? 'bg-purple-100 text-purple-700' 
                                                : user.role === 'admin'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{user.points || 0}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{new Date(user.created_at).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => setSelectedUser(user)}
                                                className="p-2 hover:bg-blue-50 rounded-lg transition"
                                                title="View Profile"
                                            >
                                                <Users className="w-4 h-4 text-blue-600" />
                                            </button>
                                            <button 
                                                onClick={() => onDeleteUser(user._id)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition"
                                                title="Delete User"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedUser && (
                <UserProfileModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                />
            )}
        </div>
    );
};

// --- QUEST MODAL ---
const QuestModal = ({ quest, onClose, onSave }) => {
    const [formData, setFormData] = useState(quest || {
        title: '',
        category: 'Gardening & Planting',
        difficulty: 'Medium',
        points: 50,
        description: '',
        location: '',
        duration: '',
        maxParticipants: 50,
        objectives: '',
        submissionRequirements: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
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
                                value={formData.duration}
                                onChange={(e) => setFormData({...formData, duration: e.target.value})}
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
                        <label className="block text-sm font-semibold mb-2">Objectives</label>
                        <textarea
                            value={formData.objectives}
                            onChange={(e) => setFormData({...formData, objectives: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            rows="3"
                            placeholder="List quest objectives..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Submission Requirements</label>
                        <textarea
                            value={formData.submissionRequirements}
                            onChange={(e) => setFormData({...formData, submissionRequirements: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            rows="3"
                            placeholder="List submission requirements..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Quest Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Optional: Upload an image for this quest</p>
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

// --- QUESTS TAB ---
const QuestsTab = ({ quests, setQuests }) => {
    const [showModal, setShowModal] = useState(false);
    const [editingQuest, setEditingQuest] = useState(null);

    const handleSaveQuest = async (questData) => {
        try {
            const token = localStorage.getItem('token');
            
            if (editingQuest) {
                // For updates, we'll use JSON for now (can add file upload later)
                const payload = {
                    title: questData.title,
                    description: questData.description,
                    category: questData.category,
                    difficulty: questData.difficulty,
                    points: questData.points,
                    duration: questData.duration,
                    location: questData.location,
                    objectives: questData.objectives ? [questData.objectives] : [],
                    submissionRequirements: questData.submissionRequirements ? [questData.submissionRequirements] : ['Photo proof required'],
                    maxParticipants: questData.maxParticipants
                };

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
                // For new quests, use FormData to handle file uploads
                const formData = new FormData();
                formData.append('title', questData.title);
                formData.append('description', questData.description);
                formData.append('category', questData.category);
                formData.append('difficulty', questData.difficulty);
                formData.append('points', questData.points);
                formData.append('duration', questData.duration);
                formData.append('location', questData.location);
                formData.append('objectives', JSON.stringify(questData.objectives ? [questData.objectives] : []));
                formData.append('submissionRequirements', JSON.stringify(questData.submissionRequirements ? [questData.submissionRequirements] : ['Photo proof required']));
                formData.append('maxParticipants', questData.maxParticipants);
                
                if (questData.image) {
                    formData.append('image', questData.image);
                }

                const response = await fetch('http://localhost:5000/api/quests', {
                    method: 'POST',
                    headers: {
                        'x-auth-token': token
                    },
                    body: formData
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.msg || 'Failed to create quest');
                }
                const newQuest = await response.json();
                setQuests([newQuest, ...quests]);
            }
            
            setShowModal(false);
            setEditingQuest(null);
        } catch (error) {
            console.error('Error saving quest:', error);
            alert(`Failed to save quest: ${error.message}`);
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

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Quest Management</h3>
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

                <div className="space-y-4">
                    {quests.map(quest => (
                        <div key={quest._id} className="border rounded-xl p-5 hover:shadow-md transition">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="text-lg font-bold">{quest.title}</h4>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            quest.isActive 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {quest.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <BookOpen className="w-4 h-4" />
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
                                            <Calendar className="w-4 h-4" />
                                            {quest.duration}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2 ml-4">
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
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                                    quest.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                    quest.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                    {quest.difficulty}
                                </span>
                            </div>
                        </div>
                    ))}
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

// --- ANALYTICS TAB ---
const AnalyticsTab = ({ stats, users, quests }) => {
    const [analyticsData, setAnalyticsData] = useState({
        userGrowth: [],
        questCompletions: [],
        categoryStats: {},
        monthlyActivity: []
    });

    useEffect(() => {
        calculateAnalytics();
    }, [users, quests]);

    const calculateAnalytics = () => {
        // Calculate user growth over time
        const usersByMonth = {};
        users.forEach(user => {
            const month = new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
            usersByMonth[month] = (usersByMonth[month] || 0) + 1;
        });

        // Calculate quest completions by category
        const categoryStats = {};
        quests.forEach(quest => {
            const category = quest.category;
            if (!categoryStats[category]) {
                categoryStats[category] = { total: 0, completed: quest.completions?.length || 0 };
            }
            categoryStats[category].total++;
            categoryStats[category].completed += quest.completions?.length || 0;
        });

        setAnalyticsData({
            userGrowth: Object.entries(usersByMonth),
            categoryStats: categoryStats,
            totalEngagement: users.reduce((sum, u) => sum + (u.questsCompleted || 0), 0),
            averagePoints: users.length > 0 ? Math.round(users.reduce((sum, u) => sum + (u.points || 0), 0) / users.length) : 0
        });
    };

    return (
        <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md border">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.totalUsers}</p>
                            <p className="text-sm text-gray-500">Total Users</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md border">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-100 p-3 rounded-lg">
                            <BookOpen className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{quests.length}</p>
                            <p className="text-sm text-gray-500">Total Quests</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border">
                    <div className="flex items-center gap-4">
                        <div className="bg-yellow-100 p-3 rounded-lg">
                            <Award className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{analyticsData.totalEngagement}</p>
                            <p className="text-sm text-gray-500">Quest Completions</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border">
                    <div className="flex items-center gap-4">
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <BarChart className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{analyticsData.averagePoints}</p>
                            <p className="text-sm text-gray-500">Avg Points/User</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Growth Chart */}
            <div className="bg-white p-6 rounded-xl shadow-md border">
                <h3 className="text-xl font-bold mb-4">User Registration Growth</h3>
                <div className="space-y-3">
                    {analyticsData.userGrowth.map(([month, count], index) => (
                        <div key={index} className="flex items-center justify-between">
                            <span className="text-sm font-medium">{month}</span>
                            <div className="flex items-center gap-3">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-blue-500 h-2 rounded-full" 
                                        style={{ width: `${(count / Math.max(...analyticsData.userGrowth.map(([,c]) => c))) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm text-gray-600 w-8">{count}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Category Performance */}
            <div className="bg-white p-6 rounded-xl shadow-md border">
                <h3 className="text-xl font-bold mb-4">Quest Category Performance</h3>
                <div className="space-y-4">
                    {Object.entries(analyticsData.categoryStats).map(([category, stats]) => (
                        <div key={category} className="border-b pb-3 last:border-b-0">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold">{category}</h4>
                                <span className="text-sm text-gray-500">{stats.completed} completions</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-green-500 h-2 rounded-full" 
                                    style={{ width: `${stats.total > 0 ? (stats.completed / (stats.total * 10)) * 100 : 0}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{stats.total} total quests in category</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Activity Summary */}
            <div className="bg-white p-6 rounded-xl shadow-md border">
                <h3 className="text-xl font-bold mb-4">Platform Health</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold mb-3">User Engagement</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm">Active Users</span>
                                <span className="text-sm font-semibold">{users.filter(u => u.questsCompleted > 0).length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Inactive Users</span>
                                <span className="text-sm font-semibold">{users.filter(u => u.questsCompleted === 0).length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Pending Partners</span>
                                <span className="text-sm font-semibold text-yellow-600">{stats.pendingPartners}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3">Quest Statistics</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm">Active Quests</span>
                                <span className="text-sm font-semibold">{stats.activeQuests}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Completed Quests</span>
                                <span className="text-sm font-semibold">{quests.filter(q => !q.isActive).length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Total Points Awarded</span>
                                <span className="text-sm font-semibold">{users.reduce((sum, u) => sum + (u.points || 0), 0)}</span>
                            </div>
                        </div>
                    </div>
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
            const token = localStorage.getItem('token');
            
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
                <DailyQuestModal 
                    onClose={() => setShowQuestModal(false)}
                    onSave={handleCreateDailyQuest}
                />
            )}

            {/* Daily Challenge Modal */}
            {showChallengeModal && (
                <DailyChallengeModal 
                    onClose={() => setShowChallengeModal(false)}
                    onSave={handleCreateDailyChallenge}
                />
            )}
        </div>
    );
};

// --- DAILY QUEST MODAL ---
const DailyQuestModal = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Gardening & Planting',
        difficulty: 'Medium',
        points: 100,
        duration: '1 day',
        location: 'HAU Campus',
        objectives: '',
        submissionRequirements: '',
        maxParticipants: 100
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h3 className="text-2xl font-bold">Create Today's Quest</h3>
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
                            placeholder="e.g., Today's Campus Clean-up Challenge"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Description</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            rows="3"
                            placeholder="Describe today's special quest..."
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
                            <label className="block text-sm font-semibold mb-2">Points Reward</label>
                            <input
                                type="number"
                                required
                                value={formData.points}
                                onChange={(e) => setFormData({...formData, points: parseInt(e.target.value)})}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition font-semibold"
                        >
                            Create Daily Quest
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

// --- DAILY CHALLENGE MODAL ---
const DailyChallengeModal = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: []
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h3 className="text-2xl font-bold">Create Today's Community Challenge</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Challenge Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="e.g., Share Your Green Tip of the Day"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Challenge Description</label>
                        <textarea
                            required
                            value={formData.content}
                            onChange={(e) => setFormData({...formData, content: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            rows="4"
                            placeholder="Describe today's community challenge..."
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition font-semibold"
                        >
                            Create Daily Challenge
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

// --- MAIN ADMIN DASHBOARD ---
const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const { user, logout } = useUser();
    const [users, setUsers] = useState([]);
    const [quests, setQuests] = useState([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeQuests: 0,
        pendingPartners: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Protect against unauthorized access and pending role requests
        if (!user || user.role !== 'admin' || (user.requested_role && !user.is_approved)) {
            alert('Access denied. Admin privileges required.');
            if (user) logout();
            window.location.href = '/';
            return;
        }
        if (user && user.role === 'admin') {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // Fetch users
            const usersRes = await fetch('http://localhost:5000/api/admin/users', {
                headers: { 'x-auth-token': token }
            });
            const usersData = await usersRes.json();
            setUsers(usersData);

            // Fetch quests
            const questsRes = await fetch('http://localhost:5000/api/quests', {
                headers: { 'x-auth-token': token }
            });
            const questsData = await questsRes.json();
            setQuests(questsData);

            // Calculate stats - include both pending partner AND admin requests
            const pendingRequests = usersData.filter(u => u.requested_role && !u.is_approved).length;
            const activeQuests = questsData.filter(q => q.isActive).length;

            setStats({
                totalUsers: usersData.length,
                activeQuests: activeQuests,
                pendingPartners: pendingRequests
            });

            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleApprovePartner = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5000/api/admin/users/${userId}/approve`, {
                method: 'PUT',
                headers: { 'x-auth-token': token }
            });
            fetchData();
        } catch (error) {
            console.error('Error approving partner:', error);
        }
    };

    const handleRejectPartner = async (userId) => {
        if (!confirm('Are you sure you want to reject this role request? The user will become a regular user.')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5000/api/admin/users/${userId}/reject`, {
                method: 'PUT',
                headers: { 'x-auth-token': token }
            });
            fetchData();
        } catch (error) {
            console.error('Error rejecting role request:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            fetchData();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleDeleteQuest = async (questId) => {
        if (!confirm('Are you sure you want to delete this quest?')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5000/api/quests/${questId}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            fetchData();
        } catch (error) {
            console.error('Error deleting quest:', error);
        }
    };

    if (!user) {
        return (
            <div className="pt-24 text-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (user.role !== 'admin') {
        return (
            <div className="pt-24 text-center">
                <p className="text-red-600 font-semibold">Access Denied. Admin privileges required.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="pt-24 text-center">
                <p>Loading dashboard...</p>
            </div>
        );
    }

    // Filter for users with pending role requests (partner or admin)
    const pendingPartners = users.filter(u => u.requested_role && !u.is_approved);

    return (
        <div className="font-sans bg-gray-50 text-gray-800">
            <main className="container mx-auto px-4 pt-24 pb-12">
                {/* Header */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                    Admin
                                </span>
                            </div>
                            <p className="text-gray-500">Welcome back, {user.username}! Manage the HAU Eco-Quest platform.</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white p-2 rounded-xl shadow-md border inline-flex items-center gap-2 mb-8">
                    <TabButton id="overview" label="Overview" icon={<BarChart className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="users" label="Users" icon={<Users className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="quests" label="Quests" icon={<BookOpen className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="daily" label="Daily Content" icon={<Calendar className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="analytics" label="Analytics" icon={<BarChart className="w-4 h-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && <OverviewTab stats={stats} setActiveTab={setActiveTab} />}
                {activeTab === 'users' && <UsersTab users={users} pendingPartners={pendingPartners} onApprove={handleApprovePartner} onReject={handleRejectPartner} onDeleteUser={handleDeleteUser} />}
                {activeTab === 'quests' && <QuestsTab quests={quests} setQuests={setQuests} />}
                {activeTab === 'daily' && <DailyTab />}
                {activeTab === 'analytics' && <AnalyticsTab stats={stats} users={users} quests={quests} />}
            </main>
        </div>
    );
};

export default AdminDashboard;

