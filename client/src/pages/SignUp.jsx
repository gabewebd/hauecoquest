import React, { useState } from "react";
import { Check, Sprout, Users, Crown, ChevronLeft, GraduationCap } from "lucide-react";


const RoleSelectionForm = ({ selectedRole, setSelectedRole, agreedToTerms, setAgreedToTerms, goToStep }) => {
    // Common style for role cards
    const RoleCard = ({ role, title, icon, features, requiresApproval = false }) => {
        const isSelected = selectedRole === role;
        const baseClasses = "border-2 p-4 rounded-xl cursor-pointer transition-all duration-200 flex items-start gap-4";
        const selectedClasses = "border-green-500 bg-green-50 shadow-md";
        const unselectedClasses = "border-gray-200 hover:border-green-300";

        return (
            <div
                className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
                onClick={() => setSelectedRole(role)}
            >
                <div className="flex-shrink-0 mt-1">
                    {/* Icon container */}
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

                {/* Custom radio button checkmark */}
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
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <h3 className="font-bold text-lg mb-4 text-gray-800">Select Your Role</h3>

            <div className="space-y-4 mb-6">
                {/* Role Cards */}
                <RoleCard
                    role="Eco-Hero Student"
                    title="Eco-Hero Student"
                    icon={<Sprout className="w-5 h-5" />}
                    features={{
                        main: "Join environmental quests and make a difference on campus",
                        tags: ["Complete quests", "Earn rewards", "Join community", "Track progress"]
                    }}
                />
                <RoleCard
                    role="Environmental Partner"
                    title="Environmental Partner"
                    icon={<Users className="w-5 h-5" />}
                    features={{
                        main: "Organizations working together for sustainability",
                        tags: ["Create events", "Manage quests", "Analytics dashboard", "Community impact"]
                    }}
                    requiresApproval
                />
                <RoleCard
                    role="Quest Master Admin"
                    title="Quest Master Admin"
                    icon={<Crown className="w-5 h-5" />}
                    features={{
                        main: "University administrators managing the platform",
                        tags: ["Full platform control", "User management", "Content approval", "System reports"]
                    }}
                    requiresApproval
                />
            </div>
            
            {/* Phone Number Input */}
            <div className="mb-6">
                <label htmlFor="phone" className="block text-sm font-medium mb-1 text-gray-700">
                    Phone Number (Optional)
                </label>
                <input
                    id="phone"
                    type="tel"
                    placeholder="+63 (9XX) XXX-XXXX"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                    For important quest and event notifications
                </p>
            </div>
            
            {/* Terms and Privacy Checkbox */}
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

            {/* Action Buttons */}
            <div className="flex gap-4">
                <button
                    type="button"
                    className="w-1/3 flex justify-center items-center gap-2 bg-gray-100 text-gray-700 font-semibold py-3 rounded-full hover:bg-gray-200 transition"
                    onClick={() => goToStep(1)}
                >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                </button>
                <button
                    type="submit"
                    className="w-2/3 flex justify-center items-center gap-2 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold py-3 rounded-full shadow-lg hover:opacity-90 transition disabled:opacity-50"
                    disabled={!agreedToTerms || !selectedRole}
                    onClick={() => console.log('Successfully Signed Up with role:', selectedRole)}
                >
                    <Check className="w-5 h-5 mr-1" />
                    Join the Adventure!
                </button>
            </div>
        </form>
    );
};

// --- Account Details Component (Internal component for Step 1) ---
const AccountDetailsForm = ({ goToStep }) => {
    return (
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); goToStep(2); }}>
            <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                    type="text"
                    placeholder="Enter your full name"
                    required
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
                    required
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
                    required
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
                    required
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
    );
};

// --- Main SignUp Component ---
const SignUp = () => {
    const [step, setStep] = useState(1);
    const [selectedRole, setSelectedRole] = useState("Eco-Hero Student");
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const isStep1 = step === 1;

    // Helper function to render the correct step indicator icon
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

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Main Content Area */}
            <main className="flex-grow flex items-center justify-center px-4 py-12">
                <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8">
                    
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                            <GraduationCap className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">{FormTitle}</h2>
                        <p className="text-gray-600">{FormSubtitle}</p>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center gap-4">
                            <StepIcon number={1} isCurrent={isStep1} isComplete={!isStep1} label="Account Details" />
                            <div className={`h-0.5 w-12 transition-colors duration-300 ${isStep1 ? 'bg-gray-300' : 'bg-green-600'}`}></div>
                            <StepIcon number={2} isCurrent={!isStep1} isComplete={false} label="Role & Preferences" />
                        </div>
                    </div>

                    {/* Dynamic Form Content */}
                    {isStep1 ? (
                        <AccountDetailsForm goToStep={setStep} />
                    ) : (
                        <RoleSelectionForm 
                            selectedRole={selectedRole}
                            setSelectedRole={setSelectedRole}
                            agreedToTerms={agreedToTerms}
                            setAgreedToTerms={setAgreedToTerms}
                            goToStep={setStep}
                        />
                    )}

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