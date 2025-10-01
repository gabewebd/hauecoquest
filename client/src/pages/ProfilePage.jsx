//Josh Andrei Aguiluz
import React, { useState, useEffect } from "react";
import {
  Award,
  Users,
  Edit,
  Settings,
  Trophy,
  User,
  UserCircle,
} from "lucide-react";
import { useUser } from "./UserContext";

const ProfilePage = () => {
  const { user, updateUser } = useUser();
  
  const [activeTab, setActiveTab] = useState("Activity");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTab, setEditTab] = useState("avatar");
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || "Girl Avatar 1");
  const [headerTheme, setHeaderTheme] = useState(user?.headerTheme || "orange");

  // ADD THIS: Update local state when user context changes
  useEffect(() => {
    if (user) {
      setSelectedAvatar(user.avatar);
      setHeaderTheme(user.headerTheme);
    }
  }, [user]);

  // Rest of your code stays the same...

  // Avatars with lucide-react icons and colors
  const avatars = [
    { name: "Girl Avatar 1", gender: "Female", color: "text-pink-500", bg: "bg-pink-100" },
    { name: "Girl Avatar 2", gender: "Female", color: "text-pink-400", bg: "bg-pink-50" },
    { name: "Boy Avatar 1", gender: "Male", color: "text-blue-500", bg: "bg-blue-100" },
    { name: "Boy Avatar 2", gender: "Male", color: "text-blue-400", bg: "bg-blue-50" },
  ];

  const headerThemes = {
    orange: "from-orange-400 to-pink-500",
    green: "from-green-400 to-emerald-600",
    blue: "from-blue-400 to-indigo-500",
  };

  const handleSaveChanges = () => {
    updateUser({
      avatar: selectedAvatar,
      headerTheme: headerTheme,
    });
    setIsEditOpen(false);
  };

  const handleCancelEdit = () => {
    setSelectedAvatar(user?.avatar || "Girl Avatar 1");
    setHeaderTheme(user?.headerTheme || "orange");
    setIsEditOpen(false);
  };

  const currentAvatar = avatars.find((a) => a.name === (user?.avatar || selectedAvatar));
  const level = Math.floor((user?.points || 450) / 100) + 1;

  return (
    <div className="pt-20 flex flex-col min-h-screen">
      {/* Banner */}
      <div className={`h-48 bg-gradient-to-r ${headerThemes[user?.headerTheme || headerTheme]} relative`}>
        {/* Profile Card */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-20 w-full max-w-4xl px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 flex items-center relative">
            {/* Avatar */}
            <div className="relative">
              <div className={`w-24 h-24 rounded-full ${currentAvatar?.bg} overflow-hidden flex justify-center items-center`}>
                <UserCircle className={`w-20 h-20 ${currentAvatar?.color}`} />
              </div>
              <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {level}
              </div>
            </div>

            {/* Info */}
            <div className="ml-6 flex-1">
              <h2 className="text-2xl font-bold">{user?.username || "Maria Student"}</h2>
              <p className="text-gray-600">HAU Student</p>
              <p className="text-sm text-gray-500 mt-1">
                Environmental science student passionate about making a
                difference on campus.
              </p>

              {/* Stats */}
              <div className="flex gap-6 mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-yellow-500" /> {user?.points || 450} points
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-orange-500" /> {user?.badges || 2} badges
                </div>
                <div className="flex items-center gap-1">
<<<<<<< HEAD
                  <Users className="w-4 h-4 text-green-500" /> {user?.friends || 3} friends
=======
>>>>>>> e698dd07d690e4e8e3510973666b0fe8ab544f27
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 absolute top-4 right-4">
              <button
                onClick={() => { 
                  setSelectedAvatar(user?.avatar || "Girl Avatar 1");
                  setHeaderTheme(user?.headerTheme || "orange");
                  setEditTab("avatar"); 
                  setIsEditOpen(true); 
                }}
                className="px-3 py-1 bg-gray-100 rounded-lg text-sm flex items-center gap-1 hover:bg-gray-200"
              >
                <Edit className="w-4 h-4" /> Edit
              </button>
              <button className="px-3 py-1 bg-gray-100 rounded-lg text-sm flex items-center gap-1 hover:bg-gray-200">
                <Settings className="w-4 h-4" /> Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-28 max-w-4xl mx-auto px-4 flex-grow">
        <div className="flex justify-center gap-8 border-b pb-2">
          {["Activity", "Quests", "Photo History", "Achievements"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 ${
                activeTab === tab
                  ? "border-b-2 border-green-500 text-green-600 font-semibold"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="py-10 text-center text-gray-500">
          <p>No posts yet</p>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl relative shadow-lg">
            {/* Header Tabs */}
            <div className="flex mb-6 border-b">
              <button
                onClick={() => setEditTab("avatar")}
                className={`flex-1 py-2 ${
                  editTab === "avatar"
                    ? "border-b-2 border-green-500 font-semibold"
                    : "text-gray-500"
                }`}
              >
                Choose Avatar
              </button>
              <button
                onClick={() => setEditTab("header")}
                className={`flex-1 py-2 ${
                  editTab === "header"
                    ? "border-b-2 border-green-500 font-semibold"
                    : "text-gray-500"
                }`}
              >
                Choose Header Theme
              </button>
            </div>

            {/* Avatar Tab */}
            {editTab === "avatar" && (
              <div className="grid grid-cols-2 gap-6">
                {avatars.map((avatar) => (
                  <div
                    key={avatar.name}
                    onClick={() => setSelectedAvatar(avatar.name)}
                    className={`p-4 border-2 rounded-xl cursor-pointer text-center transition ${
                      selectedAvatar === avatar.name
                        ? "bg-green-100 border-green-500"
                        : "hover:bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className={`flex justify-center ${avatar.bg} rounded-full w-20 h-20 mx-auto items-center`}>
                      <UserCircle className={`w-16 h-16 ${avatar.color}`} />
                    </div>
                    <h3 className="mt-2 font-medium">{avatar.name}</h3>
                    <p className="text-xs text-gray-500">
                      {avatar.gender} • Perfect For You!
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Header Theme Tab */}
            {editTab === "header" && (
              <div className="grid grid-cols-3 gap-6">
                {Object.keys(headerThemes).map((theme) => (
                  <div
                    key={theme}
                    onClick={() => setHeaderTheme(theme)}
                    className={`h-20 rounded-xl cursor-pointer border-4 transition ${
                      headerTheme === theme
                        ? "border-green-500"
                        : "border-gray-200"
                    } bg-gradient-to-r ${headerThemes[theme]} flex items-center justify-center`}
                  >
                    {headerTheme === theme && (
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={handleCancelEdit}
                className="px-6 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-6 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <footer className="bg-green-700 text-white pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center text-2xl">🌱</div>
              <h3 className="text-2xl font-bold">HAU Eco-Quest</h3>
            </div>
            <p className="text-sm text-green-100">
              Empowering students to become environmental champions through
              engaging sustainability adventures.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Adventure Paths</h4>
            <ul className="space-y-2 text-sm text-green-100">
              <li><a href="#" className="hover:text-white">Browse Epic Quests</a></li>
              <li><a href="#" className="hover:text-white">Upcoming Events</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Support Guild</h4>
            <ul className="space-y-2 text-sm text-green-100">
              <li><a href="#" className="hover:text-white">Contact Quest Masters</a></li>
              <li><a href="#" className="hover:text-white">Help Center</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Connect with Us</h4>
            <div className="bg-green-600 p-4 rounded-lg text-sm">
              <p>eco-quest@hau.edu.ph</p>
              <p>+63 (2) 123-4567</p>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto text-center border-t border-green-600 mt-8 pt-6 text-green-200 text-sm">
          <p>© 2024 HAU Eco-Quest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ProfilePage;