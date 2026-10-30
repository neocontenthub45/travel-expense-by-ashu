"use client";

import { useEffect } from "react";

export default function PWARegister() {
  useEffect(() => {
    // ABHI KE LIYE SERVICE WORKER DISABLE KIYA HAI
    /*
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.log("SW registration failed:", err);
      });
    }
    */
  }, []);
  return null;
}
