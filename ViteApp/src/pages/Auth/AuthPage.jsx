import { useState, useRef } from "react";
import { Eye, EyeOff, LogIn, UtensilsCrossed, UserPlus } from "lucide-react";
import { gsap } from "gsap";
import { Avatar } from "antd";

import LogInForm from "../../components/Forms/LoginForm.jsx";
import SignUpForm from "../../components/Forms/SignUpForm.jsx";

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
    console.log("Email:", email);
    console.log("Password:", password);
    setIsLoading(true);

    if (name.trim() === "") {
      console.log("Logging in with email:", email);
    } else {
      console.log("Signing up with name:", name, "and email:", email);
    }

    setEmail("");
    setPassword("");
    setName("");

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const toggleMode = () => {
    // Animate form opacity on mode change
    gsap.to(formRef.current, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        setIsLogin(!isLogin); // Toggle between login and signup
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
          <div>
            <Avatar src="/src/assets/logo.png" size={150} />
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
        {isLogin ? (
          <LogInForm
            email={email}
            password={password}
            onEmailChange={(e) => setEmail(e.target.value)}
            onPasswordChange={(e) => setPassword(e.target.value)}
            showPassword={showPassword}
            togglePasswordVisibility={() => setShowPassword(!showPassword)}
            isLoading={isLoading}
            handleSubmit={handleSubmit}
            buttonRef={buttonRef}
            callParallax={callParallax}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
        ) : (
          <SignUpForm
            name={name}
            email={email}
            password={password}
            onNameChange={(e) => setName(e.target.value)}
            onEmailChange={(e) => setEmail(e.target.value)}
            onPasswordChange={(e) => setPassword(e.target.value)}
            showPassword={showPassword}
            togglePasswordVisibility={() => setShowPassword(!showPassword)}
            isLoading={isLoading}
            handleSubmit={handleSubmit}
            buttonRef={buttonRef}
            callParallax={callParallax}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
