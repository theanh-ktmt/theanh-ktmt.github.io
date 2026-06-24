import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = await getCollection("blog");
  return rss({
    title: "The Anh Tran — Blog",
    description:
      "Technical posts on LLM inference, GPU optimization, and distributed systems.",
    site: context.site,
    items: posts
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
      .map((p) => ({
        title: p.data.title,
        description: p.data.description,
        pubDate: p.data.date,
        link: `/blogs/${p.id}.html`,
      })),
  });
}
