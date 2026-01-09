import React from "react";

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  alt?: string;
}

const EyeToggle: React.FC<IconButtonProps> = ({
  icon,
  alt = "",
  className = "",
  ...props
}) => {
  return (
    <button
      type="button"
      className={`
        inline-flex items-center justify-center
        p-1
        focus:outline-none
        ${className}
      `}
      {...props}
    >
      <img
        src={icon}
        alt={alt}
        className="w-5 h-5 sm:w-6 sm:h-6"
      />
    </button>
  );
};

export default EyeToggle;
