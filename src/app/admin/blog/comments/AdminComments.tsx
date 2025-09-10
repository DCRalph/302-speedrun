"use client";

import { useMemo } from "react";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import Link from "next/link";
import { Check, Eye, RefreshCw } from "lucide-react";

export default function AdminComments() {
  const utils = api.useUtils();

  const { data, isLoading, refetch, isRefetching } = api.adminBlog.listPendingComments.useQuery({ limit: 50 });

  const approve = api.adminBlog.approveComment.useMutation({
    onSuccess: async () => {
      await utils.adminBlog.listPendingComments.invalidate();
    },
  });

  const pendingCount = useMemo(() => data?.items?.length ?? 0, [data]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Comment Moderation</h1>
          <p className="text-gray-600 mt-1">Review and approve new comments.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-yellow-100 text-yellow-800">{pendingCount} pending</Badge>
          <Button variant="outline" onClick={() => refetch()} disabled={isRefetching}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading pending comments…</p>
      ) : pendingCount === 0 ? (
        <Card>
          <CardContent className="p-6 text-gray-600">No pending comments. You're all caught up!</CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {data?.items?.map((c) => (
            <Card key={c.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium truncate">{c.authorName}</span>
                      <span className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-600 break-all">{c.authorEmail}</p>
                    <div className="mt-2 text-gray-900 whitespace-pre-wrap break-words">{c.content}</div>
                    <div className="mt-3 text-sm text-gray-600">
                      On post: {" "}
                      {c.post?.slug ? (
                        <Link href={`/blog/${c.post.slug}`} className="underline inline-flex items-center gap-1" target="_blank">
                          <span className="font-medium">{c.post?.title ?? c.post?.slug}</span>
                          <Eye className="w-3 h-3" />
                        </Link>
                      ) : (
                        <span className="font-medium">{c.post?.title ?? "Unknown"}</span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 flex gap-2">
                    <Button
                      onClick={() => approve.mutate({ commentId: c.id, approved: true })}
                      disabled={approve.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-1" /> Approve
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


