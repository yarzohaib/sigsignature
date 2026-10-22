export const dynamic = "force-static";

export async function GET() {
  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || "pub-2946217028626519";
  const content = `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`;

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
