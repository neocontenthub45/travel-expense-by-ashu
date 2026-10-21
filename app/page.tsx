"use client";

import Link from "next/link";
import { Plane, ArrowRight, ShieldCheck, BarChart3, Receipt } from "lucide-react";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";

const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["700", "800"] });
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });

const notchMask =
  "radial-gradient(circle 10px at 0 calc(100% - 88px), #0000 98%, #000) left/51% 100% no-repeat, radial-gradient(circle 10px at 100% calc(100% - 88px), #0000 98%, #000) right/51% 100% no-repeat";

const features = [
  {
    title: "Snap & Store",
    text: "Take photos of bills on the go. We compress and store them securely.",
    Icon: Receipt,
  },
  {
    title: "Smart Dashboard",
    text: "See exactly what is pending, submitted, and claimed at a glance.",
    Icon: BarChart3,
  },
  {
    title: "Claim Ready",
    text: "Export your trip data as a ZIP file with CSV and images ready for claims.",
    Icon: ShieldCheck,
  },
];

export default function LandingPage() {
  return (
    <div className={`${body.className} h-[100dvh] w-full fixed inset-0 overflow-hidden text-white bg-[radial-gradient(circle_at_85%_8%,rgba(255,214,102,.45)_0,rgba(255,214,102,0)_38%),radial-gradient(circle_at_50%_112%,#FFB36B_0,rgba(255,179,107,0)_52%),linear-gradient(172deg,#5E6BFF_0%,#8A63F5_40%,#E26FC0_76%,#FF9A7A_100%)]`}>
      
      {/* Flight path */}
      <svg className="pointer-events-none absolute left-1/2 top-0 h-[30vh] w-full max-w-[460px] -translate-x-1/2 opacity-60" viewBox="0 0 460 260" fill="none" aria-hidden="true">
        <path d="M-10 230C90 60 280 20 470 110" stroke="#fff" strokeWidth="1.2" strokeDasharray="3 8" strokeLinecap="round" />
        <g transform="translate(372 66) rotate(28)">
          <path d="M0-12 3.5-3.5 14 2v3.5L3.5 2.5 2.5 9.5 7 12v2.5L0 13-7 14.5v-2.5L-2.5 9.5-3.5 2.5-14 5.5V2L-3.5-3.5z" fill="#fff" />
        </g>
      </svg>

      <div className="relative mx-auto flex h-full max-w-[400px] flex-col justify-between px-5 py-6">
        
        {/* Header - Removed redundant logo, just showing text for space */}
        <header className={`${display.className} flex items-center gap-2 text-[15px] font-bold shrink-0`}>
          <span className="grid h-[28px] w-[28px] place-items-center rounded-full bg-white">
            <Plane className="h-[14px] w-[14px] text-indigo-600" fill="currentColor" />
          </span>
          Travel Expense
        </header>

        {/* Hero Section */}
        <section className="flex flex-col gap-2 mt-4 shrink-0">
          <span className="inline-flex self-start items-center gap-1.5 rounded-full border border-dashed border-white/70 bg-white/20 px-2.5 py-1 text-[10px] font-medium tracking-wide">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF7A4D]" />
            New: Global Export Feature Added
          </span>

          <h1 className={`${display.className} text-[26px] font-extrabold leading-[1.05] tracking-[-0.03em]`}>
            Track expenses, manage bills, and claim effortlessly.
          </h1>

          <p className="text-[12.5px] leading-[1.4] text-white/90">
            The only expense manager designed for frequent business travelers. Snap receipts, organize by trip, and export claims in one click.
          </p>
        </section>

        {/* Boarding Pass Card */}
        <section
          className="flex flex-col flex-1 min-h-0 mt-4 mb-2 rounded-[20px] bg-[#FFFBF4] text-[#17163F] shadow-[0_12px_30px_-10px_rgba(90,40,150,0.6)]"
          style={{ WebkitMask: notchMask, mask: notchMask }}
        >
          <div className="flex flex-col justify-center flex-1 px-3.5">
            {features.map(({ title, text, Icon }, idx) => (
              <div key={title} className={`flex items-start gap-2.5 py-2 ${idx !== 0 ? "border-t border-[#D9D2E6]" : ""}`}>
                <span className="grid h-7 w-7 shrink-0 -rotate-[8deg] place-items-center rounded-full border-[1.5px] border-dashed border-indigo-600 text-indigo-600 mt-0.5">
                  <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
                </span>
                <div className="min-w-0">
                  <h3 className={`${display.className} text-[13px] font-bold leading-tight`}>{title}</h3>
                  <p className="text-[11px] leading-[1.3] text-[#5E5C7E] mt-0.5">{text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Button Stub */}
          <div className="flex h-[88px] shrink-0 items-center gap-2 border-t-2 border-dashed border-[#D9D2E6] px-3.5 pb-2">
            <Link
              href="/signup"
              className="group flex h-11 flex-[1.5] items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-indigo-600 to-[#7B3FD6] text-[13px] font-bold text-white shadow-md transition-all active:scale-95"
            >
              Get Started
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/login"
              className="flex h-11 flex-1 items-center justify-center rounded-xl border-2 border-[#D9D2E6] text-[13px] font-bold transition-all active:scale-95 bg-white/50"
            >
              Log In
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}