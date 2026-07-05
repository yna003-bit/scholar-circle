import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#16223D",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 28,
            backgroundColor: "#16223D",
            border: "4px solid #C9972C",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 72,
            fontWeight: 700,
            marginBottom: 32,
          }}
        >
          S
        </div>
        <div style={{ fontSize: 56, fontWeight: 700 }}>Scholar Circle</div>
        <div style={{ fontSize: 28, marginTop: 12, color: "#C9972C" }}>
          Find funding. Find your people.
        </div>
      </div>
    ),
    { ...size }
  );
}