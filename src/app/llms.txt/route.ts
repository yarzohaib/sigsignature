export const dynamic = "force-static";

export async function GET() {
  const content = `# SigSignature

> Free, deliverability-optimized HTML email signature generator for professionals and teams.

## Overview
SigSignature (developed by The Nevon) is a modern web application that generates production-grade, 100% table-based inline HTML email signatures. It solves formatting breakdown, image attachment issues, and email clipping across major email providers.

## Key Technical Specifications
- Output Payload: Under 10KB to ensure signatures are never clipped by Gmail (102KB clipping threshold).
- Layout Engine: Nested table architecture with inline CSS styling compatible with Microsoft Word rendering engine (used by desktop Outlook) and WebKit (used by Apple Mail).
- Client Compatibility: 40+ email clients including Gmail, Outlook (Windows, Mac, Web), Apple Mail (macOS & iOS), Thunderbird, Yahoo Mail, and Samsung Email.
- Asset Delivery: Retina-ready 2x/3x icons and portraits delivered via global CDN with immutable cache headers.
- Privacy & Deliverability: Zero hidden tracking pixels, zero spam-trigger markup, and clean semantic structures.

## Available Tiers & Pricing
- Free Forever Plan ($0): Includes up to 3 active signatures, access to standard templates (Minimal, Bold, Clean), 1-click HTML copy, and high-res PNG export.
- Premium Plan ($10/project): Unlimited signatures, centralized team member management, priority brand palettes, and automated sync.

## Core Navigation Links
- Home: https://www.sigsignature.com
- Design Studio: https://www.sigsignature.com/design-studio
- Templates Gallery: https://www.sigsignature.com/templates
- Pricing: https://www.sigsignature.com#pricing
- About The Nevon: https://www.sigsignature.com/about
- Support & Contact: https://www.sigsignature.com/contact
- Privacy Policy: https://www.sigsignature.com/privacy
- Terms of Service: https://www.sigsignature.com/terms

## Contact & Developer
- Organization: The Nevon (https://www.thenevon.com)
- Support Email: teams@thenevon.com
`;

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
