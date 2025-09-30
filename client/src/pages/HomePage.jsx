import React from "react";

export default function HomePage() {
  return (
    <div className="font-sans bg-green-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-green-700 text-white py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Welcome to HAU Eco-Quest</h1>
          <p className="text-lg mb-8">
            Join the quest to save the planet through exciting eco-adventures.
            Track your impact, complete challenges, and become an environmental hero!
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="#quests"
              className="bg-white text-green-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-green-100"
            >
              Start Questing
            </a>
            <a
              href="#learn"
              className="bg-green-500 font-semibold px-6 py-3 rounded-lg shadow hover:bg-green-600"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="bg-green-100 p-6 rounded-lg shadow">
            <h2 className="text-3xl font-bold text-green-700">1,245+</h2>
            <p className="text-gray-600">Trees Planted</p>
          </div>
          <div className="bg-green-100 p-6 rounded-lg shadow">
            <h2 className="text-3xl font-bold text-green-700">980kg</h2>
            <p className="text-gray-600">Waste Recycled</p>
          </div>
          <div className="bg-green-100 p-6 rounded-lg shadow">
            <h2 className="text-3xl font-bold text-green-700">320+</h2>
            <p className="text-gray-600">Eco Quests</p>
          </div>
          <div className="bg-green-100 p-6 rounded-lg shadow">
            <h2 className="text-3xl font-bold text-green-700">5,000+</h2>
            <p className="text-gray-600">Student Heroes</p>
          </div>
        </div>
      </section>

      {/* Featured Quests */}
      <section id="quests" className="py-16 px-6 bg-green-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-green-700 mb-6">
            Featured Eco Quests
          </h2>
          <p className="text-gray-600 mb-12">
            Take part in exciting sustainability missions and earn rewards while
            helping the planet.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <img
                src="https://placehold.co/400x200/4ade80/fff?text=Tree+Planting"
                alt="Tree Planting"
                className="rounded mb-4"
              />
              <h3 className="text-xl font-bold text-green-700 mb-2">
                Tree Planting
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Join the movement to plant native trees across campus and restore
                our environment.
              </p>
              <a href="#" className="text-green-600 font-semibold hover:underline">
                Join Quest →
              </a>
            </div>

            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <img
                src="https://placehold.co/400x200/22c55e/fff?text=Waste+Management"
                alt="Waste Management"
                className="rounded mb-4"
              />
              <h3 className="text-xl font-bold text-green-700 mb-2">
                Waste Management
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Take on challenges to recycle waste, reduce plastic, and promote
                zero-waste living.
              </p>
              <a href="#" className="text-green-600 font-semibold hover:underline">
                Join Quest →
              </a>
            </div>

            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <img
                src="https://placehold.co/400x200/15803d/fff?text=Solar+Setup"
                alt="Solar Panel Setup"
                className="rounded mb-4"
              />
              <h3 className="text-xl font-bold text-green-700 mb-2">
                Solar Panel Setup
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Help install solar panels on campus buildings and promote
                renewable energy use.
              </p>
              <a href="#" className="text-green-600 font-semibold hover:underline">
                Join Quest →
              </a>
            </div>
          </div>
        </div>
      </section>

            {/* Call to Action */}
      <section className="py-20 px-6 bg-white text-center">
        <div className="max-w-3xl mx-auto">
          <div className="text-5xl mb-4">🌟</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Become an Eco-Hero?
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Join thousands of students making a real environmental impact. Start your
            journey today and earn rewards while saving the planet!
          </p>
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition">
            Continue Your Journey
          </button>
        </div>
      </section>


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
