import React from 'react';

const StatCard = ({ icon, value, label }) => (
  <div className="bg-white p-6 rounded-2xl flex items-center justify-center gap-5 shadow-lg border border-gray-100">
    {icon}
    <div>
      <p className="text-3xl font-bold text-text-dark">{value}</p>
      <p className="text-sm text-text-muted">{label}</p>
    </div>
  </div>
);

const InfoCard = ({ icon, title, description, buttonText, buttonColor }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col text-center items-center">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-text-dark mb-2">{title}</h3>
    <p className="text-text-muted text-sm mb-4 flex-grow">{description}</p>
    <div className="flex justify-center items-center w-full mt-auto pt-4">
      <button className={`${buttonColor} text-white font-bold py-2 px-6 rounded-full transition-transform transform hover:scale-105 w-full`}>
        {buttonText}
      </button>
    </div>
  </div>
);

const HomePage = () => {
  const icons = {
    tree: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-8"/><path d="M12 14c-4.42 0-8-3.58-8-8 0-4.42 3.58-8 8-8s8 3.58 8 8c0 4.42-3.58 8-8 8Z"/><path d="M12 14c4.42 0 8 3.58 8 8 0 4.42-3.58 8-8 8s-8-3.58-8-8c0-4.42 3.58-8 8-8Z"/></svg>,
    recycle: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 19H4.6c-1.1 0-2-.9-2-2v-1.4c0-1.1.9-2 2-2H7"/><path d="M10 19h4"/><path d="M17 19h2.4c1.1 0 2-.9 2-2v-1.4c0-1.1-.9-2-2-2H17"/><path d="M16 13V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v8"/><path d="m10 9-1.8 1.8c-.4.4-.4 1.1 0 1.5l1.8 1.8"/><path d="M14 12.5 15.8 11c.4-.4.4-1.1 0-1.5L14 7.8"/></svg>,
    leaf: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 4 13H2a10 10 0 0 0 10 10v-2Z"/><path d="M12 4a10 10 0 0 0-10 10h2A7 7 0 0 1 11 7v5l4-4-4 4Z"/></svg>,
    users: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    waste: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5V21"/><path d="M8 5V21"/><path d="M16 5V21"/><path d="M3 5h18"/><path d="M4 5v0c0 2.2 1.8 4 4 4h8c2.2 0 4-1.8 4-4v0"/></svg>,
    solar: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>,
    planet: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20Z"/><path d="M2 12h20"/></svg>,
    workshop: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>,
    bulb: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>,
  };

  return (
    <div className="font-sans">
      <main>
        <section className="bg-hero-bg text-center pt-40 pb-24 px-4">
          <div className="relative">
            <h2 className="text-5xl md:text-6xl font-extrabold mb-4 text-text-dark">Join the Journey Towards a <br /><span className="text-primary-green">Greener World</span></h2>
            <p className="max-w-3xl mx-auto mb-8 text-lg text-text-muted">
              Embark on an exciting quest to make a positive impact on our planet. Join thousands of eco heroes at HAU in the ultimate sustainability adventure!
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-primary-green text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-transform">Start Your Adventure</button>
              <button className="bg-white border-2 border-gray-200 text-text-dark font-bold py-3 px-8 rounded-full hover:bg-gray-50 transition-colors">Explore Quests</button>
            </div>
          </div>
        </section>

        <section className="relative -mt-12 z-10 px-4">
          <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={icons.leaf} value="2,547" label="Trees Planted" />
            <StatCard icon={icons.recycle} value="15.2 tons" label="Waste Recycled" />
            <StatCard icon={icons.tree} value="1,248" label="Quests Completed" />
            <StatCard icon={icons.users} value="3,891" label="Active Members" />
          </div>
        </section>

        <section className="py-24 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold text-text-dark mb-4">Featured Eco Quests</h2>
            <p className="text-text-muted max-w-2xl mx-auto mb-12">Join these amazing environmental adventures and make a real difference while earning rewards.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <InfoCard
                icon={icons.tree}
                title="Tree Planting"
                description="Plant trees around campus and help create a greener environment for future generations."
                buttonText="Join Quest"
                buttonColor="bg-primary-green hover:bg-secondary-green"
              />
              <InfoCard
                icon={icons.waste}
                title="Waste Management"
                description="Learn proper waste sorting and help us set up a new recycling system on campus."
                buttonText="Join Quest"
                buttonColor="bg-primary-green hover:bg-secondary-green"
              />
              <InfoCard
                icon={icons.solar}
                title="Solar Panel Setup"
                description="Help install solar panels and learn about renewable energy solutions."
                buttonText="Join Quest"
                buttonColor="bg-primary-green hover:bg-secondary-green"
              />
            </div>
             <button className="mt-12 text-primary-green font-bold hover:underline">View All Quests</button>
          </div>
        </section>

        <section className="bg-white py-24 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold text-text-dark mb-4">Upcoming Events</h2>
            <p className="text-text-muted max-w-2xl mx-auto mb-12">Join our community events and connect with fellow eco-heroes!</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <InfoCard
                icon={icons.planet}
                title="Earth Day Festival"
                description="April 22, 2026 | HAU Grounds | 500 registered"
                buttonText="Learn More"
                buttonColor="bg-accent-orange hover:bg-orange-600"
              />
              <InfoCard
                icon={icons.workshop}
                title="Sustainability Workshop"
                description="May 15, 2026 | N-Building | 120 registered"
                buttonText="Learn More"
                buttonColor="bg-accent-orange hover:bg-orange-600"
              />
            </div>
            <button className="mt-12 text-primary-green font-bold hover:underline">View All Events</button>
          </div>
        </section>

        <section className="py-24 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center flex flex-col items-center">
              {icons.bulb}
              <h2 className="text-3xl font-bold text-text-dark my-4">Ready to Become an Eco-Hero?</h2>
              <p className="text-text-muted mb-8">Join thousands of others in making a difference. Start your journey today and earn rewards while saving the planet!</p>
              <div className="flex gap-4">
                <button className="bg-primary-green text-white font-bold py-3 px-8 rounded-full hover:bg-secondary-green transition-colors">Join the Movement</button>
                <button className="bg-gray-100 text-gray-700 font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors">Learn More</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-footer-bg text-green-100 pt-16 pb-8 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
             <div className="flex items-center gap-2 mb-2">
               <img src="/vite.svg" alt="HAU Eco-Quest Logo" className="h-8 w-8 bg-white rounded-full p-1" />
               <h3 className="text-2xl font-bold text-white">HAU Eco-Quest</h3>
            </div>
            <p className="text-sm text-green-200">Empowering students to become environmental champions through gamified quests and community action. Join the movement to save our planet!</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Adventure Paths</h4>
            <ul className="space-y-2 text-sm text-green-200">
              <li><a href="#" className="hover:text-white">Beginner Quests</a></li>
              <li><a href="#" className="hover:text-white">Recycling Challenges</a></li>
              <li><a href="#" className="hover:text-white">Energy Savers</a></li>
              <li><a href="#" className="hover:text-white">Nature Community</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Support Guild</h4>
            <ul className="space-y-2 text-sm text-green-200">
              <li><a href="#" className="hover:text-white">About Eco-Quest</a></li>
              <li><a href="#" className="hover:text-white">Our Mission</a></li>
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Quest T&Cs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Connect with Us</h4>
            <div className="bg-teal-800/50 p-4 rounded-lg">
                <p className="text-sm">eco-quest@hau.edu.ph</p>
                <p className="text-sm">(012) 345-6789</p>
                <div className="flex gap-4 mt-4">
                  <div className="w-6 h-6 bg-teal-600 rounded-full"></div>
                  <div className="w-6 h-6 bg-teal-600 rounded-full"></div>
                  <div className="w-6 h-6 bg-teal-600 rounded-full"></div>
                </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto text-center border-t border-teal-600 mt-8 pt-6 text-sm text-green-300">
          <p>© 2024 HAU Eco-Quest. All rights reserved. Built with ❤️ for a sustainable future.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;