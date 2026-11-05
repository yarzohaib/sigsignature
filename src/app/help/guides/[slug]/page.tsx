import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { DETAILED_GUIDES, LEGACY_GUIDE_SLUG_REDIRECTS } from "@/lib/guidesData";
import GuideArticle from "@/components/help/GuideArticle";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return Object.keys(DETAILED_GUIDES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;

  // If slug is a legacy alias, canonical should point to the canonical slug
  const canonicalSlug = LEGACY_GUIDE_SLUG_REDIRECTS[slug] || slug;
  const guide = DETAILED_GUIDES[canonicalSlug];

  if (!guide) {
    return {
      title: "Guide Not Found | Sig Signature",
      description: "The requested email signature guide could not be found.",
    };
  }

  return {
    title: `${guide.title} | Sig Signature Help`,
    description: guide.subtitle,
    alternates: {
      canonical: `https://www.sigsignature.com/help/guides/${canonicalSlug}`,
    },
    openGraph: {
      title: `${guide.title} | Sig Signature Help`,
      description: guide.subtitle,
      url: `https://www.sigsignature.com/help/guides/${canonicalSlug}`,
      type: "article",
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;

  // 301 Permanent redirect for legacy duplicate slugs
  if (LEGACY_GUIDE_SLUG_REDIRECTS[slug]) {
    redirect(`/help/guides/${LEGACY_GUIDE_SLUG_REDIRECTS[slug]}`);
  }

  const guide = DETAILED_GUIDES[slug];

  if (!guide) {
    notFound();
  }

  return (
    <div className="flex-1 w-full bg-[#F8FAFC]">
      <GuideArticle guide={guide} />
    </div>
  );
}
