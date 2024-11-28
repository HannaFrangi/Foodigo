import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";
import { gsap } from "gsap";
//import { Mail, ChevronRight } from "lucide-react";

const EmailVerification = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { token } = useParams();

  const formRef = useRef(null);
  //const buttonRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    const verifyEmailAutomatically = async () => {
      if (token) {
        try {
          console.log(token);
          await axiosInstance.post("/auth/verify", {
            token,
          });
          setSuccess(true);
          toast.success("Email verified successfully!");
          setTimeout(() => navigate("/"), 2500);
        } catch (err) {
          setError(err.response?.data?.message || "Verification failed");
        }
      }
    };

    verifyEmailAutomatically();

    // Animation setup
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
  }, [token, navigate]);

  const handleResendCode = async () => {
    try {
      await axiosInstance.post("/auth/verify", {
        token,
      });
      toast.success("Verification link resent!");
    } catch (err) {
      toast.error("Failed to resend verification link");
    }
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
          <h2 className="text-3xl text-gray-800 tracking-tight">
            {success ? "Email Verified" : "Verifying Your Email"}
          </h2>
        </div>

        <div ref={formRef}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative animate-shake mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative">
              Email verified. Redirecting to login...
            </div>
          )}

          {!success && (
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Verifying your email address...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
