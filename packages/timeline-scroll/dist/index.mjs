"use client";
import { useRef, useState, useEffect } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import { jsxs, jsx } from 'react/jsx-runtime';

var HorizontalTimelineCarousel = ({
  items,
  scrollHeight = 300,
  header,
  footer,
  startX = "1%",
  startXOffset = "0px",
  endX = "-95%",
  cardGap = 1,
  sidePadding = 4,
  showLine = false,
  lineColor = "rgba(139, 92, 246, 0.3)",
  showProgressBar = false,
  progressBarColor = "rgba(139, 92, 246, 0.8)",
  sectionClassName = "",
  containerClassName = "",
  cardsContainerClassName = ""
}) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef
  });
  const isCentered = startX === "center";
  const baseStartX = isCentered ? "calc(50vw - 287px)" : startX;
  const calculatedStartX = startXOffset !== "0px" ? `calc(${baseStartX} + ${startXOffset})` : baseStartX;
  const x = useTransform(scrollYProgress, [0, 1], [calculatedStartX, endX]);
  const [centeredIndex, setCenteredIndex] = useState(0);
  const cardRefs = useRef([]);
  useEffect(() => {
    const updateCenteredCard = () => {
      if (typeof window === "undefined") return;
      const viewportCenter = window.innerWidth / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distance = Math.abs(cardCenter - viewportCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      setCenteredIndex(closestIndex);
    };
    const unsubscribe = scrollYProgress.on("change", updateCenteredCard);
    updateCenteredCard();
    return unsubscribe;
  }, [scrollYProgress]);
  const gapPx = cardGap * 16;
  const paddingPx = sidePadding * 16;
  const calculatedScrollHeight = scrollHeight === "auto" ? 100 + (items.length - 1) * 20 : scrollHeight;
  const heightValue = typeof calculatedScrollHeight === "string" ? calculatedScrollHeight : `${calculatedScrollHeight}vh`;
  return /* @__PURE__ */ jsxs(
    "section",
    {
      ref: targetRef,
      className: `relative ${sectionClassName}`,
      style: { height: heightValue, position: "relative" },
      children: [
        showProgressBar && /* @__PURE__ */ jsx("div", { className: "sticky bottom-8 left-0 right-0 flex justify-center gap-2 z-50 pointer-events-none", children: items.map((item, index) => {
          const dotProgress = index / Math.max(items.length - 1, 1);
          const opacity = useTransform(
            scrollYProgress,
            [dotProgress - 0.05, dotProgress, dotProgress + 0.05],
            [0.2, 1, 0.2]
          );
          return /* @__PURE__ */ jsx(
            motion.div,
            {
              className: "w-2 h-2 rounded-full",
              style: {
                backgroundColor: progressBarColor,
                opacity
              }
            },
            item.id
          );
        }) }),
        /* @__PURE__ */ jsx("div", { className: `sticky top-0 overflow-hidden ${containerClassName}`, style: { height: "100vh" }, children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-between h-full", children: [
          header && /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-full pt-24 pb-4", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6", children: header }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 flex items-center justify-center relative overflow-hidden", children: [
            showLine && /* @__PURE__ */ jsx(
              "div",
              {
                className: "absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 pointer-events-none z-0",
                style: {
                  backgroundColor: lineColor
                }
              }
            ),
            /* @__PURE__ */ jsx(
              motion.div,
              {
                style: {
                  x,
                  gap: `${gapPx}px`,
                  paddingLeft: `${paddingPx}px`,
                  paddingRight: `${paddingPx}px`
                },
                className: `flex items-center relative z-10 ${cardsContainerClassName}`,
                children: items.map((item, index) => {
                  const isCentered2 = index === centeredIndex;
                  return /* @__PURE__ */ jsx(
                    motion.div,
                    {
                      ref: (el) => {
                        cardRefs.current[index] = el;
                      },
                      className: "relative z-20",
                      animate: {
                        scale: isCentered2 ? 1.05 : 1,
                        opacity: isCentered2 ? 1 : 0.75
                      },
                      transition: { duration: 0.3, ease: "easeOut" },
                      children: item.content
                    },
                    item.id
                  );
                })
              }
            )
          ] }),
          footer && /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-full pb-8 pointer-events-none", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6", children: footer }) })
        ] }) })
      ]
    }
  );
};
HorizontalTimelineCarousel.displayName = "HorizontalTimelineCarousel";
var TimelineCard = ({
  title,
  subtitle,
  period,
  location,
  description,
  tags = [],
  imageUrl,
  backgroundGradient,
  children,
  width = 450,
  height = 450,
  className = "",
  variant = "default",
  colorScheme = "blue"
}) => {
  const widthStyle = typeof width === "number" ? `${width}px` : width;
  const heightStyle = typeof height === "number" ? `${height}px` : height;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${className}`,
      style: { width: widthStyle, height: heightStyle },
      children: [
        period && /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx("span", { className: "inline-block px-3 py-1 text-xs font-bold text-white bg-gray-900 rounded-full uppercase tracking-wide", children: period }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-3xl font-bold mb-2 text-gray-900", children: title }),
        subtitle && /* @__PURE__ */ jsx("h4", { className: "text-xl font-semibold text-gray-700 mb-4", children: subtitle }),
        location && /* @__PURE__ */ jsxs("p", { className: "text-gray-500 text-sm mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [
            /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" }),
            /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z" })
          ] }),
          location
        ] }),
        description && /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-6 leading-relaxed", children: description }),
        tags.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: tags.map((tag, index) => /* @__PURE__ */ jsx(
          "span",
          {
            className: "px-4 py-2 text-sm font-semibold rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors",
            children: tag
          },
          index
        )) }),
        children
      ]
    }
  );
};
TimelineCard.displayName = "TimelineCard";
var ExperienceCard = ({
  title,
  company,
  period,
  location,
  description,
  achievements = [],
  technologies,
  companyLogo,
  color = "violet",
  width = 550,
  href,
  className = "",
  children,
  showViewDetails = true,
  viewDetailsText = "View Details"
}) => {
  const cardContent = /* @__PURE__ */ jsxs(
    "div",
    {
      className: `relative p-8 rounded-2xl bg-secondary-bg border border-surface hover:border-accent-primary transition-all duration-300 group hover:shadow-2xl hover:-translate-y-2 ${href ? "cursor-pointer" : ""} ${className} flex flex-col justify-between`,
      style: {
        width: `${width}px`,
        height: "600px",
        minHeight: "600px",
        maxHeight: "600px"
      },
      children: [
        companyLogo && /* @__PURE__ */ jsx("div", { className: "absolute top-6 right-6 w-16 h-16 rounded-xl bg-surface border-2 border-surface-light shadow-lg p-2 group-hover:scale-110 transition-transform duration-300 z-20 flex items-center justify-center", children: companyLogo.startsWith("/") ? /* @__PURE__ */ jsx(
          "img",
          {
            src: companyLogo,
            alt: `${company} logo`,
            className: "object-contain w-full h-full"
          }
        ) : /* @__PURE__ */ jsx("span", { className: "text-3xl", children: companyLogo }) }),
        children ? children : /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full", children: [
          /* @__PURE__ */ jsxs("div", { className: "pr-20 flex-shrink-0", style: { height: "140px" }, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
              /* @__PURE__ */ jsx(
                "svg",
                {
                  className: "w-5 h-5 text-accent-primary flex-shrink-0",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24",
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-accent-primary uppercase tracking-wide", children: period })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "text-2xl font-display font-bold mb-2 text-text-primary group-hover:text-accent-primary transition-colors leading-tight line-clamp-2", children: title }),
            /* @__PURE__ */ jsxs("h4", { className: "text-lg font-semibold text-text-secondary mb-1 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(
                "svg",
                {
                  className: "w-5 h-5",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24",
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "line-clamp-1", children: company })
            ] }),
            location && /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2 text-text-muted text-sm line-clamp-1", children: [
              /* @__PURE__ */ jsxs(
                "svg",
                {
                  className: "w-4 h-4",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24",
                  children: [
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      }
                    )
                  ]
                }
              ),
              location
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mb-3 flex-shrink-0 overflow-hidden", style: { height: "90px" }, children: /* @__PURE__ */ jsx("p", { className: "text-text-secondary leading-relaxed text-sm line-clamp-4", children: description }) }),
          /* @__PURE__ */ jsxs("div", { className: "mb-3 flex-shrink-0 overflow-hidden", style: { height: "110px" }, children: [
            /* @__PURE__ */ jsx("h5", { className: "text-xs font-bold text-text-primary mb-2 uppercase tracking-wide", children: "Key Achievements" }),
            achievements && achievements.length > 0 ? /* @__PURE__ */ jsx("ul", { className: "space-y-1.5", children: achievements.slice(0, 3).map((achievement, i) => /* @__PURE__ */ jsxs(
              "li",
              {
                className: "flex items-start gap-2 text-xs text-text-secondary line-clamp-1",
                children: [
                  /* @__PURE__ */ jsx("span", { className: "text-accent-primary mt-0.5 flex-shrink-0", children: "\u25B8" }),
                  /* @__PURE__ */ jsx("span", { className: "line-clamp-1", children: achievement })
                ]
              },
              i
            )) }) : /* @__PURE__ */ jsx("p", { className: "text-xs text-text-muted", children: "No achievements listed" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mb-3 flex-shrink-0 overflow-hidden", style: { height: "90px" }, children: [
            /* @__PURE__ */ jsx("h5", { className: "text-xs font-bold text-text-primary mb-2 uppercase tracking-wide", children: "Technologies" }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
              technologies.slice(0, 6).map((tech) => /* @__PURE__ */ jsx(
                "span",
                {
                  className: "px-3 py-1 text-xs font-semibold rounded-lg bg-surface text-text-secondary border-2 border-surface-light hover:border-accent-primary hover:text-accent-primary transition-all duration-300",
                  children: tech
                },
                tech
              )),
              technologies.length > 6 && /* @__PURE__ */ jsxs("span", { className: "px-3 py-1 text-xs font-semibold rounded-lg bg-surface text-text-secondary border-2 border-surface-light", children: [
                "+",
                technologies.length - 6,
                " more"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex-1" }),
          showViewDetails && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-accent-primary text-sm font-bold group-hover:gap-4 transition-all duration-300 pt-3 border-t border-surface-light flex-shrink-0 mt-auto", children: [
            /* @__PURE__ */ jsx("span", { children: viewDetailsText }),
            /* @__PURE__ */ jsx(
              "svg",
              {
                className: "w-5 h-5 group-hover:translate-x-2 transition-transform duration-300",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M14 5l7 7m0 0l-7 7m7-7H3"
                  }
                )
              }
            )
          ] })
        ] })
      ]
    }
  );
  if (href) {
    return /* @__PURE__ */ jsx("a", { href, children: cardContent });
  }
  return cardContent;
};
ExperienceCard.displayName = "ExperienceCard";
var TimelineScroll = ({
  items,
  itemHeightVh = 20,
  cardWidth = 550,
  cardGap = 64,
  distanceMultiplier = 60,
  startPosition = "20%",
  showProgressIndicator = true,
  progressText = "Scroll to explore timeline",
  showTimelineLine = true,
  timelineLineClassName = "",
  containerClassName = "",
  cardsContainerClassName = "",
  cardClassName = "",
  renderDot,
  renderCardNumber
}) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef
  });
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [startPosition, `-${items.length * distanceMultiplier}%`]
  );
  const defaultDotRender = (item, index) => /* @__PURE__ */ jsx("div", { className: "absolute -bottom-12 left-1/2 -translate-x-1/2 z-20", children: /* @__PURE__ */ jsx(
    "div",
    {
      className: item.dotClassName || `w-6 h-6 rounded-full border-4 ${item.dotColor || "bg-blue-500 border-gray-900"}`
    }
  ) });
  const defaultCardNumberRender = (index) => /* @__PURE__ */ jsx("div", { className: "absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gray-900 border-2 border-blue-500 flex items-center justify-center text-blue-500 font-bold text-lg shadow-lg z-20", children: String(index + 1).padStart(2, "0") });
  return /* @__PURE__ */ jsx(
    "section",
    {
      ref: targetRef,
      className: "timeline-scroll-section relative",
      style: { height: `${items.length * itemHeightVh}vh` },
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: `sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden py-12 ${containerClassName}`,
          children: [
            showTimelineLine && /* @__PURE__ */ jsx(
              "div",
              {
                className: timelineLineClassName || "absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-30 z-0"
              }
            ),
            /* @__PURE__ */ jsx(
              motion.div,
              {
                className: `flex relative z-10 ${cardsContainerClassName}`,
                style: {
                  gap: `${cardGap}px`,
                  paddingLeft: `${cardGap}px`,
                  paddingRight: `${cardGap}px`,
                  x
                },
                children: items.map((item, index) => /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: `flex-shrink-0 relative ${cardClassName}`,
                    style: { width: `${cardWidth}px` },
                    children: [
                      renderDot ? renderDot(item, index) : defaultDotRender(item),
                      item.content,
                      renderCardNumber ? renderCardNumber(index) : defaultCardNumberRender(index)
                    ]
                  },
                  item.id
                ))
              }
            ),
            showProgressIndicator && /* @__PURE__ */ jsxs("div", { className: "absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-gray-400 z-10", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  "svg",
                  {
                    className: "w-4 h-4 animate-pulse",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24",
                    children: /* @__PURE__ */ jsx(
                      "path",
                      {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M14 5l7 7m0 0l-7 7m7-7H3"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: progressText })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "w-32 h-1 bg-gray-700 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
                motion.div,
                {
                  style: { scaleX: scrollYProgress },
                  className: "h-full bg-gradient-to-r from-purple-500 to-blue-500 origin-left"
                }
              ) })
            ] })
          ]
        }
      )
    }
  );
};
TimelineScroll.displayName = "TimelineScroll";

export { ExperienceCard, HorizontalTimelineCarousel, TimelineCard, TimelineScroll };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map