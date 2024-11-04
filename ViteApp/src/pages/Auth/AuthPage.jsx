import { useState, useRef } from "react";
import { Eye, EyeOff, LogIn, UtensilsCrossed, UserPlus } from "lucide-react";
import { gsap } from "gsap";
import { Avatar } from "antd";

const AuthPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const buttonRef = useRef(null);
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const toggleMode = () => {
    // Animate form opacity on mode change
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
    <div className="min-h-screen bg-[#FFFAF5] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 relative">
        {/* Decorative food-themed elements */}
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-red-900/5 rounded-full ">
          {" "}
          {/* Adjusted padding */}
          <div>
            <Avatar src="/src/assets/logo.png" size={150} />{" "}
            {/* Increased size */}
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
              !isLogin ? "olive border-b-2 olive" : "text-zinc-400 hover:olive"
            }`}
          >
            Create Account
          </button>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
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
              className="absolute right-0 bottom-5 text-zinc-400 hover:text-olivetransition-colors duration-200"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Remember me and Forgot password (Login only) */}
          {isLogin && (
            <div className="flex items-center justify-between pt-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-olive rounded border-zinc-300 focus:ring-olive"
                />
                <span className="text-zinc-600">Remember me</span>
              </label>
              <button
                type="button"
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
