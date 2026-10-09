"use client";

import { useState } from "react";
import { EyeIcon } from "@/components/auth/icons";

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
          className={`h-12 w-full rounded-xl border bg-white px-4 pr-12 text-base text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 sm:h-14 ${
            error ? "border-red-500 focus:border-red-500" : "border-line focus:border-brand"
          }`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-4 top-1/2 -translate-y-1/2"
        >
          <EyeIcon />
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}