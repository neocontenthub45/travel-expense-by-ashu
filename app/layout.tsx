import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import Link from "next/link";
import { Plane } from "lucide-react";
import ToastContainer from "@/components/Toast";
import UserNav from "@/components/UserNav";
import "./globals.css";

const display = Bricolage_Grotesque({ 
  subsets: ["latin"], 
  weight: ["700", "800"],
  variable: "--font-display"
});

const body = DM_Sans({ 
  subsets: ["latin"], 
  weight: ["400", "500", "700"],
  variable: "--font-body"
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
        className={`${body.variable} ${display.variable} antialiased bg-[#F8F6F0] min-h-screen text-[#17163F]`}
        style={{ fontFamily: 'var(--font-body)' }}
      >
        <nav className="sticky top-0 z-40 bg-[#F8F6F0]/90 backdrop-blur-md border-b border-slate-200/50">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold hover:text-indigo-600 transition-colors"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-[#7B3FD6] text-white flex items-center justify-center shadow-sm">
                <Plane className="w-4 h-4" fill="currentColor" />
              </span>
              <span>Travel Expense</span>
            </Link>
            <div className="flex items-center text-sm">
              <UserNav />
            </div>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
        <ToastContainer />
      </body>
    </html>
  );
}