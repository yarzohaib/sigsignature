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
            <span className="text-brand">Sig Signature</span>
          </h2>
        </div>

        {/* Comparison Table Container (1200px matching Figma) */}
        <div className="mx-auto mt-12 max-w-[1200px] overflow-x-auto sm:mt-16">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-[12px] border border-[#D7D7D7] bg-white shadow-xs">
              <table className="min-w-full border-collapse text-left font-body">
                <thead>
                  <tr className="border-b border-[#D7D7D7]">
                    <th
                      scope="col"
                      className="w-[30%] border-r border-[#D7D7D7] bg-white px-6 py-5 font-heading text-base font-semibold text-slate-900 sm:px-8"
                    >
                      Criteria
                    </th>
                    <th
                      scope="col"
                      className="w-[36%] border-r border-[#D7D7D7] bg-white px-6 py-5 font-heading text-base font-semibold text-slate-900 sm:px-8"
                    >
                      Hiring a Developer
                    </th>
                    <th
                      scope="col"
                      className="w-[34%] bg-gradient-to-b from-[#245FD4] to-[#0D3287] px-6 py-5 font-heading text-base font-semibold text-white shadow-md sm:px-8"
                    >
                      The Sig Signature
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {rows.map((row, idx) => {
                    const isShaded = idx % 2 === 0; // Alternate rows shaded (#F6F6F6)
                    const isLast = idx === rows.length - 1;

                    return (
                      <tr
                        key={row.criteria}
                        className={`${!isLast ? "border-b border-[#D7D7D7]" : ""}`}
                      >
                        {/* Column 1: Criteria */}
                        <td
                          className={`border-r border-[#D7D7D7] px-6 py-4.5 font-medium text-slate-900 sm:px-8 ${
                            isShaded ? "bg-[#F6F6F6]" : "bg-white"
                          }`}
                        >
                          {row.criteria}
                        </td>

                        {/* Column 2: Hiring a Developer */}
                        <td
                          className={`border-r border-[#D7D7D7] px-6 py-4.5 text-[#878787] sm:px-8 ${
                            isShaded ? "bg-[#F6F6F6]" : "bg-white"
                          }`}
                        >
                          {row.developer}
                        </td>

                        {/* Column 3: The Sig Signature (Gradient from #245FD4 to #0D3287 with white text) */}
                        <td
                          className={`bg-gradient-to-b from-[#245FD4] to-[#0D3287] px-6 py-4.5 font-medium text-white shadow-md sm:px-8 ${
                            !isLast ? "border-b border-white/20" : ""
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
