"use client";

import { useEffect } from "react";

export default function PWARegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("SW registered:", reg.scope);
        })
        .catch((err) => {
          console.log("SW registration failed:", err);
        });
    }

    // Debug: Check if beforeinstallprompt fires
    window.addEventListener("beforeinstallprompt", (e) => {
      console.log("beforeinstallprompt fired! App is installable.");
      // Prevent default mini-infobar
      e.preventDefault();
      // Save event for later
      (window as any).deferredPrompt = e;
    });

    window.addEventListener("appinstalled", () => {
      console.log("App was installed!");
    });
  }, []);

  return null;
}