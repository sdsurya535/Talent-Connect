import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import logoImage from "../../assets/logo-light.svg";
import PropTypes from "prop-types";

// Add custom styles for input focus
const customInputStyles = `
  .custom-input:focus {
    border-color: #1565C0 !important;
    ring-color: #1565C0 !important;
    outline: none !important;
    box-shadow: 0 0 0 2px rgba(21, 101, 192, 0.2) !important;
  }
`;

const Logo = ({ className = "" }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <img src={logoImage} alt="EduSkills Logo" className="w-40" />
  </div>
);

const RegisterForm = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    organization: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
  };

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!value) return "Email is required";
        if (!validateEmail(value)) return "Invalid email format";
        break;
      case "password":
        if (!value) return "Password is required";
        if (!validatePassword(value))
          return "Password must be at least 8 characters";
        break;
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== formData.password) return "Passwords do not match";
        break;
      case "fullName":
        if (!value) return "Full name is required";
        break;
      case "organization":
        if (!value) return "Organization is required";
        break;
      case "phone":
        if (!value) return "Phone number is required";
        if (!validatePhone(value)) return "Invalid phone number format";
        break;
      default:
        return "";
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // If field hasn't been touched yet, mark it as touched and validate
    if (!touchedFields[name]) {
      setTouchedFields((prev) => ({ ...prev, [name]: true }));
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateStep1 = () => {
    const stepErrors = {};
    const fields = ["email", "password", "confirmPassword"];

    fields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) stepErrors[field] = error;
    });

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep2 = () => {
    const stepErrors = {};
    const fields = ["fullName", "organization", "phone"];

    fields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) stepErrors[field] = error;
    });

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1) {
      // Mark all fields in step 1 as touched
      setTouchedFields((prev) => ({
        ...prev,
        email: true,
        password: true,
        confirmPassword: true,
      }));

      if (validateStep1()) {
        setStep(2);
      }
    }
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = () => {
    // Mark all fields in step 2 as touched
    setTouchedFields((prev) => ({
      ...prev,
      fullName: true,
      organization: true,
      phone: true,
    }));

    if (validateStep2()) {
      console.log("Form submitted:", formData);
      // Add your submission logic here
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4 w-full">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={`custom-input dark:bg-slate-800 dark:border-slate-700 ${
                  touchedFields.email && errors.email ? "border-red-500" : ""
                }`}
              />
              {touchedFields.email && errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={`custom-input dark:bg-slate-800 dark:border-slate-700 ${
                  touchedFields.password && errors.password
                    ? "border-red-500"
                    : ""
                }`}
              />
              {touchedFields.password && errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={`custom-input dark:bg-slate-800 dark:border-slate-700 ${
                  touchedFields.confirmPassword && errors.confirmPassword
                    ? "border-red-500"
                    : ""
                }`}
              />
              {touchedFields.confirmPassword && errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 w-full">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={`custom-input dark:bg-slate-800 dark:border-slate-700 ${
                  touchedFields.fullName && errors.fullName
                    ? "border-red-500"
                    : ""
                }`}
              />
              {touchedFields.fullName && errors.fullName && (
                <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                name="organization"
                placeholder="Enter your organization name"
                value={formData.organization}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={`custom-input dark:bg-slate-800 dark:border-slate-700 ${
                  touchedFields.organization && errors.organization
                    ? "border-red-500"
                    : ""
                }`}
              />
              {touchedFields.organization && errors.organization && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.organization}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={`custom-input dark:bg-slate-800 dark:border-slate-700 ${
                  touchedFields.phone && errors.phone ? "border-red-500" : ""
                }`}
              />
              {touchedFields.phone && errors.phone && (
                <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <style>{customInputStyles}</style>
      <div className="flex min-h-screen">
        {/* Mobile Logo - Visible only on small screens */}
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-blue-600 p-4 z-10">
          <Logo />
        </div>

        {/* Left Panel */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#1565C0] dark:bg-[#0D47A1] p-12 flex-col justify-between">
          <Logo />
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-white">
              Hello EduSkills! 👋
            </h2>
            <p className="text-xl text-white/80">
              Join our community and start your learning journey today.
            </p>
          </div>
          <div className="text-white/60 text-sm">
            © 2022 EduSkills Foundation. All rights reserved.
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-white dark:bg-slate-900 relative">
          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="absolute top-4 right-4 rounded-full"
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Main Content */}
          <div className="w-full max-w-md space-y-8 p-6 mt-16 lg:mt-0">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Create Account
              </h2>
              {/* <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Create a new account now. It&apos;s FREE!
                <br />
                Takes less than a minute.
              </p> */}
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-[#1565C0] hover:text-[#1976D2] font-medium hover:underline"
                >
                  Login here
                </a>
              </p>
            </div>

            <div className="mt-8 space-y-6">
              {renderStep()}

              {/* Progress Bar */}
              <div className="h-1 w-full bg-gray-200 dark:bg-slate-700 rounded mt-8">
                <div
                  className="h-1 bg-[#1565C0] dark:bg-[#0D47A1] rounded transition-all duration-300"
                  style={{ width: `${(step / 2) * 100}%` }}
                />
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-4 justify-between mt-8">
                {step > 1 && (
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="w-1/2 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700"
                  >
                    Back
                  </Button>
                )}
                <Button
                  className={`${
                    step === 1 ? "w-full" : "w-1/2"
                  } bg-[#1565C0] dark:bg-[#0D47A1] hover:bg-blue-800`}
                  onClick={step === 2 ? handleSubmit : nextStep}
                >
                  {step === 2 ? "Create Account" : "Next"}
                </Button>
              </div>

              {/* Terms and Support Links */}
              <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8">
                <p>
                  By continuing, you agree to our{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </p>
                <p className="mt-4">
                  Need help?{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Contact Support
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Logo.propTypes = {
  className: PropTypes.string,
};

export default RegisterForm;
