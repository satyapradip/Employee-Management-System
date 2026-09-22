import React from "react";

/**
 * Modernized Clean Form Input Component
 * Following Reference 1 specifications
 */
const FormInput = ({
  label,
  icon: Icon,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  as = "input",
  options = [],
  rows = 3,
}) => {
  const baseInputClass =
    "w-full px-4 py-2.5 bg-white border border-[#E1E5E9] focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 rounded-xl text-xs sm:text-sm text-[#15191E] placeholder:text-[#87909B] transition-all";

  return (
    <div>
      <label className="flex items-center gap-2 text-xs font-semibold text-[#5E6875] uppercase tracking-wider mb-2">
        {Icon && <Icon className="w-3.5 h-3.5 text-[#4F46E5]" />}
        {label}
      </label>

      {as === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={`${baseInputClass} resize-none`}
        />
      ) : as === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`${baseInputClass} cursor-pointer`}
        >
          <option value="" className="text-[#87909B]">
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option} className="text-[#15191E]">
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={baseInputClass}
        />
      )}
    </div>
  );
};

export default FormInput;
