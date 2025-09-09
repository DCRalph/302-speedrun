"use client";

import { api } from "~/trpc/react";

export function CommentList({ postId }: { postId: string }) {
  const { data, isLoading } = api.blog.getApprovedComments.useQuery({ postId });
  if (isLoading) return <p className="text-gray-500">Loading comments…</p>;

  if (!data || data.length === 0) return <p className="text-gray-500">No comments yet.</p>;

  return (
    <div className="space-y-4">
      {data.map((c) => (
        <div key={c.id} className="rounded-md bg-white p-3 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">{c.authorName}</span> on {new Date(c.createdAt).toLocaleDateString()}
          </p>
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{c.content}</p>
        </div>
      ))}
    </div>
  );
}

