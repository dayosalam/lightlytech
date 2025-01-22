"use client";

import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function UnsubscribePage() {
  const url = new URL(window.location.href);
  const email = url.searchParams.get("email") ?? "";

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleUnsubscribe = async () => {
    if (!email) {
      setMessage("Invalid or missing email address.");
      return;
    }

    setStatus("loading");

    try {
      const response = await axios.post("/api/unsubscribe", { email });
      setMessage(response.data.message);
      setStatus("success");
    } catch (error: any) {
      setMessage(
        error.response?.data?.error ??
          "Failed to unsubscribe. Please try again."
      );
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Image
        src="/images/logo.png"
        alt="Logo"
        width={150}
        height={150}
        priority
        className="object-cover pointer-events-none"
      />
      <p className="text-gray-700 mb-4">
        Are you sure you want to unsubscribe from our waitlist?
      </p>
      <Button
        onClick={handleUnsubscribe}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        disabled={status === "loading" || status === "success"}
      >
        {status === "loading" ? "Processing..." : "Unsubscribe"}
      </Button>
      {message && <p className="mt-4 text-gray-900">{message}</p>}
    </div>
  );
}
