import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string | number; label: string }[];
}

const Select: React.FC<SelectProps> = ({ options, className = "", ...props }) => {
  return (
    <div className="relative w-full">
      <select
        className={`
          w-full p-4 sm:p-5 appearance-none bg-white
          text-base sm:text-[18px] font-semibold text-black
          border-[1.5px] border-gray-500 rounded-lg
          shadow-[2.5px_3px_0_#000] outline-none
          transition-all duration-200 cursor-pointer
          focus:shadow-[5.5px_7px_0_#000]
          ${className}
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {/* Custom Arrow */}
      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default Select;