import { readFileSync } from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";
export function dimensions(src: string) {
  const root = path.resolve("public");
  const filename = path.resolve(root, "." + src);
  if (!src.startsWith("/") || !filename.startsWith(root + path.sep))
    throw Error("Expected a local public image: " + src);
  const { width, height } = imageSize(readFileSync(filename));
  return { width, height };
}
