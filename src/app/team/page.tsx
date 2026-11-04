import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { TeamPageJsonLd, BreadcrumbJsonLd } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Meet Our Team | Sig Signature",
  description:
    "The builders, designers, and problem solvers behind Sig Signature and The Nevon.",
  alternates: {
    canonical: "https://www.sigsignature.com/team",
  },
  openGraph: {
    title: "Meet Our Team | Sig Signature",
    description:
      "Meet the engineers, designers, and search strategists building Sig Signature at The Nevon.",
    url: "https://www.sigsignature.com/team",
    siteName: "Sig Signature",
    images: [
      {
        url: "https://www.sigsignature.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sig Signature Team",
      },
    ],
    locale: "en_US",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meet Our Team | Sig Signature",
    description:
      "Meet the engineers, designers, and search strategists building Sig Signature at The Nevon.",
    images: ["https://www.sigsignature.com/og-image.png"],
  },
};

interface TeamMember {
  initials: string;
  imageUrl: string;
  name: string;
  role: string;
  bio: string;
  linkedinUrl: string;
}

const leadershipMember: TeamMember = {
  initials: "SN",
  imageUrl: "/nadir.png",
  name: "Sardar Muhammad Nadir",
  role: "CEO & FOUNDER",
  bio: "As the Founder of The Nevon, he leads a vision to build smart, user-focused SaaS products that simplify everyday digital experiences. He shapes the product vision, drives innovation, and leads the team in creating practical tools designed around real user needs. Sig Signature is one of the products in this growing ecosystem, with more purposeful solutions on the way.",
  linkedinUrl: "https://www.linkedin.com/in/nadir1214/",
};

const teamMembers: TeamMember[] = [
  {
    initials: "M",
    imageUrl: "/mishal.png",
    name: "Mishal",
    role: "UI / UX & Product Designer",
    bio: "Designs every screen of Sig Signature, turning complex signature building into a clear, intuitive, and seamless experience for every user.",
    linkedinUrl: "https://www.linkedin.com/in/mishal-rajpoot-79323741b",
  },
  {
    initials: "Z",
    imageUrl: "/zohaib.jpeg",
    name: "Zohaib",
    role: "Full Stack Developer",
    bio: "Builds the interface and infrastructure, ensuring every signature complies into clean HTML that renders consistently across email clients and platforms.",
    linkedinUrl: "https://www.linkedin.com/in/zohaib-yar/",
  },
  {
    initials: "AA",
    imageUrl: "/ali.png",
    name: "Ali Aun",
    role: "QA & Tester",
    bio: "Tests every release across email clients, browsers, and devices, making sure each signature looks polished and works correctly wherever it opens.",
    linkedinUrl: "https://www.linkedin.com/in/ali-aun/",
  },
  {
    initials: "M",
    imageUrl: "/moiz.png",
    name: "M. Moiz",
    role: "SEO Specialist",
    bio: "Drives organic growth through SEO and search-focused content, helping Sig Signature reach the right audience.",
    linkedinUrl: "https://www.linkedin.com/in/abdul-moiz-shahzad-92b240441/",
  },
];

const corePrinciples = [
  {
    number: "01",
    title: "Deliverability First",
    description:
      "Every generated signature is audited to remain under 10KB to preserve deliverability, prevent email clipping, and protect sender reputation.",
  },
  {
    number: "02",
    title: "Cross-Client Consistency",
    description:
      "Layout fidelity verified across Microsoft Outlook, Gmail, Apple Mail, and mobile email applications.",
  },
  {
    number: "03",
    title: "Clean Software",
    description:
      "Zero bloat, zero tracking scripts embedded in user signatures, and zero unnecessary dependencies.",
  },
  {
    number: "04",
    title: "Powered by The Nevon",
    description:
      "Part of The Nevon's portfolio of purpose-built productivity and developer utilities.",
  },
];

function TeamAvatar({
  imageUrl,
  name,
  initials,
  sizeClass,
  textSizeClass = "text-sm",
  imageClassName = "object-cover",
}: {
  imageUrl?: string;
  name: string;
  initials: string;
  sizeClass: string;
  textSizeClass?: string;
  imageClassName?: string;
}) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full border border-white/25 bg-[#DDE8F8] ${sizeClass}`}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={`${name} profile photo`}
          width={128}
          height={128}
          className={`h-full w-full ${imageClassName}`}
        />
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center font-heading font-semibold text-white ${textSizeClass}`}
        >
          {initials}
        </div>
      )}
    </div>
  );
}

function LinkedInIcon({ url, name }: { url: string; name: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${name} on LinkedIn`}
      className="inline-flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center text-white/80 transition hover:text-white hover:scale-105"
    >
      <svg className="h-4.5 w-4.5 sm:h-5 sm:w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 1 0-.01-3.05 1.53 1.53 0 0 0 .01 3.05m1.39 9.74v-8.37H5.07v8.37h2.78z" />
      </svg>
    </a>
  );
}

export default function TeamPage() {
  return (
    <div className="relative isolate flex min-h-screen flex-col bg-surface font-body text-slate-900 selection:bg-brand selection:text-white">
      {/* Background ambient lighting matching Figma design system */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[900px] overflow-hidden"
      >
        <div className="absolute -right-[200px] -top-[240px] h-[480px] w-[560px] rounded-full bg-[#C4DFFB] opacity-50 blur-[80px] lg:-right-[372px] lg:-top-[475px] lg:h-[946px] lg:w-[1103px] lg:blur-[162px]" />
        <div className="absolute -right-[100px] -top-[170px] h-[300px] w-[320px] rounded-full bg-[#F0F8F5] opacity-50 blur-[80px] lg:-right-[216px] lg:-top-[350px] lg:h-[598px] lg:w-[616px] lg:blur-[162px]" />
      </div>

      <Navbar />

      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://www.sigsignature.com" },
          { name: "Our Team", url: "https://www.sigsignature.com/team" },
        ]}
      />
      <TeamPageJsonLd />

      <main className="flex-1">
        {/* HERO & TEAM SECTION */}
        {/* Keep the hero clear of the floating mobile navbar without excessive top whitespace. */}
        <section className="pt-16 pb-10 sm:pt-10 sm:pb-12 lg:pt-12 lg:pb-16">
          <div className="mx-auto max-w-[1288px] px-4 sm:px-6 lg:px-8">
            {/* Header: Title & Subtitle */}
            <div className="max-w-3xl">
              <h1 className="font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-[42px] lg:leading-[1.17]">
                The Team Behind <span className="text-[#245FD4]">Sig Signature.</span>
              </h1>
              <p className="mt-3 font-body text-sm text-[#5A5A5A] sm:text-base leading-relaxed">
                A focused team of designers, engineers and strategists building the simplest way to create professional email signatures.
              </p>
            </div>

            {/* Leadership Card (Sardar Muhammad Nadir) */}
            <div
              className="mt-8 sm:mt-10 rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-sm border border-white/10"
              style={{
                background:
                  "linear-gradient(93.58deg, #1C52C9 0%, #0C43B1 36.06%, #02215F 100%)",
              }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 justify-between">
                {/* Left: Avatar + Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-7 flex-1">
                  {/* Photo Avatar */}
                  <TeamAvatar
                    imageUrl={leadershipMember.imageUrl}
                    name={leadershipMember.name}
                    initials={leadershipMember.initials}
                    sizeClass="h-20 w-20 sm:h-24 sm:w-24 border-2 border-white/30"
                    textSizeClass="text-xl sm:text-2xl"
                    imageClassName="scale-115 object-cover object-center"
                  />

                  {/* Details */}
                  <div className="flex-1">
                    <span className="inline-flex items-center rounded-full border border-white/25 bg-white/15 px-3 py-1 font-heading text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-white">
                      {leadershipMember.role}
                    </span>
                    <h2 className="mt-2.5 font-heading text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-[32px] leading-tight">
                      {leadershipMember.name}
                    </h2>
                    <p className="mt-3 font-body text-xs sm:text-sm lg:text-[14px] leading-relaxed text-white/85 max-w-3xl">
                      {leadershipMember.bio}
                    </p>
                  </div>
                </div>

                {/* LinkedIn button */}
                <div className="self-end sm:self-center shrink-0">
                  <LinkedInIcon url={leadershipMember.linkedinUrl} name={leadershipMember.name} />
                </div>
              </div>
            </div>

            {/* Team Members Card (Mishal, Zohaib, Ali Aun, M. Moiz) */}
            <div
              className="mt-6 sm:mt-8 rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-sm border border-white/10"
              style={{
                background:
                  "linear-gradient(121.54deg, #1C52C9 2.58%, #0E2863 47.92%, #001749 97.84%)",
              }}
            >
              <div className="divide-y divide-white/10">
                {teamMembers.map((member) => (
                  <div
                    key={member.name}
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-8 py-6 sm:py-7 first:pt-0 last:pb-0"
                  >
                    {/* Member Identity: Photo Avatar + Name & Role */}
                    <div className="flex items-center justify-between lg:justify-start gap-4 lg:w-[280px] shrink-0">
                      <div className="flex items-center gap-3.5 sm:gap-4">
                        <TeamAvatar
                          imageUrl={member.imageUrl}
                          name={member.name}
                          initials={member.initials}
                          sizeClass="h-11 w-11 sm:h-12 sm:w-12 border border-white/25"
                          textSizeClass="text-sm"
                        />
                        <div>
                          <h3 className="font-heading text-lg sm:text-xl font-semibold text-white tracking-tight">
                            {member.name}
                          </h3>
                          <p className="font-body text-xs text-white/70 tracking-wide mt-0.5">
                            {member.role}
                          </p>
                        </div>
                      </div>

                      {/* Mobile LinkedIn Icon (aligned to top right on mobile) */}
                      <div className="lg:hidden">
                        <LinkedInIcon url={member.linkedinUrl} name={member.name} />
                      </div>
                    </div>

                    {/* Bio Description */}
                    <p className="font-body text-xs sm:text-sm text-white/80 leading-relaxed max-w-2xl flex-1">
                      {member.bio}
                    </p>

                    {/* Desktop LinkedIn Icon (aligned far right) */}
                    <div className="hidden lg:flex shrink-0 justify-end w-10">
                      <LinkedInIcon url={member.linkedinUrl} name={member.name} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WHAT WE STAND FOR SECTION */}
            <div className="mt-14 sm:mt-18 lg:mt-20">
              <h2 className="font-heading text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl lg:text-[34px]">
                What we <span className="text-[#245FD4]">stand for</span>
              </h2>

              <div className="mt-8 sm:mt-10 divide-y divide-slate-200 border-t border-slate-200">
                {corePrinciples.map((item) => (
                  <div
                    key={item.number}
                    className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 md:gap-8 items-center py-6 sm:py-7"
                  >
                    {/* Number */}
                    <div className="md:col-span-2 font-heading text-2xl sm:text-3xl font-normal text-[#245FD4]">
                      {item.number}
                    </div>

                    {/* Title */}
                    <div className="md:col-span-4 font-heading text-base sm:text-lg font-medium text-slate-900">
                      {item.title}
                    </div>

                    {/* Description */}
                    <div className="md:col-span-6 font-body text-xs sm:text-[13px] text-slate-500 leading-relaxed">
                      {item.description}
                    </div>
                  </div>
                ))}
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
