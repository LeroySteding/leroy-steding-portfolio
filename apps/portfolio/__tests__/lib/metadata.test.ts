import { describe, expect, it } from "vitest";
import {
  getAlternateLanguages,
  getAlternatesMetadata,
  getCanonicalUrl,
} from "@/lib/metadata";

describe("getCanonicalUrl", () => {
  it("returns correct URL for Dutch locale (default)", () => {
    expect(getCanonicalUrl("/about", "nl")).toBe(
      "https://www.leroysteding.nl/about",
    );
  });

  it("returns correct URL for English locale", () => {
    expect(getCanonicalUrl("/about", "en")).toBe(
      "https://www.leroysteding.nl/en/about",
    );
  });

  it("handles root path for Dutch locale", () => {
    expect(getCanonicalUrl("", "nl")).toBe("https://www.leroysteding.nl");
  });

  it("handles root path for English locale", () => {
    expect(getCanonicalUrl("", "en")).toBe("https://www.leroysteding.nl/en");
  });

  it("handles paths with leading slash", () => {
    expect(getCanonicalUrl("/blog/my-post", "en")).toBe(
      "https://www.leroysteding.nl/en/blog/my-post",
    );
  });

  it("handles paths without leading slash", () => {
    expect(getCanonicalUrl("blog/my-post", "en")).toBe(
      "https://www.leroysteding.nl/en/blog/my-post",
    );
  });

  it("handles nested paths", () => {
    expect(getCanonicalUrl("/projects/my-project/details", "nl")).toBe(
      "https://www.leroysteding.nl/projects/my-project/details",
    );
  });
});

describe("getAlternateLanguages", () => {
  it("returns correct URLs for a page path", () => {
    const result = getAlternateLanguages("/about");

    expect(result.nl).toBe("https://www.leroysteding.nl/about");
    expect(result.en).toBe("https://www.leroysteding.nl/en/about");
    expect(result["x-default"]).toBe("https://www.leroysteding.nl/about");
  });

  it("returns correct URLs for root path", () => {
    const result = getAlternateLanguages("");

    expect(result.nl).toBe("https://www.leroysteding.nl");
    expect(result.en).toBe("https://www.leroysteding.nl/en");
    expect(result["x-default"]).toBe("https://www.leroysteding.nl");
  });

  it("handles paths with leading slash", () => {
    const result = getAlternateLanguages("/blog");

    expect(result.nl).toBe("https://www.leroysteding.nl/blog");
    expect(result.en).toBe("https://www.leroysteding.nl/en/blog");
  });
});

describe("getAlternatesMetadata", () => {
  it("returns complete metadata for Dutch locale", () => {
    const result = getAlternatesMetadata("/about", "nl");

    expect(result.canonical).toBe("https://www.leroysteding.nl/about");
    expect(result.languages.nl).toBe("https://www.leroysteding.nl/about");
    expect(result.languages.en).toBe("https://www.leroysteding.nl/en/about");
    expect(result.languages["x-default"]).toBe(
      "https://www.leroysteding.nl/about",
    );
  });

  it("returns complete metadata for English locale", () => {
    const result = getAlternatesMetadata("/about", "en");

    expect(result.canonical).toBe("https://www.leroysteding.nl/en/about");
    expect(result.languages.nl).toBe("https://www.leroysteding.nl/about");
    expect(result.languages.en).toBe("https://www.leroysteding.nl/en/about");
  });

  it("handles blog post paths correctly", () => {
    const result = getAlternatesMetadata("/blog/my-awesome-post", "en");

    expect(result.canonical).toBe(
      "https://www.leroysteding.nl/en/blog/my-awesome-post",
    );
    expect(result.languages.nl).toBe(
      "https://www.leroysteding.nl/blog/my-awesome-post",
    );
  });
});
