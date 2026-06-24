import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    readTime: z.string(),
    hero: z.string(),
    heroAlt: z.string().optional(),
    ogImage: z.string().optional(),
    ogDescription: z.string().optional(),
  }),
});

export const collections = { blog };
