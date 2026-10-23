import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import SectionBadge from "@/components/landing/SectionBadge";

export const metadata: Metadata = {
  title: "Meet the Team | SigSignature",
  description:
    "The builders, designers, and problem solvers behind Sig Signature and The Nevon.",
  alternates: {
    canonical: "https://www.sigsignature.com/team",
  },
};

interface TeamMember {
  initials: string;
  name: string;
  role: string;
  bio: string;
  focusAreas: string[];
  linkedinUrl?: string;
}

const leadershipMember: TeamMember = {
  initials: "SN",
  name: "Sardar M. Nadir",
  role: "CEO AND FOUNDER",
  bio: "Visionary entrepreneur and tech leader driving the strategic direction of The Nevon. Nadir is focused on building high-utility, deliverability-first SaaS products and scaling high-agency engineering teams.",
  focusAreas: [
    "Business Strategy",
    "Product Vision",
    "Executive Leadership",
    "Venture Growth",
  ],
  linkedinUrl: "https://linkedin.com",
};

const teamMembers: TeamMember[] = [
  {
    initials: "MZ",
    name: "Muhammad Zohaib",
    role: "LEAD FULL-STACK DEVELOPER",
    bio: "Full-stack systems engineer who architected and built Sig Signature end-to-end. Zohaib engineered the core dual-viewport studio, reactive editor, and the strict HTML table compilation engine that ensures zero Outlook distortion.",
    focusAreas: [
      "Full-Stack Architecture",
      "HTML Compiler Engine",
      "Next.js & React",
      "Tailwind CSS",
    ],
    linkedinUrl: "https://linkedin.com",
  },
  {
    initials: "AM",
    name: "Abdul Moiz Shahzad",
    role: "HEAD OF SEO, AEO & GEO",
    bio: "Organic growth and search intelligence strategist who engineered Sig Signature's complete SEO, AEO (Answer Engine Optimization), and GEO framework. Abdul Moiz ensures the platform dominates high-intent discovery and AI search engines.",
    focusAreas: [
      "SEO Strategy",
      "AEO & GEO Architecture",
      "Entity Optimization",
      "Organic Growth",
    ],
    linkedinUrl: "https://linkedin.com",
  },
  {
    initials: "AA",
    name: "Ali Aun",
    role: "QA & SOCIAL OPERATIONS",
    bio: "Rigorous quality assurance engineer dedicated to end-to-end testing, edge-case validation, and email client deliverability. Ali tests Sig Signature across legacy Outlook engines and mobile viewports, while also managing social media operations and brand engagement.",
    focusAreas: [
      "Quality Assurance",
      "Cross-Client Testing",
      "Social Media Ops",
      "Deliverability QA",
    ],
    linkedinUrl: "https://linkedin.com",
  },
  {
    initials: "M",
    name: "Mishal",
    role: "UI/UX DESIGNER",
    bio: "Product designer crafting clean, functional, and accessible digital interfaces. Mishal established Sig Signature's frosted glass aesthetic, typography hierarchy, and minimal executive signature templates.",
    focusAreas: [
      "UI/UX Design",
      "Design Systems",
      "Responsive Layouts",
      "Visual Hierarchy",
    ],
    linkedinUrl: "https://linkedin.com",
  },
];

function LinkedInButton({ url, name }: { url?: string; name: string }) {
  return (
    <a
      href={url || "https://linkedin.com"}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${name} on LinkedIn`}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0A66C2] text-white shadow-xs transition hover:opacity-90"
    >
      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 1 0-.01-3.05 1.53 1.53 0 0 0 .01 3.05m1.39 9.74v-8.37H5.07v8.37h2.78z" />
      </svg>
    </a>
  );
}

export default function TeamPage() {
  return (
    <div className="relative isolate flex min-h-screen flex-col bg-surface font-body text-slate-900 selection:bg-brand selection:text-white">
      {/* Background ambient lighting from Figma system */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[900px] overflow-hidden"
      >
        <div className="absolute -right-[200px] -top-[240px] h-[480px] w-[560px] rounded-full bg-[#C4DFFB] opacity-50 blur-[80px] lg:-right-[372px] lg:-top-[475px] lg:h-[946px] lg:w-[1103px] lg:blur-[162px]" />
        <div className="absolute -right-[100px] -top-[170px] h-[300px] w-[320px] rounded-full bg-[#F0F8F5] opacity-50 blur-[80px] lg:-right-[216px] lg:-top-[350px] lg:h-[598px] lg:w-[616px] lg:blur-[162px]" />
      </div>

      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-14 sm:pt-16 sm:pb-16 lg:pt-20 lg:pb-20">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 flex items-center justify-center">
                <SectionBadge label="A PRODUCT BY THE NEVON" />
              </div>

              <h1 className="font-heading text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-[54px] lg:leading-[1.12]">
                Meet the{" "}
                <span className="text-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] bg-clip-text text-transparent">
                  Team
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-2xl font-body text-base leading-relaxed text-slate-600 sm:text-lg lg:text-[19px]">
                The builders, designers, and problem solvers behind Sig Signature and The Nevon.
              </p>
            </div>
          </div>
        </section>

        {/* TEAM CARDS SECTION */}
        <section className="pb-20 sm:pb-24 lg:pb-28">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="mx-auto max-w-5xl space-y-6 sm:space-y-8">
              {/* Leader Card: Sardar M. Nadir */}
              <div className="rounded-3xl border border-[#C1C1C1]/80 bg-white p-7 shadow-xs transition-all duration-200 hover:border-blue-300 hover:shadow-sm sm:p-9 lg:p-10">
                <div className="flex flex-col justify-between gap-6">
                  {/* Top Header: Avatar + Title + LinkedIn */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4 sm:gap-5">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#DCEBFF] font-heading text-lg font-bold text-[#245FD4] sm:h-16 sm:w-16 sm:text-xl">
                        {leadershipMember.initials}
                      </div>
                      <div>
                        <h2 className="font-heading text-xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-[26px]">
                          {leadershipMember.name}
                        </h2>
                        <p className="mt-1 font-heading text-xs font-bold tracking-wider text-[#245FD4] uppercase sm:text-sm">
                          {leadershipMember.role}
                        </p>
                      </div>
                    </div>

                    <LinkedInButton
                      url={leadershipMember.linkedinUrl}
                      name={leadershipMember.name}
                    />
                  </div>

                  {/* Bio */}
                  <p className="font-body text-base leading-relaxed text-slate-600 sm:text-[17px]">
                    {leadershipMember.bio}
                  </p>

                  {/* Focus Areas */}
                  <div className="pt-2">
                    <p className="font-heading text-xs font-semibold tracking-wider text-slate-400 uppercase">
                      Focus Areas
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2.5">
                      {leadershipMember.focusAreas.map((area) => (
                        <span
                          key={area}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 font-body text-xs font-medium text-slate-700 transition hover:border-blue-200"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2-Column Grid: 4 Core Team Members */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
                {teamMembers.map((member) => (
                  <div
                    key={member.name}
                    className="flex flex-col justify-between rounded-3xl border border-[#C1C1C1]/80 bg-white p-7 shadow-xs transition-all duration-200 hover:border-blue-300 hover:shadow-sm sm:p-8"
                  >
                    <div>
                      {/* Avatar + Name + LinkedIn */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3.5 sm:gap-4">
                          <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-[#DCEBFF] font-heading text-base font-bold text-[#245FD4] sm:h-14 sm:w-14 sm:text-lg">
                            {member.initials}
                          </div>
                          <div>
                            <h3 className="font-heading text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                              {member.name}
                            </h3>
                            <p className="mt-0.5 font-heading text-xs font-bold tracking-wider text-[#245FD4] uppercase">
                              {member.role}
                            </p>
                          </div>
                        </div>

                        <LinkedInButton url={member.linkedinUrl} name={member.name} />
                      </div>

                      {/* Bio */}
                      <p className="mt-5 font-body text-sm leading-relaxed text-slate-600 sm:text-[15px]">
                        {member.bio}
                      </p>
                    </div>

                    {/* Focus Areas */}
                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <p className="font-heading text-xs font-semibold tracking-wider text-slate-400 uppercase">
                        Focus Areas
                      </p>
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {member.focusAreas.map((area) => (
                          <span
                            key={area}
                            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-body text-xs font-medium text-slate-700 transition hover:border-blue-200"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Ecosystem Tagline */}
              <div className="mt-12 rounded-2xl border border-slate-200/80 bg-white/70 p-4 text-center backdrop-blur-xs">
                <p className="font-body text-xs sm:text-sm text-slate-500">
                  <strong className="font-semibold text-slate-800">Sig Signature</strong> by The Nevon · Deliverability-First Email Signatures ·{" "}
                  <a
                    href="https://thenevon.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#1243A3] hover:underline"
                  >
                    thenevon.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Full-width horizontal divider line above Footer */}
      <div className="w-full border-t border-[#D7D7D7]" />

      <Footer />
    </div>
  );
}
