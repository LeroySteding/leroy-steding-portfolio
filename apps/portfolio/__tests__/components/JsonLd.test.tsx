import { render } from "@testing-library/react";
import type { Person, WebSite, WithContext } from "schema-dts";
import { describe, expect, it } from "vitest";
import JsonLd from "@/components/JsonLd";

describe("JsonLd", () => {
  it("renders a single schema object", () => {
    const personSchema: WithContext<Person> = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "John Doe",
      jobTitle: "Developer",
    };

    const { container } = render(<JsonLd data={personSchema} />);

    const scripts = container.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    expect(scripts).toHaveLength(1);

    const content = JSON.parse(scripts[0].innerHTML);
    expect(content["@type"]).toBe("Person");
    expect(content.name).toBe("John Doe");
  });

  it("renders multiple schema objects", () => {
    const personSchema: WithContext<Person> = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "John Doe",
    };

    const websiteSchema: WithContext<WebSite> = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "My Website",
      url: "https://example.com",
    };

    const { container } = render(
      <JsonLd data={[personSchema, websiteSchema]} />,
    );

    const scripts = container.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    expect(scripts).toHaveLength(2);

    const personContent = JSON.parse(scripts[0].innerHTML);
    expect(personContent["@type"]).toBe("Person");

    const websiteContent = JSON.parse(scripts[1].innerHTML);
    expect(websiteContent["@type"]).toBe("WebSite");
  });

  it("uses @type as key for unique identification", () => {
    const schema: WithContext<Person> = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Test",
    };

    const { container } = render(<JsonLd data={schema} />);
    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    expect(script).toBeTruthy();
  });

  it("handles empty array gracefully", () => {
    const { container } = render(<JsonLd data={[]} />);
    const scripts = container.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    expect(scripts).toHaveLength(0);
  });

  it("properly escapes JSON content", () => {
    const schema: WithContext<Person> = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: 'John "The Developer" Doe',
      description: "Writes code & builds things",
    };

    const { container } = render(<JsonLd data={schema} />);
    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    const content = JSON.parse(script?.innerHTML ?? "{}");

    expect(content.name).toBe('John "The Developer" Doe');
    expect(content.description).toBe("Writes code & builds things");
  });
});
