"use client";

import { useState } from "react";

export default function ViewBillButton({ path }: { path: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/signed-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load bill");
      window.open(data.url, "_blank");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <span>
      <button
        onClick={handleClick}
        disabled={loading}
        className="text-xs text-blue-600 underline hover:text-blue-800"
      >
        {loading ? "Loading..." : "View Bill"}
      </button>
      {error && <span className="text-xs text-red-600 ml-2">{error}</span>}
    </span>
  );
}