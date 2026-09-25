import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { Heatmap } from "@paper-design/shaders-react";

export interface HeroHeatmapTechItem {
  name: string;
  version?: string;
  badge?: string;
}

export interface HeroHeatmapShaderOverrides {
  width?: number;
  height?: number;
  image?: string;
  colors?: string[];
  colorBack?: string;
  contour?: number;
  angle?: number;
  noise?: number;
  innerGlow?: number;
  outerGlow?: number;
  speed?: number;
  scale?: number;
}

export interface HeroHeatmapContextValue extends HeroHeatmapShaderOverrides {
  srTitle?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
  showCta?: boolean;
  ctaProps?: {
    label?: string;
    href?: string;
    target?: string;
    rel?: string;
    onClick?: () => void;
  };
  showBadges?: boolean;
  techStack?: HeroHeatmapTechItem[];
  renderBadge?: (tech: HeroHeatmapTechItem, index: number, defaultBadge: React.ReactNode) => React.ReactNode;
  desktopShaderProps?: Partial<HeroHeatmapShaderOverrides>;
  mobileShaderProps?: Partial<HeroHeatmapShaderOverrides>;
}

const HeroHeatmapContext = createContext<HeroHeatmapContextValue | null>(null);

export const useHeroHeatmap = () => {
  const context = useContext(HeroHeatmapContext);
  if (!context) {
    throw new Error("useHeroHeatmap must be used within HeroHeatmapRoot");
  }
  return context;
};

// Default diamond image located in public directory
const DEFAULT_DIAMOND_IMAGE = "/diamond.png";

export interface HeroHeatmapRootProps extends HeroHeatmapShaderOverrides {
  children?: React.ReactNode;
  srTitle?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
  showCta?: boolean;
  ctaProps?: {
    label?: string;
    href?: string;
    target?: string;
    rel?: string;
    onClick?: () => void;
  };
  showBadges?: boolean;
  techStack?: HeroHeatmapTechItem[];
  renderBadge?: (tech: HeroHeatmapTechItem, index: number, defaultBadge: React.ReactNode) => React.ReactNode;
  desktopShaderProps?: Partial<HeroHeatmapShaderOverrides>;
  mobileShaderProps?: Partial<HeroHeatmapShaderOverrides>;
  className?: string;
}

export function HeroHeatmapRoot({
  children,
  srTitle = "What Does India Eat?",
  title = "What Does India Eat?",
  subtitle = "A Mathematical & Cultural Analysis",
  description = "A deep statistical exploration of 255 traditional dishes across India. Unveiling dietary Bayesian priors, continuous prep-cook density dynamics, and regional grain dependencies.",
  showCta = true,
  ctaProps = { label: "Explore Visualisations", href: "/visualisations" },
  showBadges = true,
  techStack = [
    { name: "255 Dishes" },
    { name: "13 Engineered Features" },
    { name: "Bayesian Probability" },
    { name: "10 Plotly Models" }
  ],
  renderBadge,
  width = 1000,
  height = 1000,
  image = DEFAULT_DIAMOND_IMAGE,
  colors = [
    "#112069",
    "#1f3ca3",
    "#367c66",
    "#adfa1e",
    "#ffe77a",
    "#ff9a1f",
    "#ed40b3"
  ],
  colorBack = "#0a0a0a",
  contour = 0.45,
  angle = 0,
  noise = 0,
  innerGlow = 0.35,
  outerGlow = 0.25,
  speed = 1,
  scale = 0.55,
  desktopShaderProps,
  mobileShaderProps,
  className = ""
}: HeroHeatmapRootProps) {
  const value: HeroHeatmapContextValue = {
    srTitle,
    title,
    subtitle,
    description,
    showCta,
    ctaProps,
    showBadges,
    techStack,
    renderBadge,
    width,
    height,
    image,
    colors,
    colorBack,
    contour,
    angle,
    noise,
    innerGlow,
    outerGlow,
    speed,
    scale,
    desktopShaderProps,
    mobileShaderProps
  };

  return (
    <HeroHeatmapContext.Provider value={value}>
      <section className={`relative overflow-hidden w-full min-h-[92vh] flex items-center justify-center bg-[#172021] text-[#f7f7f5] ${className}`}>
        {srTitle && <h1 className="sr-only">{srTitle}</h1>}
        {children}
      </section>
    </HeroHeatmapContext.Provider>
  );
}

export function HeroHeatmapContainer({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative z-10 w-full max-w-[1360px] mx-auto px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${className}`}>
      {children}
    </div>
  );
}

export function HeroHeatmapContent({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`lg:col-span-7 flex flex-col justify-center text-left space-y-6 ${className}`}>
      {children}
    </div>
  );
}

export function HeroHeatmapHeading({ className = "" }: { className?: string }) {
  const { title, subtitle } = useHeroHeatmap();
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2 text-xs font-mono-tech text-[#cef79e]">
        <span className="w-2 h-2 rounded-full bg-[#cef79e] animate-pulse"></span>
        <span className="tracking-widest uppercase">LABORATORY EXPLORATION · 255 DISHES</span>
      </div>
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-[-0.03em] text-[#ffffff] leading-[1.05] text-balance">
        {title}
      </h1>
      <p className="text-xl sm:text-2xl lg:text-3xl text-[#c9cbbe] font-light tracking-[-0.015em]">
        {subtitle}
      </p>
    </div>
  );
}

export function HeroHeatmapDescription({ className = "" }: { className?: string }) {
  const { description } = useHeroHeatmap();
  return (
    <p className={`text-base sm:text-lg text-[#94a3b8] max-w-xl leading-relaxed font-light ${className}`}>
      {description}
    </p>
  );
}

export function HeroHeatmapActions({
  children,
  className = ""
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const { ctaProps } = useHeroHeatmap();

  if (children) {
    return <div className={`flex flex-wrap items-center gap-4 pt-3 ${className}`}>{children}</div>;
  }

  return (
    <div className={`flex flex-wrap items-center gap-4 pt-3 ${className}`}>
      {ctaProps && (
        <a
          href={ctaProps.href || "#"}
          onClick={ctaProps.onClick}
          target={ctaProps.target}
          rel={ctaProps.rel || (ctaProps.target === "_blank" ? "noopener noreferrer" : undefined)}
          className="inline-flex items-center justify-center h-11 px-6 rounded-lg font-mono-tech text-xs tracking-wider uppercase bg-[#222f30] text-[#cef79e] border border-[#4d5757] hover:border-[#cef79e] transition-colors"
        >
          {ctaProps.label || "Explore"}
        </a>
      )}
    </div>
  );
}

export function HeroHeatmapBadges({ className = "" }: { className?: string }) {
  const { techStack, renderBadge } = useHeroHeatmap();

  if (!techStack || techStack.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-3 pt-6 border-t border-[#4d5757]/40 text-xs font-mono-tech text-[#c9cbbe] ${className}`}>
      {techStack.map((tech, idx) => {
        const defaultBadge = (
          <div
            key={idx}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#222f30]/70 border border-[#4d5757]/50"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#cef79e]"></span>
            <span>{tech.name}</span>
            {tech.version && <span className="text-[#64748b]">{tech.version}</span>}
          </div>
        );

        return renderBadge ? renderBadge(tech, idx, defaultBadge) : defaultBadge;
      })}
    </div>
  );
}

// Shader Visual Component
export const HeroHeatmapVisual = React.memo(function HeroHeatmapVisual({
  className = "",
  desktopShaderProps: propOverrides
}: {
  className?: string;
  desktopShaderProps?: Partial<HeroHeatmapShaderOverrides>;
}) {
  const ctx = useHeroHeatmap();
  const [shaderError, setShaderError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (!gl) {
        setShaderError(true);
      }
    } catch {
      setShaderError(true);
    }
    setMounted(true);
  }, []);

  const merged = useMemo(() => {
    return {
      width: ctx.width,
      height: ctx.height,
      image: ctx.image,
      colors: ctx.colors,
      colorBack: ctx.colorBack,
      contour: ctx.contour,
      angle: ctx.angle,
      noise: ctx.noise,
      innerGlow: ctx.innerGlow,
      outerGlow: ctx.outerGlow,
      speed: ctx.speed,
      scale: ctx.scale,
      ...ctx.desktopShaderProps,
      ...propOverrides
    };
  }, [ctx, propOverrides]);

  return (
    <div className={`lg:col-span-5 relative w-full aspect-square max-w-[500px] mx-auto flex items-center justify-center ${className}`}>
      {/* Decorative laboratory grid frame */}
      <div className="absolute inset-0 rounded-3xl border border-[#4d5757]/40 bg-[#1e292b]/40 backdrop-blur-sm pointer-events-none z-10 flex flex-col justify-between p-4">
        <div className="flex justify-between items-center text-[10px] font-mono-tech text-[#c9cbbe]">
          <span>FIG 0.1 · SPECTRAL HEATMAP</span>
          <span className="text-[#cef79e]">GLOW: {(merged.innerGlow ?? 0.6) * 100}%</span>
        </div>
        <div className="flex justify-between items-center text-[10px] font-mono-tech text-[#64748b]">
          <span>CONTOUR: {merged.contour}</span>
          <span>N=255 DISHES</span>
        </div>
      </div>

      <div className="w-full h-full rounded-2xl overflow-hidden relative flex items-center justify-center p-2 bg-[#0c1214]/60">
        {mounted && !shaderError ? (
          <div className="w-full h-full relative overflow-hidden rounded-xl flex items-center justify-center">
            <Heatmap
              image={merged.image || DEFAULT_DIAMOND_IMAGE}
              colors={
                merged.colors || [
                  "#112069",
                  "#1f3ca3",
                  "#367c66",
                  "#adfa1e",
                  "#ffe77a",
                  "#ff9a1f",
                  "#ed40b3"
                ]
              }
              colorBack={merged.colorBack || "#0a0a0a"}
              contour={merged.contour ?? 0.45}
              angle={merged.angle ?? 0}
              noise={merged.noise ?? 0}
              innerGlow={merged.innerGlow ?? 0.35}
              outerGlow={merged.outerGlow ?? 0.25}
              speed={merged.speed ?? 1}
              scale={merged.scale ?? 0.55}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        ) : (
          <div className="w-full h-full relative bg-radial from-[#cef79e]/20 via-[#1f3ca3]/30 to-[#172021] flex items-center justify-center">
            <div className="w-48 h-48 rounded-full border border-[#cef79e]/40 animate-spin border-t-transparent"></div>
          </div>
        )}
      </div>
    </div>
  );
});

export function HeroHeatmapMobileVisual() {
  return null; // Mobile rendering handled responsively in container
}

export function HeroHeatmap(props: HeroHeatmapRootProps) {
  return (
    <HeroHeatmapRoot {...props}>
      <HeroHeatmapContainer>
        <HeroHeatmapContent>
          <HeroHeatmapHeading />
          <HeroHeatmapDescription />
          <HeroHeatmapActions />
          <HeroHeatmapBadges />
        </HeroHeatmapContent>
        <HeroHeatmapVisual />
      </HeroHeatmapContainer>
    </HeroHeatmapRoot>
  );
}

export default HeroHeatmap;
