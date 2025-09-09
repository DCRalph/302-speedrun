"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

export function CommentForm({ postId, onSubmitted }: { postId: string; onSubmitted?: () => void }) {
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [content, setContent] = useState("");

  const utils = api.useUtils();
  const addComment = api.blog.addComment.useMutation({
    onSuccess: async () => {
      setAuthorName("");
      setAuthorEmail("");
      setContent("");
      await utils.blog.getApprovedComments.invalidate({ postId });
      onSubmitted?.();
    },
  });

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        addComment.mutate({ postId, authorName, authorEmail, content });
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          placeholder="Your name"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          required
        />
        <Input
          placeholder="Your email"
          type="email"
          value={authorEmail}
          onChange={(e) => setAuthorEmail(e.target.value)}
          required
        />
      </div>
      <Textarea
        placeholder="Your comment"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        className="min-h-28"
      />
      <div>
        <Button type="submit" disabled={addComment.isPending} className="bg-gradient-to-r from-blue-600 to-teal-600">
          {addComment.isPending ? "Submitting..." : "Submit Comment"}
        </Button>
        <p className="text-xs text-gray-500 mt-1">Comments are subject to approval.</p>
      </div>
    </form>
  );
}

