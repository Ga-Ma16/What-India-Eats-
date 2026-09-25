import React, { forwardRef, useState, useEffect } from "react";
import { MetalFx } from "metal-fx";
import { Button, ButtonProps } from "./button";

export interface MetalButtonProps extends ButtonProps {
  preset?: "chromatic" | "silver" | "gold";
  theme?: "auto" | "dark" | "light";
  metalVariant?: "button" | "circle";
  strength?: number;
  paused?: boolean;
  normalizeHostStyles?: boolean;
  disableGlow?: boolean;
  metalFxClassName?: string;
  metalFxStyle?: React.CSSProperties;
  children?: React.ReactNode;
}

export const MetalButton = forwardRef<HTMLDivElement, MetalButtonProps>(
  (
    {
      preset = "chromatic",
      theme = "dark",
      metalVariant = "button",
      strength = 0.9,
      paused = false,
      normalizeHostStyles = true,
      disableGlow = false,
      metalFxClassName = "",
      metalFxStyle,
      className = "",
      variant = "outline",
      children,
      onClick,
      ...buttonProps
    },
    ref
  ) => {
    const [hasError, setHasError] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
    }, []);

    // Graceful fallback for non-WebGL environments or error states
    if (hasError || !isMounted) {
      return (
        <div
          ref={ref}
          className={`relative inline-block group p-[1px] rounded-lg bg-gradient-to-r from-[#cef79e]/40 via-[#4d5757]/30 to-[#cef79e]/40 transition-all duration-300 hover:from-[#cef79e] hover:to-[#a3e635] ${metalFxClassName}`}
          style={metalFxStyle}
        >
          <Button
            variant={variant}
            className={`relative z-10 transition-colors ${className}`}
            onClick={onClick}
            {...buttonProps}
          >
            {children}
          </Button>
        </div>
      );
    }

    try {
      return (
        <div ref={ref} className={`relative inline-block ${metalFxClassName}`} style={metalFxStyle}>
          <MetalFx
            preset={preset}
            theme={theme}
            variant={metalVariant}
            strength={strength}
            paused={paused}
            normalizeHostStyles={normalizeHostStyles}
            disableGlow={disableGlow}
          >
            <Button
              variant={variant}
              className={`relative z-10 transition-colors ${className}`}
              onClick={onClick}
              {...buttonProps}
            >
              {children}
            </Button>
          </MetalFx>
        </div>
      );
    } catch {
      setHasError(true);
      return (
        <Button
          variant={variant}
          className={className}
          onClick={onClick}
          {...buttonProps}
        >
          {children}
        </Button>
      );
    }
  }
);

MetalButton.displayName = "MetalButton";

export interface MetalIconButtonProps extends MetalButtonProps {}

export const MetalIconButton = forwardRef<HTMLDivElement, MetalIconButtonProps>(
  ({ size = "icon-sm", metalVariant = "circle", ...props }, ref) => {
    return (
      <MetalButton
        ref={ref}
        size={size}
        metalVariant={metalVariant}
        {...props}
      />
    );
  }
);

MetalIconButton.displayName = "MetalIconButton";
