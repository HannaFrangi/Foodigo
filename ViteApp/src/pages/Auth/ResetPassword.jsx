import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";
import { gsap } from "gsap";
import { Lock, Eye, EyeOff, ChevronRight } from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const { token } = useParams();

  const formRef = useRef(null);
  const buttonRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    // Initial page load animation
    const tl = gsap.timeline();

    tl.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.7, y: -50 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" }
    ).fromTo(
      formRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.3"
    );
  }, []);

  const handleMouseMove = (e) => {
    const button = buttonRef.current;
    const boundingRect = button.getBoundingClientRect();
    const x = e.clientX - boundingRect.left;
    const y = e.clientY - boundingRect.top;

    gsap.to(button, {
      duration: 0.4,
      x: (x - boundingRect.width / 2) / 10,
      y: (y - boundingRect.height / 2) / 10,
      ease: "power1.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(buttonRef.current, {
      duration: 0.4,
      x: 0,
      y: 0,
      ease: "power1.out",
    });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      if (!token) {
        setError("Invalid or missing reset token");
        return;
      }

      await axiosInstance.post("/auth/reset-password", {
        token,
        newPassword: password,
      });

      // Success animation
      const tl = gsap.timeline();
      tl.to(formRef.current, {
        scale: 1.05,
        rotation: 2,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
      });

      setSuccess(true);
      toast.success("Password reset successfully!");
      setTimeout(() => navigate("/"), 2500);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all hover:scale-[1.02]">
        <div className="text-center mb-6">
          <img
            ref={logoRef}
            src="/logo.png"
            alt="Foodigo Logo"
            className="mx-auto h-28 w-auto mb-4 object-contain"
          />
          <h2 className="text-3xl  text-gray-800 tracking-tight">
            Reset Your Password
          </h2>
        </div>

        <form
          ref={formRef}
          onSubmit={handleResetPassword}
          className="space-y-4"
        >
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative animate-shake">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-olive text-green-700 px-4 py-3 rounded-lg relative">
              Password reset successfully. Redirecting to login...
            </div>
          )}

          <div className="relative">
            <label className="block text-gray-700 text-sm mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 w-full py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5d6544] shadow-lg shadow-olive"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>

          <div className="relative">
            <label className="block text-gray-700 text-sm  mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-10 w-full py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5d6544]"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>

          <button
            ref={buttonRef}
            type="submit"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full bg-[#5d6544] text-white py-3 rounded-full flex items-center justify-center space-x-2 transition-all duration-300 hover:bg-[#4a5336] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5d6544]"
          >
            <span>Reset Password</span>
            <ChevronRight />
          </button>

          <div className="text-center mt-4">
            <p className="text-gray-600 text-sm">
              Remember your password?{" "}
              <a
                href="/auth"
                className="text-[#5d6544] hover:underline transition-colors"
              >
                Log in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
