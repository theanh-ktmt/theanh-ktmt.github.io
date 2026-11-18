import { getCollection } from "astro:content";
import { ogImage } from "../../utils/og";
export async function getStaticPaths() {
  return [
    {
      params: { slug: "home" },
      props: {
        title: "The Anh Tran - Personal Page",
        label: "NVIDIA",
      },
    },
    ...(await getCollection("blog")).map((post) => ({
      params: { slug: post.id },
      props: { title: post.data.title, label: "ENGINEERING NOTES" },
    })),
  ];
}
export async function GET({ props }: any) {
  const png = await ogImage(props.title, props.label);
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
