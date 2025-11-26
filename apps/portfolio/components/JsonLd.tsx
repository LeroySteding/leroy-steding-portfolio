import type { Thing, WithContext } from "schema-dts";

interface JsonLdProps {
  data: WithContext<Thing> | WithContext<Thing>[];
}

export default function JsonLd({ data }: JsonLdProps) {
  const jsonLdArray = Array.isArray(data) ? data : [data];

  return (
    <>
      {jsonLdArray.map((item) => {
        // Use the @type as a stable key since schema types are unique per document
        const schemaType = (item as { "@type"?: string })["@type"] || "unknown";
        return (
          <script
            key={schemaType}
            type="application/ld+json"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires innerHTML, data is generated server-side
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(item),
            }}
          />
        );
      })}
    </>
  );
}
