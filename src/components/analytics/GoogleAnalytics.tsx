import Script from "next/script";

interface GoogleTrackingProps {
  gtmId?: string;
  gaId?: string;
}

export function GoogleTracking({
  gtmId = process.env.NEXT_PUBLIC_GTM_ID,
  gaId = process.env.NEXT_PUBLIC_GA_ID || "G-MZM2JLRVWY",
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
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied',
              'wait_for_update': 500
            });
          `,
        }}
      />

      {/* 2. Google tag (gtag.js) for GA4: G-MZM2JLRVWY */}
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

      {/* 4. Google AdSense Code Snippet */}
      <Script
        id="google-adsense"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2946217028626519"
        crossOrigin="anonymous"
        strategy="afterInteractive"
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
