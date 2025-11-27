import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get("title") || "Leroy Steding";
  const description =
    searchParams.get("description") ||
    "Full-Stack Developer & AI Automation Architect";
  const type = searchParams.get("type") || "default";

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        backgroundColor: "#0a0a0a",
        padding: "60px",
        position: "relative",
      }}
    >
      {/* Background gradient */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 20% 20%, rgba(34, 211, 238, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)",
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          zIndex: 1,
        }}
      >
        {/* Type badge */}
        {type !== "default" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "9999px",
              backgroundColor: "rgba(34, 211, 238, 0.2)",
              border: "1px solid rgba(34, 211, 238, 0.5)",
            }}
          >
            <span
              style={{
                color: "#22d3ee",
                fontSize: "20px",
                fontWeight: 600,
              }}
            >
              {type === "blog"
                ? "📝 Blog"
                : type === "project"
                  ? "🚀 Project"
                  : type}
            </span>
          </div>
        )}

        {/* Title */}
        <h1
          style={{
            fontSize: title.length > 40 ? "48px" : "64px",
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.1,
            margin: 0,
            maxWidth: "900px",
          }}
        >
          {title}
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: "24px",
            color: "#a1a1aa",
            lineHeight: 1.4,
            margin: 0,
            maxWidth: "800px",
          }}
        >
          {description.length > 120
            ? `${description.slice(0, 120)}...`
            : description}
        </p>
      </div>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "60px",
          right: "60px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "#22d3ee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "20px",
              color: "#0a0a0a",
            }}
          >
            LS
          </div>
          <span
            style={{
              color: "#ffffff",
              fontSize: "24px",
              fontWeight: 600,
            }}
          >
            STEDING.
          </span>
        </div>

        <span
          style={{
            color: "#71717a",
            fontSize: "20px",
          }}
        >
          leroysteding.nl
        </span>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
