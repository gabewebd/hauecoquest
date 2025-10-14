//Josh Andrei Aguiluz
import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { Mail, Lock, Sparkles, Rocket } from 'lucide-react';

const LoginPage = ({ onPageChange }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, user } = useUser();

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const result = await login(email, password);
            
            if (result.success && result.user) {
                if (result.user.requested_role && !result.user.is_approved) {
                    onPageChange('dashboard');
                } else {
                    const userRole = result.user.role;
                    if (userRole === 'admin' && result.user.is_approved) {
                        onPageChange('admin-dashboard');
                    } else if (userRole === 'partner' && result.user.is_approved) {
                        onPageChange('partner-dashboard');
                    } else {
                        onPageChange('dashboard');
                    }
                }
            } else {
                setError(result.error || 'Login failed. Please try again.');
                setLoading(false);
            }
        } catch (err) {
            setError('Invalid Credentials. Please try again.');
            setLoading(false);
            console.error(err);
        }
    };

    const handleSignupClick = () => {
        onPageChange('signup');
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full"></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-white rounded-full"></div>
                <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-white rounded-full"></div>
                <div className="absolute bottom-40 right-1/3 w-20 h-20 bg-white rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 w-28 h-28 bg-white rounded-full"></div>
            </div>

            {/* Wavy SVG Bottom */}
            <div className="absolute inset-0 opacity-20">
                <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <path fill="currentColor" fillOpacity="0.3" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
            </div>

            <div className="relative min-h-screen flex items-center justify-center px-4 py-8 sm:py-12">
                <div className="w-full max-w-md">

                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10">
                        <div className="text-center mb-6 sm:mb-8">
                            <div className="inline-block bg-gradient-to-br from-green-400 to-emerald-600 p-3 sm:p-4 rounded-2xl mb-3 sm:mb-4 shadow-lg">
                                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-2">Welcome Back!</h1>
                            <p className="text-gray-600 text-base sm:text-lg">Continue your eco-adventure and make an impact</p>
                        </div>
                        
                        {error && (
                            <div className="bg-red-50 border-2 border-red-200 text-red-700 text-center p-4 rounded-2xl mb-6 font-semibold">
                                {error}
                            </div>
                        )}

                        <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                    <input 
                                        type="email" 
                                        placeholder="your.email@hau.edu.ph" 
                                        name="email"
                                        value={email}
                                        onChange={onChange}
                                        required
                                        className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all font-medium text-sm sm:text-base"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                    <input 
                                        type="password"
                                        placeholder="Enter your password" 
                                        name="password"
                                        value={password}
                                        onChange={onChange}
                                        required
                                        className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all font-medium text-sm sm:text-base" 
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-2">
                                <label className="flex items-center text-sm text-gray-600 font-medium cursor-pointer">
                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 focus:ring-2" />
                                    <span className="ml-2">Remember me</span>
                                </label>
                                <a href="#" className="text-sm font-bold text-green-600 hover:text-green-700 transition-colors">Forgot password?</a>
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full flex justify-center items-center gap-2 sm:gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black py-3 sm:py-4 rounded-full text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-4 sm:mt-6"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-sm sm:text-base">Logging in...</span>
                                    </>
                                ) : (
                                    <>
                                        <Rocket className="w-5 h-5 sm:w-6 sm:h-6" />
                                        <span className="text-sm sm:text-base">Enter Quest Hall</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="relative my-6 sm:my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t-2 border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-xs sm:text-sm">
                                <span className="px-3 sm:px-4 bg-white text-gray-500 font-medium">or</span>
                            </div>
                        </div>

                        <p className="text-center text-gray-600 text-sm sm:text-base">
                            New to HAU Eco-Quest?{" "}
                            <button 
                                onClick={handleSignupClick} 
                                className="font-black text-green-600 hover:text-green-700 transition-colors text-sm sm:text-base"
                            >
                                Begin Your Journey
                            </button>
                        </p>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-white text-opacity-90">
                            By logging in, you agree to our{" "}
                            <a href="#" className="font-semibold hover:underline">Terms of Service</a>
                            {" "}and{" "}
                            <a href="#" className="font-semibold hover:underline">Privacy Policy</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
