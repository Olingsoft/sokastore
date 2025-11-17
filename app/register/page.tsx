'use client';

import React from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function RegisterPage() {
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
        <form className="space-y-5">
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
                placeholder="you@example.com"
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
                placeholder="••••••••"
                className="w-full bg-[#2A2A2A] border border-gray-700 rounded-lg py-2.5 pl-10 pr-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accentTeal focus:border-accentTeal"
                required
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
                placeholder="••••••••"
                className="w-full bg-[#2A2A2A] border border-gray-700 rounded-lg py-2.5 pl-10 pr-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accentTeal focus:border-accentTeal"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-accentTeal hover:bg-teal-700 transition-all text-white font-semibold py-3 rounded-lg shadow-lg"
          >
            Create Account
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
