import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Plane } from "lucide-react";
import ToastContainer from "@/components/Toast";
import UserNav from "@/components/UserNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Travel Expense Tracker",
  description: "Track trips, bills, and claims effortlessly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 min-h-screen text-slate-900`}
      >
        <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
            >
              <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <Plane className="w-4 h-4" />
              </span>
              <span>Travel Expense</span>
            </Link>
            <div className="flex items-center gap-2 text-sm">
              <Link
                href="/trips"
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                Trips
              </Link>
              <Link
                href="/trips/new"
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
              >
                + New Trip
              </Link>
              <UserNav />
            </div>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        <ToastContainer />
      </body>
    </html>
  );
}