import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          borderRadius: "9999px",
          overflow: "hidden",
          background: "white",
          border: "3px solid #0f172a",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "50%", background: "#dc2626", display: "flex" }} />

        <div style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: 3, marginTop: -1.5, background: "#0f172a", display: "flex" }} />

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 12,
            height: 12,
            marginTop: -6,
            marginLeft: -6,
            borderRadius: "9999px",
            background: "white",
            border: "3px solid #0f172a",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
