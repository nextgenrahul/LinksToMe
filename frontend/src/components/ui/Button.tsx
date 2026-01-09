import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'primaryShort';
  children: React.ReactNode;
}

const Button = ({ children, variant = 'primary', className, ...props }: ButtonProps) => {
  
  // 2. Keep baseStyles minimal to avoid CSS conflicts
  const baseStyles = "transition-all duration-200 active:shadow-none active:translate-x-0.5 active:translate-y-0.5";
  
  const variants = {
    primary: `
      w-full
                    flex items-center justify-center gap-3
                    p-3 sm:p-4
                    text-base sm:text-lg
                    font-semibold
                    text-white
                    bg-black
                    border-[1.5px] border-gray-500
                    rounded-lg
                    shadow-[2.5px_3px_0_#000]
                    transition-all duration-200
                    hover:translate-x-px hover:translate-y-px
                    hover:shadow-[1.5px_2px_0_#000]
                    active:translate-x-0.5 active:translate-y-0.5
                    active:shadow-none
      
    `,
    secondary: `
       mt-4
                  w-full
                  flex items-center justify-center gap-3
                  p-3 sm:p-4
                  text-base sm:text-lg
                  font-semibold
                  text-black
                  bg-white
                  border-[1.5px] border-gray-500
                  rounded-lg
                  shadow-[2.5px_3px_0_#000]
                  transition-all duration-200
                  hover:translate-x-px hover:translate-y-px
                  hover:shadow-[1.5px_2px_0_#000]
                  active:translate-x-0.5 active:translate-y-0.5
                  active:shadow-none
    `,
    primaryShort: `
      w-full
                    flex items-center justify-center gap-3
                    p-2 sm:p-2
                    text-base sm:text-lg
                    font-semibold
                    text-white
                    bg-black
                    border-[1.5px] border-gray-500
                    rounded-lg
                    shadow-[2.5px_3px_0_#000]
                    transition-all duration-200
                    hover:translate-x-px hover:translate-y-px
                    hover:shadow-[1.5px_2px_0_#000]
                    active:translate-x-0.5 active:translate-y-0.5
                    active:shadow-none
    `
  };

  return (
    <button 
      type='button'
      // 3. Ensure we access the variant correctly
      className={`${baseStyles} ${variants[variant as keyof typeof variants]} ${className || ''}`} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;