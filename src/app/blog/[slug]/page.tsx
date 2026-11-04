import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { BlogPostJsonLd, BreadcrumbJsonLd } from "@/components/seo/StructuredData";
import { BLOG_POSTS, BlogPost } from "@/lib/blogData";
import MarkdownRenderer from "@/components/blog/MarkdownRenderer";
import BlogCardVisual from "@/components/blog/BlogCardVisual";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Story Not Found | Sig Signature",
    };
  }

  const postUrl = `https://www.sigsignature.com/blog/${post.slug}`;
  const imageUrl = post.coverImage
    ? `https://www.sigsignature.com${post.coverImage}`
    : "https://www.sigsignature.com/og-image.png";

  return {
    title: `${post.title} | Sig Signature`,
    description: post.excerpt,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: postUrl,
      siteName: "Sig Signature",
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);
  const postUrl = `https://www.sigsignature.com/blog/${post.slug}`;
  const imageUrl = post.coverImage
    ? `https://www.sigsignature.com${post.coverImage}`
    : "https://www.sigsignature.com/og-image.png";

  return (
    <div className="relative isolate flex min-h-screen flex-col bg-[#FCFCFD] font-body text-slate-900 selection:bg-brand selection:text-white">
      {/* Background ambient lighting matching Figma design system */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[900px] overflow-hidden"
      >
        <div className="absolute -right-[200px] -top-[240px] h-[480px] w-[560px] rounded-full bg-[#C4DFFB] opacity-50 blur-[80px] lg:-right-[372px] lg:-top-[475px] lg:h-[946px] lg:w-[1103px] lg:blur-[162px]" />
        <div className="absolute -right-[100px] -top-[170px] h-[300px] w-[320px] rounded-full bg-[#F0F8F5] opacity-50 blur-[80px] lg:-right-[216px] lg:-top-[350px] lg:h-[598px] lg:w-[616px] lg:blur-[162px]" />
      </div>

      <Navbar />

      <BlogPostJsonLd
        title={post.title}
        description={post.excerpt}
        url={postUrl}
        publishedAt={post.publishedAt}
        authorName={post.author.name}
        imageUrl={imageUrl}
      />

      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://www.sigsignature.com" },
          { name: "Blog", url: "https://www.sigsignature.com/blog" },
          { name: post.title, url: postUrl },
        ]}
      />

      <main className="flex-1">
        {/* Article Container */}
        <article className="pt-12 pb-20 sm:pt-16 sm:pb-24">
          <div className="mx-auto max-w-[860px] px-4 sm:px-6 lg:px-8">
            {/* Back link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#245FD4] transition hover:text-[#1746A2]"
              style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
            >
              <span>←</span>
              <span>Back to all stories</span>
            </Link>

            {/* Category badge + Reading time */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#EBF3FE] px-3 py-1 font-body text-xs font-semibold text-[#245FD4]">
                {post.category}
              </span>
              <span className="text-slate-300" aria-hidden="true">&bull;</span>
              <span className="font-body text-xs font-medium text-slate-500">
                {post.readingTime}
              </span>
              <span className="text-slate-300" aria-hidden="true">&bull;</span>
              <span className="font-body text-xs font-medium text-slate-500">
                {post.publishedAt}
              </span>
            </div>

            {/* Article Heading */}
            <h1
              className="mt-4 font-heading text-3xl sm:text-4xl lg:text-[46px] font-bold text-[#101B30] tracking-tight leading-[1.2]"
              style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
            >
              {post.title}
            </h1>

            {/* Author Block */}
            <div className="mt-6 flex items-center gap-3 border-y border-slate-200/80 py-4">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white font-bold text-xs shadow-sm"
                style={{
                  background:
                    "radial-gradient(circle at 35% 35%, #3B82F6 0%, #1E40AF 50%, #0B1C43 100%)",
                }}
              >
                SS
              </div>
              <div>
                <p className="font-heading text-sm font-bold text-slate-900 leading-snug">
                  {post.author.name}
                </p>
                <p className="font-body text-xs text-slate-500 leading-snug">
                  {post.author.role} <span aria-hidden="true">&bull;</span> The Nevon Technical Publications
                </p>
              </div>
            </div>

            {/* Cover Image (if available) */}
            {post.coverImage && (
              <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200/80 shadow-md">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  width={1280}
                  height={720}
                  priority
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {/* Whitepaper PDF Download Bar (if available) */}
            {post.pdfUrl && (
              <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-blue-200 bg-blue-50/70 p-5 shadow-xs">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#245FD4] text-white shadow-xs">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-heading text-sm font-bold text-slate-900">
                      Download Executive Whitepaper (PDF)
                    </h4>
                    <p className="font-body text-xs text-slate-500">
                      Complete whitepaper with benchmarks, Word specifications, and code snippets.
                    </p>
                  </div>
                </div>

                <a
                  href={post.pdfUrl}
                  download="why-outlook-uses-microsoft-word-to-render-html.pdf"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#245FD4] to-[#022977] px-5 py-2.5 font-body text-xs sm:text-sm font-semibold text-white shadow-xs transition hover:opacity-95 shrink-0"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  <span>Download PDF</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                </a>
              </div>
            )}

            {/* Markdown Body */}
            <div className="mt-10">
              <MarkdownRenderer content={post.contentMarkdown} />
            </div>

            {/* Contextual Homepage Link */}
            <div className="mt-12 rounded-2xl border border-slate-200/90 bg-[#F8FAFC] p-5 sm:p-6 text-sm text-slate-700 font-body">
              <p className="leading-relaxed">
                Looking to build a professional, deliverable sign-off for yourself or your team? You can{" "}
                <Link
                  href="https://www.sigsignature.com/"
                  className="font-semibold text-[#245FD4] underline underline-offset-2 hover:text-[#1746A2] transition"
                >
                  create your signature with our free email signature generator
                </Link>
                .
              </p>
            </div>

            {/* In-Article Callout Box */}
            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-[#101B30]">
                  Ready to test your email signature?
                </h3>
                <p className="mt-1 font-body text-xs sm:text-sm text-[#64748B] max-w-md">
                  Sig Signature automatically compiles defensive table structures and MSO conditionals so your signature never deforms in Outlook.
                </p>
              </div>
              <Link
                href="/templates"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-7 py-3 font-body text-xs sm:text-sm font-semibold text-white shadow-xs transition hover:opacity-95 shrink-0"
              >
                <span>Browse Templates</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </article>

        {/* Related Stories */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-slate-200/80 bg-white py-16 sm:py-20">
            <div className="mx-auto max-w-[1288px] px-4 sm:px-6 lg:px-8">
              <h2
                className="font-heading text-2xl sm:text-3xl font-medium text-[#101B30] tracking-[-0.03em]"
                style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                More from The Journal
              </h2>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((related: BlogPost) => (
                  <article key={related.slug} className="group flex flex-col justify-between">
                    <div>
                      <Link href={`/blog/${related.slug}`} className="block overflow-hidden rounded-2xl">
                        <BlogCardVisual
                          type={related.visualType}
                          coverImage={related.coverImage}
                          title={related.title}
                        />
                      </Link>
                      <h3 className="mt-4 font-heading text-lg sm:text-xl font-medium text-[#101B30] leading-snug group-hover:text-[#245FD4] transition">
                        <Link href={`/blog/${related.slug}`}>
                          {related.title}
                        </Link>
                      </h3>
                      <p className="mt-2 font-body text-xs sm:text-sm text-[#687386] leading-relaxed line-clamp-2">
                        {related.excerpt}
                      </p>
                    </div>

                    <div className="mt-4">
                      <Link
                        href={`/blog/${related.slug}`}
                        className="inline-flex items-center gap-1 font-body text-xs sm:text-sm font-semibold text-[#245FD4]"
                      >
                        <span>Read the story</span>
                        <span aria-hidden="true">↗</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Blue CTA Banner */}
        <section
          className="py-16 sm:py-20 lg:py-24 text-white text-center"
          style={{
            background:
              "linear-gradient(100.16deg, #245FD4 1.32%, #00359F 50.19%, #00143C 100%)",
          }}
        >
          <div className="mx-auto max-w-[1288px] px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2
                className="font-heading text-3xl sm:text-4xl lg:text-[48px] font-semibold text-white tracking-tight leading-[1.15]"
                style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
              >
                Your Email Signature Is the Last Thing People See, <br />
                Make It Count.
              </h2>
              <p className="mx-auto mt-4 max-w-xl font-body text-sm sm:text-base text-white/85 leading-relaxed">
                Join professionals who&apos;ve stopped overpaying for email signatures. Create yours free in minutes.
              </p>
              <div className="mt-8 flex justify-center">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 font-body text-sm font-semibold text-[#00359F] shadow-sm transition hover:bg-slate-50 hover:shadow-md active:scale-98"
                >
                  <span>Create Your Free Signature</span>
                </Link>
              </div>
              <p className="mt-4 font-body text-xs text-white/70">
                No credit card. No designer. No developer. Just you.
              </p>
            </div>
          </div>
        </section>
      </main>

      <div className="w-full border-t border-[#D7D7D7]" />

      <Footer />
    </div>
  );
}
