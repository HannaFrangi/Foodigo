import React, { useState } from "react";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useUserStore } from "../../source/useAuthStore";

const SignUpForm = ({ callParallax, onMouseEnter, onMouseLeave }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { signup, loading } = useUserStore(); // Use the signup function and loading state from Zustand

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = { name, email, password };
    signup(userData); // Call signup function from Zustand store
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle password visibility
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-6 bg-white p-8 rounded-3xl shadow-lg"
    >
      {/* Name Field */}
      <div className="group">
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full pb-3 text-lg bg-transparent border-b-2 border-gray-200 focus:border-olive focus:outline-none"
          placeholder="Full Name"
        />
      </div>

      {/* Email Field */}
      <div className="group">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full pb-3 text-lg bg-transparent border-b-2 border-gray-200 focus:border-olive focus:outline-none"
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
          className="w-full pb-3 text-lg bg-transparent border-b-2 border-gray-200 focus:border-olive focus:outline-none pr-12"
          placeholder="Password"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-0 bottom-5 text-gray-400 hover:text-olive"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Submit Button */}
      <button
        onMouseMove={callParallax}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        type="submit"
        disabled={loading} // Disable the button when loading
        className="w-full bg-olive text-white py-4 rounded-full flex items-center justify-center gap-2"
      >
        <UserPlus className="w-5 h-5" />
        <span>{loading ? "Processing..." : "Join Foodigo"}</span>
      </button>
    </form>
  );
};

export default SignUpForm;
