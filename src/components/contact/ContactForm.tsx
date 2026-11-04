"use client";

import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import Select from "@/components/ui/Select";

const ABOUT_OPTIONS = [
  { value: "General enquiry", label: "General enquiry" },
  { value: "Technical support", label: "Technical support" },
  { value: "Billing & subscription", label: "Billing & subscription" },
  { value: "Feature request", label: "Feature request" },
  { value: "Enterprise & team licensing", label: "Enterprise & team licensing" },
  { value: "Privacy & data request", label: "Privacy & data request" },
];

const CLIENT_OPTIONS = [
  { value: "", label: "Select your email client" },
  { value: "Gmail (Web)", label: "Gmail (Web)" },
  { value: "Gmail (Mobile App)", label: "Gmail (Mobile App)" },
  { value: "Microsoft Outlook (Desktop)", label: "Microsoft Outlook (Desktop)" },
  { value: "Outlook 365 (Web)", label: "Outlook 365 (Web)" },
  { value: "Apple Mail (macOS)", label: "Apple Mail (macOS)" },
  { value: "Apple Mail (iOS)", label: "Apple Mail (iOS)" },
  { value: "Yahoo Mail", label: "Yahoo Mail" },
  { value: "Mozilla Thunderbird", label: "Mozilla Thunderbird" },
  { value: "Other", label: "Other / Not listed" },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
  terms?: string;
}

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [about, setAbout] = useState("General enquiry");
  const [emailClient, setEmailClient] = useState("");
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [agreed, setAgreed] = useState(false);

  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [, setTouched] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage("Selected file exceeds the 10 MB limit.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setErrorMessage("");
    setAttachment(file);
  };

  const handleRemoveFile = () => {
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!name.trim()) {
      newErrors.name = "Your name is required.";
    }
    if (!email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!message.trim()) {
      newErrors.message = "Your message is required.";
    } else if (message.trim().length < 50) {
      newErrors.message = `Message must be at least 50 characters (currently ${message.trim().length}).`;
    }
    if (!agreed) {
      newErrors.terms = "You must agree to the privacy statement to proceed.";
    }
    return newErrors;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true, terms: true });
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setErrorMessage("");
    setStatus("submitting");

    // Smooth dispatch feedback
    setTimeout(() => {
      setStatus("success");
    }, 700);
  };

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-xs">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#245FD4]">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <h3 className="font-heading mt-6 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Message Sent
        </h3>
        <p className="mt-3 font-body text-sm sm:text-base leading-relaxed text-slate-600 max-w-md mx-auto">
          Thank you for reaching out, <span className="font-semibold text-slate-800">{name}</span>. We have received your message and will respond to{" "}
          <span className="font-semibold text-slate-800">{email}</span> within 1 business day.
        </p>

        <button
          type="button"
          onClick={() => {
            setName("");
            setEmail("");
            setAbout("General enquiry");
            setEmailClient("");
            setMessage("");
            setAttachment(null);
            setAgreed(false);
            setStatus("idle");
          }}
          className="mt-8 inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-3 font-body text-sm font-semibold text-slate-800 shadow-xs transition hover:bg-slate-50 cursor-pointer"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 lg:p-10 shadow-xs"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Send us a message
        </h2>
        <span className="font-body text-xs text-slate-400">
          * Required fields
        </span>
      </div>

      <div className="mt-6 space-y-6">
        {/* Row 1: Name and Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Your name */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="contact-name" className="block font-heading text-xs font-bold text-slate-800 uppercase tracking-wider">
                Your name *
              </label>
              <span className="font-body text-[11px] text-slate-400">
                {name.length}/16
              </span>
            </div>
            <input
              id="contact-name"
              name="name"
              type="text"
              maxLength={16}
              placeholder="John Doe"
              value={name}
              onChange={(e) => {
                setName(e.target.value.slice(0, 16));
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, name: true }));
                if (!name.trim()) {
                  setErrors((prev) => ({ ...prev, name: "Your name is required." }));
                }
              }}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
              className={`w-full rounded-xl border bg-white px-4 py-3 font-body text-sm text-slate-900 placeholder:text-slate-400 transition focus:outline-none focus:ring-2 ${
                errors.name
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
                  : "border-slate-200 focus:border-[#245FD4] focus:ring-[#245FD4]/15"
              }`}
            />
            {errors.name && (
              <p id="contact-name-error" className="mt-1.5 font-body text-xs text-red-600 font-medium">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email address */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="contact-email" className="block font-heading text-xs font-bold text-slate-800 uppercase tracking-wider">
                Email address *
              </label>
            </div>
            <input
              id="contact-email"
              name="email"
              type="email"
              maxLength={120}
              placeholder="johndoe@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, email: true }));
                if (!email.trim()) {
                  setErrors((prev) => ({ ...prev, email: "Email address is required." }));
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
                  setErrors((prev) => ({ ...prev, email: "Please enter a valid email address." }));
                }
              }}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "contact-email-error" : undefined}
              className={`w-full rounded-xl border bg-white px-4 py-3 font-body text-sm text-slate-900 placeholder:text-slate-400 transition focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
                  : "border-slate-200 focus:border-[#245FD4] focus:ring-[#245FD4]/15"
              }`}
            />
            {errors.email && (
              <p id="contact-email-error" className="mt-1.5 font-body text-xs text-red-600 font-medium">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: What's this about? & Email client (optional) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* What's this about? */}
          <div>
            <label htmlFor="contact-about" className="block font-heading text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              What&apos;s this about? *
            </label>
            <Select
              id="contact-about"
              name="about"
              value={about}
              options={ABOUT_OPTIONS}
              onValueChange={setAbout}
              className="w-full h-11"
            />
          </div>

          {/* Email client (optional) */}
          <div>
            <label htmlFor="contact-client" className="block font-heading text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Email client (optional)
            </label>
            <Select
              id="contact-client"
              name="emailClient"
              value={emailClient}
              options={CLIENT_OPTIONS}
              onValueChange={setEmailClient}
              className="w-full h-11"
            />
          </div>
        </div>

        {/* Row 3: Your message */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="contact-message" className="block font-heading text-xs font-bold text-slate-800 uppercase tracking-wider">
              Your message *
            </label>
            <span className="font-body text-xs text-slate-400">
              {message.length.toLocaleString()} / 5,000
            </span>
          </div>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            maxLength={5000}
            placeholder="Tell us a little about what you need help with (min. 50 characters)..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value.slice(0, 5000));
              if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
            }}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, message: true }));
              if (!message.trim()) {
                setErrors((prev) => ({ ...prev, message: "Your message is required." }));
              } else if (message.trim().length < 50) {
                setErrors((prev) => ({
                  ...prev,
                  message: `Message must be at least 50 characters (currently ${message.trim().length}).`,
                }));
              }
            }}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
            className={`w-full resize-y rounded-xl border bg-white p-4 font-body text-sm text-slate-900 placeholder:text-slate-400 transition focus:outline-none focus:ring-2 ${
              errors.message
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
                : "border-slate-200 focus:border-[#245FD4] focus:ring-[#245FD4]/15"
            }`}
          />
          {errors.message && (
            <p id="contact-message-error" className="mt-1.5 font-body text-xs text-red-600 font-medium">
              {errors.message}
            </p>
          )}
        </div>

        {/* Row 4: File attachment */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            name="attachment"
            accept=".png,.jpg,.jpeg,.pdf"
            onChange={handleFileChange}
            className="hidden"
            id="contact-attachment"
          />

          {!attachment ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group flex items-center justify-between rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4 transition hover:border-[#245FD4]/50 hover:bg-blue-50/30 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#245FD4] transition group-hover:bg-[#245FD4] group-hover:text-white">
                  {/* Paperclip */}
                  <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.37l-9.52 9.52a1.5 1.5 0 01-2.122-2.122l8.82-8.82" />
                  </svg>
                </div>
                <div>
                  <p className="font-heading text-xs sm:text-sm font-semibold text-[#245FD4] group-hover:underline">
                    Add a screenshot or file
                  </p>
                  <p className="font-body text-[11px] text-slate-400 mt-0.5">
                    Optional · PNG, JPG, or PDF · Up to 10 MB
                  </p>
                </div>
              </div>

              {/* Upload arrow */}
              <div className="text-slate-400 group-hover:text-[#245FD4] transition">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-2xl border border-blue-200 bg-[#EFF6FF] p-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#245FD4] shadow-2xs">
                  <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="font-body text-xs sm:text-sm font-semibold text-slate-900 truncate">
                    {attachment.name}
                  </p>
                  <p className="font-body text-[11px] text-slate-500 mt-0.5">
                    {(attachment.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemoveFile}
                className="font-body text-xs font-semibold text-red-600 hover:text-red-700 hover:underline px-2 py-1 cursor-pointer"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Row 5: Checkbox */}
        <div>
          <label htmlFor="contact-terms" className="flex items-start gap-3 cursor-pointer select-none">
            <div className="relative flex items-center pt-0.5">
              <input
                id="contact-terms"
                name="terms"
                type="checkbox"
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  if (errors.terms) setErrors((prev) => ({ ...prev, terms: undefined }));
                }}
                aria-invalid={!!errors.terms}
                aria-describedby={errors.terms ? "contact-terms-error" : undefined}
                className="sr-only peer"
              />
              <div
                className={`flex h-4.5 w-4.5 items-center justify-center rounded-md border transition-all duration-150 peer-focus-visible:ring-2 peer-focus-visible:ring-[#245FD4] peer-focus-visible:ring-offset-2 ${
                  agreed
                    ? "border-[#245FD4] bg-[#245FD4] text-white shadow-xs"
                    : errors.terms
                    ? "border-red-500 bg-white"
                    : "border-slate-300 bg-white hover:border-slate-400"
                }`}
              >
                {agreed && (
                  <svg className="h-3 w-3 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </div>
            </div>
            <span className="font-body text-xs text-slate-500 leading-relaxed">
              I agree to the use of these details to respond to my enquiry. See the{" "}
              <Link href="/privacy" className="text-[#245FD4] underline hover:text-[#022977]">
                Privacy Policy
              </Link>{" "}
              for more information.
            </span>
          </label>
          {errors.terms && (
            <p id="contact-terms-error" className="mt-1.5 font-body text-xs text-red-600 font-medium">
              {errors.terms}
            </p>
          )}
        </div>

        {errorMessage && (
          <p className="font-body text-xs sm:text-sm text-red-600 font-medium">
            {errorMessage}
          </p>
        )}

        {/* Row 6: Footer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">
          <p className="font-body text-xs text-slate-400">
            We&apos;ll reply to the email address you provide.
          </p>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-[#164CA4] hover:bg-[#1243A3] px-8 py-3 font-body text-sm font-semibold text-white shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {status === "submitting" ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Sending...</span>
              </span>
            ) : (
              <span>Send message</span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
