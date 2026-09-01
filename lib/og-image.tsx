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
          background: "#06080d",
          color: "#eef4f8",
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
              border: "2px solid #2a3a52",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#3de0c8",
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
            color: "#3de0c8",
          }}
        >
          See what&apos;s actually wrong.
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 24,
            color: "#8b9bb0",
          }}
        >
          Paste an error, crash log, code, API response, or screenshot.
        </div>
      </div>
    ),
    ogImageSize,
  );
}
