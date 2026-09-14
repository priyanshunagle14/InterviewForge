import { forwardRef } from "react";

const Select = forwardRef(({
  label,
  error,
  options = [],
  size = "md",
  hint,
  className = "",
  ...props
}, ref) => {
  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-md",
    md: "px-3.5 py-2.5 text-sm rounded-lg",
    lg: "px-4 py-3 text-base rounded-lg",
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-xs font-medium text-dim uppercase tracking-wider mb-1.5">
          {label}
          {props.required && <span className="text-rose-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={`
            w-full bg-surface-subtle border rounded-lg transition-all duration-200 outline-none appearance-none cursor-pointer
            text-white pr-9
            ${sizes[size]}
            ${error
              ? "border-rose-500/60 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 bg-rose-500/5"
              : "border-border/80 focus:border-candidate focus:ring-1 focus:ring-candidate/20 hover:border-border-hover"
            }
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-surface text-white">
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dim pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {error && (
        <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1">
          <span className="text-xs">⚠</span> {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-dim/80 text-xs mt-1.5">{hint}</p>
      )}
    </div>
  );
});

Select.displayName = "Select";
export default Select;

