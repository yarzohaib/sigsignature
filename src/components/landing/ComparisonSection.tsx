import SectionBadge from "./SectionBadge";

const rows = [
  {
    criteria: "Cost",
    developer: "$100 – $120 per signature",
    sigSignature: "Free to start",
  },
  {
    criteria: "Time",
    developer: "Days to weeks",
    sigSignature: "Minutes",
  },
  {
    criteria: "Revisions",
    developer: "Back and forth",
    sigSignature: "Instant — edit anytime",
  },
  {
    criteria: "Team signatures",
    developer: "Expensive at scale",
    sigSignature: "Manage all in one place",
  },
  {
    criteria: "HTML quality",
    developer: "Varies by developer",
    sigSignature: "Clean, tested, production-ready",
  },
  {
    criteria: "Ownership",
    developer: "You depend on them",
    sigSignature: "You're in full control",
  },
];

export default function ComparisonSection() {
  return (
    <section className="bg-[#FCFCFC] py-16 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        <div className="text-center">
          <SectionBadge label="COMPARISON" className="mb-4" />
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-[54px] lg:leading-[1.12]">
            Why Developers Vs{" "}
            <span className="text-[#1243A3]">Sig Signature</span>
          </h2>
        </div>

        {/* Comparison Table Container (1200px matching Figma) */}
        <div className="mx-auto mt-12 max-w-[1200px] overflow-x-auto sm:mt-16">
          <div className="inline-block min-w-full align-middle">
            <div className="relative overflow-hidden rounded-[12px] border border-[#D7D7D7] bg-white shadow-xs">
              {/* Continuous gradient backdrop for Column 3 matching Figma Rectangle 22160 */}
              <div
                aria-hidden
                style={{
                  background:
                    "linear-gradient(180deg, #245FD4 0%, #0D3287 100%)",
                }}
                className="pointer-events-none absolute top-0 right-0 bottom-0 w-[37%] rounded-r-[12px] border-t border-r border-b border-[#C1C1C1]"
              />

              <table className="min-w-full table-fixed border-separate border-spacing-0 text-left">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="w-[26%] border-r border-b border-[#D7D7D7] bg-white px-6 py-6 font-heading text-lg font-semibold text-slate-900 sm:px-8 sm:py-7 lg:py-8 lg:text-[28px] leading-[100%] tracking-normal"
                    >
                      Criteria
                    </th>
                    <th
                      scope="col"
                      className="w-[37%] border-r border-b border-[#D7D7D7] bg-white px-6 py-6 font-heading text-lg font-semibold text-slate-900 sm:px-8 sm:py-7 lg:py-8 lg:text-[28px] leading-[100%] tracking-normal"
                    >
                      Hiring a Developer
                    </th>
                    <th
                      scope="col"
                      style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.35)" }}
                      className="relative z-10 w-[37%] border-b border-white/35 bg-transparent px-6 py-6 font-heading text-lg font-semibold text-white sm:px-8 sm:py-7 lg:py-8 lg:text-[28px] leading-[100%] tracking-normal"
                    >
                      The Sig Signature
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => {
                    const isShaded = idx % 2 === 0; // Alternate rows shaded (#F6F6F6)
                    const isLast = idx === rows.length - 1;

                    return (
                      <tr key={row.criteria}>
                        {/* Column 1: Criteria */}
                        <td
                          className={`border-r border-[#D7D7D7] px-6 py-4.5 font-body text-sm font-normal text-slate-900 sm:px-8 sm:py-5.5 lg:text-[18px] leading-[100%] tracking-normal ${
                            isShaded ? "bg-[#F6F6F6]" : "bg-white"
                          } ${!isLast ? "border-b border-[#D7D7D7]" : ""}`}
                        >
                          {row.criteria}
                        </td>

                        {/* Column 2: Hiring a Developer (Same color as Column 1) */}
                        <td
                          className={`border-r border-[#D7D7D7] px-6 py-4.5 font-body text-sm font-normal text-slate-900 sm:px-8 sm:py-5.5 lg:text-[18px] leading-[100%] tracking-normal ${
                            isShaded ? "bg-[#F6F6F6]" : "bg-white"
                          } ${!isLast ? "border-b border-[#D7D7D7]" : ""}`}
                        >
                          {row.developer}
                        </td>

                        {/* Column 3: The Sig Signature (with explicit horizontal row divider line) */}
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
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
