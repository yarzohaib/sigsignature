"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { EASE_OUT_CUBIC, MOTION_VIEWPORT } from "@/components/motion/motionConfig";

export interface ComparisonRow {
  criteria: string;
  developer: string;
  sigSignature: string;
}

export interface ComparisonTableProps {
  rows: ComparisonRow[];
}

const rowVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
    // Strictly no blur on table rows to avoid text smear
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: EASE_OUT_CUBIC,
    },
  },
};

const tbodyVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

/**
 * ComparisonTable:
 * Semantic HTML table with motion reveals.
 * - Rows stagger in with 0.07s interval (fade and 16px rise, zero blur).
 * - Check and cross icons pop in with spring scale (0.5 to 1).
 * - Sig Signature column gradient backdrop fades in after the rows settle.
 * - Semantic table markup preserved, horizontally scrollable on mobile.
 */
export default function ComparisonTable({ rows }: ComparisonTableProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {/* Mobile card view: one card per criteria, shown below md */}
      <ul className="mt-5 space-y-3 md:hidden">
        {rows.map((row) => (
          <li key={row.criteria} className="rounded-[20px] border border-[#E1E8F5] bg-white p-3 shadow-[0_3px_10px_rgba(20,45,90,0.06)]">
            <h3 className="mb-2 font-heading text-[10px] font-bold uppercase tracking-[0.12em] text-[#1646C8]">
              {row.criteria}
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="min-h-[78px] rounded-[14px] bg-[#F1F2F5] p-2.5">
                <span className="block font-body text-[9px] font-medium text-slate-500">Custom Development</span>
                <span className="mt-1 block font-heading text-[12px] font-semibold leading-[1.3] text-[#25324C]">{row.developer}</span>
              </div>
              <div className="min-h-[78px] rounded-[14px] bg-gradient-to-br from-[#315EEA] to-[#163B9D] p-2.5">
                <span className="block font-body text-[9px] font-medium text-white/85">SigSignature</span>
                <span className="mt-1 block font-heading text-[12px] font-semibold leading-[1.3] text-white">{row.sigSignature}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop / tablet table — hidden below md */}
      <div className="mx-auto hidden md:block mt-12 max-w-[1200px] overflow-x-auto sm:mt-16">
      <div className="inline-block min-w-full align-middle">
        <div className="relative overflow-hidden rounded-[12px] border border-[#D7D7D7] bg-white shadow-xs">
          {/* Continuous gradient backdrop for Column 3: fades in after all rows stagger in */}
          <motion.div
            aria-hidden="true"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={MOTION_VIEWPORT}
            transition={{
              duration: 0.6,
              delay: shouldReduceMotion ? 0 : rows.length * 0.07 + 0.1,
              ease: EASE_OUT_CUBIC,
            }}
            style={{
              background: "linear-gradient(180deg, #245FD4 0%, #0D3287 100%)",
            }}
            className="pointer-events-none absolute top-0 right-0 bottom-0 w-[37%] rounded-r-[12px] border-t border-r border-b border-[#C1C1C1]"
          />

          <table className="min-w-[540px] md:min-w-full table-fixed border-separate border-spacing-0 text-left">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="w-[26%] border-r border-b border-[#D7D7D7] bg-white px-6 py-6 font-heading text-lg font-semibold text-slate-900 sm:px-8 sm:py-7 lg:py-8 lg:text-[28px] leading-[100%] tracking-normal"
                >
                  Feature
                </th>
                <th
                  scope="col"
                  className="w-[37%] border-r border-b border-[#D7D7D7] bg-white px-6 py-6 font-heading text-lg font-semibold text-slate-900 sm:px-8 sm:py-7 lg:py-8 lg:text-[28px] leading-[100%] tracking-normal"
                >
                  Custom Development
                </th>
                <th
                  scope="col"
                  style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.35)" }}
                  className="relative z-10 w-[37%] border-b border-white/35 bg-transparent px-6 py-6 font-heading text-lg font-semibold text-white sm:px-8 sm:py-7 lg:py-8 lg:text-[28px] leading-[100%] tracking-normal"
                >
                  SigSignature
                </th>
              </tr>
            </thead>

            {shouldReduceMotion ? (
              <tbody>
                {rows.map((row, idx) => {
                  const isShaded = idx % 2 === 0;
                  const isLast = idx === rows.length - 1;

                  return (
                    <tr key={row.criteria}>
                      <td
                        className={`border-r border-[#D7D7D7] px-6 py-4.5 font-body text-sm font-normal text-slate-900 sm:px-8 sm:py-5.5 lg:text-[18px] leading-[100%] tracking-normal ${
                          isShaded ? "bg-[#F6F6F6]" : "bg-white"
                        } ${!isLast ? "border-b border-[#D7D7D7]" : ""}`}
                      >
                        {row.criteria}
                      </td>

                      <td
                        className={`border-r border-[#D7D7D7] px-6 py-4.5 font-body text-sm font-normal text-slate-900 sm:px-8 sm:py-5.5 lg:text-[18px] leading-[100%] tracking-normal ${
                          isShaded ? "bg-[#F6F6F6]" : "bg-white"
                        } ${!isLast ? "border-b border-[#D7D7D7]" : ""}`}
                      >
                        {row.developer}
                      </td>

                      <td
                        style={{
                          borderBottom: !isLast
                            ? "1px solid rgba(255, 255, 255, 0.35)"
                            : "none",
                        }}
                        className={`relative z-10 px-6 py-4.5 font-body text-sm font-normal text-white sm:px-8 sm:py-5.5 lg:text-[18px] leading-[100%] tracking-normal ${
                          !isLast ? "border-b border-white/35" : ""
                        }`}
                      >
                        {row.sigSignature}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            ) : (
              <motion.tbody
                initial="hidden"
                whileInView="visible"
                viewport={MOTION_VIEWPORT}
                variants={tbodyVariants}
              >
                {rows.map((row, idx) => {
                  const isShaded = idx % 2 === 0;
                  const isLast = idx === rows.length - 1;

                  return (
                    <motion.tr key={row.criteria} variants={rowVariants}>
                      {/* Column 1: Criteria */}
                      <td
                        className={`border-r border-[#D7D7D7] px-6 py-4.5 font-body text-sm font-normal text-slate-900 sm:px-8 sm:py-5.5 lg:text-[18px] leading-[100%] tracking-normal ${
                          isShaded ? "bg-[#F6F6F6]" : "bg-white"
                        } ${!isLast ? "border-b border-[#D7D7D7]" : ""}`}
                      >
                        {row.criteria}
                      </td>

                      {/* Column 2: Hiring a Developer */}
                      <td
                        className={`border-r border-[#D7D7D7] px-6 py-4.5 font-body text-sm font-normal text-slate-900 sm:px-8 sm:py-5.5 lg:text-[18px] leading-[100%] tracking-normal ${
                          isShaded ? "bg-[#F6F6F6]" : "bg-white"
                        } ${!isLast ? "border-b border-[#D7D7D7]" : ""}`}
                      >
                        {row.developer}
                      </td>

                      {/* Column 3: The Sig Signature */}
                      <td
                        style={{
                          borderBottom: !isLast
                            ? "1px solid rgba(255, 255, 255, 0.35)"
                            : "none",
                        }}
                        className={`relative z-10 px-6 py-4.5 font-body text-sm font-normal text-white sm:px-8 sm:py-5.5 lg:text-[18px] leading-[100%] tracking-normal ${
                          !isLast ? "border-b border-white/35" : ""
                        }`}
                      >
                        {row.sigSignature}
                      </td>
                    </motion.tr>
                  );
                })}
              </motion.tbody>
            )}
          </table>
        </div>
      </div>
    </div>
    </>
  );
}
