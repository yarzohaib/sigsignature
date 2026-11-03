import Script from "next/script";

interface GoogleTrackingProps {
  gtmId?: string;
  gaId?: string;
  measurementId?: string;
}

export function GoogleTracking({
  gtmId = process.env.NEXT_PUBLIC_GTM_ID,
  gaId = process.env.NEXT_PUBLIC_GA_ID || "G-MZM2JLRVWY",
  measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-5515MKG8NL",
}: GoogleTrackingProps) {
  // If neither GTM nor GA ID is configured in the environment, render nothing
  if (!gtmId && !gaId) {
    return null;
  }

  return (
    <>
      {/* 1. Google Consent Mode v2: Must initialize before any tracking tags fire */}
      <Script
        id="google-consent-mode-v2"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            try {
              var consent = localStorage.getItem('sig_cookie_consent_v1');
              if (consent === 'all') {
                gtag('consent', 'default', {
                  'ad_storage': 'granted',
                  'ad_user_data': 'granted',
                  'ad_personalization': 'granted',
                  'analytics_storage': 'granted'
                });
              } else {
                gtag('consent', 'default', {
                  'ad_storage': 'denied',
                  'ad_user_data': 'denied',
                  'ad_personalization': 'denied',
                  'analytics_storage': 'denied',
                  'region': ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO','GB','CH'],
                  'wait_for_update': 500
                });
              }
            } catch (e) {
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied',
                'wait_for_update': 500
              });
            }
          `,
        }}
      />

      {/* 2. Google tag (gtag.js) for GA4: Primary Tag (G-MZM2JLRVWY) & Stream Measurement (G-5515MKG8NL) */}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script
            id="google-analytics-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
                ${measurementId && measurementId !== gaId ? `gtag('config', '${measurementId}');` : ""}
              `,
            }}
          />
        </>
      )}

      {/* 3. Google Tag Manager Container */}
      {gtmId && (
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `,
          }}
        />
      )}

      {/* 4. Google AdSense Code Snippet:
          Use native <script async> rather than Next.js <Script> component because
          next/script automatically injects data-nscript="afterInteractive", which triggers
          the AdSense warning: "AdSense head tag doesn't support the data-nscript attribute."
          React 19 hoists standard <script async> directly into <head> without injecting data-nscript. */}
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2946217028626519"
        crossOrigin="anonymous"
      />
    </>
  );
}

/**
 * Fallback noscript iframe for GTM when JavaScript is disabled
 */
export function GtmNoScript({
  gtmId = process.env.NEXT_PUBLIC_GTM_ID,
}: {
  gtmId?: string;
}) {
  if (!gtmId) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
