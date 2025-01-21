"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { WaitlistBanner } from "@/components/WaitlistBanner";
import { BackgroundBeams } from "@/components/ui/background-beams";
import axios from "axios";
import DOMPurify from "dompurify";

export default function Page() {
  const [showBanner, setShowBanner] = useState(false);
  const [email, setEmail] = useState("");
  const [successEmail, setSuccessEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sanitizeInput = (input: string): string => {
    return DOMPurify.sanitize(input.trim());
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Sanitize and validate the email
    const sanitizedEmail = sanitizeInput(email);
    if (!sanitizedEmail || !validateEmail(sanitizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/waitlist", {
        email: sanitizedEmail,
      });

      if (response.status === 200) {
        setSuccessEmail(sanitizedEmail);
        setShowBanner(true);
        setTimeout(() => {
          setShowBanner(false);
        }, 5000);
        setEmail("");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (error: any) {
      console.error(error);
      setError(
        error?.response?.data?.error ??
          error?.message ??
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white text-gray-900 overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-4 px-4 py-2">
        <Image src="/images/logo.png" alt="Logo" width={150} height={150} />
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-center text-gray-900">
            Effortless client management
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 text-center">
            The all-in-one platform that helps freelancers and agencies deliver
            premium client service while maintaining profitability and control.
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full items-center justify-center"
          >
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Input
                type="email"
                placeholder="Email address"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white focus:ring-2 focus:ring-gray-900 placeholder:text-gray-400 py-5 border-gray-300"
              />
              <Button
                type="submit"
                className="bg-gray-900 text-white font-medium py-5 hover:bg-gray-800 whitespace-nowrap"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Get early access"}
              </Button>
            </div>
            {error && <p className="text-red-500 text-md mt-2">{error}</p>}
            <WaitlistBanner show={showBanner} email={successEmail} />
          </form>
        </div>
      </main>

      <BackgroundBeams />
    </div>
  );
}
