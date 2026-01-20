import React from "react";

/**
 * Form Input Component
 * Reusable input with label and icon
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
    "w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300";

  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
        {Icon && <Icon className="h-4 w-4" />}
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
          className={baseInputClass}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
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
