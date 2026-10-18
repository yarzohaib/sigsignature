import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Email Signature | Sig Signature",
  description: "View and install your team email signature.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  referrer: "no-referrer",
};

export default function PublicInviteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <head>
        <meta name="referrer" content="no-referrer" />
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <div className="min-h-screen bg-[#F8FAFC] text-[#0B1A3D] selection:bg-[#245FD4]/10 selection:text-[#245FD4]">
        {children}
      </div>
    </>
  );
}
