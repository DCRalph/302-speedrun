import HomePage from "./Home";
import { api } from "~/trpc/server";

export default async function Home() {
  const { items } = await api.blog.listPosts({ limit: 1, publishedOnly: true });
  const recent = items[0] ?? null;
  return <HomePage recent={recent as any} />;
}
