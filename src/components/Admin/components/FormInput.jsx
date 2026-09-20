import React from "react";

/**
 * Modernized Form Input Component
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
    "w-full px-4 py-2.5 glass-input rounded-xl text-sm placeholder:text-zinc-500 transition-all";

  return (
    <div>
      <label className="flex items-center gap-2 text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
        {Icon && <Icon className="w-3.5 h-3.5 text-indigo-400" />}
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
          <option value="" className="bg-[#090e1c] text-zinc-400">
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option} className="bg-[#090e1c] text-white">
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
          className={`${baseInputClass} ${type === "date" ? "scheme-dark" : ""}`}
        />
      )}
    </div>
  );
};

export default FormInput;
