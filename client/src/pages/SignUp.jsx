import React from "react";

const SignUp = () => {
  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/vite.svg" alt="Logo" className="h-8 w-8" />
          <h1 className="font-bold text-xl text-green-600">HAU Eco-Quest</h1>
        </div>
        <nav className="hidden md:flex gap-6 text-gray-600">
          <a href="#">Home</a>
          <a href="#">Quests</a>
          <a href="#">Community</a>
          <a href="#">Events</a>
          <a href="#">Leaderboard</a>
        </nav>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 text-gray-700">Login</button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-full shadow">
            Join Adventure
          </button>
        </div>
      </header>

      {/* Main Sign Up Form */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8">
          {/* Icon */}
          <div className="text-center mb-6">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              ☀️
            </div>
            <h2 className="text-2xl font-bold mb-2">Join the Eco-Revolution!</h2>
            <p className="text-gray-600">
              Create your account and start making a positive environmental
              impact today
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-4 text-green-600 font-semibold">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-600 text-white">
                1
              </div>
              <span>Account Details</span>
              <div className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-500">
                2
              </div>
              <span className="text-gray-400">Role & Preferences</span>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="your.email@hau.edu.ph"
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                We'll use this to send you quest updates and achievements
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                placeholder="Create a strong password"
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold py-3 rounded-full shadow-lg hover:opacity-90 transition"
            >
              Continue to Role Selection
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm mt-6 text-gray-600">
            Already part of the eco-community?{" "}
            <a href="#" className="text-green-600 font-semibold hover:underline">
              Sign In Here
            </a>
          </p>

          {/* Small card */}
          <div className="mt-8 p-4 border rounded-xl bg-green-50 text-center">
            <div className="text-3xl mb-2">🌍</div>
            <h3 className="font-semibold mb-1">Join the Global Movement</h3>
            <p className="text-sm text-gray-600">
              Every account created brings us one step closer to a sustainable
              future. Welcome to the revolution!
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-600 text-white pt-12 pb-6 px-6">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          <div>
            <h3 className="text-2xl font-bold mb-4">HAU Eco-Quest</h3>
            <p className="text-sm text-green-100">
              Empowering students to become environmental champions through
              engaging sustainability adventures. Join the movement to save our
              planet! 🌍
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Adventure Paths</h4>
            <ul className="space-y-2 text-sm text-green-100">
              <li>Browse Epic Quests</li>
              <li>Upcoming Events</li>
              <li>Hero Community</li>
              <li>Hall of Fame</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Support Guild</h4>
            <ul className="space-y-2 text-sm text-green-100">
              <li>Contact Quest Masters</li>
              <li>Alliance Partners</li>
              <li>Help Center</li>
              <li>Quest Rules</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Connect with Us</h4>
            <p>eco-quest@hau.edu.ph</p>
            <p>+63 (2) 123-4567</p>
            <p>HAU Main Campus</p>
          </div>
        </div>
        <div className="text-center text-green-200 text-sm mt-8 border-t border-green-500 pt-4">
          © 2024 HAU Eco-Quest. All rights reserved. Built with 💚 for a
          sustainable future.
        </div>
      </footer>
    </div>
  );
};

export default SignUp;
