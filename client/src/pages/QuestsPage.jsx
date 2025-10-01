//Josh Andrei Aguiluz
import React from 'react';
import { Search, Droplets, TreePine, Recycle, Sun, Leaf, Building, Clock, Users, Award, Lightbulb, BookOpen, Smile, Camera, Handshake } from 'lucide-react'; // Added Smile, Camera, Handshake icons

// Reusable component for Quest Cards, styled to match your design
const QuestCard = ({ icon, title, description, difficulty, points, duration, participants, progress, color }) => {
  const difficultyStyles = {
    Easy: 'bg-green-100 text-green-600',
    Medium: 'bg-yellow-100 text-yellow-600',
    Hard: 'bg-red-100 text-red-600',
  };
  
  // This object helps Tailwind "see" the full class names so it can generate them properly.
  const colorVariants = {
    green: { bg: 'bg-green-500', hover: 'hover:bg-green-600', iconBg: 'bg-green-100' },
    yellow: { bg: 'bg-yellow-500', hover: 'hover:bg-yellow-600', iconBg: 'bg-yellow-100' },
    blue: { bg: 'bg-blue-500', hover: 'hover:bg-blue-600', iconBg: 'bg-blue-100' },
    cyan: { bg: 'bg-cyan-500', hover: 'hover:bg-cyan-600', iconBg: 'bg-cyan-100' },
    lime: { bg: 'bg-lime-500', hover: 'hover:bg-lime-600', iconBg: 'bg-lime-100' },
    indigo: { bg: 'bg-indigo-500', hover: 'hover:bg-indigo-600', iconBg: 'bg-indigo-100' },
  };
  const activeColor = colorVariants[color] || colorVariants.green;


  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col transition-transform transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${activeColor.iconBg}`}>{icon}</div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${difficultyStyles[difficulty]}`}>{difficulty}</span>
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4 flex-grow">{description}</p>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-sm text-gray-500 mb-4 border-t border-b border-gray-100 py-3">
        <div className="flex items-center gap-1.5"><Award className="w-4 h-4 text-yellow-500"/><span>{points} points</span></div>
        <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-500"/><span>{duration}</span></div>
        <div className="flex items-center gap-1.5"><Users className="w-4 h-4 text-purple-500"/><span>{participants}</span></div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Participants</span>
          <span>{progress}% Filled</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className={`${activeColor.bg} h-2 rounded-full`} style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <button className={`mt-auto w-full ${activeColor.bg} text-white font-bold py-2.5 px-4 rounded-xl transition-transform transform hover:scale-105 ${activeColor.hover}`}>
        Start Quest
      </button>
    </div>
  );
};

const QuestsPage = () => {
    // Mock data for the quests based on your image
    const quests = [
        { icon: <TreePine className="w-6 h-6 text-green-700"/>, title: "Campus Tree Planting Initiative", description: "Plant native trees around campus and learn about sustainable forestry practices while creating lasting environmental impact.", difficulty: "Medium", points: 300, duration: "2-3 weeks", participants: "45/100", progress: 45, color: "green" },
        { icon: <Sun className="w-6 h-6 text-yellow-600"/>, title: "Solar Panel Installation Project", description: "Help install solar panels on campus buildings and learn about renewable energy systems and their environmental benefits.", difficulty: "Hard", points: 500, duration: "1 month", participants: "23/50", progress: 46, color: "yellow" },
        { icon: <Recycle className="w-6 h-6 text-blue-700"/>, title: "Campus Recycling Program", description: "Organize and implement comprehensive recycling systems across campus facilities to reduce waste and promote a circular economy.", difficulty: "Easy", points: 200, duration: "2 weeks", participants: "78/150", progress: 52, color: "blue" },
        { icon: <Droplets className="w-6 h-6 text-cyan-700"/>, title: "Rainwater Harvesting System", description: "Design and build rainwater collection systems for campus irrigation and learn about water conservation techniques.", difficulty: "Medium", points: 350, duration: "3 weeks", participants: "34/80", progress: 43, color: "cyan" },
        { icon: <Leaf className="w-6 h-6 text-lime-700"/>, title: "Campus Biodiversity Survey", description: "Document local flora and fauna, create a biodiversity database, and develop conservation strategies for campus ecosystems.", difficulty: "Medium", points: 250, duration: "1 month", participants: "56/120", progress: 46, color: "lime" },
        { icon: <Building className="w-6 h-6 text-indigo-700"/>, title: "Green Building Certification", description: "Work towards LEED certification for campus buildings by implementing sustainable practices and energy-efficient solutions.", difficulty: "Hard", points: 800, duration: "2 months", participants: "19/40", progress: 48, color: "indigo" },
    ];

    // New component for the guideline cards
    const GuidelineCard = ({ icon, title, description, iconColor }) => (
        <div className="text-center p-4">
            <div className={`mx-auto w-12 h-12 flex items-center justify-center rounded-full mb-4 text-3xl`} style={{ color: iconColor }}>
                {icon}
            </div>
            <h4 className="font-bold text-gray-800 mb-2">{title}</h4>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    );

  return (
    <div className="font-sans bg-app-bg text-gray-800">
      <main className="pt-24 pb-12">
        {/* Page Header */}
        <section className="container mx-auto px-4 text-center mb-12">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 mb-8 flex items-center justify-center gap-6">
                <div className="bg-white p-4 rounded-full shadow-md">
                    <BookOpen className="w-10 h-10 text-primary-green" />
                </div>
                <div>
                    <h2 className="text-4xl font-extrabold text-dark-green mb-2">Environmental Quests</h2>
                    <p className="max-w-2xl mx-auto text-gray-600">
                        Choose your adventure and make a real impact on our planet. Complete quests to earn points, badges, and contribute to a sustainable future!
                    </p>
                </div>
            </div>
        </section>

        {/* Today's Quest */}
        <section className="container mx-auto px-4 mb-12">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-yellow-500">⭐</span> Today's Quest
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Droplets className="w-8 h-8 text-blue-500" />
                        <div>
                            <h4 className="font-bold text-blue-800">Water Conservation Challenge</h4>
                            <p className="text-sm text-blue-700">Save water by taking shorter showers today. Track your progress and earn +20 bonus points.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                         <button className="bg-green-500 text-white font-bold py-2 px-5 rounded-full transition-transform transform hover:scale-105">Accept Challenge</button>
                         <button className="text-sm text-gray-600 hover:underline">View Details</button>
                    </div>
                </div>
            </div>
        </section>

        {/* Filters and Quest Grid */}
        <section className="container mx-auto px-4">
            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 mb-8">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <input type="text" placeholder="Search quests..." className="w-full pl-10 pr-4 py-2 border rounded-xl" />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                     <div>
                        {/* Simplified filter buttons for demonstration */}
                        <div className="flex flex-wrap gap-2">
                           <button className="bg-primary-green text-white px-4 py-2 rounded-xl text-sm font-semibold">All Quests</button>
                           <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold">Recycling</button>
                           <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold">Energy</button>
                        </div>
                    </div>
                    <div>
                        <select className="w-full border rounded-xl px-4 py-2 bg-white">
                            <option>All Difficulty Levels</option>
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                        </select>
                    </div>
                 </div>
            </div>

            {/* Quest Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {quests.map((quest, index) => <QuestCard key={index} {...quest} />)}
            </div>
        </section>
        
        {/* QUEST GUIDELINES SECTION (Refactored) */}
        <section className="container mx-auto px-4 mt-24 text-center">
            {/* White card with shadow, mimicking the Community Guidelines page */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Quest Guidelines</h2>
                <p className="text-gray-600 max-w-lg mb-8">
                    To ensure the integrity of your environmental impact, please follow these core principles when completing quests.
                </p>

                {/* Three-column layout for guidelines */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
                    <GuidelineCard
                        icon={<Lightbulb className="w-8 h-8"/>} // Changed icon to be different from the one removed
                        title="Real Impact"
                        description="Ensure your actions are genuine and contribute directly to the quest's stated environmental goal."
                        iconColor="#10b981" // Green
                    />
                    <GuidelineCard
                        icon={<Camera className="w-8 h-8"/>}
                        title="Verify Progress"
                        description="Always document your proof of completion clearly (photos/videos) for verification by a Quest Master."
                        iconColor="#3b82f6" // Blue
                    />
                    <GuidelineCard
                        icon={<Handshake className="w-8 h-8"/>}
                        title="Collaborate Fairly"
                        description="If the quest is collaborative, ensure all team members contribute equally to the final outcome."
                        iconColor="#ef4444" // Red/Green for diversity
                    />
                </div>
              

            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-green-700 text-white pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/vite.svg"
                alt="HAU Eco-Quest Logo"
                className="h-8 w-8 bg-white rounded-full p-1"
              />
              <h3 className="text-2xl font-bold">HAU Eco-Quest</h3>
            </div>
            <p className="text-sm text-green-100">
              Empowering students to become environmental champions through
              engaging sustainability adventures. Join the movement to save our
              planet!
            </p>
          </div>

          {/* Adventure Paths */}
          <div>
            <h4 className="font-bold mb-4">Adventure Paths</h4>
            <ul className="space-y-2 text-sm text-green-100">
              <li><a href="#" className="hover:text-white">Browse Epic Quests</a></li>
              <li><a href="#" className="hover:text-white">Upcoming Events</a></li>
              <li><a href="#" className="hover:text-white">Hero Community</a></li>
              <li><a href="#" className="hover:text-white">Hall of Fame</a></li>
            </ul>
          </div>

          {/* Support Guild */}
          <div>
            <h4 className="font-bold mb-4">Support Guild</h4>
            <ul className="space-y-2 text-sm text-green-100">
              <li><a href="#" className="hover:text-white">Contact Quest Masters</a></li>
              <li><a href="#" className="hover:text-white">Alliance Partners</a></li>
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Quest Rules</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-bold mb-4">Connect with Us</h4>
            <div className="bg-green-600 p-4 rounded-lg text-sm">
              <p>eco-quest@hau.edu.ph</p>
              <p>+63 (2) 123-4567</p>
              <p>HAU Main Campus</p>
              <div className="flex gap-4 mt-4">
                <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto text-center border-t border-green-600 mt-8 pt-6 text-green-200 text-sm">
          <p>© 2024 HAU Eco-Quest. All rights reserved. Built with ❤️ for a sustainable future.</p>
        </div>
      </footer>
    </div>
  );
}


export default QuestsPage;