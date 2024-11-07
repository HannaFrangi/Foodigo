import React, { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useUserStore } from "../../source/useAuthStore"; // Importing the zustand store

const LogInForm = () => {
  // States for form data and password visibility
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Get loading and login function from the store
  const { login, loading } = useUserStore((state) => ({
    login: state.login,
    loading: state.loading,
  }));

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email, password });
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-6 bg-white p-8 rounded-3xl shadow-lg"
    >
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
        type="submit"
        disabled={loading}
        className="w-full bg-olive text-white py-4 rounded-full flex items-center justify-center gap-2"
      >
        <LogIn className="w-5 h-5" />
        <span>{loading ? "Processing..." : "Start Cooking"}</span>
      </button>
    </form>
  );
};

export default LogInForm;
