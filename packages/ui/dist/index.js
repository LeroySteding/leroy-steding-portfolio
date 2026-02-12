'use strict';

var jsxRuntime = require('react/jsx-runtime');
var React8 = require('react');
var framerMotion = require('framer-motion');
var clsx = require('clsx');
var tailwindMerge = require('tailwind-merge');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React8__default = /*#__PURE__*/_interopDefault(React8);

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};

// src/tokens/colors.ts
var colors = {
  // Dark theme colors (default)
  dark: {
    primary: {
      bg: "#0f1419",
      DEFAULT: "#0f1419"
    },
    secondary: {
      bg: "#1a2332",
      DEFAULT: "#1a2332"
    },
    tertiary: {
      bg: "#242d3d",
      DEFAULT: "#242d3d"
    },
    surface: {
      DEFAULT: "#2a3444",
      light: "#354150"
    },
    accent: {
      primary: "#e8d5c4",
      secondary: "#d4a574",
      hover: "#f0e0d0",
      DEFAULT: "#e8d5c4"
    },
    text: {
      primary: "#f5f5f5",
      secondary: "#b8b8b8",
      muted: "#808080",
      DEFAULT: "#f5f5f5"
    },
    mint: {
      DEFAULT: "#a0d9b4",
      dark: "#7ec99a"
    },
    border: {
      DEFAULT: "#2a3444",
      light: "#354150"
    }
  },
  // Light theme colors
  light: {
    primary: {
      bg: "#ffffff",
      DEFAULT: "#ffffff"
    },
    secondary: {
      bg: "#fafafa",
      DEFAULT: "#fafafa"
    },
    tertiary: {
      bg: "#f5f5f5",
      DEFAULT: "#f5f5f5"
    },
    surface: {
      DEFAULT: "#eeeeee",
      light: "#e0e0e0"
    },
    accent: {
      primary: "#c4a574",
      secondary: "#a08555",
      hover: "#d4b584",
      DEFAULT: "#c4a574"
    },
    text: {
      primary: "#0a0a0a",
      secondary: "#525252",
      muted: "#737373",
      DEFAULT: "#0a0a0a"
    },
    mint: {
      DEFAULT: "#059669",
      dark: "#047857"
    },
    border: {
      DEFAULT: "#e0e0e0",
      light: "#eeeeee"
    }
  }
};
var semanticColors = {
  background: {
    primary: "var(--color-primary-bg)",
    secondary: "var(--color-secondary-bg)",
    tertiary: "var(--color-tertiary-bg)",
    surface: "var(--color-surface)",
    surfaceLight: "var(--color-surface-light)"
  },
  text: {
    primary: "var(--color-text-primary)",
    secondary: "var(--color-text-secondary)",
    muted: "var(--color-text-muted)"
  },
  accent: {
    primary: "var(--color-accent-primary)",
    secondary: "var(--color-accent-secondary)",
    hover: "var(--color-accent-hover)"
  },
  mint: {
    DEFAULT: "var(--color-mint)",
    dark: "var(--color-mint-dark)"
  }
};
var cssVariables = {
  // Backgrounds
  "primary-bg": colors.dark.primary.bg,
  "secondary-bg": colors.dark.secondary.bg,
  "tertiary-bg": colors.dark.tertiary.bg,
  "surface": colors.dark.surface.DEFAULT,
  "surface-light": colors.dark.surface.light,
  // Accents
  "accent-primary": colors.dark.accent.primary,
  "accent-secondary": colors.dark.accent.secondary,
  "accent-hover": colors.dark.accent.hover,
  // Text
  "text-primary": colors.dark.text.primary,
  "text-secondary": colors.dark.text.secondary,
  "text-muted": colors.dark.text.muted,
  // Mint
  "mint": colors.dark.mint.DEFAULT,
  "mint-dark": colors.dark.mint.dark
};

// src/tokens/spacing.ts
var spacing = {
  // Section spacing - generous white space
  section: {
    DEFAULT: "10rem",
    // 160px - Main section padding
    sm: "6rem",
    // 96px - Smaller section padding
    xs: "4rem"
    // 64px - Extra small section padding
  },
  // Container spacing
  container: {
    DEFAULT: "5rem",
    // 80px - Container padding
    sm: "3rem",
    // 48px - Smaller container padding
    xs: "2rem"
    // 32px - Extra small container padding
  },
  // Component spacing
  component: {
    xl: "3rem",
    // 48px
    lg: "2rem",
    // 32px
    md: "1.5rem",
    // 24px
    DEFAULT: "1rem",
    // 16px
    sm: "0.75rem",
    // 12px
    xs: "0.5rem",
    // 8px
    xxs: "0.25rem"
    // 4px
  }
};
var borderRadius = {
  sm: "0.25rem",
  // 4px
  md: "0.5rem",
  // 8px
  DEFAULT: "0.5rem",
  // 8px
  lg: "0.75rem",
  // 12px
  xl: "1rem",
  // 16px
  "2xl": "1.5rem",
  // 24px
  full: "9999px"
  // Fully rounded
};
var spacingVariables = {
  "spacing-section": spacing.section.DEFAULT,
  "spacing-section-sm": spacing.section.sm,
  "spacing-container": spacing.container.DEFAULT,
  "radius-sm": borderRadius.sm,
  "radius-md": borderRadius.md,
  "radius-lg": borderRadius.lg,
  "radius-xl": borderRadius.xl
};

// src/tokens/typography.ts
var fontFamily = {
  sans: 'var(--font-inter), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  display: "var(--font-space-grotesk), system-ui, sans-serif",
  mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace'
};
var fontSize = {
  xs: "0.75rem",
  // 12px
  sm: "0.875rem",
  // 14px
  base: "1rem",
  // 16px
  lg: "1.125rem",
  // 18px - Body text default
  xl: "1.25rem",
  // 20px
  "2xl": "1.5rem",
  // 24px
  "3xl": "1.875rem",
  // 30px
  "4xl": "2.25rem",
  // 36px
  "5xl": "3rem",
  // 48px
  "6xl": "3.75rem",
  // 60px
  "7xl": "4.5rem",
  // 72px
  "8xl": "6rem",
  // 96px
  "9xl": "8rem"
  // 128px
};
var fontWeight = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800
};
var lineHeight = {
  none: 1,
  tight: 1.1,
  // Headings
  snug: 1.25,
  normal: 1.5,
  relaxed: 1.7,
  // Body text default
  loose: 1.75,
  extra: 2
};
var letterSpacing = {
  tighter: "-0.05em",
  tight: "-0.02em",
  // Headings default
  normal: "0",
  wide: "0.025em",
  wider: "0.05em",
  widest: "0.1em"
};
var headingScale = {
  h1: {
    fontSize: fontSize["7xl"],
    // 72px mobile, 96-128px desktop
    fontWeight: fontWeight.extrabold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
    fontFamily: fontFamily.display
  },
  h2: {
    fontSize: fontSize["5xl"],
    // 48px mobile, 60-72px desktop
    fontWeight: fontWeight.extrabold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
    fontFamily: fontFamily.display
  },
  h3: {
    fontSize: fontSize["4xl"],
    // 36px mobile, 48px desktop
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
    fontFamily: fontFamily.display
  },
  h4: {
    fontSize: fontSize["3xl"],
    // 30px mobile, 36px desktop
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
    fontFamily: fontFamily.display
  },
  h5: {
    fontSize: fontSize["2xl"],
    // 24px mobile, 30px desktop
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.tight,
    fontFamily: fontFamily.display
  },
  h6: {
    fontSize: fontSize.xl,
    // 20px mobile, 24px desktop
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.tight,
    fontFamily: fontFamily.display
  }
};
var bodyScale = {
  large: {
    fontSize: fontSize.lg,
    // 18px - Default body text
    lineHeight: lineHeight.relaxed,
    // 1.7
    fontFamily: fontFamily.sans
  },
  base: {
    fontSize: fontSize.base,
    // 16px
    lineHeight: lineHeight.normal,
    // 1.5
    fontFamily: fontFamily.sans
  },
  small: {
    fontSize: fontSize.sm,
    // 14px
    lineHeight: lineHeight.normal,
    fontFamily: fontFamily.sans
  }
};
var typography = {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  headingScale,
  bodyScale
};

// src/tokens/effects.ts
var boxShadow = {
  none: "none",
  sm: "0 1px 3px rgba(0, 0, 0, 0.3)",
  DEFAULT: "0 4px 12px rgba(0, 0, 0, 0.3)",
  md: "0 4px 12px rgba(0, 0, 0, 0.3)",
  lg: "0 8px 24px rgba(0, 0, 0, 0.4)",
  xl: "0 12px 32px rgba(0, 0, 0, 0.5)",
  "2xl": "0 20px 48px rgba(0, 0, 0, 0.6)",
  inner: "inset 0 2px 4px rgba(0, 0, 0, 0.3)"
};
var elevation = {
  0: boxShadow.none,
  1: boxShadow.sm,
  2: boxShadow.md,
  3: boxShadow.lg,
  4: boxShadow.xl,
  5: boxShadow["2xl"]
};
var boxShadowLight = {
  none: "none",
  sm: "0 1px 3px rgba(0, 0, 0, 0.1)",
  DEFAULT: "0 4px 12px rgba(0, 0, 0, 0.08)",
  md: "0 4px 12px rgba(0, 0, 0, 0.08)",
  lg: "0 8px 24px rgba(0, 0, 0, 0.12)",
  xl: "0 12px 32px rgba(0, 0, 0, 0.15)",
  "2xl": "0 20px 48px rgba(0, 0, 0, 0.18)",
  inner: "inset 0 2px 4px rgba(0, 0, 0, 0.06)"
};
var elevationLight = {
  0: boxShadowLight.none,
  1: boxShadowLight.sm,
  2: boxShadowLight.md,
  3: boxShadowLight.lg,
  4: boxShadowLight.xl,
  5: boxShadowLight["2xl"]
};
var animationDuration = {
  instant: "0ms",
  quick: "150ms",
  normal: "300ms",
  slow: "500ms",
  slower: "700ms"
};
var animationEasing = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out"
};
var effects = {
  boxShadow,
  boxShadowLight,
  elevation,
  elevationLight,
  animationDuration,
  animationEasing
};
var Button = ({
  variant = "primary",
  size = "md",
  children,
  onClick,
  disabled = false,
  fullWidth = false,
  className = "",
  type = "button"
}) => {
  const baseStyles = {
    fontFamily: typography.fontFamily.sans,
    fontWeight: typography.fontWeight.bold,
    borderRadius: borderRadius.md,
    transition: "all 0.3s ease",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    width: fullWidth ? "100%" : "auto"
  };
  const sizeStyles = {
    sm: {
      padding: `${spacing.component.sm} ${spacing.component.lg}`,
      fontSize: typography.fontSize.base
    },
    md: {
      padding: `${spacing.component.DEFAULT} ${spacing.component.xl}`,
      fontSize: typography.fontSize.lg
    },
    lg: {
      padding: `${spacing.component.lg} ${spacing.component.xl}`,
      fontSize: typography.fontSize.xl
    }
  };
  const variantStyles2 = {
    primary: {
      background: colors.dark.accent.primary,
      color: colors.dark.primary.bg
    },
    secondary: {
      background: "transparent",
      color: colors.dark.accent.primary,
      border: `2px solid ${colors.dark.accent.primary}`
    },
    outline: {
      background: "transparent",
      color: colors.dark.text.primary,
      border: `2px solid ${colors.dark.surface.light}`
    },
    ghost: {
      background: "transparent",
      color: colors.dark.accent.primary
    }
  };
  const handleHover = (e) => {
    if (disabled) return;
    const styles = {
      primary: {
        background: colors.dark.accent.hover,
        transform: "scale(1.02)"
      },
      secondary: {
        background: colors.dark.accent.primary,
        color: colors.dark.primary.bg,
        transform: "scale(1.02)"
      },
      outline: {
        background: colors.dark.surface.DEFAULT,
        borderColor: colors.dark.accent.primary
      },
      ghost: {
        background: colors.dark.surface.DEFAULT
      }
    };
    Object.assign(e.currentTarget.style, styles[variant]);
  };
  const handleLeave = (e) => {
    if (disabled) return;
    Object.assign(e.currentTarget.style, variantStyles2[variant]);
    e.currentTarget.style.transform = "scale(1)";
  };
  return /* @__PURE__ */ jsxRuntime.jsx(
    "button",
    {
      type,
      onClick: disabled ? void 0 : onClick,
      onMouseEnter: handleHover,
      onMouseLeave: handleLeave,
      disabled,
      className,
      style: __spreadValues(__spreadValues(__spreadValues({}, baseStyles), sizeStyles[size]), variantStyles2[variant]),
      children
    }
  );
};
var Card = ({
  children,
  variant = "default",
  padding = "md",
  hoverable = true,
  onClick,
  className = "",
  fullWidth = false
}) => {
  const [isHovered, setIsHovered] = React8__default.default.useState(false);
  const baseStyles = {
    borderRadius: borderRadius.lg,
    transition: "all 0.3s ease",
    width: fullWidth ? "100%" : "auto",
    cursor: onClick ? "pointer" : "default"
  };
  const paddingStyles = {
    none: { padding: "0" },
    sm: { padding: spacing.component.DEFAULT },
    md: { padding: spacing.component.lg },
    lg: { padding: spacing.component.xl },
    xl: { padding: `${spacing.component.xl} ${spacing.container.sm}` }
  };
  const variantStyles2 = {
    default: {
      background: colors.dark.secondary.bg,
      border: `1px solid ${colors.dark.surface.DEFAULT}`
    },
    elevated: {
      background: colors.dark.secondary.bg,
      border: `1px solid ${colors.dark.surface.DEFAULT}`,
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
    },
    outlined: {
      background: "transparent",
      border: `2px solid ${colors.dark.surface.light}`
    },
    flat: {
      background: colors.dark.tertiary.bg,
      border: "none"
    }
  };
  const hoverStyles = hoverable && isHovered ? {
    borderColor: colors.dark.accent.primary,
    transform: "translateY(-2px)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)"
  } : {};
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      className,
      onClick,
      onMouseEnter: () => hoverable && setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      style: __spreadValues(__spreadValues(__spreadValues(__spreadValues({}, baseStyles), variantStyles2[variant]), paddingStyles[padding]), hoverStyles),
      children
    }
  );
};
var Badge = ({
  children,
  variant = "primary",
  size = "md",
  style = "filled",
  rounded = "md",
  className = "",
  onClick
}) => {
  const baseStyles = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: typography.fontFamily.sans,
    fontWeight: typography.fontWeight.semibold,
    transition: "all 0.2s ease",
    cursor: onClick ? "pointer" : "default",
    whiteSpace: "nowrap"
  };
  const sizeStyles = {
    sm: {
      padding: `${spacing.component.xxs} ${spacing.component.sm}`,
      fontSize: typography.fontSize.xs,
      height: "1.25rem"
    },
    md: {
      padding: `${spacing.component.xs} ${spacing.component.DEFAULT}`,
      fontSize: typography.fontSize.sm,
      height: "1.5rem"
    },
    lg: {
      padding: `${spacing.component.sm} ${spacing.component.lg}`,
      fontSize: typography.fontSize.base,
      height: "2rem"
    }
  };
  const roundedStyles = {
    sm: { borderRadius: borderRadius.sm },
    md: { borderRadius: borderRadius.md },
    full: { borderRadius: borderRadius.full }
  };
  const variantColors = {
    primary: {
      filled: {
        background: colors.dark.accent.primary,
        color: colors.dark.primary.bg
      },
      outlined: {
        background: "transparent",
        color: colors.dark.accent.primary,
        border: `1px solid ${colors.dark.accent.primary}`
      },
      subtle: {
        background: `${colors.dark.accent.primary}20`,
        color: colors.dark.accent.primary
      }
    },
    secondary: {
      filled: {
        background: colors.dark.accent.secondary,
        color: colors.dark.primary.bg
      },
      outlined: {
        background: "transparent",
        color: colors.dark.accent.secondary,
        border: `1px solid ${colors.dark.accent.secondary}`
      },
      subtle: {
        background: `${colors.dark.accent.secondary}20`,
        color: colors.dark.accent.secondary
      }
    },
    success: {
      filled: {
        background: "#10b981",
        color: "#ffffff"
      },
      outlined: {
        background: "transparent",
        color: "#10b981",
        border: "1px solid #10b981"
      },
      subtle: {
        background: "#10b98120",
        color: "#10b981"
      }
    },
    warning: {
      filled: {
        background: "#f59e0b",
        color: "#ffffff"
      },
      outlined: {
        background: "transparent",
        color: "#f59e0b",
        border: "1px solid #f59e0b"
      },
      subtle: {
        background: "#f59e0b20",
        color: "#f59e0b"
      }
    },
    error: {
      filled: {
        background: "#ef4444",
        color: "#ffffff"
      },
      outlined: {
        background: "transparent",
        color: "#ef4444",
        border: "1px solid #ef4444"
      },
      subtle: {
        background: "#ef444420",
        color: "#ef4444"
      }
    },
    info: {
      filled: {
        background: "#3b82f6",
        color: "#ffffff"
      },
      outlined: {
        background: "transparent",
        color: "#3b82f6",
        border: "1px solid #3b82f6"
      },
      subtle: {
        background: "#3b82f620",
        color: "#3b82f6"
      }
    }
  };
  const handleHover = (e) => {
    if (!onClick) return;
    e.currentTarget.style.transform = "scale(1.05)";
    e.currentTarget.style.opacity = "0.9";
  };
  const handleLeave = (e) => {
    if (!onClick) return;
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.opacity = "1";
  };
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      className,
      onClick,
      onMouseEnter: handleHover,
      onMouseLeave: handleLeave,
      style: __spreadValues(__spreadValues(__spreadValues(__spreadValues({}, baseStyles), sizeStyles[size]), roundedStyles[rounded]), variantColors[variant][style]),
      children
    }
  );
};
var MouseEnterContext = React8.createContext(void 0);
var CardContainer = ({
  children,
  className,
  containerClassName
}) => {
  const containerRef = React8.useRef(null);
  const [isMouseEntered, setIsMouseEntered] = React8.useState(false);
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
  };
  const handleMouseEnter = () => {
    setIsMouseEntered(true);
    if (!containerRef.current) return;
  };
  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    setIsMouseEntered(false);
    containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
  };
  return /* @__PURE__ */ jsxRuntime.jsx(MouseEnterContext.Provider, { value: [isMouseEntered, setIsMouseEntered], children: /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      className: `flex items-center justify-center ${containerClassName}`,
      style: {
        perspective: "1000px"
      },
      children: /* @__PURE__ */ jsxRuntime.jsx(
        "div",
        {
          ref: containerRef,
          onMouseEnter: handleMouseEnter,
          onMouseMove: handleMouseMove,
          onMouseLeave: handleMouseLeave,
          className: `flex items-center justify-center relative transition-all duration-200 ease-linear ${className}`,
          style: {
            transformStyle: "preserve-3d"
          },
          children
        }
      )
    }
  ) });
};
var CardBody = ({
  children,
  className
}) => {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      className: `h-96 w-96 [transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d] ${className}`,
      children
    }
  );
};
var CardItem = (_a) => {
  var _b = _a, {
    as: Tag = "div",
    children,
    className,
    translateX = 0,
    translateY = 0,
    translateZ = 0,
    rotateX = 0,
    rotateY = 0,
    rotateZ = 0
  } = _b, rest = __objRest(_b, [
    "as",
    "children",
    "className",
    "translateX",
    "translateY",
    "translateZ",
    "rotateX",
    "rotateY",
    "rotateZ"
  ]);
  const ref = React8.useRef(null);
  const [isMouseEntered] = useMouseEnter();
  const handleAnimations = () => {
    if (!ref.current) return;
    if (isMouseEntered) {
      ref.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
    } else {
      ref.current.style.transform = `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
    }
  };
  React8.useEffect(() => {
    handleAnimations();
  }, [isMouseEntered, translateX, translateY, translateZ, rotateX, rotateY, rotateZ]);
  return /* @__PURE__ */ jsxRuntime.jsx(
    Tag,
    __spreadProps(__spreadValues({
      ref,
      className: `w-fit transition duration-200 ease-linear ${className}`
    }, rest), {
      children
    })
  );
};
var useMouseEnter = () => {
  const context = React8.useContext(MouseEnterContext);
  if (context === void 0) {
    throw new Error("useMouseEnter must be used within a MouseEnterProvider");
  }
  return context;
};
CardContainer.displayName = "CardContainer";
CardBody.displayName = "CardBody";
CardItem.displayName = "CardItem";
function cn(...inputs) {
  return tailwindMerge.twMerge(clsx.clsx(inputs));
}
var LayoutTextFlip = ({
  text = "Build Amazing",
  words = ["Landing Pages", "Component Blocks", "Page Sections", "3D Shaders"],
  duration = 3e3,
  className
}) => {
  const [currentIndex, setCurrentIndex] = React8.useState(0);
  React8.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);
    return () => clearInterval(interval);
  }, [duration, words.length]);
  return /* @__PURE__ */ jsxRuntime.jsxs("span", { className: cn("inline-flex flex-wrap items-center gap-2", className), children: [
    /* @__PURE__ */ jsxRuntime.jsx(framerMotion.motion.span, { layoutId: "subtext", className: "inline-block", children: text }),
    /* @__PURE__ */ jsxRuntime.jsx(
      framerMotion.motion.span,
      {
        layout: true,
        className: "relative inline-block overflow-hidden rounded-lg border border-primary/20 bg-primary/10 px-3 py-1 backdrop-blur-sm",
        children: /* @__PURE__ */ jsxRuntime.jsx(framerMotion.AnimatePresence, { mode: "popLayout", children: /* @__PURE__ */ jsxRuntime.jsx(
          framerMotion.motion.span,
          {
            initial: { y: -40, filter: "blur(10px)", opacity: 0 },
            animate: {
              y: 0,
              filter: "blur(0px)",
              opacity: 1
            },
            exit: { y: 50, filter: "blur(10px)", opacity: 0 },
            transition: {
              duration: 0.5,
              ease: "easeInOut"
            },
            className: cn(
              "inline-block whitespace-nowrap font-semibold text-primary"
            ),
            children: words[currentIndex]
          },
          currentIndex
        ) })
      }
    )
  ] });
};
LayoutTextFlip.displayName = "LayoutTextFlip";
var Input = React8.forwardRef(
  (_a, ref) => {
    var _b = _a, {
      label,
      error,
      helperText,
      size = "md",
      variant = "default",
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      disabled,
      required,
      id
    } = _b, props = __objRest(_b, [
      "label",
      "error",
      "helperText",
      "size",
      "variant",
      "leftIcon",
      "rightIcon",
      "fullWidth",
      "className",
      "disabled",
      "required",
      "id"
    ]);
    const [isFocused, setIsFocused] = React8.useState(false);
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const sizeClasses3 = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-5 py-3 text-lg"
    };
    const variantClasses3 = {
      default: "bg-transparent border-2 border-surface focus:border-accent-primary",
      filled: "bg-surface border-2 border-surface focus:border-accent-primary",
      outlined: "bg-transparent border-2 border-text-muted focus:border-accent-primary"
    };
    const inputClasses = cn(
      // Base styles
      "w-full rounded-lg font-medium transition-all duration-200",
      "text-text-primary placeholder:text-text-muted",
      "focus:outline-none focus:ring-2 focus:ring-accent-primary/20",
      // Size
      sizeClasses3[size],
      // Variant
      variantClasses3[variant],
      // With icons
      leftIcon && "pl-10",
      rightIcon && "pr-10",
      // States
      error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
      disabled && "opacity-50 cursor-not-allowed bg-surface-light",
      className
    );
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: cn("flex flex-col gap-1.5", fullWidth && "w-full"), children: [
      label && /* @__PURE__ */ jsxRuntime.jsxs(
        "label",
        {
          htmlFor: inputId,
          className: "text-sm font-semibold text-text-secondary",
          children: [
            label,
            required && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-red-500 ml-1", children: "*" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "relative", children: [
        leftIcon && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-text-muted", children: leftIcon }),
        /* @__PURE__ */ jsxRuntime.jsx(
          "input",
          __spreadValues({
            ref,
            id: inputId,
            className: inputClasses,
            disabled,
            required,
            onFocus: () => setIsFocused(true),
            onBlur: () => setIsFocused(false),
            "aria-invalid": error ? "true" : "false",
            "aria-describedby": error ? `${inputId}-error` : helperText ? `${inputId}-helper` : void 0
          }, props)
        ),
        rightIcon && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-text-muted", children: rightIcon })
      ] }),
      error && /* @__PURE__ */ jsxRuntime.jsx(
        "p",
        {
          id: `${inputId}-error`,
          className: "text-sm font-medium text-red-500",
          children: error
        }
      ),
      helperText && !error && /* @__PURE__ */ jsxRuntime.jsx(
        "p",
        {
          id: `${inputId}-helper`,
          className: "text-sm text-text-muted",
          children: helperText
        }
      )
    ] });
  }
);
Input.displayName = "Input";
var TextArea = React8.forwardRef(
  (_a, ref) => {
    var _b = _a, {
      label,
      error,
      helperText,
      variant = "default",
      showCount = false,
      fullWidth = false,
      resize = "vertical",
      className,
      disabled,
      required,
      id,
      maxLength,
      value
    } = _b, props = __objRest(_b, [
      "label",
      "error",
      "helperText",
      "variant",
      "showCount",
      "fullWidth",
      "resize",
      "className",
      "disabled",
      "required",
      "id",
      "maxLength",
      "value"
    ]);
    const [isFocused, setIsFocused] = React8.useState(false);
    const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const currentLength = typeof value === "string" ? value.length : 0;
    const variantClasses3 = {
      default: "bg-transparent border-2 border-surface focus:border-accent-primary",
      filled: "bg-surface border-2 border-surface focus:border-accent-primary",
      outlined: "bg-transparent border-2 border-text-muted focus:border-accent-primary"
    };
    const resizeClasses = {
      none: "resize-none",
      vertical: "resize-y",
      horizontal: "resize-x",
      both: "resize"
    };
    const textareaClasses = cn(
      // Base styles
      "w-full rounded-lg px-4 py-3 text-base font-medium transition-all duration-200",
      "text-text-primary placeholder:text-text-muted",
      "focus:outline-none focus:ring-2 focus:ring-accent-primary/20",
      "min-h-[100px]",
      // Variant
      variantClasses3[variant],
      // Resize
      resizeClasses[resize],
      // States
      error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
      disabled && "opacity-50 cursor-not-allowed bg-surface-light",
      className
    );
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: cn("flex flex-col gap-1.5", fullWidth && "w-full"), children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
        label && /* @__PURE__ */ jsxRuntime.jsxs(
          "label",
          {
            htmlFor: inputId,
            className: "text-sm font-semibold text-text-secondary",
            children: [
              label,
              required && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-red-500 ml-1", children: "*" })
            ]
          }
        ),
        showCount && maxLength && /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "text-xs text-text-muted font-medium", children: [
          currentLength,
          " / ",
          maxLength
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx(
        "textarea",
        __spreadValues({
          ref,
          id: inputId,
          className: textareaClasses,
          disabled,
          required,
          maxLength,
          value,
          onFocus: () => setIsFocused(true),
          onBlur: () => setIsFocused(false),
          "aria-invalid": error ? "true" : "false",
          "aria-describedby": error ? `${inputId}-error` : helperText ? `${inputId}-helper` : void 0
        }, props)
      ),
      error && /* @__PURE__ */ jsxRuntime.jsx(
        "p",
        {
          id: `${inputId}-error`,
          className: "text-sm font-medium text-red-500",
          children: error
        }
      ),
      helperText && !error && /* @__PURE__ */ jsxRuntime.jsx(
        "p",
        {
          id: `${inputId}-helper`,
          className: "text-sm text-text-muted",
          children: helperText
        }
      )
    ] });
  }
);
TextArea.displayName = "TextArea";
var Select = React8.forwardRef(
  (_a, ref) => {
    var _b = _a, {
      label,
      error,
      helperText,
      size = "md",
      variant = "default",
      options,
      placeholder,
      fullWidth = false,
      className,
      disabled,
      required,
      id
    } = _b, props = __objRest(_b, [
      "label",
      "error",
      "helperText",
      "size",
      "variant",
      "options",
      "placeholder",
      "fullWidth",
      "className",
      "disabled",
      "required",
      "id"
    ]);
    const inputId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const sizeClasses3 = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-5 py-3 text-lg"
    };
    const variantClasses3 = {
      default: "bg-transparent border-2 border-surface focus:border-accent-primary",
      filled: "bg-surface border-2 border-surface focus:border-accent-primary",
      outlined: "bg-transparent border-2 border-text-muted focus:border-accent-primary"
    };
    const selectClasses = cn(
      // Base styles
      "w-full rounded-lg font-medium transition-all duration-200 appearance-none",
      "text-text-primary",
      "focus:outline-none focus:ring-2 focus:ring-accent-primary/20",
      "pr-10",
      // Space for chevron icon
      // Size
      sizeClasses3[size],
      // Variant
      variantClasses3[variant],
      // States
      error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
      disabled && "opacity-50 cursor-not-allowed bg-surface-light",
      className
    );
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: cn("flex flex-col gap-1.5", fullWidth && "w-full"), children: [
      label && /* @__PURE__ */ jsxRuntime.jsxs(
        "label",
        {
          htmlFor: inputId,
          className: "text-sm font-semibold text-text-secondary",
          children: [
            label,
            required && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-red-500 ml-1", children: "*" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntime.jsxs(
          "select",
          __spreadProps(__spreadValues({
            ref,
            id: inputId,
            className: selectClasses,
            disabled,
            required,
            "aria-invalid": error ? "true" : "false",
            "aria-describedby": error ? `${inputId}-error` : helperText ? `${inputId}-helper` : void 0
          }, props), {
            children: [
              placeholder && /* @__PURE__ */ jsxRuntime.jsx("option", { value: "", disabled: true, children: placeholder }),
              options.map((option) => /* @__PURE__ */ jsxRuntime.jsx(
                "option",
                {
                  value: option.value,
                  disabled: option.disabled,
                  children: option.label
                },
                option.value
              ))
            ]
          })
        ),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted", children: /* @__PURE__ */ jsxRuntime.jsx(
          "svg",
          {
            className: "w-5 h-5",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            children: /* @__PURE__ */ jsxRuntime.jsx(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M19 9l-7 7-7-7"
              }
            )
          }
        ) })
      ] }),
      error && /* @__PURE__ */ jsxRuntime.jsx(
        "p",
        {
          id: `${inputId}-error`,
          className: "text-sm font-medium text-red-500",
          children: error
        }
      ),
      helperText && !error && /* @__PURE__ */ jsxRuntime.jsx(
        "p",
        {
          id: `${inputId}-helper`,
          className: "text-sm text-text-muted",
          children: helperText
        }
      )
    ] });
  }
);
Select.displayName = "Select";
var Checkbox = React8.forwardRef(
  (_a, ref) => {
    var _b = _a, {
      label,
      description,
      error,
      size = "md",
      indeterminate = false,
      className,
      disabled,
      id
    } = _b, props = __objRest(_b, [
      "label",
      "description",
      "error",
      "size",
      "indeterminate",
      "className",
      "disabled",
      "id"
    ]);
    const inputId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    const sizeClasses3 = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6"
    };
    const checkboxClasses = cn(
      // Base styles
      "rounded border-2 transition-all duration-200",
      "focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:ring-offset-2",
      "cursor-pointer",
      // Size
      sizeClasses3[size],
      // States
      "border-surface hover:border-accent-primary",
      "checked:bg-accent-primary checked:border-accent-primary",
      "indeterminate:bg-accent-primary indeterminate:border-accent-primary",
      error && "border-red-500 checked:bg-red-500 checked:border-red-500",
      disabled && "opacity-50 cursor-not-allowed",
      className
    );
    React8__default.default.useEffect(() => {
      if (ref && "current" in ref && ref.current) {
        ref.current.indeterminate = indeterminate;
      }
    }, [indeterminate, ref]);
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "input",
          __spreadValues({
            ref,
            type: "checkbox",
            id: inputId,
            className: checkboxClasses,
            disabled,
            "aria-invalid": error ? "true" : "false",
            "aria-describedby": error ? `${inputId}-error` : void 0
          }, props)
        ),
        (label || description) && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col gap-1", children: [
          label && /* @__PURE__ */ jsxRuntime.jsx(
            "label",
            {
              htmlFor: inputId,
              className: cn(
                "font-semibold text-text-primary cursor-pointer select-none",
                disabled && "opacity-50 cursor-not-allowed",
                size === "sm" && "text-sm",
                size === "md" && "text-base",
                size === "lg" && "text-lg"
              ),
              children: label
            }
          ),
          description && /* @__PURE__ */ jsxRuntime.jsx(
            "p",
            {
              className: cn(
                "text-text-muted",
                disabled && "opacity-50",
                size === "sm" && "text-xs",
                size === "md" && "text-sm",
                size === "lg" && "text-base"
              ),
              children: description
            }
          )
        ] })
      ] }),
      error && /* @__PURE__ */ jsxRuntime.jsx(
        "p",
        {
          id: `${inputId}-error`,
          className: "text-sm font-medium text-red-500 ml-8",
          children: error
        }
      )
    ] });
  }
);
Checkbox.displayName = "Checkbox";
var Radio = React8.forwardRef(
  (_a, ref) => {
    var _b = _a, {
      label,
      description,
      error,
      size = "md",
      className,
      disabled,
      id
    } = _b, props = __objRest(_b, [
      "label",
      "description",
      "error",
      "size",
      "className",
      "disabled",
      "id"
    ]);
    const inputId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;
    const sizeClasses3 = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6"
    };
    const radioClasses = cn(
      // Base styles
      "rounded-full border-2 transition-all duration-200",
      "focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:ring-offset-2",
      "cursor-pointer",
      // Size
      sizeClasses3[size],
      // States
      "border-surface hover:border-accent-primary",
      "checked:bg-accent-primary checked:border-accent-primary",
      error && "border-red-500 checked:bg-red-500 checked:border-red-500",
      disabled && "opacity-50 cursor-not-allowed",
      className
    );
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "input",
          __spreadValues({
            ref,
            type: "radio",
            id: inputId,
            className: radioClasses,
            disabled,
            "aria-invalid": error ? "true" : "false",
            "aria-describedby": error ? `${inputId}-error` : void 0
          }, props)
        ),
        (label || description) && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col gap-1", children: [
          label && /* @__PURE__ */ jsxRuntime.jsx(
            "label",
            {
              htmlFor: inputId,
              className: cn(
                "font-semibold text-text-primary cursor-pointer select-none",
                disabled && "opacity-50 cursor-not-allowed",
                size === "sm" && "text-sm",
                size === "md" && "text-base",
                size === "lg" && "text-lg"
              ),
              children: label
            }
          ),
          description && /* @__PURE__ */ jsxRuntime.jsx(
            "p",
            {
              className: cn(
                "text-text-muted",
                disabled && "opacity-50",
                size === "sm" && "text-xs",
                size === "md" && "text-sm",
                size === "lg" && "text-base"
              ),
              children: description
            }
          )
        ] })
      ] }),
      error && /* @__PURE__ */ jsxRuntime.jsx(
        "p",
        {
          id: `${inputId}-error`,
          className: "text-sm font-medium text-red-500 ml-8",
          children: error
        }
      )
    ] });
  }
);
Radio.displayName = "Radio";
var RadioGroup = ({
  label,
  name,
  options,
  value,
  onChange,
  error,
  size = "md",
  orientation = "vertical"
}) => {
  const groupId = `radio-group-${Math.random().toString(36).substr(2, 9)}`;
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col gap-3", children: [
    label && /* @__PURE__ */ jsxRuntime.jsx("legend", { className: "text-sm font-semibold text-text-secondary", children: label }),
    /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        role: "radiogroup",
        "aria-labelledby": label ? groupId : void 0,
        className: cn(
          "flex gap-4",
          orientation === "vertical" ? "flex-col" : "flex-row flex-wrap"
        ),
        children: options.map((option) => /* @__PURE__ */ jsxRuntime.jsx(
          Radio,
          {
            name,
            value: option.value,
            label: option.label,
            description: option.description,
            disabled: option.disabled,
            checked: value === option.value,
            onChange: (e) => {
              if (onChange && e.target.checked) {
                onChange(option.value);
              }
            },
            size
          },
          option.value
        ))
      }
    ),
    error && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm font-medium text-red-500", children: error })
  ] });
};
RadioGroup.displayName = "RadioGroup";
var variantStyles = {
  default: {
    bg: "bg-surface border-surface-light",
    icon: "\u{1F4CB}"
  },
  success: {
    bg: "bg-green-500/10 border-green-500/30",
    icon: "\u2705"
  },
  error: {
    bg: "bg-red-500/10 border-red-500/30",
    icon: "\u274C"
  },
  warning: {
    bg: "bg-yellow-500/10 border-yellow-500/30",
    icon: "\u26A0\uFE0F"
  },
  info: {
    bg: "bg-blue-500/10 border-blue-500/30",
    icon: "\u2139\uFE0F"
  }
};
var Toast = ({
  id,
  title,
  description,
  variant = "default",
  icon,
  action,
  onClose
}) => {
  const style = variantStyles[variant];
  return /* @__PURE__ */ jsxRuntime.jsxs(
    framerMotion.motion.div,
    {
      initial: { opacity: 0, y: -20, scale: 0.95 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -20, scale: 0.95 },
      className: cn(
        "relative flex items-start gap-3 p-4 rounded-xl border-2",
        "shadow-lg backdrop-blur-sm",
        "max-w-md w-full",
        style.bg
      ),
      children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex-shrink-0 text-2xl", children: icon || style.icon }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "font-bold text-text-primary mb-1", children: title }),
          description && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-sm text-text-secondary", children: description }),
          action && /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              onClick: action.onClick,
              className: "mt-2 text-sm font-semibold text-accent-primary hover:text-accent-hover transition-colors",
              children: action.label
            }
          )
        ] }),
        onClose && /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            onClick: onClose,
            className: "flex-shrink-0 text-text-muted hover:text-text-primary transition-colors p-1",
            "aria-label": "Close",
            children: /* @__PURE__ */ jsxRuntime.jsx(
              "svg",
              {
                className: "w-4 h-4",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ jsxRuntime.jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M6 18L18 6M6 6l12 12"
                  }
                )
              }
            )
          }
        )
      ]
    },
    id
  );
};
Toast.displayName = "Toast";
var positionClasses = {
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2"
};
var ToastContainer = ({
  toasts,
  position = "top-right"
}) => {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      className: cn(
        "fixed z-50 flex flex-col gap-3",
        positionClasses[position]
      ),
      children: /* @__PURE__ */ jsxRuntime.jsx(framerMotion.AnimatePresence, { mode: "popLayout", children: toasts.map((toast) => /* @__PURE__ */ jsxRuntime.jsx(Toast, __spreadValues({}, toast), toast.id)) })
    }
  );
};
ToastContainer.displayName = "ToastContainer";
var toastCount = 0;
var listeners = [];
var useToast = () => {
  const [toasts, setToasts] = React8__default.default.useState([]);
  React8__default.default.useEffect(() => {
    const addToast = (toast2) => {
      setToasts((prev) => [...prev, toast2]);
      if (toast2.duration && toast2.duration > 0) {
        setTimeout(() => {
          removeToast(toast2.id);
        }, toast2.duration);
      }
    };
    listeners.push(addToast);
    return () => {
      const index = listeners.indexOf(addToast);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };
  const toast = (props) => {
    const id = `toast-${++toastCount}`;
    const toastProps = __spreadProps(__spreadValues({
      id,
      duration: 5e3
    }, props), {
      onClose: () => {
        var _a;
        removeToast(id);
        (_a = props.onClose) == null ? void 0 : _a.call(props);
      }
    });
    listeners.forEach((listener) => listener(toastProps));
  };
  return {
    toasts,
    toast,
    success: (title, description) => toast({ title, description, variant: "success" }),
    error: (title, description) => toast({ title, description, variant: "error" }),
    warning: (title, description) => toast({ title, description, variant: "warning" }),
    info: (title, description) => toast({ title, description, variant: "info" })
  };
};
var sizeClasses = {
  xs: "w-3 h-3 border-2",
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-3",
  xl: "w-12 h-12 border-4"
};
var variantClasses = {
  primary: "border-accent-primary border-t-transparent",
  secondary: "border-accent-secondary border-t-transparent",
  white: "border-white border-t-transparent",
  current: "border-current border-t-transparent"
};
var Spinner = ({
  size = "md",
  variant = "primary",
  label = "Loading...",
  className
}) => {
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      role: "status",
      className: cn("inline-block", className),
      "aria-label": label,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "div",
          {
            className: cn(
              "animate-spin rounded-full",
              sizeClasses[size],
              variantClasses[variant]
            )
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "sr-only", children: label })
      ]
    }
  );
};
Spinner.displayName = "Spinner";
var LoadingOverlay = ({
  visible,
  message,
  size = "lg",
  blur = true
}) => {
  if (!visible) return null;
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      className: cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-primary-bg/80",
        blur && "backdrop-blur-sm"
      ),
      children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntime.jsx(Spinner, { size, variant: "primary" }),
        message && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-lg font-semibold text-text-primary", children: message })
      ] })
    }
  );
};
LoadingOverlay.displayName = "LoadingOverlay";
var radiusClasses = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full"
};
var Skeleton = ({
  width,
  height = "1rem",
  radius = "md",
  className
}) => {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      className: cn(
        "animate-pulse bg-surface",
        radiusClasses[radius],
        className
      ),
      style: {
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height
      }
    }
  );
};
Skeleton.displayName = "Skeleton";
var sizeClasses2 = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3"
};
var variantClasses2 = {
  primary: "bg-accent-primary",
  secondary: "bg-accent-secondary",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  error: "bg-red-500"
};
var Progress = ({
  value,
  max = 100,
  size = "md",
  variant = "primary",
  showLabel = false,
  labelPosition = "outside",
  labelFormatter,
  className
}) => {
  const percentage = Math.min(Math.max(value / max * 100, 0), 100);
  const label = labelFormatter ? labelFormatter(value, max) : `${Math.round(percentage)}%`;
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: cn("w-full", className), children: [
    showLabel && labelPosition === "outside" && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex items-center justify-between mb-2", children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm font-semibold text-text-secondary", children: label }) }),
    /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        className: cn(
          "w-full bg-surface rounded-full overflow-hidden relative",
          sizeClasses2[size]
        ),
        role: "progressbar",
        "aria-valuenow": value,
        "aria-valuemin": 0,
        "aria-valuemax": max,
        children: /* @__PURE__ */ jsxRuntime.jsx(
          "div",
          {
            className: cn(
              "h-full transition-all duration-300 ease-out rounded-full",
              variantClasses2[variant]
            ),
            style: { width: `${percentage}%` },
            children: showLabel && labelPosition === "inside" && size === "lg" && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-xs font-bold text-primary-bg px-2", children: label }) })
          }
        )
      }
    )
  ] });
};
Progress.displayName = "Progress";
var circularVariantClasses = {
  primary: "stroke-accent-primary",
  secondary: "stroke-accent-secondary",
  success: "stroke-green-500",
  warning: "stroke-yellow-500",
  error: "stroke-red-500"
};
var CircularProgress = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  variant = "primary",
  showLabel = true,
  labelFormatter,
  className
}) => {
  const percentage = Math.min(Math.max(value / max * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - percentage / 100 * circumference;
  const label = labelFormatter ? labelFormatter(value, max) : `${Math.round(percentage)}%`;
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      className: cn("relative inline-flex items-center justify-center", className),
      style: { width: size, height: size },
      children: [
        /* @__PURE__ */ jsxRuntime.jsxs(
          "svg",
          {
            className: "transform -rotate-90",
            width: size,
            height: size,
            children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                "circle",
                {
                  cx: size / 2,
                  cy: size / 2,
                  r: radius,
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth,
                  className: "text-surface"
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsx(
                "circle",
                {
                  cx: size / 2,
                  cy: size / 2,
                  r: radius,
                  fill: "none",
                  strokeWidth,
                  strokeDasharray: circumference,
                  strokeDashoffset: offset,
                  strokeLinecap: "round",
                  className: cn("transition-all duration-300", circularVariantClasses[variant])
                }
              )
            ]
          }
        ),
        showLabel && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-2xl font-bold text-text-primary", children: label }) })
      ]
    }
  );
};
CircularProgress.displayName = "CircularProgress";
var Tabs = ({
  items,
  defaultValue,
  value: controlledValue,
  onChange,
  variant = "default",
  size = "md",
  fullWidth = false,
  className
}) => {
  var _a;
  const [internalValue, setInternalValue] = React8.useState(
    defaultValue || ((_a = items[0]) == null ? void 0 : _a.value) || ""
  );
  const activeValue = controlledValue !== void 0 ? controlledValue : internalValue;
  const handleTabClick = (value) => {
    if (controlledValue === void 0) {
      setInternalValue(value);
    }
    onChange == null ? void 0 : onChange(value);
  };
  items.find((item) => item.value === activeValue);
  const sizeClasses3 = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
    lg: "text-lg px-5 py-3"
  };
  const variantStyles2 = {
    default: {
      list: "bg-surface p-1 rounded-lg",
      tab: "rounded-md transition-all duration-200",
      activeTab: "bg-accent-primary text-primary-bg",
      inactiveTab: "text-text-secondary hover:text-text-primary hover:bg-surface-light"
    },
    pills: {
      list: "gap-2",
      tab: "rounded-full border-2 border-surface transition-all duration-200",
      activeTab: "border-accent-primary bg-accent-primary text-primary-bg",
      inactiveTab: "text-text-secondary hover:text-text-primary hover:border-accent-primary/50"
    },
    underline: {
      list: "border-b-2 border-surface gap-4",
      tab: "relative pb-2 transition-all duration-200",
      activeTab: "text-accent-primary",
      inactiveTab: "text-text-secondary hover:text-text-primary"
    }
  };
  const style = variantStyles2[variant];
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: cn("w-full", className), children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        className: cn(
          "flex",
          style.list,
          fullWidth && "w-full"
        ),
        role: "tablist",
        children: items.map((item) => {
          const isActive = item.value === activeValue;
          return /* @__PURE__ */ jsxRuntime.jsxs(
            "button",
            {
              role: "tab",
              "aria-selected": isActive,
              "aria-controls": `tabpanel-${item.value}`,
              id: `tab-${item.value}`,
              disabled: item.disabled,
              onClick: () => handleTabClick(item.value),
              className: cn(
                "relative font-semibold transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-accent-primary/20",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                sizeClasses3[size],
                style.tab,
                isActive ? style.activeTab : style.inactiveTab,
                fullWidth && "flex-1"
              ),
              children: [
                /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex items-center justify-center gap-2", children: [
                  item.icon,
                  item.label
                ] }),
                variant === "underline" && isActive && /* @__PURE__ */ jsxRuntime.jsx(
                  framerMotion.motion.div,
                  {
                    className: "absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary",
                    layoutId: "underline",
                    transition: { type: "spring", stiffness: 300, damping: 30 }
                  }
                )
              ]
            },
            item.value
          );
        })
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "mt-4", children: items.map((item) => /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        id: `tabpanel-${item.value}`,
        role: "tabpanel",
        "aria-labelledby": `tab-${item.value}`,
        hidden: item.value !== activeValue,
        children: item.value === activeValue && item.content
      },
      item.value
    )) })
  ] });
};
Tabs.displayName = "Tabs";

exports.Badge = Badge;
exports.Button = Button;
exports.Card = Card;
exports.CardBody = CardBody;
exports.CardContainer = CardContainer;
exports.CardItem = CardItem;
exports.Checkbox = Checkbox;
exports.CircularProgress = CircularProgress;
exports.Input = Input;
exports.LayoutTextFlip = LayoutTextFlip;
exports.LoadingOverlay = LoadingOverlay;
exports.Progress = Progress;
exports.Radio = Radio;
exports.RadioGroup = RadioGroup;
exports.Select = Select;
exports.Skeleton = Skeleton;
exports.Spinner = Spinner;
exports.Tabs = Tabs;
exports.TextArea = TextArea;
exports.Toast = Toast;
exports.ToastContainer = ToastContainer;
exports.animationDuration = animationDuration;
exports.animationEasing = animationEasing;
exports.bodyScale = bodyScale;
exports.borderRadius = borderRadius;
exports.boxShadow = boxShadow;
exports.boxShadowLight = boxShadowLight;
exports.cn = cn;
exports.colors = colors;
exports.cssVariables = cssVariables;
exports.effects = effects;
exports.elevation = elevation;
exports.elevationLight = elevationLight;
exports.fontFamily = fontFamily;
exports.fontSize = fontSize;
exports.fontWeight = fontWeight;
exports.headingScale = headingScale;
exports.letterSpacing = letterSpacing;
exports.lineHeight = lineHeight;
exports.semanticColors = semanticColors;
exports.spacing = spacing;
exports.spacingVariables = spacingVariables;
exports.typography = typography;
exports.useMouseEnter = useMouseEnter;
exports.useToast = useToast;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map