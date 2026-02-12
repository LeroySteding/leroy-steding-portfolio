// src/index.ts
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
function formatDate(date, locale = "en-US") {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(d);
}
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function truncate(str, length, suffix = "...") {
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
}
export {
  cn,
  delay,
  formatDate,
  truncate
};
