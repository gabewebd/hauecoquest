//Josh Andrei Aguiluz
import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { Mail, Lock, Eye, EyeOff, Sprout, GraduationCap, User } from 'lucide-react';

const LoginPage = ({ onPageChange }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useUser();

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            onPageChange('dashboard');
        } catch (err) {
            setError('Invalid Credentials. Please try again.');
            console.error(err);
        }
    };
    
    return (
        <div className="font-sans bg-app-bg text-gray-800 flex items-center justify-center min-h-screen pt-24 pb-12 px-4">
            <div className="w-full max-w-lg">
                <div className="bg-white/90 backdrop-blur-sm p-8 sm:p-12 rounded-3xl shadow-xl border border-gray-100">
                    <div className="text-center mb-8">
                        <div className="inline-block bg-green-100 p-3 rounded-2xl mb-4">
                            <GraduationCap className="w-8 h-8 text-green-500" />
                        </div>
                        <h1 className="text-3xl font-bold text-green-900">Welcome Back!</h1>
                        <p className="text-gray-600 mt-2">Continue your environmental adventure and make a positive impact.</p>
                    </div>
                    
                    {error && <p className="bg-red-100 text-red-700 text-center p-3 rounded-lg mb-4">{error}</p>}

                    <form onSubmit={onSubmit}>
                        <div className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input 
                                    type="email" 
                                    placeholder="your.email@hau.edu.ph" 
                                    name="email"
                                    value={email}
                                    onChange={onChange}
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input 
                                    type="password"
                                    placeholder="Enter your password" 
                                    name="password"
                                    value={password}
                                    onChange={onChange}
                                    required
                                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" 
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center my-6">
                            <label className="flex items-center text-sm text-gray-600">
                                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-green-500 focus:ring-green-500" />
                                <span className="ml-2">Remember me</span>
                            </label>
                            <a href="#" className="text-sm font-semibold text-green-600 hover:underline">Forgot password?</a>
                        </div>
                        
                        <button type="submit" className="w-full flex justify-center items-center gap-2 bg-green-500 text-white font-bold py-3 rounded-full text-lg shadow-lg hover:bg-green-600 transition-colors">
                            <User className="w-6 h-6" />
                            Enter Quest Hall
                        </button>
                    </form>

                    <div className="text-center my-6 text-xs text-gray-400">or continue with</div>

                    <p className="text-center text-sm text-gray-600 mt-8">
                        New to the environmental realm? <a href="#" className="font-bold text-green-600 hover:underline">Begin Your Journey</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;