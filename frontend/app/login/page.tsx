/**
 * Login page
 * @module app/login/page
 */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { login as apiLogin } from "@/lib/api";
import { ROUTES } from "@/constants/routes";

import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";

/**
 * Login page component (Presentational)
 */
const LoginPage = () => {
  // --- Hooks -----------------------------------------------------------------
  const { login, checkAuth, isAuthenticated } = useAuthStore();
  const router = useRouter();
  // --- END: Hooks ------------------------------------------------------------

  // --- Local state -----------------------------------------------------------
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  // --- END: Local state ------------------------------------------------------

  // --- Refs ------------------------------------------------------------------
  // --- END: Refs -------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true);
    setError("");

    try {
      console.log("Attempting login...");
      const response = await apiLogin({ username, password });
      console.log("Login successful, token received");

      login(response.token, response.expiresAt);
      console.log("Token saved, redirecting to:", ROUTES.HOME);

      // Force a hard navigation so middleware can intercept and redirect
      window.location.href = ROUTES.HOME;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Login failed. Please check your credentials.";
      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  // --- END: Data and handlers ------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    console.log("Login page: ");
    if (isAuthenticated) {
      console.log("User is authenticated, redirecting to home...");
    }
  }, [isAuthenticated, router]);
  // --- END: Side effects -----------------------------------------------------

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        backgroundImage: "url(/login-background.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay for better form visibility */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Login Form Container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* White Card with Shadow */}
          <div className="rounded-2xl bg-white p-8 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
            {/* Pokéball Logo */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#DC0A2D]">
                <div className="h-12 w-12 rounded-full border-4 border-white bg-[#DC0A2D]">
                  <div className="flex h-full items-center justify-center">
                    <div className="h-3 w-3 rounded-full border-2 border-[#212121] bg-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="mb-2 text-center font-bold text-2xl leading-8 text-[#212121]">
              Welcome back
            </h1>
            <p className="mb-8 text-center font-normal text-sm leading-4 text-[#666666]">
              Sign in to access your Pokédex
            </p>

            {/* Error Message */}
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-center">
                <p className="font-normal text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="font-bold text-sm leading-4 text-[#212121]"
                >
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  className="h-12 rounded-lg border-2 border-[#E0E0E0] bg-white font-normal text-sm leading-4 text-[#212121] placeholder:text-[#666666] focus:border-[#DC0A2D] focus:ring-0"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="font-bold text-sm leading-4 text-[#212121]"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="h-12 rounded-lg border-2 border-[#E0E0E0] bg-white font-normal text-sm leading-4 text-[#212121] placeholder:text-[#666666] focus:border-[#DC0A2D] focus:ring-0"
                />
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link
                  href="#"
                  className="font-normal text-sm leading-4 text-[#DC0A2D] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                className="h-12 w-full rounded-lg bg-[#DC0A2D] font-bold text-base leading-4 text-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-all hover:bg-[#DC0A2D]/90 hover:shadow-[0_6px_12px_rgba(0,0,0,0.15)]"
                disabled={isLoading}
                onClick={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget.form;
                  if (form) {
                    const username = (
                      form.elements.namedItem("username") as HTMLInputElement
                    ).value;
                    const password = (
                      form.elements.namedItem("password") as HTMLInputElement
                    ).value;
                    handleLogin(username, password);
                  }
                }}
              >
                Sign In
              </Button>

              {/* Sign Up Link */}
              <p className="text-center font-normal text-sm leading-4 text-[#666666]">
                Don't have an account?{" "}
                <Link
                  href="#"
                  className="font-bold text-[#DC0A2D] hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
