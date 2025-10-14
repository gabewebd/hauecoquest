//Josh Andrei Aguiluz
import React, { useState } from "react";
import axios from "axios";
import { useUser } from '../context/UserContext';
import { Check, Sprout, Users, Crown, ChevronLeft, GraduationCap, Mail, Lock, Building2 } from "lucide-react";

const StyledInput = ({ label, placeholder, type, icon, name, value, onChange }) => (
    <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
        <div className="relative">
            <input
                type={type}
                placeholder={placeholder}
                required
                name={name}
                value={value}
                onChange={onChange}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all font-medium text-sm sm:text-base"
            />
            <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                {icon}
            </div>
        </div>
    </div>
);

const StyledSelect = ({ label, icon, name, value, onChange, options }) => (
    <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
        <div className="relative">
            <select
                required
                name={name}
                value={value}
                onChange={onChange}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all font-medium appearance-none text-sm sm:text-base"
            >
                <option value="">Select your department</option>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                {icon}
            </div>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    </div>
);

const AccountDetailsForm = ({ goToStep, formData, handleInputChange }) => {
    const departmentOptions = [
        { value: 'SOC', label: 'School of Computing (SOC)' },
        { value: 'SAS', label: 'School of Arts and Sciences (SAS)' },
        { value: 'SEA', label: 'School of Engineering and Architecture (SEA)' },
        { value: 'SBA', label: 'School of Business and Accountancy (SBA)' },
        { value: 'SED', label: 'School of Education (SED)' },
        { value: 'CCJEF', label: 'College of Criminal Justice Education and Forensics (CCJEF)' },
        { value: 'SHTM', label: 'School of Hospitality and Tourism Management (SHTM)' },
        { value: 'SNAMS', label: 'School of Nursing and Allied Medical Sciences (SNAMS)' }
    ];

    return (
        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); goToStep(2); }}>
            <StyledInput
                label="Full Name"
                placeholder="Enter your full name"
                type="text"
                icon={<GraduationCap className="w-5 h-5" />}
                name="username"
                value={formData.username}
                onChange={handleInputChange}
            />
            <StyledInput
                label="Email Address"
                placeholder="your.email@hau.edu.ph"
                type="email"
                icon={<Mail className="w-5 h-5" />}
                name="email"
                value={formData.email}
                onChange={handleInputChange}
            />
            <StyledSelect
                label="Department"
                icon={<Building2 className="w-5 h-5" />}
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                options={departmentOptions}
            />
            <StyledInput
                label="Password"
                placeholder="Create a strong password"
                type="password"
                icon={<Lock className="w-5 h-5" />}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
            />
            <StyledInput
                label="Confirm Password"
                placeholder="Confirm your password"
                type="password"
                icon={<Lock className="w-5 h-5" />}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
            />
            <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 sm:gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black py-3 sm:py-4 rounded-full text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all mt-4 sm:mt-6"
            >
                <span className="text-sm sm:text-base">Continue to Role Selection</span>
            </button>
        </form>
    );
};

const AgreementForm = ({ agreedToTerms, setAgreedToTerms, goToStep, handleSubmit, loading }) => {
    return (
        <form className="space-y-6" onSubmit={handleSubmit}>

            <div className="bg-green-50 border-2 border-green-200 p-5 rounded-2xl">
                <div className="flex items-start gap-3 mb-3">
                    <div className="bg-gradient-to-br from-green-400 to-emerald-600 p-2 rounded-xl shadow-lg flex-shrink-0">
                        <Sprout className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">Welcome to HAU Eco-Quest!</h3>
                        <p className="text-gray-600 text-sm mt-1">
                            Start your environmental journey as an Eco-Hero. You can request additional roles
                            like Partner or Admin access from your dashboard after completing your registration.
                        </p>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t-2 border-green-200">
                    <h4 className="font-bold text-green-800 mb-3">Your Account Features:</h4>
                    <ul className="text-sm text-green-700 space-y-2">
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">•</span>
                            <span>Complete environmental quests and earn points</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">•</span>
                            <span>Join the eco-community and share your progress</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">•</span>
                            <span>Track your environmental impact</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">•</span>
                            <span>Request Partner or Admin access from your dashboard</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="bg-white border-2 border-gray-200 p-4 rounded-2xl">
                <label className="flex items-start text-sm text-gray-700 font-medium cursor-pointer">
                    <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-green-600 mt-0.5 focus:ring-green-500 focus:ring-2 flex-shrink-0"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                    />
                    <span className="ml-3">
                        I agree to the <a href="#" className="text-green-600 font-bold hover:text-green-700 transition-colors">Terms of Service</a> and <a href="#" className="text-green-600 font-bold hover:text-green-700 transition-colors">Privacy Policy</a>, and I want to receive environmental quest updates via email.
                    </span>
                </label>
            </div>

            <div className="flex gap-4">
                <button
                    type="button"
                    className="w-1/3 flex justify-center items-center gap-2 bg-gray-200 text-gray-700 font-bold py-4 rounded-full hover:bg-gray-300 transition-all shadow-lg"
                    onClick={() => goToStep(1)}
                >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                </button>
                <button
                    type="submit"
                    className="w-2/3 flex justify-center items-center gap-1 sm:gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black py-3 sm:py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
                    disabled={!agreedToTerms || loading}
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs sm:text-sm">Creating Account...</span>
                        </>
                    ) : (
                        <>
                            <Check className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                            <span className="text-xs sm:text-sm">Join the Adventure!</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};


// --- Main SignUp Component ---
const SignUp = ({ onPageChange }) => {
    const { signup, logout, user } = useUser();
    const [step, setStep] = useState(1);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        department: '',
        password: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setMessage("Passwords do not match!");
            setLoading(false);
            return;
        }

        try {
            const result = await signup(
                formData.username,
                formData.email,
                formData.password,
                'user', // Everyone starts as a user
                formData.department
            );

            if (result.success && result.user) {
                setMessage("Sign up successful! Welcome to HAU Eco-Quest! Redirecting to your dashboard...");

                // All new users go to dashboard
                setTimeout(() => {
                    onPageChange('dashboard');
                    setLoading(false);
                }, 1500);
            } else {
                setMessage(result.error || "Sign up failed. Please try again.");
                setLoading(false);
            }

        } catch (error) {
            setMessage("An error occurred during sign up. Please try again.");
            setLoading(false);
            console.error("Signup error:", error);
        }
    };

    const handleLoginClick = () => {
        onPageChange('login');
    };

    const isStep1 = step === 1;

    const StepIcon = ({ number, isCurrent, isComplete, label }) => (
        <div className="flex items-center gap-1 sm:gap-2">
            <div className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full font-bold transition-all duration-300 text-xs sm:text-sm ${isComplete ? 'bg-green-600 text-white' :
                    isCurrent ? 'bg-green-600 text-white border-2 border-green-600' :
                        'border-2 border-gray-300 text-gray-500'
                }`}>
                {isComplete ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : number}
            </div>
            <span className={`font-bold text-xs sm:text-sm ${isCurrent || isComplete ? 'text-green-600' : 'text-gray-400'}`}>
                {label}
            </span>
        </div>
    );

    const FormTitle = isStep1 ? "Join the Eco-Revolution!" : "Finalize Your Registration";
    const FormSubtitle = isStep1
        ? "Create your account and start making a positive environmental impact today"
        : "Review the terms and complete your HAU Eco-Quest registration";

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
                <div className="w-full max-w-lg">
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10">

                        <div className="text-center mb-6 sm:mb-8">
                            <div className="inline-block bg-gradient-to-br from-green-400 to-emerald-600 p-3 sm:p-4 rounded-2xl mb-3 sm:mb-4 shadow-lg">
                                <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-2">{FormTitle}</h1>
                            <p className="text-gray-600 text-base sm:text-lg">{FormSubtitle}</p>
                        </div>

                        <div className="flex justify-center mb-6 sm:mb-8">
                            <div className="flex items-center gap-2 sm:gap-4">
                                <StepIcon number={1} isCurrent={isStep1} isComplete={!isStep1} label="Account Details" />
                                <div className={`h-0.5 w-8 sm:w-12 transition-colors duration-300 ${isStep1 ? 'bg-gray-300' : 'bg-green-600'}`}></div>
                                <StepIcon number={2} isCurrent={!isStep1} isComplete={false} label="Terms & Agreement" />
                            </div>
                        </div>

                        {message && (
                            <div className={`p-4 rounded-2xl mb-6 text-center font-semibold border-2 ${message.includes('successful') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
                                }`}>
                                {message}
                            </div>
                        )}

                        {isStep1 ? (
                            <AccountDetailsForm
                                goToStep={setStep}
                                formData={formData}
                                handleInputChange={handleInputChange}
                            />
                        ) : (
                            <AgreementForm
                                agreedToTerms={agreedToTerms}
                                setAgreedToTerms={setAgreedToTerms}
                                goToStep={setStep}
                                handleSubmit={handleFinalSubmit}
                                loading={loading}
                            />
                        )}

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t-2 border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500 font-medium">or</span>
                            </div>
                        </div>

                        <p className="text-center text-gray-600">
                            Already part of the eco-community?{" "}
                            <button onClick={handleLoginClick} className="font-black text-green-600 hover:text-green-700 transition-colors">
                                Sign In Here
                            </button>
                        </p>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-white text-opacity-90">
                            By signing up, you agree to our{" "}
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

export default SignUp;
