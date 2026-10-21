import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import Link from "next/link";
import { Plane } from "lucide-react";
import ToastContainer from "@/components/Toast";
import PWARegister from "@/components/PWARegister";
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
  manifest: "/manifest.json",
  themeColor: "#4F46E5",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TravelExpense",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${body.variable} ${display.variable} antialiased bg-slate-50 min-h-screen text-slate-900`}
        style={{ fontFamily: 'var(--font-body)' }}
      >
        <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold hover:text-indigo-600 transition-colors"
              style={{ fontFamily: 'var(--font-display)' }}
            >
            <img src="/logo-header.png" alt="Logo" className="w-8 h-8 object-contain" />
              <span>Travel Expense</span>
            </Link>
            <div className="flex items-center text-sm">
              <UserNav />
            </div>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
        // ... body ke andar
<ToastContainer />
<PWARegister />
      </body>
    </html>
  );
}