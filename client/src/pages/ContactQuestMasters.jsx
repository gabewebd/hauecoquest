import React, { useState } from 'react';
import { Mail, Phone, MapPin, ChevronDown, CheckCircle, Info, X } from 'lucide-react';
import FacebookIcon from '../img/Facebook.png';
import InstagramIcon from '../img/Instagram.png';
import TiktokIcon from '../img/Tiktok.png';

// ============================================================
// Helper Components
// ============================================================

const ContactCard = ({ title, icon: Icon, content, linkText }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-500 flex flex-col items-start text-left">
        <Icon className="w-8 h-8 text-green-600 mb-2" />
        <h3 className="font-semibold text-gray-700">{title}</h3>
        <p className="text-lg font-medium text-gray-900 mt-1">{content}</p>
        <a href="#" className="text-sm text-green-600 font-medium mt-3 hover:text-green-700">{linkText} →</a>
    </div>
);

const InputField = ({ label, placeholder, type }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} <span className="text-red-500">*</span>
        </label>
        <input
            type={type}
            placeholder={placeholder}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-gray-700"
        />
    </div>
);

const Checkbox = ({ label }) => (
    <label className="inline-flex items-center text-sm text-gray-700">
        <input type="checkbox" className="form-checkbox text-green-600 rounded" />
        <span className="ml-2">{label}</span>
    </label>
);

const Radio = ({ label, name, checked = false }) => (
    <label className="inline-flex items-center text-sm text-gray-700">
        <input type="radio" name={name} defaultChecked={checked} className="form-radio text-green-600" />
        <span className="ml-2">{label}</span>
    </label>
);

const FAQItem = ({ question, answer, isOpen, onToggle }) => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
        <button 
            onClick={onToggle}
            className={`w-full p-5 flex justify-between items-center text-left transition-colors ${
                isOpen ? 'bg-green-50 border-b border-green-200 rounded-t-xl' : 'rounded-xl'
            }`}
        >
            <h4 className="font-semibold text-gray-800 text-lg">
                {question}
            </h4>
            <ChevronDown className={`w-5 h-5 text-green-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
            <div className="p-5 pt-0 text-gray-600 animate-fade-in">
                <p className="border-t border-gray-100 pt-4 text-sm leading-relaxed">{answer}</p>
            </div>
        )}
    </div>
);


// ============================================================
// Main Component
// ============================================================

const ContactQuestMasters = ({ onPageChange }) => {
    // State to track the currently open FAQ item
    const [openFAQ, setOpenFAQ] = useState(null);

    const faqData = [
        { 
            id: 1, 
            question: "How do I join environmental quests?",
            answer: "You can join quests by navigating to the Quests Page. Once logged in, simply select an available quest, review the requirements and rewards (Eco-Points), and click 'Accept Quest' to begin your adventure."
        },
        { 
            id: 2, 
            question: "What are eco-points and how do I earn them?",
            answer: "Eco-Points are the in-app currency earned by completing Quests and participating in verified Eco-Events. They can be redeemed for exclusive rewards, items in the Product Hub, and contribute to your Leaderboard ranking."
        },
        { 
            id: 3, 
            question: "Can I create my own environmental event?",
            answer: "Yes! If you are a recognized student organization or faculty member, you can submit an event proposal through the Partner Dashboard. Once approved by the Admin team (Quest Masters), it will be listed as an official Eco-Quest."
        },
        { 
            id: 4, 
            question: "Are you hiring or accepting volunteer applications?",
            answer: "We are always looking for passionate environmental stewards! Please send an email to eco-quest@hau.edu.ph with the subject 'Volunteer Inquiry' and attach your resume and letter of intent."
        },
        { 
            id: 5, 
            question: "When photo evidence is required for quests?",
            answer: "Photo evidence is required for all physical quests (e.g., cleanups, tree planting). The submission form will clearly indicate whether before/after photos, geo-tagged locations, or signatures are necessary to validate your completion."
        },
        { 
            id: 6, 
            question: "How is environmental impact calculated?",
            answer: "Environmental impact is calculated based on standardized metrics (e.g., kilograms of trash collected, liters of water saved, number of trees planted). These metrics are converted into your final Eco-Point reward."
        },
    ];

    const handleFAQToggle = (id) => {
        setOpenFAQ(openFAQ === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans pt-20">
            {/* Tailwind CSS Setup for Animation */}
            <style jsx="true">{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out forwards;
                }
            `}</style>
            
            {/* ============================================================
              1. Header/Navigation Bar (Mocked for single-file context) 
              ============================================================ 
            */}
            <header className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
            </header>

            {/* Main Content Area */}
            <main className="container mx-auto px-4 py-12 max-w-5xl">

                <header className="text-center mb-16 pt-8">
                    <h1 className="text-5xl font-extrabold text-green-800 mb-4">Contact the Quest Masters Guild</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Your environmental support team is ready to assist you on your journey to make a difference.
                    </p>
                </header>

                {/* ============================================================
                  2. Get in Touch Section 
                  ============================================================ 
                */}
                <section className="mb-16">
                    <div className="grid md:grid-cols-4 gap-6">
                        {/* Card 1: Email (Using Lucide Icons) */}
                        <ContactCard title="Email Support" icon={Mail} content="eco-quest@hau.edu.ph" linkText="Send Email" />
                        
                        {/* Card 2: Call Us */}
                        <ContactCard title="Call Hotline" icon={Phone} content="+63 912 345 6789" linkText="Call Now" />

                        {/* Card 3: Visit Us */}
                        <ContactCard title="Guild Location" icon={MapPin} content="HAU Main Campus" linkText="View Map" />

                        {/* Card 4: Office Hours */}
                        <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-500 flex flex-col items-start text-left">
                            <h3 className="font-semibold text-gray-700">Office Hours</h3>
                            <p className="text-sm text-gray-500 mt-1">Monday - Friday</p>
                            <p className="text-xl font-bold text-gray-900">9:00 AM - 5:00 PM</p>
                            <p className="text-xs text-gray-400 mt-2">Closed on weekends & holidays</p>
                        </div>
                    </div>
                    
                    {/* Response Times Box */}
                    <div className="mt-8 bg-white p-6 rounded-xl shadow-xl border-l-8 border-green-500">
                        <div className="grid grid-cols-1 md:grid-cols-4 text-left">
                            <div className="col-span-1 border-r border-gray-100 pr-6">
                                <h4 className="text-lg font-bold text-green-700 mb-2 flex items-center gap-2"><Info className="w-5 h-5" /> Quick Info</h4>
                                <ul className="space-y-1 text-sm text-gray-600">
                                    <li><span className="font-semibold">Guest Inquiries:</span> 24 Hours</li>
                                    <li><span className="font-semibold">Quest Submissions:</span> 1-2 Hours</li>
                                    <li><span className="font-semibold">Technical Issues:</span> Immediate Priority</li>
                                </ul>
                            </div>
                            <div className="col-span-3 md:pl-6 pt-4 md:pt-0">
                                <h4 className="text-lg font-bold text-gray-800 mb-2">Need to Talk to the Quest Master?</h4>
                                <p className="text-gray-600 text-sm">For administrative or partnership discussions, please schedule an appointment directly via email. </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ============================================================
                  4. Frequently Asked Questions (FAQ)
                  ============================================================ 
                */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqData.map((item) => (
                            <FAQItem 
                                key={item.id}
                                question={item.question}
                                answer={item.answer}
                                isOpen={openFAQ === item.id}
                                onToggle={() => handleFAQToggle(item.id)}
                            />
                        ))}
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
                    <li><button onClick={() => onPageChange('quests')} className="hover:text-white">Browse Epic Quests</button></li>
                    <li><button onClick={() => onPageChange('community')} className="hover:text-white">Hero Community</button></li>
                    <li><button onClick={() => onPageChange('leaderboard')} className="hover:text-white">Hall of Fame</button></li>
                  </ul>
                </div>
      
                {/* Support Guild */}
                <div>
                  <h4 className="font-bold mb-4">Support Guild</h4>
                  <ul className="space-y-2 text-sm text-green-100">
                    <li><button onClick={() => onPageChange('contactquestmasters')} className="hover:text-white">Contact Quest Masters</button></li>
                    <li><button onClick={() => onPageChange('alliancepartners')} className="hover:text-white">Alliance Partners</button></li>
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
                      <a href="#"><img src={FacebookIcon} alt="Facebook" className="w-6 h-6" /></a>
                      <a href="#"><img src={InstagramIcon} alt="Instagram" className="w-6 h-6" /></a>
                      <a href="#"><img src={TiktokIcon} alt="Instagram" className="w-6 h-6" /></a>
                    </div>
                  </div>
                </div>
              </div>
      
              <div className="max-w-6xl mx-auto text-center border-t border-green-600 mt-8 pt-6 text-green-200 text-sm">
                <p>© 2025 HAU Eco-Quest. All rights reserved. Built with for a sustainable future.</p>
              </div>
            </footer>
        </div>
    );
};

export default ContactQuestMasters;