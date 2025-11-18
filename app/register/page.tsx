'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

type FormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  return (
    <div className="min-h-screen flex flex-col bg-[#141313]">
      <Header />
      <main className="flex-grow flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-[#1E1E1E] rounded-2xl shadow-2xl p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-wide">
            Create Account
          </h1>
          <p className="text-gray-400 text-sm">
            Join us and start your journey today
          </p>
        </div>

        {/* Form */}
        <form 
          className="space-y-5"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            
            // Validate passwords match
            if (formData.password !== formData.confirmPassword) {
              setError("Passwords do not match");
              return;
            }

            setIsLoading(true);
            
            try {
              const response = await fetch(`${BASE_URL}/auth/register`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: formData.name,
                  email: formData.email,
                  phone: formData.phone,
                  password: formData.password,
                }),
              });

              const data = await response.json();

              if (!response.ok) {
                throw new Error(data.message || "Registration failed");
              }

              // Save token and user data to localStorage
              localStorage.setItem("token", data.token);
              localStorage.setItem("user", JSON.stringify(data.user));
              
              // Redirect to dashboard or home page
              router.push("/");
            } catch (err) {
              console.error("Registration error:", err);
              const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.';
              setError(errorMessage);
            } finally {
              setIsLoading(false);
            }
          }}
        >
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullname"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Full Name
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 21a9 9 0 0115 0"
                />
              </svg>
              <input
                type="text"
                id="fullname"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Abdul Olinga"
                className="w-full bg-[#2A2A2A] border border-gray-700 rounded-lg py-2.5 pl-10 pr-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accentTeal focus:border-accentTeal"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0L12 12.75 2.25 6.75"
                />
              </svg>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="you@example.com"
                className="w-full bg-[#2A2A2A] border border-gray-700 rounded-lg py-2.5 pl-10 pr-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accentTeal focus:border-accentTeal"
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Phone Number
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                />
              </svg>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+1 (555) 123-4567"
                className="w-full bg-[#2A2A2A] border border-gray-700 rounded-lg py-2.5 pl-10 pr-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accentTeal focus:border-accentTeal"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 00-9 0v3.75M5.25 10.5h13.5A1.5 1.5 0 0120.25 12v7.5A1.5 1.5 0 0118.75 21H5.25A1.5 1.5 0 013.75 19.5V12a1.5 1.5 0 011.5-1.5z"
                />
              </svg>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••"
                className="w-full bg-[#2A2A2A] border border-gray-700 rounded-lg py-2.5 pl-10 pr-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accentTeal focus:border-accentTeal"
                required
                minLength={6}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 00-9 0v3.75M5.25 10.5h13.5A1.5 1.5 0 0120.25 12v7.5A1.5 1.5 0 0118.75 21H5.25A1.5 1.5 0 013.75 19.5V12a1.5 1.5 0 011.5-1.5z"
                />
              </svg>
              <input
                type="password"
                id="confirm-password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                placeholder="••••••••"
                className="w-full bg-[#2A2A2A] border border-gray-700 rounded-lg py-2.5 pl-10 pr-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accentTeal focus:border-accentTeal"
                required
                minLength={6}
              />
            </div>
          </div>

          {/* Submit Button */}
          {error && (
            <div className="text-red-500 text-sm text-center p-2 bg-red-100 bg-opacity-10 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${
              isLoading ? 'bg-gray-600' : 'bg-accentTeal hover:bg-teal-700'
            } transition-all text-white font-semibold py-3 rounded-lg shadow-lg flex items-center justify-center`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 text-gray-500 my-6">
            <div className="flex-grow h-px bg-gray-700"></div>
            <span className="text-sm">or</span>
            <div className="flex-grow h-px bg-gray-700"></div>
          </div>

          {/* Google Sign Up */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-[#2A2A2A] border border-gray-700 hover:border-accentTeal hover:text-accentTeal transition-all py-3 rounded-lg"
          >
            <img src="/google.svg" alt="Google" className="w-5 h-5" />
            Sign up with Google
          </button>

          {/* Already have an account */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-accentTeal hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
      </main>
      <Footer />
    </div>
  );
}
