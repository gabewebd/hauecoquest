//Josh Andrei Aguiluz
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Sprout, GraduationCap } from 'lucide-react';

const LoginPage = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    return (
        <div className="font-sans bg-app-bg text-gray-800 flex items-center justify-center min-h-screen pt-24 pb-12 px-4">
            <div className="w-full max-w-lg">
                {/* Main Login Card */}
                <div className="bg-white/90 backdrop-blur-sm p-8 sm:p-12 rounded-3xl shadow-xl border border-gray-100">
                    <div className="text-center mb-8">
                        <div className="inline-block bg-green-100 p-3 rounded-2xl mb-4">
                            <GraduationCap className="w-8 h-8 text-primary-green" />
                        </div>
                        <h1 className="text-3xl font-bold text-dark-green">Welcome Back!</h1>
                        <p className="text-gray-600 mt-2">Continue your environmental adventure and make a positive impact.</p>
                    </div>

                    <form>
                        <div className="space-y-4">
                            {/* Email Input */}
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input 
                                    type="email" 
                                    placeholder="your.email@hau.edu.ph" 
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green"
                                />
                            </div>
                            {/* Password Input */}
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input 
                                    type={passwordVisible ? "text" : "password"}
                                    placeholder="Enter your password" 
                                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green" 
                                />
                                <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {passwordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between items-center my-6">
                            <label className="flex items-center text-sm text-gray-600">
                                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-green focus:ring-primary-green" />
                                <span className="ml-2">Remember me</span>
                            </label>
                            <a href="#" className="text-sm font-semibold text-primary-green hover:underline">Forgot password?</a>
                        </div>
                        
                        <button type="submit" className="w-full bg-primary-green text-white font-bold py-3 rounded-full text-lg shadow-lg hover:bg-secondary-green transition-colors transform hover:scale-105">
                            Enter Quest Hall
                        </button>
                    </form>

                    <div className="text-center my-6 text-xs text-gray-400">or continue with</div>

                    <div className="space-y-3">
                        <button className="w-full flex justify-center items-center gap-3 bg-white border border-gray-300 text-gray-700 font-semibold py-3 rounded-full hover:bg-gray-50 transition-colors">
                           <span className="font-bold">H</span> HAU Portal
                        </button>
                         <button className="w-full flex justify-center items-center gap-3 bg-white border border-gray-300 text-gray-700 font-semibold py-3 rounded-full hover:bg-gray-50 transition-colors">
                            <img src="https://www.google.com/favicon.ico" alt="Google icon" className="w-5 h-5"/> Google
                        </button>
                    </div>

                    <p className="text-center text-sm text-gray-600 mt-8">
                        New to the environmental realm? <a href="#" className="font-bold text-primary-green hover:underline">Begin Your Journey</a>
                    </p>
                </div>

                 {/* Bottom Info Card */}
                <div className="bg-green-50/80 mt-8 p-6 rounded-3xl text-center border border-green-200">
                    <Sprout className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-bold text-green-800">Join the Movement</h3>
                    <p className="text-sm text-green-700 mt-1">Every login brings us closer to a sustainable future. Welcome to the quest that matters most!</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;