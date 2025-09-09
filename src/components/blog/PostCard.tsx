"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

type Author = { name: string | null };
type Category = { category: { name: string; slug: string } };
type Tag = { tag: { name: string; slug: string } };

export type PostListItem = {
  id: string;
  title: string;
  slug: string | null;
  excerpt: string | null;
  coverImageUrl: string | null;
  publishedAt: Date | null;
  author: Author;
  categories: Category[];
  tags: Tag[];
  _count?: { comments: number };
};

export function PostCard({ post }: { post: PostListItem }) {
  const href = post.slug ? `/blog/${post.slug}` : `#`;
  return (
    <Link href={href} className="block">
      <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-gray-900">{post.title}</CardTitle>
          {post.publishedAt && (
            <p className="text-sm text-gray-500">
              {new Date(post.publishedAt).toLocaleDateString()} • {post.author?.name ?? "Unknown"}
            </p>
          )}
        </CardHeader>
        <CardContent>
          {post.excerpt && (
            <p className="text-gray-700 leading-relaxed mb-2 line-clamp-3">{post.excerpt}</p>
          )}
          {post._count?.comments !== undefined && (
            <p className="text-sm text-gray-500">{post._count.comments} comments</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

