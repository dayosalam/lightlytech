"use client";

import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Monitor,
  GitPullRequest,
  LayoutDashboard,
  Settings2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { WaitlistBanner } from "@/components/WaitlistBanner";
import { addToWaitlist } from "@/lib/utils";

export default function Page() {
  const [showBanner, setShowBanner] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const { error } = await addToWaitlist(email);
      if (error) throw new Error(error.message);

      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 3000);
    } catch (error) {
      console.error(error);
      setError(error?.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4 py-2">
        <Image src="/images/logo.png" alt="Logo" width={150} height={150} />
        <a
          href="https://instagram.com/useatelier08"
          className="text-gray-900 border border-gray-900 px-4 py-2 rounded-full text-sm hover:bg-gray-900 hover:text-white transition-colors whitespace-nowrap"
        >
          Follow us on Instagram
        </a>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-xl mx-auto flex flex-col items-center mb-20">
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
                className="bg-gray-900 text-white font-medium py-5 hover:bg-gray-800 whitespace-nowrap "
                disabled={loading}
              >
                Get early access
              </Button>
            </div>
            {error && <p className="text-red-500 text-md mt-2">{error}</p>}
            <WaitlistBanner show={showBanner} email={email} />
          </form>
        </div>

        <Separator className="mb-16 max-w-3xl mx-auto bg-gray-200" />

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 sm:gap-16 mt-16 sm:mt-32">
          <div>
            <Monitor className="w-8 h-8 sm:w-12 sm:h-12 mb-4 sm:mb-6 text-gray-900" />
            <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-900">
              White-label client portal
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Turn scattered communications into a premium branded experience.
              Custom domains, your design, your brand - all managed from one
              place.
            </p>
          </div>

          <div>
            <GitPullRequest className="w-8 h-8 sm:w-12 sm:h-12 mb-4 sm:mb-6 text-gray-900" />
            <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-900">
              Scope management that pays
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Transform scope creep from a profit killer into a revenue stream.
              Track changes, assess impact, and manage client expectations
              effortlessly.
            </p>
          </div>

          <div>
            <LayoutDashboard className="w-8 h-8 sm:w-12 sm:h-12 mb-4 sm:mb-6 text-gray-900" />
            <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-900">
              Project dashboard
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Keep everything organized and visible. Track progress, manage
              timelines, and deliver updates - all with professional polish.
            </p>
          </div>

          <div>
            <Settings2 className="w-8 h-8 sm:w-12 sm:h-12 mb-4 sm:mb-6 text-gray-900" />
            <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-900">
              Smart automation
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Save hours on routine tasks. Automated updates, scheduled
              check-ins, and intelligent assistance when you need it.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
