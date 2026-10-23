// "use client";

// import { useState, useRef } from "react";
// import { toPng } from "html-to-image";
// import { TemplateSignatureData } from "@/types/template";
// import { StudioSignatureData } from "@/types/studio";
// import { SavedSignature } from "@/types/signature";
// import { copySignatureRich, copyTextToClipboard } from "@/lib/email-core";
// import { getStoredSettings } from "@/app/lib/auth";
// import {
//   renderSavedSignatureHtml,
//   renderSavedSignaturePlainText,
// } from "@/lib/signatures/render";
// import {
//   generateTemplateHtml,
//   generateTemplatePlainText,
// } from "@/lib/templates/renderTemplateHtml";
// import {
//   generateStudioHtml,
//   generateStudioPlainText,
// } from "@/lib/studio/renderStudioHtml";
// import {
//   generateFreeHtml,
//   generateFreePlainText,
// } from "@/lib/studio/free/renderFreeHtml";
// import SignatureCopiedAlert from "@/components/signatures/SignatureCopiedAlert";

// interface SaveSuccessModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   signatureData?: TemplateSignatureData | StudioSignatureData;
//   signature?: SavedSignature;
//   preRenderedHtml?: string;
//   preRenderedPlainText?: string;
//   signatureName?: string;
// }

// /**
//  * Calculates canvas dimensions from studio signature data or canvas element bounds.
//  */
// function getCanvasDimensions(
//   signature?: SavedSignature,
//   signatureData?: TemplateSignatureData | StudioSignatureData
// ): { width?: number; height?: number } {
//   let w: number | undefined;
//   let h: number | undefined;

//   const studioData =
//     signature?.kind === "studio"
//       ? signature.data
//       : signatureData &&
//         ("extras" in signatureData ||
//           "elements" in signatureData ||
//           "canvas" in signatureData ||
//           (signatureData as StudioSignatureData).layout === "single")
//       ? (signatureData as StudioSignatureData)
//       : undefined;

//   if (studioData) {
//     if (studioData.canvas?.width && Number.isFinite(studioData.canvas.width)) {
//       w = Number(studioData.canvas.width);
//     }
//     if (studioData.canvas?.height && Number.isFinite(studioData.canvas.height)) {
//       h = Number(studioData.canvas.height);
//     }
//     if (Array.isArray(studioData.elements)) {
//       for (const el of studioData.elements) {
//         if (typeof el.x === "number" && typeof el.w === "number") {
//           w = Math.max(w || 0, el.x + el.w);
//         }
//         if (typeof el.y === "number" && typeof el.h === "number") {
//           h = Math.max(h || 0, el.y + el.h);
//         }
//       }
//     }
//   }

//   return { width: w, height: h };
// }

// /**
//  * Pre-inlines all <img> tags inside a container as base64 data URLs.
//  * Avoids CORS / foreignObject cross-origin tainting when rasterizing with html-to-image.
//  */
// async function inlineImages(container: HTMLElement): Promise<void> {
//   const images = Array.from(container.querySelectorAll<HTMLImageElement>("img"));
//   if (images.length === 0) return;

//   await Promise.all(
//     images.map(async (img) => {
//       const src = img.getAttribute("src");
//       if (!src || src.startsWith("data:") || src.startsWith("blob:")) {
//         return;
//       }

//       try {
//         const response = await fetch(src, {
//           mode: "cors",
//           credentials: "omit",
//         });
//         if (!response.ok) return;

//         const blob = await response.blob();
//         const base64 = await new Promise<string>((resolve, reject) => {
//           const reader = new FileReader();
//           reader.onloadend = () => {
//             if (typeof reader.result === "string") {
//               resolve(reader.result);
//             } else {
//               reject(new Error("FileReader did not produce a string"));
//             }
//           };
//           reader.onerror = reject;
//           reader.readAsDataURL(blob);
//         });

//         img.setAttribute("src", base64);
//         img.src = base64;

//         if (!img.complete) {
//           await new Promise<void>((resolve) => {
//             img.onload = () => resolve();
//             img.onerror = () => resolve();
//           });
//         }
//       } catch (err) {
//         console.warn("Could not pre-inline image:", src, err);
//       }
//     })
//   );
// }

// /**
//  * Validates whether the exported image is completely blank (100% white or transparent).
//  */
// async function isImageBlank(dataUrl: string): Promise<boolean> {
//   return new Promise((resolve) => {
//     const img = new Image();
//     img.onload = () => {
//       try {
//         const w = img.naturalWidth || img.width;
//         const h = img.naturalHeight || img.height;
//         if (w === 0 || h === 0) {
//           resolve(true);
//           return;
//         }

//         const canvas = document.createElement("canvas");
//         canvas.width = w;
//         canvas.height = h;

//         const ctx = canvas.getContext("2d", { willReadFrequently: true });
//         if (!ctx) {
//           resolve(false);
//           return;
//         }

//         ctx.drawImage(img, 0, 0);
//         const imgData = ctx.getImageData(0, 0, w, h);
//         const data = imgData.data;

//         let hasContent = false;
//         // Step through pixels: non-white content has (r < 248 || g < 248 || b < 248) and alpha > 30
//         for (let i = 0; i < data.length; i += 4) {
//           const r = data[i];
//           const g = data[i + 1];
//           const b = data[i + 2];
//           const a = data[i + 3];

//           if (a > 30 && (r < 248 || g < 248 || b < 248)) {
//             hasContent = true;
//             break;
//           }
//         }

//         resolve(!hasContent);
//       } catch (err) {
//         console.warn("Could not check pixel data on canvas:", err);
//         resolve(false);
//       }
//     };
//     img.onerror = () => resolve(true);
//     img.src = dataUrl;
//   });
// }

// export default function SaveSuccessModal({
//   isOpen,
//   onClose,
//   signatureData,
//   signature,
//   preRenderedHtml,
//   preRenderedPlainText,
//   signatureName,
// }: SaveSuccessModalProps) {
//   const [copiedSignature, setCopiedSignature] = useState(false);
//   const [showCopiedAlert, setShowCopiedAlert] = useState(false);
//   const [isDownloadingImage, setIsDownloadingImage] = useState(false);
//   const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
//   const signatureDownloadRef = useRef<HTMLDivElement>(null);

//   function getHtmlAndPlainText(): {
//     html: string;
//     previewHtml: string;
//     plainText: string;
//   } {
//     if (preRenderedHtml) {
//       return {
//         html: preRenderedHtml,
//         previewHtml: preRenderedHtml,
//         plainText: preRenderedPlainText || "",
//       };
//     }
//     if (signature) {
//       return {
//         html: renderSavedSignatureHtml(signature),
//         previewHtml: renderSavedSignatureHtml(signature, { preview: true }),
//         plainText: renderSavedSignaturePlainText(signature),
//       };
//     }
//     if (signatureData) {
//       if (
//         "extras" in signatureData ||
//         "design" in signatureData ||
//         (signatureData.layout as string) === "single"
//       ) {
//         const studioData = signatureData as StudioSignatureData;
//         if (studioData.elements && Array.isArray(studioData.elements)) {
//           return {
//             html: generateFreeHtml(studioData),
//             previewHtml: generateFreeHtml(studioData, { preview: true }),
//             plainText: generateFreePlainText(studioData),
//           };
//         }
//         return {
//           html: generateStudioHtml(studioData),
//           previewHtml: generateStudioHtml(studioData, { preview: true }),
//           plainText: generateStudioPlainText(studioData),
//         };
//       }
//       const templateData = signatureData as TemplateSignatureData;
//       return {
//         html: generateTemplateHtml(templateData),
//         previewHtml: generateTemplateHtml(templateData),
//         plainText: generateTemplatePlainText(templateData),
//       };
//     }
//     return { html: "", previewHtml: "", plainText: "" };
//   }

//   const { html, previewHtml, plainText } = getHtmlAndPlainText();
//   const canvasDimensions = getCanvasDimensions(signature, signatureData);

//   if (!isOpen) return null;

//   function showToast(msg: string) {
//     setFeedbackToast(msg);
//     setTimeout(() => {
//       setFeedbackToast(null);
//     }, 3000);
//   }

//   // 1. Copy Signature as formatted rich text or plain text according to user defaults
//   async function handleCopySignature() {
//     try {
//       const storedSettings = getStoredSettings();
//       if (storedSettings?.defaultExportFormat === "plain") {
//         await copyTextToClipboard(plainText);
//       } else {
//         await copySignatureRich(html, plainText);
//       }
//       setCopiedSignature(true);
//       setShowCopiedAlert(true);
//       setTimeout(() => setCopiedSignature(false), 2500);
//     } catch {
//       showToast("Failed to copy signature. Please try again.");
//     }
//   }

//   // 2. Download as Image (PNG via html-to-image)
//   async function handleDownloadImage() {
//     setIsDownloadingImage(true);
//     const fileName = (signatureName || signatureData?.fullName || "my_signature")
//       .trim()
//       .replace(/\s+/g, "_");

//     try {
//       const target = signatureDownloadRef.current;
//       if (!target) {
//         throw new Error("Download element not available");
//       }

//       // Step 1: Pre-inline all external / S3 / relative images as data URLs
//       await inlineImages(target);

//       // Step 2: Ensure fonts are loaded before rasterization
//       if (typeof document !== "undefined" && document.fonts?.ready) {
//         try {
//           await document.fonts.ready;
//         } catch (fontErr) {
//           console.warn("document.fonts.ready error:", fontErr);
//         }
//       }

//       // Step 3: Wait two animation frames to allow DOM layout to settle
//       await new Promise<void>((resolve) => {
//         requestAnimationFrame(() => {
//           requestAnimationFrame(() => {
//             resolve();
//           });
//         });
//       });

//       // Step 4: Calculate exact export dimensions
//       const targetRect = target.getBoundingClientRect();
//       const contentWidth = canvasDimensions.width || 600;
//       const exportWidth = Math.ceil(
//         Math.max(
//           contentWidth + 48,
//           target.scrollWidth,
//           target.offsetWidth,
//           targetRect.width
//         )
//       );
//       const exportHeight = Math.ceil(
//         Math.max(
//           canvasDimensions.height ? canvasDimensions.height + 48 : 0,
//           target.scrollHeight,
//           target.offsetHeight,
//           targetRect.height
//         )
//       );

//       // Step 5: Warm-up call to html-to-image to prime font and CSS caches
//       try {
//         await toPng(target, {
//           pixelRatio: 1,
//           skipFonts: false,
//           width: exportWidth,
//           height: exportHeight,
//           style: {
//             position: "static",
//             left: "0",
//             top: "0",
//             transform: "none",
//             margin: "0",
//           },
//         });
//       } catch (warmupErr) {
//         console.warn("toPng warmup warning:", warmupErr);
//       }

//       // Step 6: Wait double rAF again after warm-up
//       await new Promise<void>((resolve) => {
//         requestAnimationFrame(() => {
//           requestAnimationFrame(() => {
//             resolve();
//           });
//         });
//       });

//       // Step 7: Final high-resolution capture at 2.5x pixel ratio
//       let dataUrl: string;
//       try {
//         dataUrl = await toPng(target, {
//           pixelRatio: 2.5,
//           backgroundColor: "#FFFFFF",
//           cacheBust: false,
//           width: exportWidth,
//           height: exportHeight,
//           style: {
//             position: "static",
//             left: "0",
//             top: "0",
//             transform: "none",
//             margin: "0",
//           },
//         });
//       } catch (firstAttemptErr) {
//         console.warn("toPng initial attempt failed, retrying with skipFonts: true", firstAttemptErr);
//         dataUrl = await toPng(target, {
//           pixelRatio: 2.5,
//           backgroundColor: "#FFFFFF",
//           cacheBust: false,
//           skipFonts: true,
//           width: exportWidth,
//           height: exportHeight,
//           style: {
//             position: "static",
//             left: "0",
//             top: "0",
//             transform: "none",
//             margin: "0",
//           },
//         });
//       }

//       // Step 8: Validate that the exported image is not blank white
//       const blank = await isImageBlank(dataUrl);
//       if (blank) {
//         console.warn("Generated signature image is blank white, triggering fallback HTML download");
//         showToast("Image generation resulted in a blank image. Downloading HTML instead.");
//         fallbackHtmlDownload();
//         return;
//       }

//       // Step 9: Trigger download
//       const a = document.createElement("a");
//       a.href = dataUrl;
//       a.download = `${fileName}_signature.png`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       showToast("Signature image downloaded!");
//     } catch (err) {
//       console.warn("toPng failed, using fallback:", err);
//       showToast("Image generation failed. Downloading HTML instead.");
//       fallbackHtmlDownload();
//     } finally {
//       setIsDownloadingImage(false);
//     }
//   }

//   function fallbackHtmlDownload() {
//     const rawHtml = html || previewHtml;
//     const blob = new Blob([rawHtml], { type: "text/html" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     const fileName = (signatureName || signatureData?.fullName || "my_signature")
//       .trim()
//       .replace(/\s+/g, "_");
//     a.href = url;
//     a.download = `${fileName}_signature.html`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//     showToast("Downloaded signature HTML file!");
//   }

//   return (
//     <div
//       role="dialog"
//       aria-modal="true"
//       className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
//       onClick={(e) => {
//         if (e.target === e.currentTarget) onClose();
//       }}
//     >
//       <div className="relative w-full max-w-[760px] max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-9 shadow-2xl border border-slate-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
//         {/* Close 'X' Button */}
//         <button
//           type="button"
//           onClick={onClose}
//           className="absolute top-4 right-4 sm:top-5 sm:right-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
//           aria-label="Close modal"
//         >
//           <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//             <line x1="18" y1="6" x2="6" y2="18" />
//             <line x1="6" y1="6" x2="18" y2="18" />
//           </svg>
//         </button>

//         {/* Heading & Subtitle */}
//         <h2
//           className="text-2xl sm:text-[28px] font-bold text-[#1E293B] leading-tight"
//           style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
//         >
//           Your Signature Is Ready
//         </h2>
//         <p
//           className="mt-1.5 text-xs sm:text-[14px] text-[#64748B] max-w-md"
//           style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
//         >
//           Attach it to your emails, or add it anywhere that accepts image based signatures.
//         </p>

//         {/* Central Graphic Container with Dashed Trajectory, Envelope Icon, and Center Preview */}
//         <div className="relative w-full max-w-[640px] my-4 sm:my-6 min-h-[240px] sm:min-h-[270px] flex items-center justify-center">
//           {/* Background SVG Dashed Curve Line */}
//           <svg
//             className="absolute inset-0 w-full h-full pointer-events-none"
//             viewBox="0 0 640 270"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             {/* Dashed line connecting left envelope icon, curving around center, and looping to top-right paper airplane */}
//             <path
//               d="M 52 188 C 85 160, 115 140, 160 170 C 210 205, 300 230, 420 200 C 490 180, 520 120, 545 75 C 558 52, 575 55, 570 78 C 564 100, 540 96, 548 70 C 555 48, 575 42, 600 32"
//               stroke="#245FD4"
//               strokeWidth="1.8"
//               strokeDasharray="4 4"
//               strokeLinecap="round"
//               fill="none"
//               opacity="0.85"
//             />
//           </svg>

//           {/* Left End: Envelope Icon Badge */}
//           <div className="absolute left-2 sm:left-4 bottom-8 sm:bottom-12 z-20 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#EBF3FF] border border-[#BFDBFE] shadow-xs">
//             <svg
//               className="w-5 h-5 text-[#245FD4]"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <rect x="2" y="4" width="20" height="16" rx="2" />
//               <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
//             </svg>
//           </div>

//           {/* Right End: Paper Airplane / Arrow Head */}
//           <div className="absolute right-3 sm:right-6 top-3 sm:top-5 z-20">
//             <svg
//               className="w-7 h-7 sm:w-8 sm:h-8 text-[#245FD4] rotate-[-10deg] drop-shadow-xs"
//               viewBox="0 0 24 24"
//               fill="currentColor"
//             >
//               <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
//             </svg>
//           </div>

//           {/* Centered Blue Envelope & Signature Card Preview */}
//           <div className="relative w-[340px] sm:w-[420px] max-w-[88vw] flex flex-col items-center">
//             {/* Signature Card (Emerging out of the envelope) */}
//             <div className="relative z-10 w-[315px] sm:w-[380px] max-h-[220px] overflow-y-auto rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 text-left shadow-lg">
//               {/* Green Checkmark Circle Badge (Top-Right) */}
//               <div className="absolute -top-3.5 -right-3.5 z-30 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#22C55E] text-white shadow-md border-2 border-white">
//                 <svg
//                   className="w-5 h-5 sm:w-6 sm:h-6"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="3"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <polyline points="20 6 9 17 4 12" />
//                 </svg>
//               </div>

//               {/* Signature Card Content - Real Signature Markup */}
//               <div
//                 className="w-full overflow-hidden text-left"
//                 dangerouslySetInnerHTML={{
//                   __html: previewHtml,
//                 }}
//               />
//             </div>

//             {/* Front Envelope Pocket (Overlapping lower portion of card) */}
//             <div className="relative -mt-10 sm:-mt-12 w-full z-20 pointer-events-none">
//               <svg
//                 viewBox="0 0 420 125"
//                 className="w-full h-auto drop-shadow-md"
//                 preserveAspectRatio="none"
//               >
//                 <defs>
//                   <linearGradient id="envelopeGrad" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="0%" stopColor="#1E5BD8" />
//                     <stop offset="100%" stopColor="#1748AE" />
//                   </linearGradient>
//                 </defs>
//                 {/* Envelope Front Body with V-Opening */}
//                 <path
//                   d="M0,0 L210,72 L420,0 L420,115 Q420,125 410,125 L10,125 Q0,125 0,115 Z"
//                   fill="url(#envelopeGrad)"
//                 />
//                 {/* Left diagonal crease */}
//                 <path d="M0,125 L210,58" stroke="#0E3382" strokeWidth="1.2" strokeOpacity="0.4" />
//                 {/* Right diagonal crease */}
//                 <path d="M420,125 L210,58" stroke="#0E3382" strokeWidth="1.2" strokeOpacity="0.4" />
//                 {/* Top V-notch stroke */}
//                 <path
//                   d="M0,0 L210,72 L420,0"
//                   stroke="#3B82F6"
//                   strokeWidth="1.5"
//                   fill="none"
//                   strokeOpacity="0.4"
//                 />
//               </svg>
//             </div>
//           </div>
//         </div>

//         {/* "What's Next?" Section Divider */}
//         <div className="flex items-center justify-center gap-4 my-4 sm:my-5 w-full max-w-[560px]">
//           <div className="h-px flex-1 bg-slate-200" />
//           <span
//             className="text-[13px] sm:text-[14px] font-bold text-[#1E293B]"
//             style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
//           >
//             What&apos;s Next?
//           </span>
//           <div className="h-px flex-1 bg-slate-200" />
//         </div>

//         {/* Bottom Three Action Buttons */}
//         <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-3.5 w-full max-w-[580px]">
//           {/* Button 1: Copy Signature */}
//           <button
//             type="button"
//             onClick={handleCopySignature}
//             className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-[13px] font-semibold text-[#1E293B] shadow-2xs transition hover:bg-slate-50 hover:border-slate-300 active:scale-95"
//             style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
//           >
//             {copiedSignature ? (
//               <svg
//                 className="w-4 h-4 shrink-0 text-emerald-600"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <polyline points="20 6 9 17 4 12" />
//               </svg>
//             ) : (
//               <svg
//                 className="w-4 h-4 shrink-0"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
//                 <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
//               </svg>
//             )}
//             <span>{copiedSignature ? "Copied!" : "Copy Signature"}</span>
//           </button>

//           {/* Button 2: Download Image */}
//           <button
//             type="button"
//             onClick={handleDownloadImage}
//             disabled={isDownloadingImage}
//             className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-[13px] font-semibold text-[#1E293B] shadow-2xs transition hover:bg-slate-50 hover:border-slate-300 active:scale-95 disabled:opacity-60"
//             style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
//           >
//             <svg
//               className="w-4 h-4 shrink-0"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
//               <polyline points="7 10 12 15 17 10" />
//               <line x1="12" y1="15" x2="12" y2="3" />
//             </svg>
//             <span>{isDownloadingImage ? "Downloading..." : "Download Image"}</span>
//           </button>

//           {/* Button 3: Edit Signature */}
//           <button
//             type="button"
//             onClick={onClose}
//             className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-[13px] font-semibold text-[#1E293B] shadow-2xs transition hover:bg-slate-50 hover:border-slate-300 active:scale-95"
//             style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
//           >
//             <svg
//               className="w-4 h-4 shrink-0"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <path d="M12 20h9" />
//               <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
//             </svg>
//             <span>Edit Signature</span>
//           </button>
//         </div>

//         {/* Small Copied Alert matching Image 2 */}
//         <SignatureCopiedAlert
//           isOpen={showCopiedAlert}
//           onClose={() => setShowCopiedAlert(false)}
//           className="mt-4 w-full max-w-[440px] animate-in fade-in slide-in-from-top-2 duration-200"
//         />

//         {/* Inline Feedback Toast */}
//         {feedbackToast && (
//           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-xl bg-[#1E293B] px-4 py-2 text-xs sm:text-sm text-white shadow-xl animate-in slide-in-from-bottom-2 duration-150">
//             <svg
//               className="w-4 h-4 text-emerald-400"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2.5"
//             >
//               <polyline points="20 6 9 17 4 12" />
//             </svg>
//             <span>{feedbackToast}</span>
//           </div>
//         )}

//         {/* Hidden capture sandbox for PNG export */}
//         <div
//           aria-hidden="true"
//           style={{
//             position: "fixed",
//             left: 0,
//             top: 0,
//             width: 0,
//             height: 0,
//             overflow: "hidden",
//             zIndex: -1,
//             pointerEvents: "none",
//             opacity: 1,
//             visibility: "visible",
//           }}
//         >
//           <div
//             ref={signatureDownloadRef}
//             style={{
//               position: "relative",
//               display: "inline-block",
//               boxSizing: "border-box",
//               backgroundColor: "#FFFFFF",
//               padding: "24px",
//               borderRadius: "12px",
//               overflow: "visible",
//               width: `${(canvasDimensions.width || 600) + 48}px`,
//               minWidth: `${(canvasDimensions.width || 600) + 48}px`,
//               ...(canvasDimensions.height
//                 ? {
//                     minHeight: `${canvasDimensions.height + 48}px`,
//                   }
//                 : {}),
//             }}
//             dangerouslySetInnerHTML={{
//               __html: previewHtml,
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { TemplateSignatureData } from "@/types/template";
import { StudioSignatureData } from "@/types/studio";
import { SavedSignature } from "@/types/signature";
import { copySignatureRich, copyTextToClipboard } from "@/lib/email-core";
import { getStoredSettings } from "@/app/lib/auth";
import {
  renderSavedSignatureHtml,
  renderSavedSignaturePlainText,
} from "@/lib/signatures/render";
import {
  generateTemplateHtml,
  generateTemplatePlainText,
} from "@/lib/templates/renderTemplateHtml";
import {
  generateStudioHtml,
  generateStudioPlainText,
} from "@/lib/studio/renderStudioHtml";
import {
  generateFreeHtml,
  generateFreePlainText,
} from "@/lib/studio/free/renderFreeHtml";
import { renderSignaturePng } from "@/lib/signatures/exportPng";
import { buildDownloadDocument } from "@/lib/signatures/previewDocument";
import SignatureCopiedAlert from "@/components/signatures/SignatureCopiedAlert";

interface SaveSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  signatureData?: TemplateSignatureData | StudioSignatureData;
  signature?: SavedSignature;
  preRenderedHtml?: string;
  preRenderedPlainText?: string;
  signatureName?: string;
}

/**
 * Validates whether the exported image is completely blank (100% white or transparent).
 */
async function isImageBlank(dataUrl: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        if (w === 0 || h === 0) {
          resolve(true);
          return;
        }

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          resolve(false);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        let hasContent = false;
        // Step through pixels: non-white content has (r < 248 || g < 248 || b < 248) and alpha > 30
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          if (a > 30 && (r < 248 || g < 248 || b < 248)) {
            hasContent = true;
            break;
          }
        }

        resolve(!hasContent);
      } catch (err) {
        console.warn("Could not check pixel data on canvas:", err);
        resolve(false);
      }
    };
    img.onerror = () => resolve(true);
    img.src = dataUrl;
  });
}

export default function SaveSuccessModal({
  isOpen,
  onClose,
  signatureData,
  signature,
  preRenderedHtml,
  preRenderedPlainText,
  signatureName,
}: SaveSuccessModalProps) {
  const [copiedSignature, setCopiedSignature] = useState(false);
  const [showCopiedAlert, setShowCopiedAlert] = useState(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  function getHtmlAndPlainText(): {
    html: string;
    previewHtml: string;
    plainText: string;
  } {
    if (preRenderedHtml) {
      return {
        html: preRenderedHtml,
        previewHtml: preRenderedHtml,
        plainText: preRenderedPlainText || "",
      };
    }
    if (signature) {
      return {
        html: renderSavedSignatureHtml(signature),
        previewHtml: renderSavedSignatureHtml(signature, { preview: true }),
        plainText: renderSavedSignaturePlainText(signature),
      };
    }
    if (signatureData) {
      if (
        "extras" in signatureData ||
        "design" in signatureData ||
        (signatureData.layout as string) === "single"
      ) {
        const studioData = signatureData as StudioSignatureData;
        if (studioData.elements && Array.isArray(studioData.elements)) {
          return {
            html: generateFreeHtml(studioData),
            previewHtml: generateFreeHtml(studioData, { preview: true }),
            plainText: generateFreePlainText(studioData),
          };
        }
        return {
          html: generateStudioHtml(studioData),
          previewHtml: generateStudioHtml(studioData, { preview: true }),
          plainText: generateStudioPlainText(studioData),
        };
      }
      const templateData = signatureData as TemplateSignatureData;
      return {
        html: generateTemplateHtml(templateData),
        previewHtml: generateTemplateHtml(templateData),
        plainText: generateTemplatePlainText(templateData),
      };
    }
    return { html: "", previewHtml: "", plainText: "" };
  }

  const { html, previewHtml, plainText } = getHtmlAndPlainText();

  if (!isOpen) return null;

  function showToast(msg: string) {
    setFeedbackToast(msg);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 3000);
  }

  // 1. Copy Signature as formatted rich text or plain text according to user defaults
  async function handleCopySignature() {
    try {
      const storedSettings = getStoredSettings();
      if (storedSettings?.defaultExportFormat === "plain") {
        await copyTextToClipboard(plainText);
      } else {
        await copySignatureRich(html, plainText);
      }
      setCopiedSignature(true);
      setShowCopiedAlert(true);
      setTimeout(() => setCopiedSignature(false), 2500);
    } catch {
      showToast("Failed to copy signature. Please try again.");
    }
  }

  // 2. Download as Image (PNG of the exact same document as the HTML download)
  async function handleDownloadImage() {
    setIsDownloadingImage(true);
    const fileName = (signatureName || signatureData?.fullName || "my_signature")
      .trim()
      .replace(/\s+/g, "_");

    try {
      const dataUrl = await renderSignaturePng(html || previewHtml);

      if (await isImageBlank(dataUrl)) {
        showToast("Image generation resulted in a blank image. Downloading HTML instead.");
        downloadHtmlFile("Downloaded signature HTML file!");
        return;
      }

      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${fileName}_signature.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast("Signature image downloaded!");
    } catch (err) {
      console.warn("PNG export failed, using HTML instead:", err);
      showToast("Image generation failed. Downloading HTML instead.");
      downloadHtmlFile("Downloaded signature HTML file!");
    } finally {
      setIsDownloadingImage(false);
    }
  }

  function downloadHtmlFile(message = "Signature HTML file downloaded!") {
    const fileName = (signatureName || signatureData?.fullName || "my_signature")
      .trim()
      .replace(/\s+/g, "_");
    const doc = buildDownloadDocument(html || previewHtml, signatureName || fileName);
    const blob = new Blob([doc], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}_signature.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(message);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-[760px] max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-9 shadow-2xl border border-slate-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
        {/* Close 'X' Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Heading & Subtitle */}
        <h2
          className="text-2xl sm:text-[28px] font-bold text-[#1E293B] leading-tight"
          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          Your Signature Is Ready
        </h2>
        <p
          className="mt-1.5 text-xs sm:text-[14px] text-[#64748B] max-w-md"
          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
        >
          Copy it into your email app, or download the HTML file to keep.
        </p>

        {/* Central Graphic Container with Dashed Trajectory, Envelope Icon, and Center Preview */}
        <div className="relative w-full max-w-[640px] my-4 sm:my-6 min-h-[240px] sm:min-h-[270px] flex items-center justify-center">
          {/* Background SVG Dashed Curve Line */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 640 270"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Dashed line connecting left envelope icon, curving around center, and looping to top-right paper airplane */}
            <path
              d="M 52 188 C 85 160, 115 140, 160 170 C 210 205, 300 230, 420 200 C 490 180, 520 120, 545 75 C 558 52, 575 55, 570 78 C 564 100, 540 96, 548 70 C 555 48, 575 42, 600 32"
              stroke="#245FD4"
              strokeWidth="1.8"
              strokeDasharray="4 4"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />
          </svg>

          {/* Left End: Envelope Icon Badge */}
          <div className="absolute left-2 sm:left-4 bottom-8 sm:bottom-12 z-20 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#EBF3FF] border border-[#BFDBFE] shadow-xs">
            <svg
              className="w-5 h-5 text-[#245FD4]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>

          {/* Right End: Paper Airplane / Arrow Head */}
          <div className="absolute right-3 sm:right-6 top-3 sm:top-5 z-20">
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8 text-[#245FD4] rotate-[-10deg] drop-shadow-xs"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </div>

          {/* Centered Blue Envelope & Signature Card Preview */}
          <div className="relative w-[340px] sm:w-[420px] max-w-[88vw] flex flex-col items-center">
            {/* Signature Card (Emerging out of the envelope) */}
            <div className="relative z-10 w-[315px] sm:w-[380px] max-h-[220px] overflow-y-auto rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 text-left shadow-lg">
              {/* Green Checkmark Circle Badge (Top-Right) */}
              <div className="absolute -top-3.5 -right-3.5 z-30 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#22C55E] text-white shadow-md border-2 border-white">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              {/* Signature Card Content - Real Signature Markup */}
              <div
                className="w-full overflow-hidden text-left"
                dangerouslySetInnerHTML={{
                  __html: previewHtml,
                }}
              />
            </div>

            {/* Front Envelope Pocket (Overlapping lower portion of card) */}
            <div className="relative -mt-10 sm:-mt-12 w-full z-20 pointer-events-none">
              <svg
                viewBox="0 0 420 125"
                className="w-full h-auto drop-shadow-md"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="envelopeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1E5BD8" />
                    <stop offset="100%" stopColor="#1748AE" />
                  </linearGradient>
                </defs>
                {/* Envelope Front Body with V-Opening */}
                <path
                  d="M0,0 L210,72 L420,0 L420,115 Q420,125 410,125 L10,125 Q0,125 0,115 Z"
                  fill="url(#envelopeGrad)"
                />
                {/* Left diagonal crease */}
                <path d="M0,125 L210,58" stroke="#0E3382" strokeWidth="1.2" strokeOpacity="0.4" />
                {/* Right diagonal crease */}
                <path d="M420,125 L210,58" stroke="#0E3382" strokeWidth="1.2" strokeOpacity="0.4" />
                {/* Top V-notch stroke */}
                <path
                  d="M0,0 L210,72 L420,0"
                  stroke="#3B82F6"
                  strokeWidth="1.5"
                  fill="none"
                  strokeOpacity="0.4"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* "What's Next?" Section Divider */}
        <div className="flex items-center justify-center gap-4 my-4 sm:my-5 w-full max-w-[560px]">
          <div className="h-px flex-1 bg-slate-200" />
          <span
            className="text-[13px] sm:text-[14px] font-bold text-[#1E293B]"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            What&apos;s Next?
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Bottom Three Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-3.5 w-full max-w-[580px]">
          {/* Button 1: Copy Signature */}
          <button
            type="button"
            onClick={handleCopySignature}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-[13px] font-semibold text-[#1E293B] shadow-2xs transition hover:bg-slate-50 hover:border-slate-300 active:scale-95"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            {copiedSignature ? (
              <svg
                className="w-4 h-4 shrink-0 text-emerald-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
            <span>{copiedSignature ? "Copied!" : "Copy Signature"}</span>
          </button>

          {/* Button 2: Download Image */}
          <button
            type="button"
            onClick={() => downloadHtmlFile()}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-[13px] font-semibold text-[#1E293B] shadow-2xs transition hover:bg-slate-50 hover:border-slate-300 active:scale-95 disabled:opacity-60"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            <svg
              className="w-4 h-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Download HTML</span>
          </button>

          {/* Button 3: Edit Signature */}
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-[13px] font-semibold text-[#1E293B] shadow-2xs transition hover:bg-slate-50 hover:border-slate-300 active:scale-95"
            style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
          >
            <svg
              className="w-4 h-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <span>Edit Signature</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleDownloadImage}
          disabled={isDownloadingImage}
          className="mt-3 text-[12px] font-semibold text-[#245FD4] hover:underline disabled:opacity-60"
          style={{ fontFamily: "var(--font-commissioner), Commissioner, sans-serif" }}
        >
          {isDownloadingImage ? "Preparing image..." : "Need a picture instead? Download as PNG"}
        </button>

        {/* Small Copied Alert matching Image 2 */}
        <SignatureCopiedAlert
          isOpen={showCopiedAlert}
          onClose={() => setShowCopiedAlert(false)}
          className="mt-4 w-full max-w-[440px] animate-in fade-in slide-in-from-top-2 duration-200"
        />

        {/* Inline Feedback Toast */}
        {feedbackToast && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-xl bg-[#1E293B] px-4 py-2 text-xs sm:text-sm text-white shadow-xl animate-in slide-in-from-bottom-2 duration-150">
            <svg
              className="w-4 h-4 text-emerald-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{feedbackToast}</span>
          </div>
        )}
      </div>
    </div>
  );
}