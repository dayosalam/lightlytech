"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { WaitlistBanner } from "@/components/WaitlistBanner";
import { BackgroundBeams } from "@/components/ui/background-beams";
import {
  Monitor,
  GitPullRequest,
  LayoutDashboard,
  Settings2,
  ChartArea,
} from "lucide-react";
import axios from "axios";
import DOMPurify from "dompurify";
import { features } from "@/data";

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

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case "Real-time Energy Monitoring":
        return (
          <Monitor className="w-8 h-8 sm:w-12 sm:h-12 mb-4 sm:mb-6 text-black" />
        );
      case "Smart Energy Control":
        return (
          <LayoutDashboard className="w-8 h-8 sm:w-12 sm:h-12 mb-4 sm:mb-6 text-black" />
        );
      case "Actionable Usage Insights":
        return (
          <ChartArea className="w-8 h-8 sm:w-12 sm:h-12 mb-4 sm:mb-6 text-black" />
        );
      case "Tokenized Economy & Incentives":
        return (
          <Settings2 className="w-8 h-8 sm:w-12 sm:h-12 mb-4 sm:mb-6 text-black" />
        );
      default:
        return null;
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
            Take Control of Your Energy
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 text-center">
            The smart energy management platform that helps homeowners and
            businesses monitor, optimize, and control electricity usage while
            earning rewards for efficient energy consumption.
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

      {/* Features */}
      <section className="relative  text-black py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-16">
            {features.map((feature, index) => (
              <div key={index}>
                {getFeatureIcon(feature.title)}
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BackgroundBeams />
    </div>
  );
}
