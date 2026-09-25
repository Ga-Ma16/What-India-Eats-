import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm";
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-mono-tech text-xs tracking-wider uppercase transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#cef79e]";
    
    const variants = {
      default: "bg-[#222f30] text-[#f7f7f5] hover:bg-[#2b3a3b] border border-[#4d5757]",
      destructive: "bg-red-900/40 text-red-200 border border-red-700/50 hover:bg-red-900/60",
      outline: "border border-[#4d5757] bg-transparent text-[#f7f7f5] hover:border-[#cef79e] hover:text-[#cef79e]",
      secondary: "bg-[#283536] text-[#c9cbbe] hover:bg-[#324344]",
      ghost: "hover:bg-[#222f30] text-[#c9cbbe] hover:text-[#cef79e]",
      link: "text-[#cef79e] underline-offset-4 hover:underline"
    };

    const sizes = {
      default: "h-10 px-5 py-2 rounded-lg",
      sm: "h-8 px-3.5 py-1.5 rounded-md text-[11px]",
      lg: "h-12 px-7 py-3 rounded-lg text-sm",
      icon: "h-10 w-10 rounded-lg",
      "icon-sm": "h-8 w-8 rounded-md"
    };

    const variantStyle = variants[variant] || variants.default;
    const sizeStyle = sizes[size] || sizes.default;

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyle} ${sizeStyle} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
