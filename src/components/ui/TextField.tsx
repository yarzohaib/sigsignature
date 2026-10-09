type TextFieldProps = React.ComponentProps<"input"> & {
  label: string;
  error?: string;
};

export default function TextField({
  label,
  error,
  id,
  className = "",
  ...props
}: TextFieldProps) {
  const inputId = id ?? props.name;

  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={inputId} className="text-sm font-semibold text-brand-dark">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        className={`h-12 w-full rounded-xl border bg-white px-4 text-base text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 sm:h-14 ${
          error ? "border-red-500 focus:border-red-500" : "border-line focus:border-brand"
        } ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}