"use client";

import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

interface WaitlistBannerProps {
  show: boolean;
  email: string;
}

export function WaitlistBanner({ show, email }: WaitlistBannerProps) {
  return (
    <div
      className={cn(
        "bg-gray-100 border border-gray-200 text-gray-900 px-4 py-3 transform transition-all duration-500 ease-in-out flex items-center gap-3 text-sm rounded-lg",
        show
          ? "opacity-100 max-h-20 my-4"
          : "opacity-0 max-h-0 my-0 overflow-hidden"
      )}
    >
      <CheckCircle className="w-4 h-4 text-green-600" />
      <span>
        We&apos;ve added <span className="font-semibold">{email}</span> to our
        waitlist. We&apos;ll let you know when Lightlybox is ready.
      </span>
    </div>
  );
}
