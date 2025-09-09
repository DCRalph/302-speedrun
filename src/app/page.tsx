import HomePage from "./Home";
import { api } from "~/trpc/server";

export default async function Home() {
  const { items } = await api.blog.listPosts({ limit: 1, publishedOnly: true });
  const first = items[0] ?? null;
  const recent = first
    ? {
        title: first.title,
        slug: first.slug ?? null,
        excerpt: first.excerpt ?? null,
        publishedAt: first.publishedAt ?? null,
        authorName: first.author?.name ?? null,
      }
    : null;
  return <HomePage recent={recent} />;
}
