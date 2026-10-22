import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { buildIconSvg } from "../src/lib/email-core/iconSvg";
import { ICON_PALETTE } from "../src/lib/email-core/iconPalette";
import { SOCIAL_NETWORKS } from "../src/lib/email-core/iconGlyphs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STYLES = ["filled", "outline", "minimal", "circle"];
const NETWORKS = SOCIAL_NETWORKS;

async function main() {
  const outputDir = path.resolve(__dirname, "../out/icons");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let generatedCount = 0;
  const totalCombinations = ICON_PALETTE.length * STYLES.length * NETWORKS.length;
  console.log(
    `Starting generation of ${totalCombinations} icons (${ICON_PALETTE.length} colors x ${STYLES.length} styles x ${NETWORKS.length} networks)...`
  );

  for (const style of STYLES) {
    for (const color of ICON_PALETTE) {
      for (const network of NETWORKS) {
        const fileName = `${style}-${color}-${network}.png`;
        const filePath = path.join(outputDir, fileName);
        const svg = buildIconSvg(style, color, network);

        const pngBuffer = await sharp(Buffer.from(svg))
          .resize(80, 80)
          .png({ compressionLevel: 9 })
          .toBuffer();

        fs.writeFileSync(filePath, pngBuffer);
        generatedCount++;
      }
    }
  }

  console.log(`\nSuccessfully generated ${generatedCount} icons into ${outputDir}`);
  console.log("\nTo upload to production S3 bucket, run:");
  console.log(
    'aws s3 sync out/icons s3://sigsignature-prod-assets-2026/static/ --cache-control "public, max-age=31536000, immutable" --content-type image/png'
  );
}

main().catch((err) => {
  console.error("Error generating email icons:", err);
  process.exit(1);
});
