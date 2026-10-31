export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Sig Signature",
    "alternateName": "Sig Signature by The Nevon",
    "url": "https://www.sigsignature.com",
    "logo": "https://www.sigsignature.com/logo.svg",
    "foundingDate": "2026",
    "knowsAbout": [
      "Email Deliverability",
      "HTML Email Signatures",
      "Corporate Brand Consistency",
      "Cross-Client Email Rendering"
    ],
    "sameAs": [
      "https://www.linkedin.com/showcase/sig-signature",
      "https://x.com/sigsignature",
      "https://www.producthunt.com/products/sigsignature",
      "https://www.crunchbase.com/organization/sigsignature"
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

export function WebSiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Sig Signature",
    "alternateName": [
      "Sig Signature",
      "Sig Signature by The Nevon",
      "Sig Signature Email Signature Generator"
    ],
    "url": "https://www.sigsignature.com",
    "description": "Free professional HTML email signature generator engineered for modern professionals and teams.",
    "publisher": {
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

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
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
    "name": "Sig Signature",
    "url": "https://www.sigsignature.com",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All (Web Browser)",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": "Sig Signature is a lightweight, deliverability-focused HTML email signature generator engineered for modern professionals and teams.",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "0",
      "highPrice": "10",
      "offerCount": "2"
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

export function AboutPageJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "url": "https://www.sigsignature.com/about",
    "name": "About Sig Signature",
    "description": "Sig Signature by The Nevon is a deliverability-focused HTML email signature generator built for modern professionals and enterprise teams.",
    "mainEntity": {
      "@type": "Organization",
      "name": "Sig Signature",
      "url": "https://www.sigsignature.com",
      "parentOrganization": {
        "@type": "Organization",
        "name": "The Nevon",
        "url": "https://www.thenevon.com"
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function TeamPageJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "url": "https://www.sigsignature.com/team",
    "name": "Meet the Sig Signature Team",
    "description": "The builders, designers, and problem solvers behind Sig Signature and The Nevon.",
    "mainEntity": [
      {
        "@type": "Person",
        "name": "Sardar M. Nadir",
        "jobTitle": "CEO and Founder",
        "worksFor": {
          "@type": "Organization",
          "name": "Sig Signature"
        },
        "sameAs": "https://www.linkedin.com/in/nadir1214/"
      },
      {
        "@type": "Person",
        "name": "Muhammad Zohaib",
        "jobTitle": "Lead Full-Stack Developer",
        "worksFor": {
          "@type": "Organization",
          "name": "Sig Signature"
        },
        "sameAs": "https://www.linkedin.com/in/zohaib-yar/"
      },
      {
        "@type": "Person",
        "name": "Abdul Moiz Shahzad",
        "jobTitle": "Head of SEO, AEO & GEO",
        "worksFor": {
          "@type": "Organization",
          "name": "Sig Signature"
        },
        "sameAs": "https://www.linkedin.com/in/abdul-moiz-shahzad-92b240441/"
      },
      {
        "@type": "Person",
        "name": "Ali Aun",
        "jobTitle": "QA & Social Operations",
        "worksFor": {
          "@type": "Organization",
          "name": "Sig Signature"
        },
        "sameAs": "https://www.linkedin.com/in/ali-aun/"
      },
      {
        "@type": "Person",
        "name": "Mishal",
        "jobTitle": "UI/UX Designer",
        "worksFor": {
          "@type": "Organization",
          "name": "Sig Signature"
        },
        "sameAs": "https://www.linkedin.com/in/mishal-rajpoot-79323741b"
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ContactPageJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "url": "https://www.sigsignature.com/contact",
    "name": "Contact Sig Signature Support",
    "description": "Get in touch with the Sig Signature engineering and customer support team.",
    "mainEntity": {
      "@type": "Organization",
      "name": "Sig Signature",
      "url": "https://www.sigsignature.com",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Support",
        "email": "team@thenevon.com",
        "availableLanguage": "English"
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function UpdatesPageJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "url": "https://www.sigsignature.com/updates",
    "name": "Sig Signature Changelog & Product Updates",
    "description": "Latest feature releases, templates, deliverability upgrades, and bug fixes for Sig Signature."
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function TemplatesPageJsonLd({
  templates,
}: {
  templates: Array<{ id: string; name: string; description: string; category: string }>;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "url": "https://www.sigsignature.com/templates",
    "name": "Email Signature Templates Gallery",
    "description": "Explore responsive, deliverability-optimized email signature templates for Gmail, Outlook, Apple Mail.",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": templates.map((tpl, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": tpl.name,
        "description": tpl.description,
        "url": `https://www.sigsignature.com/templates?template=${encodeURIComponent(tpl.id)}`
      }))
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function PricingPageJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Sig Signature Email Signature Generator",
    "description": "Create up to 3 free email signatures with deliverability-first HTML. Upgrade to Pro for unlimited signatures and team management.",
    "brand": {
      "@type": "Brand",
      "name": "Sig Signature"
    },
    "offers": [
      {
        "@type": "Offer",
        "name": "Free Plan",
        "price": "0",
        "priceCurrency": "USD",
        "description": "Up to 3 active signatures, standard templates, live preview, instant HTML & PNG export"
      },
      {
        "@type": "Offer",
        "name": "Pro Plan",
        "price": "10",
        "priceCurrency": "USD",
        "billingDuration": "P1M",
        "description": "Unlimited signatures, team signature management, brand locks, priority deliverability support"
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
