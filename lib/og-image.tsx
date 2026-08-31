import { ImageResponse } from "next/og";

export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";
export const ogImageAlt =
  "DevLens — Drop the error. See what's actually wrong.";

export function createOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#09090b",
          color: "#fafafa",
          padding: "72px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              border: "2px solid #27272a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#22d3ee",
              fontSize: 28,
              fontWeight: 600,
            }}
          >
            {"<>"}
          </div>
          <div
            style={{
              fontSize: 40,
              fontWeight: 600,
              letterSpacing: "-0.04em",
            }}
          >
            DevLens
          </div>
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 68,
            fontWeight: 600,
            letterSpacing: "-0.045em",
            lineHeight: 1.1,
          }}
        >
          Drop the error.
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 68,
            fontWeight: 600,
            letterSpacing: "-0.045em",
            lineHeight: 1.1,
            color: "#22d3ee",
          }}
        >
          See what&apos;s actually wrong.
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 24,
            color: "#a1a1aa",
          }}
        >
          Paste an error, crash log, code, API response, or screenshot.
        </div>
      </div>
    ),
    ogImageSize,
  );
}
