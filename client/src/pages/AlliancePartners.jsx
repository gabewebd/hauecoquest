import React, { useState } from 'react';
import { Leaf, Users, Calendar, Award, Globe, Search, Filter } from 'lucide-react';
import FacebookIcon from '../img/Facebook.png';
import InstagramIcon from '../img/Instagram.png';
import TiktokIcon from '../img/Tiktok.png';

// ============================================================
// 1. STAT CARD Component (Used for the top 5 metrics)
// ============================================================
const StatCard = ({ icon: Icon, value, label }) => (
    <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-lg border-b-4 border-green-500 hover:shadow-xl transition-shadow duration-300">
        <Icon className="w-8 h-8 text-green-600 mb-2" />
        <p className="text-3xl font-extrabold text-gray-800">{value}</p>
        <p className="text-sm font-medium text-gray-500 mt-1">{label}</p>
    </div>
);

// ============================================================
// 2. PARTNER CARD Component (Used for individual partners)
// ============================================================
const PartnerCard = ({ name, description, iconColor, metrics }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
        <div>
            {/* Header and Logo/Name */}
            <div className={`flex items-center space-x-3 mb-4`}>
                <div className={`p-2 rounded-full bg-${iconColor}-100`}>
                    <Leaf className={`w-6 h-6 text-${iconColor}-600`} />
                </div>
                <h3 className="text-xl font-bold text-gray-800">{name}</h3>
            </div>
            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 h-12 overflow-hidden">
                {description}
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-4 border-t pt-3">
                {metrics.map((metric, index) => (
                    <div key={index} className="text-left">
                        <p className="text-lg font-bold text-green-700">{metric.value}</p>
                        <p className="text-xs text-gray-500">{metric.label}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 mt-4">
            <button className="flex-1 px-3 py-2 text-sm bg-green-50 text-green-700 font-semibold rounded-full hover:bg-green-100 transition">
                Visit Website
            </button>
            <button className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition">
                Contact
            </button>
        </div>
    </div>
);

// ============================================================
// 3. MAIN COMPONENT
// ============================================================
const AlliancePartners = ({ onPageChange }) => {
    // Mock Data based on the provided image
    const statsData = [
        { icon: Globe, value: '9,700', label: 'Global Reach' },
        { icon: Users, value: '12,100', label: 'Active Students' },
        { icon: Calendar, value: '10,000+', label: 'Eco-Friendly Events' },
        { icon: Award, value: '7.5M+', label: 'Global Programs' },
        { icon: Leaf, value: '1.8K', label: 'Total Programs' },
    ];

    const partnerData = [
        {
            name: "Green Earth Foundation",
            description: "Dedicated to large-scale reforestation, water conservation, and sustainable development initiatives.",
            iconColor: "green",
            metrics: [
                { value: '50,000+', label: 'Trees Planted' },
                { value: '7,888+', label: 'Volunteer Hours' },
            ]
        },
        {
            name: "Philippine Dept. of Environment",
            description: "Regulating policies and environmental protection measures across the Philippines.",
            iconColor: "blue",
            metrics: [
                { value: '50+', label: 'Active Policies' },
                { value: '200+', label: 'Verified Projects' },
            ]
        },
        {
            name: "Corporates for Sustainability",
            description: "A network helping corporations integrate environmental ethics into their business models.",
            iconColor: "teal",
            metrics: [
                { value: '21 tons', label: 'CO2e Saved' },
                { value: '500+', label: 'Green Jobs' },
            ]
        },
        {
            name: "Green Globe Initiative",
            description: "Focusing on local community cleanups, waste management education, and plastic reduction.",
            iconColor: "indigo",
            metrics: [
                { value: '50+', label: 'Events Hosted' },
                { value: '300+', label: 'Community Cleanups' },
            ]
        },
        {
            name: "University of the Philippines Diliman",
            description: "Leading research institution providing scientific expertise for environmental policies.",
            iconColor: "red",
            metrics: [
                { value: '12', label: 'Research Projects' },
                { value: '50+', label: 'Student Researchers' },
            ]
        },
        {
            name: "Oceans Guardian Alliance",
            description: "Protecting marine ecosystems through advocacy, direct action, and educational programs.",
            iconColor: "sky",
            metrics: [
                { value: '7', label: 'Active Initiatives' },
                { value: '50+', label: 'Alliance Members' },
            ]
        },
    ];

    const whyPartnerData = [
        { title: 'Student Engagement', content: 'Directly connect with passionate students and involve them in your environmental campaigns.' },
        { title: 'Societal Impact', content: 'Drive real-world change and achieve significant, measurable environmental results.' },
        { title: 'Reputation & Visibility', content: 'Elevate your environmental work to the HAU community and beyond.' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            
            {/* Tailwind utility classes for dynamic colors used in PartnerCard */}
            <style jsx="true">{`
                .text-green-600 { color: #10B981; }
                .bg-green-100 { background-color: #D1FAE5; }
                .text-blue-600 { color: #3B82F6; }
                .bg-blue-100 { background-color: #DBEAFE; }
                .text-teal-600 { color: #0D9488; }
                .bg-teal-100 { background-color: #CCFBF1; }
                .text-indigo-600 { color: #4F46E5; }
                .bg-indigo-100 { background-color: #E0E7FF; }
                .text-red-600 { color: #EF4444; }
                .bg-red-100 { background-color: #FEE2E2; }
                .text-sky-600 { color: #06B6D4; }
                .bg-sky-100 { background-color: #E0F7FA; }
            `}</style>

            {/* ============================================================
              Header/Navigation Bar 
              ============================================================ 
            */}
            <header className="bg-white shadow-md sticky top-0 z-10">
                <nav className="container mx-auto px-4 py-3 flex justify-between items-center max-w-7xl">
                    <div className="flex items-center space-x-2">
                        <span className="text-xl font-extrabold text-green-700">🌱 HAU Eco-Quest</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="text-sm text-gray-600 hover:text-green-700 font-medium">Dashboard</button>
                        <button className="bg-green-600 text-white text-sm px-4 py-2 rounded-full hover:bg-green-700 transition-colors shadow-md">
                            Product Hub
                        </button>
                    </div>
                </nav>
            </header>

            {/* Main Content Area */}
            <main className="container mx-auto px-4 py-12 max-w-7xl">

                {/* ============================================================
                  1. Partnership Header
                  ============================================================ 
                */}
                <section className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Environmental Partners</h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Discover the amazing organizations supporting HAU Eco-Quest to create a solid, sustainable future for Angeles University and the wider community of Pampanga and the Philippines.
                    </p>
                </section>

                {/* ============================================================
                  2. Stats Showcase
                  ============================================================ 
                */}
                <section className="mb-16">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                        {statsData.map((stat, index) => (
                            <StatCard key={index} {...stat} />
                        ))}
                    </div>
                </section>

                {/* ============================================================
                  3. Featured Partners & Partner Directory
                  ============================================================ 
                */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Featured Partners</h2>
                    
                    {/* Featured Partners Grid */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {partnerData.slice(0, 3).map((partner, index) => (
                            <PartnerCard key={index} {...partner} />
                        ))}
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">All Alliance Partners</h2>

                    {/* Partner Directory Grid (Showing remaining partners) */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {partnerData.slice(3).map((partner, index) => (
                            <PartnerCard key={index} {...partner} />
                        ))}
                         {/* Adding two more mock cards to fill the space like the image */}
                         <PartnerCard 
                            name="Sustainable PH" 
                            description="Dedicated to promoting sustainable business practices and green certification for SMEs."
                            iconColor="amber"
                            metrics={[{ value: '110+', label: 'SMEs Certified' }, { value: '900', label: 'Eco-Reports' }]}
                        />
                         <PartnerCard 
                            name="Global Reforest" 
                            description="A non-profit organization focused on urban and rural tree planting drives."
                            iconColor="emerald"
                            metrics={[{ value: '3M', label: 'Saplings Distributed' }, { value: '18', label: 'Active Regions' }]}
                        />
                    </div>
                </section>

                {/* ============================================================
                  4. Why Partner With Us?
                  ============================================================ 
                */}
                <section className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8">Why Partner With Us?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {whyPartnerData.map((item, index) => (
                            <div key={index} className="bg-white p-8 rounded-xl shadow-xl border-t-4 border-green-400">
                                <Leaf className="w-8 h-8 text-green-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                                <p className="text-sm text-gray-600">{item.content}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* The "Ready to Partner With Us?" section is intentionally omitted here. */}

            </main>

            {/* ============================================================
              Footer (Green Background) 
              ============================================================ 
            */}
            {/* Footer */}
            <footer className="bg-green-700 text-white pt-16 pb-8 px-6">
                      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
                        {/* Brand */}
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <img
                              src="/assets/hau-eco-quest-logo.png"
                              alt="HAU Eco-Quest Logo"
                              className="h-8 w-8"
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

export default AlliancePartners;
