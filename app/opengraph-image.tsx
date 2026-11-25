import { ImageResponse } from "next/og";
import { HOME, PERSON } from "@/content/site";

export const alt = `${PERSON.name}: ${HOME.description}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The link preview card: name and one line on white, like the site.
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 96,
          background: "#ffffff",
          color: "#0f0f0f",
        }}
      >
        <div style={{ fontSize: 112, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>{PERSON.name}</div>
        <div style={{ marginTop: 32, fontSize: 40, color: "#57534e", maxWidth: 900, lineHeight: 1.3 }}>
          {HOME.description}
        </div>
        <div style={{ marginTop: 56, width: 96, height: 8, background: "#166238" }} />
      </div>
    ),
    size,
  );
}
