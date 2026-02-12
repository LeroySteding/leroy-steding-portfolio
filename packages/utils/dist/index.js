"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  cn: () => cn,
  delay: () => delay,
  formatDate: () => formatDate,
  truncate: () => truncate
});
module.exports = __toCommonJS(index_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  cn,
  delay,
  formatDate,
  truncate
});
