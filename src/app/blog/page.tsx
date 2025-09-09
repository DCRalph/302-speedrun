import Navbar from "~/components/Navbar";
import { api } from "~/trpc/server";
import { PostCard } from "~/components/blog/PostCard";

export const dynamic = "force-dynamic";

export default async function BlogIndexPage() {
  const { items } = await api.blog.listPosts({ limit: 12, publishedOnly: true });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <Navbar />
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Blog</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((post) => (
              <PostCard key={post.id} post={{
                id: post.id,
                title: post.title,
                slug: post.slug ?? null,
                excerpt: post.excerpt ?? null,
                coverImageUrl: post.coverImageUrl ?? null,
                publishedAt: post.publishedAt ?? null,
                author: { name: post.author?.name ?? null },
                categories: post.categories as any,
                tags: post.tags as any,
                _count: post._count as any,
              }} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

