import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { requestOTP, verifyOTP } from "../../features/auth/authAPI";
import logoImage from "../../assets/logo-light.svg";
import logoDark from "../../assets/logo-dark.svg";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Loader2, Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const inputStyles = `
  w-full
  border-2
  transition-colors
  rounded-md
  px-3
  py-2
  text-base
  focus-visible:outline-none
  focus-visible:ring-0
  focus-visible:ring-offset-0
  focus:border-[#1565C0]
  dark:focus:border-[#90CAF9]
  disabled:cursor-not-allowed
  disabled:opacity-50
  dark:bg-gray-800
  dark:text-white
  dark:border-gray-700
`;

// Background SVG Components with theme support
const BackgroundPattern = ({ isDark }) => (
  <>
    {/* Abstract shapes in top-right */}
    <svg
      className="absolute right-0 top-0 -z-10 opacity-20"
      width="600"
      height="600"
      viewBox="0 0 100 100"
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop
            offset="0%"
            style={{
              stopColor: isDark ? "#1a1a1a" : "#ffffff",
              stopOpacity: 0.2,
            }}
          />
          <stop
            offset="100%"
            style={{
              stopColor: isDark ? "#1a1a1a" : "#ffffff",
              stopOpacity: 0.1,
            }}
          />
        </linearGradient>
      </defs>
      <circle cx="80" cy="20" r="15" fill="url(#grad1)" />
      <circle cx="85" cy="40" r="8" fill="url(#grad1)" />
      <circle cx="70" cy="35" r="5" fill="url(#grad1)" />
      <path
        d="M60,20 Q70,10 80,20 T100,20"
        stroke={isDark ? "#1a1a1a" : "#ffffff"}
        strokeWidth="0.5"
        fill="none"
        opacity="0.3"
      />
      <path
        d="M65,30 Q75,20 85,30 T105,30"
        stroke={isDark ? "#1a1a1a" : "#ffffff"}
        strokeWidth="0.5"
        fill="none"
        opacity="0.3"
      />
    </svg>

    {/* Dotted grid pattern */}
    <svg
      className="absolute inset-0 -z-10"
      width="100%"
      height="100%"
      fill="none"
    >
      <pattern
        id="grid"
        x="0"
        y="0"
        width="20"
        height="20"
        patternUnits="userSpaceOnUse"
      >
        <circle
          cx="2"
          cy="2"
          r="1"
          fill={isDark ? "#1a1a1a" : "#ffffff"}
          fillOpacity="0.15"
        />
      </pattern>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>

    {/* Bottom wave decoration */}
    <svg
      className="absolute left-0 bottom-0 -z-10"
      width="100%"
      height="300"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <path
        d="M0,50 Q25,45 50,50 T100,50 L100,100 L0,100 Z"
        fill={isDark ? "#1976D2" : "#1976D2"}
        fillOpacity="0.3"
      />
      <path
        d="M0,60 Q25,55 50,60 T100,60 L100,100 L0,100 Z"
        fill={isDark ? "#1a1a1a" : "#ffffff"}
        fillOpacity="0.1"
      />
      <path
        d="M0,70 Q25,65 50,70 T100,70 L100,100 L0,100 Z"
        fill={isDark ? "#1976D2" : "#1976D2"}
        fillOpacity="0.2"
      />
    </svg>
  </>
);

const LoginPage = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    otp: "",
  });
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((seconds) => seconds - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: "",
      otp: "",
    };

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (isOtpSent) {
      if (!formData.otp) {
        newErrors.otp = "OTP is required";
        isValid = false;
      } else if (!/^\d{6}$/.test(formData.otp)) {
        newErrors.otp = "OTP must be 6 digits";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === "otp") {
      updatedValue = value.replace(/\D/g, "").slice(0, 6);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const loadingToast = toast.loading("Sending OTP...");

    try {
      await dispatch(requestOTP({ email: formData.email })).unwrap();
      setIsOtpSent(true);
      setTimer(30);
      toast.success("OTP sent successfully!", { id: loadingToast });
    } catch (err) {
      console.log(err);
      toast.error(err, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (timer > 0) return;
    handleRequestOTP({ preventDefault: () => {} });
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const loadingToast = toast.loading("Verifying OTP...");

    try {
      await dispatch(
        verifyOTP({
          email: formData.email,
          otp: formData.otp,
        })
      ).unwrap();
      toast.success("Login successful!", { id: loadingToast });
      navigate("/admin/company");
    } catch (err) {
      toast.error(err || "Invalid OTP", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex ${isDark ? "bg-gray-900" : "bg-white"}`}>
      <Toaster position="top-right" />

      {/* Theme toggle button */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700"
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-gray-700" />
        )}
      </button>

      {/* Left side with blue background */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1565C0] dark:bg-[#0D47A1] text-white p-12 flex-col justify-between relative overflow-hidden">
        <BackgroundPattern isDark={isDark} />
        <div>
          <img src={logoImage} alt="SaleSkip Logo" className="w-40 mb-8" />
          <h1 className="text-5xl font-bold mb-6">Hello EduSkills!👋</h1>
          {/* <p className="text-xl">
            Skip repetitive and manual sales-marketing tasks. Get highly
            productive through automation and save tons of time!
          </p> */}
        </div>
        <div className="text-sm">
          © {new Date().getFullYear()} EduSkills Foundation. All rights
          reserved.
        </div>
      </div>

      {/* Right side with login form */}
      <div
        className={`w-full lg:w-1/2 flex items-center justify-center p-8 ${
          isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8">
            <img
              src={isDark ? logoImage : logoDark}
              alt="SaleSkip Logo"
              className="w-40"
            />
          </div>

          <div className="text-center mb-8">
            <h2
              className={`text-2xl font-bold mb-2 ${
                isDark ? "text-[#90CAF9]" : "text-[#1565C0]"
              }`}
            >
              Welcome To Talent Connect
            </h2>
            {/* <p className={isDark ? "text-gray-300" : "text-gray-600"}>
              Don&apos;t have an account?
              <a
                href="/register"
                className={`ml-1 ${
                  isDark
                    ? "text-[#90CAF9] hover:text-[#64B5F6]"
                    : "text-[#1565C0] hover:text-[#1976D2]"
                }`}
              >
                Create a new account now.
              </a>
            </p> */}
            {/* <p
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              It&apos;s FREE! Takes less than a minute.
            </p> */}
          </div>

          <form onSubmit={isOtpSent ? handleVerifyOTP : handleRequestOTP}>
            <div className="space-y-4">
              <div>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${inputStyles} ${
                    errors.email
                      ? "border-red-500"
                      : isDark
                      ? "border-gray-700"
                      : "border-gray-200"
                  }`}
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {isOtpSent && (
                <div>
                  <Input
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    value={formData.otp}
                    onChange={handleChange}
                    className={`${inputStyles} ${
                      errors.otp
                        ? "border-red-500"
                        : isDark
                        ? "border-gray-700"
                        : "border-gray-200"
                    }`}
                    maxLength={6}
                    disabled={loading}
                  />

                  {errors.otp && (
                    <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
                  )}
                  <div className="flex justify-between items-center mt-2 text-sm">
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      className={`${
                        isDark ? "text-[#90CAF9]" : "text-[#1565C0]"
                      } ${
                        timer > 0 || loading
                          ? "opacity-50 cursor-not-allowed"
                          : isDark
                          ? "hover:text-[#64B5F6]"
                          : "hover:text-[#1976D2]"
                      }`}
                      disabled={timer > 0 || loading}
                    >
                      Resend OTP
                    </button>
                    {timer > 0 && (
                      <span
                        className={isDark ? "text-gray-400" : "text-gray-500"}
                      >
                        Resend in {timer}s
                      </span>
                    )}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className={`w-full ${
                  isDark
                    ? "bg-[#1976D2] hover:bg-[#1565C0]"
                    : "bg-[#1565C0] hover:bg-[#1976D2]"
                } text-white transition-colors`}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait...
                  </span>
                ) : isOtpSent ? (
                  "Verify OTP"
                ) : (
                  "Login Now"
                )}
              </Button>

              {/* <div
                className={`text-center mt-6 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <p className="text-sm">
                  By continuing, you agree to our{" "}
                  <a
                    href="#"
                    className={`${
                      isDark
                        ? "text-[#90CAF9] hover:text-[#64B5F6]"
                        : "text-[#1565C0] hover:text-[#1976D2]"
                    }`}
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className={`${
                      isDark
                        ? "text-[#90CAF9] hover:text-[#64B5F6]"
                        : "text-[#1565C0] hover:text-[#1976D2]"
                    }`}
                  >
                    Privacy Policy
                  </a>
                </p>
              </div> */}
            </div>
          </form>

          {/* Help Section */}
          {/* <div className="mt-8 text-center">
            <p
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Need help?{" "}
              <a
                href="#"
                className={`${
                  isDark
                    ? "text-[#90CAF9] hover:text-[#64B5F6]"
                    : "text-[#1565C0] hover:text-[#1976D2]"
                }`}
              >
                Contact Support
              </a>
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
