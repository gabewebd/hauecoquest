import React from 'react';

// Helper component for Stat Cards for cleaner code
const StatCard = ({ value, label }) => (
  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl flex items-center justify-center gap-4 shadow-md border border-white">
    <div>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  </div>
);

// Helper component for Quest/Event Cards
const InfoCard = ({ category, title, description, tags, buttonText, buttonColor }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col">
    <div className="flex justify-end items-start mb-4">
      <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{category}</span>
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm mb-4 flex-grow">{description}</p>
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        {tags && tags.map(tag => (
          <span key={tag} className="text-xs text-gray-500">{tag}</span>
        ))}
      </div>
      <button className={`${buttonColor} text-white font-bold py-2 px-4 rounded-full transition-transform transform hover:scale-105`}>
        {buttonText}
      </button>
    </div>
  </div>
);


const HomePage = () => {
  return (
    <div className="font-sans">
      <main className="pt-16"> {/* Added padding-top to account for the fixed navbar */}
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-green-300 to-green-500 text-center py-40 px-4 text-white">
          <div className="absolute inset-0 bg-green-400/30"></div>
          <div className="relative z-5">
            <h2 className="text-5xl md:text-6xl font-extrabold mb-4">Join the Journey Towards a <span className="text-dark-green bg-white/90 px-4 rounded-md">Greener World</span></h2>
            <p className="max-w-3xl mx-auto mb-8 text-lg text-green-100">
              Embark on an exciting journey to make a positive impact on our planet. Join thousands of eco-heroes at HAU in the ultimate sustainability adventure!
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-white text-secondary-green font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-transform">Start Your Adventure</button>
              <button className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-green-600 transition-colors">Explore Quests</button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative -mt-16 z-10 px-4">
          <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard value="2,547" label="Trees Planted" />
            <StatCard value="15.2 tons" label="Waste Recycled" />
            <StatCard value="1,248" label="Quests Completed" />
            <StatCard value="3,891" label="Active Members" />
          </div>
        </section>

        {/* Featured Eco Quests Section */}
        <section className="py-24 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Eco Quests</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-12">Join these amazing environmental adventures and make a real difference while having fun!</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
              <InfoCard
                category="NATURE"
                title="Tree Planting"
                description="Plant trees around campus and help create a greener environment for future generations."
                tags={['German', '2D 1H Remaining']}
                buttonText="Join Quest"
                buttonColor="bg-primary-green hover:bg-green-600"
              />
              <InfoCard
                category="RECYCLE"
                title="Waste Management"
                description="Learn proper waste sorting and help us set up a new recycling system on campus."
                tags={['English', '5D 4H Remaining']}
                buttonText="Join Quest"
                buttonColor="bg-primary-green hover:bg-green-600"
              />
              <InfoCard
                category="ENERGY"
                title="Solar Panel Setup"
                description="Help install solar panels and learn about renewable energy solutions."
                tags={['English', '1W 2D Remaining']}
                buttonText="Join Quest"
                buttonColor="bg-primary-green hover:bg-green-600"
              />
            </div>
            <button className="mt-12 text-secondary-green font-bold hover:underline">View All Quests</button>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section className="bg-green-50/50 py-24 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Upcoming Events</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-12">Join our community events and connect with fellow eco-heroes!</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
              <InfoCard
                category="COMMUNITY"
                title="Earth Day Festival"
                description="April 22, 2026 | HAU Grounds"
                tags={['148 registered']}
                buttonText="Learn More"
                buttonColor="bg-accent-orange hover:bg-orange-600"
              />
              <InfoCard
                category="WORKSHOP"
                title="Sustainability Workshop"
                description="May 15, 2026 | N-Building"
                tags={['92 registered']}
                buttonText="Learn More"
                buttonColor="bg-accent-orange hover:bg-orange-600"
              />
            </div>
            <button className="mt-12 text-secondary-green font-bold hover:underline">View All Events</button>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center flex flex-col items-center">
              <h2 className="text-3xl font-bold text-gray-800 my-4">Ready to Become an Eco-Hero?</h2>
              <p className="text-gray-600 mb-8">Join thousands of others in making a difference. Start your journey today and earn rewards while saving the planet!</p>
              <div className="flex gap-4">
                <button className="bg-primary-green text-white font-bold py-3 px-8 rounded-full hover:bg-green-600 transition-colors">Join the Movement</button>
                <button className="bg-gray-200 text-gray-700 font-bold py-3 px-8 rounded-full hover:bg-gray-300 transition-colors">Learn More</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-footer-green text-green-100 pt-16 pb-8 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-2">HAU Eco-Quest</h3>
            <p className="text-sm text-green-200">A community-driven platform to promote sustainability and environmental awareness on our planet.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Adventure Paths</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Beginner Quests</a></li>
              <li><a href="#" className="hover:text-white">Recycling Challenges</a></li>
              <li><a href="#" className="hover:text-white">Energy Savers</a></li>
              <li><a href="#" className="hover:text-white">Nature Community</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Support Guild</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">About Eco-Quest</a></li>
              <li><a href="#" className="hover:text-white">Our Mission</a></li>
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Quest T&Cs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Connect with Us</h4>
            <div className="bg-green-600/50 p-4 rounded-lg">
                <p className="text-sm">eco-quest@hau.edu.ph</p>
                <p className="text-sm">(012) 345-6789</p>
                <div className="flex gap-4 mt-4">
                  {/* Placeholder for social icons */}
                  <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                  <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                  <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto text-center border-t border-green-600 mt-8 pt-6 text-sm text-green-300">
          <p>© 2024 HAU Eco-Quest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;