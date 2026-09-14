import { forwardRef } from "react";

const Input = forwardRef(({
  label,
  error,
  type = "text",
  size = "md",
  icon,
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
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dim text-sm pointer-events-none">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          type={type}
          className={`
            w-full bg-surface-subtle border rounded-lg transition-all duration-200 outline-none
            placeholder:text-dim/50 text-white font-normal
            ${sizes[size]}
            ${icon ? "pl-9" : ""}
            ${error
              ? "border-rose-500/60 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 bg-rose-500/5"
              : "border-border/80 focus:border-candidate focus:ring-1 focus:ring-candidate/20 hover:border-border-hover"
            }
          `}
          {...props}
        />
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

Input.displayName = "Input";
export default Input;

