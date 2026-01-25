import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  rightElement?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  rightElement,
  className = "",
  ...props
}) => {
  return (
    <div className="relative w-full">
      <input
        className={`
          w-full
        p-4 sm:p-5
        pr-12
        text-base sm:text-[18px]
        font-semibold        text-black
        border-[1.5px] border-gray-500
        rounded-lg
        shadow-[2.5px_3px_0_#000]
        outline-none
        transition-shadow duration-250 ease-in-out
        focus:shadow-[5.5px_7px_0_#000]
          ${rightElement ? "pl-12" : ""}
          ${className}
        `}
        {...props}
      />

      {rightElement && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {rightElement}
        </div>
      )}
    </div>
  );
};

export default Input;
