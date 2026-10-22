export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SigSignature",
    "alternateName": "Sig Signature by The Nevon",
    "url": "https://www.sigsignature.com",
    "logo": "https://www.sigsignature.com/logo.svg",
    "sameAs": [
      "https://www.linkedin.com/showcase/sig-signature",
      "https://x.com/sigsignature"
    ],
    "parentOrganization": {
      "@type": "Organization",
      "name": "The Nevon",
      "url": "https://www.thenevon.com"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebApplicationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "SigSignature",
    "url": "https://www.sigsignature.com",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All (Web Browser)",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": "SigSignature is a lightweight, deliverability-focused HTML email signature generator engineered for modern professionals and teams.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "category": "FreeTier"
    },
    "featureList": [
      "Table-based HTML with 100% email client deliverability",
      "Pre-tested across 40+ email clients including Gmail, Outlook, Apple Mail",
      "Payload optimized under 10KB to prevent clipping",
      "Retina-ready CDN hosted icons and imagery",
      "Instant 1-click HTML copy and PNG export"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function FaqJsonLd({ faqs }: { faqs: FaqItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
