"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "@/components/auth/icons";

type PasswordFieldProps = Omit<React.ComponentProps<"input">, "type"> & {
  label: string;
  error?: string;
};

export default function PasswordField({
  label,
  error,
  id,
  ...props
}: PasswordFieldProps) {
  const [visible, setVisible] = useState<boolean>(false);
  const inputId = id ?? props.name;

  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={inputId} className="text-sm font-semibold text-brand-dark">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          aria-invalid={Boolean(error)}
          maxLength={props.maxLength ?? 128}
          className={`h-12 w-full rounded-xl border bg-white px-4 pr-12 text-base text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 sm:h-14 ${
            error ? "border-red-500 focus:border-red-500" : "border-line focus:border-brand"
          }`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          title={visible ? "Hide password" : "Show password"}
          className={`absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-lg bg-transparent transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#245FD4] focus-visible:ring-offset-1 active:scale-90 ${
            visible
              ? "text-[#245FD4]"
              : "text-slate-400 hover:text-slate-700"
          }`}
        >
          {visible ? (
            <EyeIcon className="h-5 w-5 transition-transform duration-150" />
          ) : (
            <EyeOffIcon className="h-5 w-5 transition-transform duration-150" />
          )}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
