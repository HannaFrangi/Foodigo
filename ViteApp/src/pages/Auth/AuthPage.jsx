import { useState, useRef, useEffect } from "react";
import {
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  ArrowLeft,
  X,
  Send,
  Sparkles,
} from "lucide-react";
import { gsap } from "gsap";
import { Avatar } from "antd";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AuthPage = () => {
  const { signup, login, forgotPassword } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const buttonRef = useRef(null);
  const logoRef = useRef(null);
  const formRef = useRef(null);
  const backButtonRef = useRef(null);
  const modalRef = useRef(null);
  const modalContentRef = useRef(null);
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await forgotPassword(resetEmail);
      setResetEmailSent(true);
    } catch (error) {
      console.error("Error sending reset email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openForgotPassword = () => {
    setShowForgotPassword(true);
    gsap.set(modalRef.current, { display: "flex" });
    gsap.fromTo(
      modalRef.current,
      { opacity: 0, scale: 0.5 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "back.out",
      }
    );
    gsap.fromTo(
      modalContentRef.current,
      { y: 50, opacity: 0, rotation: -5 },
      {
        y: 0,
        opacity: 1,
        rotation: 0,
        duration: 0.4,
        ease: "power2.out",
      }
    );
  };

  const closeForgotPassword = () => {
    gsap.to(modalContentRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
    });
    gsap.to(modalRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        gsap.set(modalRef.current, { display: "none" });
        setShowForgotPassword(false);
        setResetEmail("");
        setResetEmailSent(false);
      },
    });
  };

  const handleSignup = async (userData) => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match!");
      toast.error(passwordError);
      return;
    }
    setIsLoading(true);
    try {
      await signup(userData);
    } catch (error) {
      console.error("Error during signup:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (loginData) => {
    setIsLoading(true);
    try {
      await login(loginData);
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    gsap.to(formRef.current, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        setIsLogin(!isLogin);
        gsap.to(formRef.current, {
          opacity: 1,
          duration: 0.2,
        });
      },
    });
  };

  const handleBackHover = () => {
    gsap.to(backButtonRef.current, {
      scale: 1.1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleBackLeave = () => {
    gsap.to(backButtonRef.current, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleBackClick = () => {
    gsap.to(backButtonRef.current, {
      rotate: -360,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        navigate("/");
      },
    });
  };

  const callParallax = (e) => {
    parallaxIt(e, buttonRef.current, 15);
  };

  const parallaxIt = (e, target, movement) => {
    const rect = target.getBoundingClientRect();
    const relX = e.pageX - rect.left - window.scrollX;
    const relY = e.pageY - rect.top - window.scrollY;

    gsap.to(target, {
      duration: 0.3,
      x: ((relX - rect.width / 2) / rect.width) * movement,
      y: ((relY - rect.height / 2) / rect.height) * movement,
      ease: "power2.out",
    });
  };

  const onMouseLeave = () => {
    gsap.to(buttonRef.current, { duration: 0.3, scale: 1, x: 0, y: 0 });
  };

  const onMouseEnter = () => {
    gsap.to(buttonRef.current, { duration: 0.3, scale: 1.05 });
  };

  return (
    <div className="min-h-screen bg-[#FFFAF5] flex items-center justify-center p-4 relative">
      {/* Forgot Password Modal */}
      <div
        ref={modalRef}
        className="fixed inset-0 bg-black/50 items-center justify-center z-50 hidden opacity-0"
        onClick={(e) => e.target === modalRef.current && closeForgotPassword()}
      >
        <div
          ref={modalContentRef}
          className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 relative"
        >
          <button
            onClick={closeForgotPassword}
            className="absolute right-4 top-4 p-2 hover:bg-zinc-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-zinc-500" />
          </button>

          {!resetEmailSent ? (
            <>
              <h3 className="text-2xl font-medium text-dark mb-2">
                Reset Password
              </h3>
              <p className="text-zinc-600 mb-6">
                Enter your email address and we'll send you instructions to
                reset your password.
              </p>
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div className="group">
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full pb-3 text-lg text-dark bg-transparent border-b-2 border-zinc-200 focus:border-olive focus:outline-none transition-all duration-300"
                    placeholder="Enter your email"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-olive text-white py-4 rounded-full font-medium transition-all duration-300 hover:bg-olive/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-olive/20"
                >
                  <Send className="w-5 h-5" />
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-olive" />
              </div>
              <h3 className="text-2xl font-medium text-dark mb-2">
                Check Your Email
              </h3>
              <p className="text-zinc-600 mb-6">
                We've sent password reset instructions to:
                <br />
                <span className="font-medium text-dark">{resetEmail}</span>
              </p>
              <button
                onClick={closeForgotPassword}
                className="relative w-full bg-olive text-white py-4 rounded-full font-medium transition-all duration-300 hover:bg-olive disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-olive"
              >
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Back Button */}
      <button
        ref={backButtonRef}
        onClick={handleBackClick}
        onMouseEnter={handleBackHover}
        onMouseLeave={handleBackLeave}
        className="absolute top-4 left-4 md:top-8 md:left-8 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 active:scale-95 z-10"
      >
        <ArrowLeft className="w-6 h-6 text-olive" />
      </button>

      <div className="max-w-md w-full space-y-8 relative">
        {/* Decorative food-themed elements */}
        <div
          ref={logoRef}
          className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-red-900/5 rounded-full transition-all duration-300 hover:scale-105"
        >
          <div className="relative">
            <Avatar src="/src/assets/logo.png" size={150} />
            <Sparkles className="absolute -top-2 -right-2 text-olive animate-pulse" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center pt-16">
          <h2 className="text-4xl font-medium text-dark tracking-tight">
            Welcome to Foodigo
          </h2>
          <p className="mt-4 text-zinc-600">
            {isLogin
              ? "Sign in to discover amazing recipes"
              : "Join us to start your culinary journey"}
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex justify-center gap-8 mb-8">
          <button
            onClick={() => !isLogin && toggleMode()}
            className={`pb-2 px-4 text-lg transition-all duration-300 ${
              isLogin
                ? "text-olive border-b-2 border-olive"
                : "text-zinc-400 hover:text-olive"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => isLogin && toggleMode()}
            className={`pb-2 px-4 text-lg transition-all duration-300 ${
              !isLogin
                ? "text-olive border-b-2 border-olive"
                : "text-zinc-400 hover:text-olive"
            }`}
          >
            Create Account
          </button>
        </div>

        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            isLogin
              ? handleLogin({ email, password })
              : handleSignup({ name, email, password });
          }}
          className="mt-8 space-y-6 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          {/* Name Field (Sign Up only) */}
          {!isLogin && (
            <div className="group">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pb-3 text-lg text-dark bg-transparent border-b-2 border-zinc-200 focus:border-olive focus:outline-none transition-all duration-300"
                placeholder="Full Name"
              />
            </div>
          )}

          {/* Email Field */}
          <div className="group">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pb-3 text-lg text-dark bg-transparent border-b-2 border-zinc-200 focus:border-olive focus:outline-none transition-all duration-300"
              placeholder="Email"
            />
          </div>

          {/* Password Field */}
          <div className="group relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pb-3 text-lg text-dark bg-transparent border-b-2 border-zinc-200 focus:border-olive focus:outline-none transition-all duration-300 pr-12"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 bottom-5 text-zinc-400 hover:text-olive transition-colors duration-200"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 -my-1.5" />
              ) : (
                <Eye className="w-5 h-5 -my-1.5" />
              )}
            </button>
          </div>

          {/* Confirm Password only in create Acc */}
          {!isLogin && (
            <div className="group relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  // Clear error when user starts typing
                  if (passwordError) setPasswordError("");
                }}
                className="w-full pb-3 text-lg text-dark bg-transparent border-b-2 border-zinc-200 focus:border-olive focus:outline-none transition-all duration-300 pr-12"
                placeholder="Confirm Password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-0 bottom-5 text-zinc-400 hover:text-olive transition-colors duration-200"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          )}

          {/* Remember me and Forgot password (Login only) */}
          {isLogin && (
            <div className="flex items-center justify-center pt-4">
              <button
                type="button"
                onClick={openForgotPassword}
                className="text-zinc-600 hover:text-olive transition-colors duration-200"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              ref={buttonRef}
              onMouseMove={callParallax}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              type="submit"
              disabled={isLoading}
              className="relative w-full bg-olive text-white py-4 rounded-full font-medium transition-all duration-300 hover:bg-olive disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-olive"
            >
              {isLogin ? (
                <LogIn className="w-5 h-5" />
              ) : (
                <UserPlus className="w-5 h-5" />
              )}
              <span>
                {isLoading
                  ? "Processing..."
                  : isLogin
                  ? "Start Cooking"
                  : "Join Foodigo"}
              </span>
            </button>
          </div>

          {/* Terms of Service (Sign Up only) */}
          {!isLogin && (
            <p className="text-center text-sm text-zinc-500 mt-4">
              By creating an account, you agree to our{" "}
              <button className="text-red-900 hover:text-red-900 underline bold">
                Terms of Service
              </button>{" "}
              and{" "}
              <button className="text-red-900 hover:text-red-900 underline bold">
                Privacy Policy
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
