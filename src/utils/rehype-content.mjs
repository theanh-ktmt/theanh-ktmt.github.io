import { readFileSync } from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";

// Build-time enhancements preserve a usable article when JavaScript is disabled.
export default function enrichContent() {
  return (tree) => {
    function visit(node) {
      if (!node.children) return;
      node.children = node.children.map((child) => {
        visit(child);
        if (child.type !== "element") return child;
        if (
          child.tagName === "span" &&
          child.properties?.className?.includes("katex-display")
        ) {
          Object.assign(child.properties, {
            tabIndex: 0,
            role: "region",
            "aria-label": "Scrollable equation",
          });
        }
        if (child.tagName === "img") {
          const src = child.properties?.src;
          if (
            typeof src === "string" &&
            src.startsWith("/") &&
            !src.startsWith("//")
          ) {
            const filename = path.resolve("public", "." + src);
            if (!filename.startsWith(path.resolve("public") + path.sep))
              throw Error("Image outside public");
            const size = imageSize(readFileSync(filename));
            Object.assign(child.properties, {
              width: size.width,
              height: size.height,
              loading: "lazy",
              decoding: "async",
            });
          }
        }
        if (child.tagName === "table")
          return {
            type: "element",
            tagName: "div",
            properties: {
              className: ["table-scroll"],
              tabIndex: 0,
              role: "region",
              "aria-label": "Scrollable data table",
            },
            children: [child],
          };
        if (child.tagName === "pre")
          return {
            type: "element",
            tagName: "div",
            properties: { className: ["code-block"] },
            children: [child],
          };
        return child;
      });
    }
    visit(tree);
  };
}
