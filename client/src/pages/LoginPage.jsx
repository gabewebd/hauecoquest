//Josh Andrei Aguiluz
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Sprout, GraduationCap, User } from 'lucide-react';

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
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            {/* Password Input */}
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input 
                                    type={passwordVisible ? "text" : "password"}
                                    placeholder="Enter your password" 
                                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" 
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setPasswordVisible(!passwordVisible)} 
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {passwordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between items-center my-6">
                            <label className="flex items-center text-sm text-gray-600">
                                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-green-500 focus:ring-green-500" />
                                <span className="ml-2">Remember me</span>
                            </label>
                            <a href="#" className="text-sm font-semibold text-green-600 hover:underline">Forgot password?</a>
                        </div>
                        
                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            className="w-full flex justify-center items-center gap-2 bg-green-500 text-white font-bold py-3 rounded-full text-lg shadow-lg hover:bg-green-600 transition-colors transform hover:scale-105"
                        >
                            <User className="w-6 h-6" />
                            Enter Quest Hall
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600 mt-8">
                        New to the environmental realm? <a href="#" className="font-bold text-green-600 hover:underline">Begin Your Journey</a>
                    </p>
                </div>

            
            </div>
        </div>
    );
};

export default LoginPage;
