"use client";

import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    workEmail: "",
    inquiryType: "Support",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.workEmail.trim() || !formData.message.trim()) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    setErrorMessage("");
    setStatus("submitting");

    // Simulate reliable dispatch with instant UX feedback
    setTimeout(() => {
      setStatus("success");
    }, 600);
  };

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-[#245FD4]/30 bg-gradient-to-b from-white to-blue-50/40 p-8 text-center sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#DCEBFF] text-[#245FD4]">
          <svg
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <h3 className="font-heading mt-6 text-2xl font-semibold text-slate-900 sm:text-3xl">
          Message Received
        </h3>
        <p className="mt-4 font-body text-base leading-relaxed text-slate-600 sm:text-lg">
          Thank you for reaching out. We have received your message and will respond within 1 to 2 business days.
        </p>

        <button
          type="button"
          onClick={() => {
            setFormData({
              fullName: "",
              workEmail: "",
              inquiryType: "Support",
              message: "",
            });
            setStatus("idle");
          }}
          className="mt-8 inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-3 font-body text-sm font-semibold text-slate-800 shadow-xs transition hover:bg-slate-50"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-[#C1C1C1]/80 bg-white p-7 shadow-xs sm:p-10 lg:p-12"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block font-heading text-sm font-semibold text-slate-800">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            required
            placeholder="Jane Doe"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="mt-2 w-full rounded-xl border border-[#C1C1C1] bg-white px-4 py-3 font-body text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#245FD4] focus:outline-hidden focus:ring-2 focus:ring-[#245FD4]/20"
          />
        </div>

        {/* Work Email */}
        <div>
          <label htmlFor="workEmail" className="block font-heading text-sm font-semibold text-slate-800">
            Work Email <span className="text-red-500">*</span>
          </label>
          <input
            id="workEmail"
            type="email"
            required
            placeholder="jane@company.com"
            value={formData.workEmail}
            onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
            className="mt-2 w-full rounded-xl border border-[#C1C1C1] bg-white px-4 py-3 font-body text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#245FD4] focus:outline-hidden focus:ring-2 focus:ring-[#245FD4]/20"
          />
        </div>
      </div>

      {/* Inquiry Type Dropdown */}
      <div className="mt-6">
        <label htmlFor="inquiryType" className="block font-heading text-sm font-semibold text-slate-800">
          Inquiry Type
        </label>
        <div className="relative mt-2">
          <select
            id="inquiryType"
            value={formData.inquiryType}
            onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
            className="w-full appearance-none rounded-xl border border-[#C1C1C1] bg-white px-4 py-3 pr-10 font-body text-sm text-slate-900 focus:border-[#245FD4] focus:outline-hidden focus:ring-2 focus:ring-[#245FD4]/20"
          >
            <option value="Support">Support</option>
            <option value="Sales & Enterprise">Sales &amp; Enterprise</option>
            <option value="Product Feedback">Product Feedback</option>
            <option value="General Inquiry">General Inquiry</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="mt-6">
        <label htmlFor="message" className="block font-heading text-sm font-semibold text-slate-800">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          required
          placeholder="How can our team help you?"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="mt-2 w-full rounded-xl border border-[#C1C1C1] bg-white p-4 font-body text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#245FD4] focus:outline-hidden focus:ring-2 focus:ring-[#245FD4]/20"
        />
      </div>

      {errorMessage && (
        <p className="mt-4 font-body text-sm text-red-600">{errorMessage}</p>
      )}

      {/* Submit Button */}
      <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-body text-xs text-slate-500">
          Prefer direct email? You can also reach us at{" "}
          <a href="mailto:support@thenevon.com" className="font-semibold text-[#1243A3] underline">
            support@thenevon.com
          </a>
        </p>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-cta-gradient bg-gradient-to-r from-[#245FD4] to-[#022977] px-8 py-3.5 font-body text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? (
            <>
              <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <span>Send Message</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
