//Josh Andrei Aguiluz
import React, { useState } from "react";
import axios from "axios";
import { useUser } from '../context/UserContext'; 
import { Check, Sprout, Users, Crown, ChevronLeft, GraduationCap, Mail, Lock } from "lucide-react";

const StyledInput = ({ label, placeholder, type, icon, name, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium mb-1">{label}</label>
        <div className="relative">
            <input
                type={type}
                placeholder={placeholder}
                required
                name={name}
                value={value}
                onChange={onChange}
                className="w-full bg-gray-50 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-inner"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {icon}
            </div>
        </div>
    </div>
);

const AccountDetailsForm = ({ goToStep, formData, handleInputChange }) => {
    return (
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); goToStep(2); }}>
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
                className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold py-3 rounded-full shadow-lg hover:opacity-90 transition"
            >
                Continue to Role Selection
            </button>
        </form>
    );
};

const RoleSelectionForm = ({ selectedRole, setSelectedRole, agreedToTerms, setAgreedToTerms, goToStep, handleSubmit, loading }) => {
    const RoleCard = ({ role, title, icon, features, requiresApproval = false }) => {
        const isSelected = selectedRole === role;
        const baseClasses = "border-2 p-4 rounded-xl cursor-pointer transition-all duration-200 flex items-start gap-4";
        const selectedClasses = "border-green-500 bg-green-50 shadow-sm";
        const unselectedClasses = "border-gray-200 hover:border-green-300 hover:shadow-xs";

        return (
            <div
                className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
                onClick={() => setSelectedRole(role)}
            >
                <div className="flex-shrink-0 mt-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        requiresApproval ? 'bg-amber-100 text-amber-500' : 'bg-green-100 text-green-600'
                    }`}>
                        {icon}
                    </div>
                </div>
                
                <div className="flex-grow">
                    <div className="flex justify-between items-center mb-1">
                        <h3 className="font-semibold text-gray-800">{title}</h3>
                        {requiresApproval && (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500 text-white">
                                Requires Approval
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                        {features.main}
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                        {features.tags.map((tag, index) => (
                            <span key={index} className="font-medium">{tag}</span>
                        ))}
                    </div>
                </div>

                <div className="flex-shrink-0 w-6 h-6 border rounded-full flex items-center justify-center mt-1"
                     style={{
                         borderColor: isSelected ? 'rgb(16, 185, 129)' : 'rgb(209, 213, 219)',
                         backgroundColor: isSelected ? 'rgb(16, 185, 129)' : 'white',
                     }}
                >
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>
            </div>
        );
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <h3 className="font-bold text-lg mb-4 text-gray-800">Select Your Role</h3>
            <div className="space-y-4 mb-6">
                <RoleCard
                    role="user"
                    title="Eco-Hero Student"
                    icon={<Sprout className="w-5 h-5" />}
                    features={{
                        main: "Join environmental quests and make a difference on campus",
                        tags: ["Complete quests", "Earn rewards", "Join community", "Track progress"]
                    }}
                />
                <RoleCard
                    role="partner"
                    title="Environmental Partner"
                    icon={<Users className="w-5 h-5" />}
                    features={{
                        main: "Organizations working together for sustainability",
                        tags: ["Create events", "Manage quests", "Analytics dashboard", "Community impact"]
                    }}
                    requiresApproval
                />
                <RoleCard
                    role="admin"
                    title="Quest Master Admin"
                    icon={<Crown className="w-5 h-5" />}
                    features={{
                        main: "University administrators managing the platform",
                        tags: ["Full platform control", "User management", "Content approval", "System reports"]
                    }}
                    requiresApproval
                />
            </div>
            
            <div className="mb-8">
                <label className="flex items-start text-sm text-gray-600 cursor-pointer">
                    <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-green-600 mt-1 focus:ring-green-500"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                    />
                    <span className="ml-3">
                        I agree to the <a href="#" className="text-green-600 font-semibold hover:underline">Terms of Service</a> and <a href="#" className="text-green-600 font-semibold hover:underline">Privacy Policy</a>, and I want to receive environmental quest updates via email.
                    </span>
                </label>
            </div>

            <div className="flex gap-4">
                <button
                    type="button"
                    className="w-1/3 flex justify-center items-center gap-2 bg-gray-200 text-gray-700 font-semibold py-3 rounded-full hover:bg-gray-300 transition"
                    onClick={() => goToStep(1)}
                >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                </button>
                <button
                    type="submit"
                    className="w-2/3 flex justify-center items-center gap-2 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold py-3 rounded-full shadow-lg hover:opacity-90 transition disabled:opacity-50"
                    disabled={!agreedToTerms || !selectedRole || loading}
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Creating Account...
                        </>
                    ) : (
                        <>
                            <Check className="w-5 h-5 mr-1" />
                            Join the Adventure!
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};


// --- Main SignUp Component ---
const SignUp = ({ onPageChange }) => {
    const { signup, user } = useUser();
    const [step, setStep] = useState(1);
    const [selectedRole, setSelectedRole] = useState("user");
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
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
                selectedRole
            );

            if (result.success && result.user) {
                setMessage(result.message || "Sign up successful! Redirecting...");
                
                // Redirect based on role from the returned user data
                const userRole = result.user.role;
                
                if (userRole === 'admin') {
                    setTimeout(() => onPageChange('admin-dashboard'), 1000);
                } else if (userRole === 'partner') {
                    // Partner needs approval
                    if (!result.user.is_approved) {
                        setMessage('Partner request submitted. Awaiting admin approval.');
                        setTimeout(() => onPageChange('home'), 2000);
                    } else {
                        setTimeout(() => onPageChange('partner-dashboard'), 1000);
                    }
                } else {
                    setTimeout(() => onPageChange('dashboard'), 1000);
                }
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
        <div className="flex items-center gap-2">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold transition-all duration-300 ${
                isComplete ? 'bg-green-600 text-white' :
                isCurrent ? 'bg-green-600 text-white border-2 border-green-600' :
                'border border-gray-300 text-gray-500'
            }`}>
                {isComplete ? <Check className="w-4 h-4" /> : number}
            </div>
            <span className={isCurrent || isComplete ? 'text-green-600 font-semibold' : 'text-gray-400'}>
                {label}
            </span>
        </div>
    );

    const FormTitle = isStep1 ? "Join the Eco-Revolution!" : "Choose Your Eco-Role";
    const FormSubtitle = isStep1 
        ? "Create your account and start making a positive environmental impact today"
        : "Select the role that best describes your environmental journey";

    const containerClass = "min-h-screen bg-gradient-to-b from-white to-green-50 flex flex-col";
    const mainClass = "flex-grow flex items-center justify-center px-4 py-12";

    return (
        <div className={containerClass}> 
            <div className={mainClass}>
                <div className="bg-white rounded-3xl shadow-lg max-w-lg w-full p-8 relative">
                    
                    <div className="text-center mb-6">
                        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                            <GraduationCap className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">{FormTitle}</h2>
                        <p className="text-gray-600">{FormSubtitle}</p>
                    </div>

                    <div className="flex justify-center mb-8">
                        <div className="flex items-center gap-4">
                            <StepIcon number={1} isCurrent={isStep1} isComplete={!isStep1} label="Account Details" />
                            <div className={`h-0.5 w-12 transition-colors duration-300 ${isStep1 ? 'bg-gray-300' : 'bg-green-600'}`}></div>
                            <StepIcon number={2} isCurrent={!isStep1} isComplete={false} label="Role & Preferences" />
                        </div>
                    </div>

                    {message && (
                        <div className={`p-3 rounded-lg mb-4 text-center text-sm font-semibold ${
                            message.includes('successful') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
                        <RoleSelectionForm 
                            selectedRole={selectedRole}
                            setSelectedRole={setSelectedRole}
                            agreedToTerms={agreedToTerms}
                            setAgreedToTerms={setAgreedToTerms}
                            goToStep={setStep}
                            handleSubmit={handleFinalSubmit}
                            loading={loading}
                        />
                    )}

                    <p className="text-center text-sm mt-6 text-gray-600">
                        Already part of the eco-community?{" "}
                        <button onClick={handleLoginClick} className="text-green-600 font-semibold hover:underline">
                            Sign In Here
                        </button>
                    </p>
                </div>
            </div>
        </div> 

        
    );
};

export default SignUp;