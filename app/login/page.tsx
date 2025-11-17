'use client';

import React from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#141313]">
      <Header />
      <main className="flex-grow flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-[#1E1E1E] rounded-2xl shadow-2xl p-8 space-y-8">
        {/* Logo / Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-wide">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-sm">Sign in to continue</p>
        </div>

        {/* Form */}
        <form className="space-y-5">
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

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="accent-accentTeal bg-[#2A2A2A] rounded"
              />
              Remember me
            </label>
            <Link href="#" className="hover:text-accentTeal">
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-accentTeal hover:bg-teal-700 transition-all text-white font-semibold py-3 rounded-lg shadow-lg"
          >
            Sign In
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 text-gray-500 my-6">
            <div className="flex-grow h-px bg-gray-700"></div>
            <span className="text-sm">or</span>
            <div className="flex-grow h-px bg-gray-700"></div>
          </div>

          {/* Social Login */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-[#2A2A2A] border border-gray-700 hover:border-accentTeal hover:text-accentTeal transition-all py-3 rounded-lg"
          >
            <img src="/google.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Don’t have an account?{" "}
            <Link href="/register" className="text-accentTeal hover:underline">
              Create one
            </Link>
          </p>
        </form>
      </div>
      </main>
      <Footer />
    </div>
  );
}
