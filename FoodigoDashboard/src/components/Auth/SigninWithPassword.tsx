"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import InputGroup from "../FormElements/InputGroup";
import { EmailIcon, PasswordIcon } from "@/assets/icons";

interface User {
  name: string;
  email: string;
  ProfilePicURL?: string;
  role?: string;
}

export default function SigninWithPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  // Decode JWT to check its validity
  const decodeJWT = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch {
      return null;
    }
  };

  // Save user data to localStorage
  const saveUserToLocalStorage = (user: User) => {
    try {
      localStorage.setItem("authUser", JSON.stringify(user));
    } catch (err) {
      console.error("Error saving user to localStorage:", err);
      toast.warning("Failed to save user data locally");
    }
  };

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = () => {
      // Check JWT cookie
      const jwt = document.cookie
        .split("; ")
        .find((row) => row.startsWith("jwt="))
        ?.split("=")[1];

      // Check localStorage
      const storedUser = localStorage.getItem("authUser");

      if (jwt && storedUser) {
        const payload = decodeJWT(jwt);

        if (payload && payload.exp * 1000 > Date.now()) {
          toast.info("You are already logged in!");
          router.push("/");
        } else {
          // Clear stored data if JWT is expired
          localStorage.removeItem("authUser");
        }
      }
    };

    checkAuth();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://foodigo.onrender.com/api/auth/adminlogin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include", // Include cookies in the request
        },
      );

      const result = await response.json();

      if (response.ok) {
        // Save user data to localStorage
        const userData: User = {
          name: result.user.name,
          email: result.user.email,
          ProfilePicURL: result.user.ProfilePicURL || "",
          role: result.user.role || "user",
        };

        saveUserToLocalStorage(userData);

        toast.success(`Welcome back, ${result.user.name}!`);
        router.push("/users"); // Redirect after successful login
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* Email Input */}
      <InputGroup
        type="email"
        label="Email"
        className="mb-4 [&_input]:py-[15px]"
        placeholder="Enter your email"
        name="email"
        value={email}
        handleChange={handleChange}
        icon={<EmailIcon />}
      />

      {/* Password Input */}
      <InputGroup
        type="password"
        label="Password"
        className="mb-5 [&_input]:py-[15px]"
        placeholder="Enter your password"
        name="password"
        value={password}
        handleChange={handleChange}
        icon={<PasswordIcon />}
      />

      {/* Error message */}
      {error && <div className="mb-4 text-red-500">{error}</div>}

      {/* Submit button */}
      <div className="mb-4.5">
        <button
          type="submit"
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
          disabled={loading}
        >
          Sign In
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
          )}
        </button>
      </div>
    </form>
  );
}
