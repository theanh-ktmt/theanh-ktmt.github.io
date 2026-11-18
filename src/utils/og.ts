import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "node:fs";
import path from "node:path";
const font = readFileSync(
  path.resolve(
    "node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-500-normal.woff",
  ),
);
export async function ogImage(title: string, label = "ENGINEERING NOTES") {
  const node = (
    type: string,
    style: Record<string, unknown>,
    children: any,
  ) => ({ type, props: { style, children } });
  const svg = await satori(
    node(
      "div",
      {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: 70,
        background: "#0b111b",
        color: "#e7edf5",
        fontFamily: "Plex",
      },
      [
        node(
          "div",
          {
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            color: "#9cacc1",
            paddingBottom: 30,
            borderBottom: "1px solid #273244",
          },
          ["THE ANH TRAN", node("span", { color: "#60a5fa" }, label)],
        ),
        node(
          "div",
          {
            display: "flex",
            flex: 1,
            alignItems: "center",
            fontSize: title.length > 75 ? 49 : 60,
            lineHeight: 1.15,
            letterSpacing: -2,
          },
          title,
        ),
        node(
          "div",
          {
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #273244",
            paddingTop: 25,
            fontSize: 20,
            color: "#9cacc1",
          },
          [
            "Agent Loop / World models / GPU performance",
            node("span", { color: "#60a5fa" }, "↗"),
          ],
        ),
      ],
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Plex", data: font, weight: 500, style: "normal" }],
    },
  );
  return new Resvg(svg).render().asPng();
}
