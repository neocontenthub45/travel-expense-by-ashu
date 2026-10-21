import Link from "next/link";
import { Plane, ArrowRight, ShieldCheck, BarChart3, Receipt } from "lucide-react";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import PageTransition from "@/components/PageTransition";

const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["700", "800"] });
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });

// Ticket notches (half-circle cut-outs) just above the buttons "stub"
const notchMask =
  "radial-gradient(circle 11px at 0 calc(100% - 112px), #0000 98%, #000) left/51% 100% no-repeat, radial-gradient(circle 11px at 100% calc(100% - 112px), #0000 98%, #000) right/51% 100% no-repeat";

const features = [
  {
    title: "Snap & Store",
    text: "Take photos of bills on the go. We automatically compress and store them securely in the cloud.",
    Icon: Receipt,
  },
  {
    title: "Smart Dashboard",
    text: "See exactly what is pending, submitted, and claimed at a glance. Track your financial overview easily.",
    Icon: BarChart3,
  },
  {
    title: "Claim Ready",
    text: "Export your trip data as a ZIP file with CSV and images ready for reimbursement submission.",
    Icon: ShieldCheck,
  },
];

export default function LandingPage() {
  return (
    <PageTransition>
      {/* Main Container - Changed from fixed z-50 to normal flow with min-height */}
      <div
        className={`${body.className} min-h-[calc(100vh-60px)] w-full relative overflow-hidden text-white rounded-2xl shadow-xl mt-2
          bg-[radial-gradient(circle_at_85%_8%,rgba(255,214,102,.45)_0,rgba(255,214,102,0)_38%),radial-gradient(circle_at_50%_112%,#FFB36B_0,rgba(255,179,107,0)_52%),linear-gradient(172deg,#5E6BFF_0%,#8A63F5_40%,#E26FC0_76%,#FF9A7A_100%)]`}
      >
        {/* Dotted flight path */}
        <svg
          className="pointer-events-none absolute left-1/2 top-0 h-[34vh] w-full max-w-[460px] -translate-x-1/2 opacity-70"
          viewBox="0 0 460 260"
          fill="none"
          aria-hidden="true"
        >
          <path d="M-10 230C90 60 280 20 470 110" stroke="#fff" strokeWidth="1.6" strokeDasharray="3 8" strokeLinecap="round" />
          <g transform="translate(372 66) rotate(28)">
            <path d="M0-14 4-4 16 2v4L4 3 3 11 8 14v3L0 15-8 17v-3L-3 11-4 3-16 6V2L-4-4z" fill="#fff" />
          </g>
        </svg>

        <div className="relative mx-auto flex min-h-[calc(100vh-60px)] w-full max-w-[460px] flex-col justify-between gap-[clamp(8px,1.6vh,16px)] px-[18px] pb-[calc(18px+env(safe-area-inset-bottom))] pt-[calc(14px+env(safe-area-inset-top))]">
          {/* Logo */}
          <header className={`${display.className} flex items-center gap-2.5 text-[17px] font-bold`}>
            <span className="grid h-[34px] w-[34px] place-items-center rounded-full bg-white">
              <Plane className="h-[18px] w-[18px] text-indigo-600" fill="currentColor" />
            </span>
            Travel Expense
          </header>

          {/* Hero */}
          <section className="flex flex-col gap-[clamp(6px,1.3vh,12px)] mt-4">
            {/* Badge */}
            <span className="inline-flex self-start items-center gap-2 rounded-full border border-dashed border-white/75 bg-white/20 px-3 py-[5px] text-xs font-medium">
              <span className="h-[7px] w-[7px] animate-pulse rounded-full bg-[#FF7A4D] motion-reduce:animate-none" />
              New: Global Export Feature Added
            </span>

            {/* Heading */}
            <h1
              className={`${display.className} text-[clamp(29px,8.4vw,38px)] font-extrabold leading-[1.02] tracking-[-0.035em]`}
            >
              Track expenses, manage bills, and claim effortlessly.
            </h1>

            {/* Subheading */}
            <p className="text-[clamp(13px,1.9vh,15px)] leading-[1.42] text-white/95">
              The only expense manager designed for frequent business travelers. Snap receipts, organize by trip, and
              export claims in one click.
            </p>
          </section>

          {/* Boarding pass: features + button stub */}
          <section
            aria-label="Features"
            className="flex flex-col rounded-[22px] bg-[#FFFBF4] text-[#17163F] shadow-[0_18px_40px_-12px_rgba(90,40,150,0.5)] dark:bg-[#1A1942] dark:text-[#F3F1FF] mt-6"
            style={{ WebkitMask: notchMask, mask: notchMask }}
          >
            <div className="px-4 pt-1">
              {features.map(({ title, text, Icon }) => (
                <div
                  key={title}
                  className="flex items-start gap-3 py-[clamp(8px,1.5vh,12px)] [&+&]:border-t [&+&]:border-[#D9D2E6] dark:[&+&]:border-[#3D3B72]"
                >
                  <span className="grid h-9 w-9 flex-none -rotate-[8deg] place-items-center rounded-full border-[1.5px] border-dashed border-indigo-600 text-indigo-600 dark:border-[#9A94FF] dark:text-[#9A94FF]">
                    <Icon className="h-[17px] w-[17px]" strokeWidth={2} />
                  </span>
                  <div>
                    <h3 className={`${display.className} mb-0.5 mt-px text-[15px] font-bold tracking-[-0.01em]`}>{title}</h3>
                    <p className="text-[12.5px] leading-[1.38] text-[#5E5C7E] dark:text-[#B1AFD3]">{text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stub with buttons */}
            <div className="mt-auto flex h-28 items-center gap-2.5 border-t-2 border-dashed border-[#D9D2E6] px-4 dark:border-[#3D3B72]">
              <Link
                href="/signup"
                className="group flex h-[52px] flex-[1.7] items-center justify-center gap-[7px] whitespace-nowrap rounded-[14px] bg-gradient-to-br from-indigo-600 to-[#7B3FD6] text-[15.5px] font-bold text-white shadow-[0_10px_22px_-8px_rgba(79,70,229,0.7)] transition-all hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FF7A4D]"
              >
                Get Started for Free
                <ArrowRight className="h-[17px] w-[17px] transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="flex h-[52px] flex-1 items-center justify-center whitespace-nowrap rounded-[14px] border-[1.5px] border-[#D9D2E6] text-[15.5px] font-bold transition-all hover:-translate-y-0.5 hover:bg-black/[0.03] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FF7A4D] dark:border-[#3D3B72] dark:hover:bg-white/5"
              >
                Log In
              </Link>
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}