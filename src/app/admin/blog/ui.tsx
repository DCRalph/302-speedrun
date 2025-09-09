"use client";

import { useMemo, useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { slugify } from "~/lib/slugify";

type Post = {
  id: string;
  title: string;
  slug: string | null;
  excerpt: string | null;
  content: string;
  published: boolean;
};

export default function AdminBlogManager() {
  const utils = api.useUtils();
  const [editing, setEditing] = useState<Post | null>(null);

  const { data: list } = api.adminBlog.listAll.useQuery({ limit: 20 });

  const upsert = api.adminBlog.upsertPost.useMutation({
    onSuccess: async () => {
      await utils.adminBlog.listAll.invalidate();
      setEditing(null);
    },
  });
  const del = api.adminBlog.deletePost.useMutation({
    onSuccess: async () => {
      await utils.adminBlog.listAll.invalidate();
    },
  });

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [published, setPublished] = useState(false);
  const [categories, setCategories] = useState("");
  const [tags, setTags] = useState("");

  useMemo(() => {
    if (!editing) {
      setTitle("");
      setSlug("");
      setExcerpt("");
      setContent("");
      setCoverImageUrl("");
      setPublished(false);
      setCategories("");
      setTags("");
      return;
    }
    setTitle(editing.title);
    setSlug(editing.slug ?? "");
    setExcerpt(editing.excerpt ?? "");
    setContent(editing.content);
    setPublished(editing.published);
  }, [editing]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Manage Posts</h1>
          <Button onClick={() => setEditing({ id: "", title: "", slug: "", excerpt: "", content: "", published: false })}>New Post</Button>
        </div>
        <div className="space-y-3">
          {list?.items?.map((p) => (
            <div key={p.id} className="p-3 border rounded-md flex items-center justify-between">
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-xs text-gray-500">{p.slug}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    setEditing({
                      id: p.id,
                      title: p.title,
                      slug: p.slug,
                      excerpt: p.excerpt,
                      content: (p as unknown as { content: string }).content,
                      published: p.published,
                    })
                  }
                >
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => del.mutate({ id: p.id })}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-3">{editing?.id ? "Edit Post" : "New Post"}</h2>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const categorySlugs = categories
              .split(",")
              .map((s) => slugify(s))
              .filter(Boolean);
            const tagSlugs = tags
              .split(",")
              .map((s) => slugify(s))
              .filter(Boolean);
            upsert.mutate({
              id: editing?.id || undefined,
              title,
              slug: slug || slugify(title),
              excerpt,
              content,
              coverImageUrl: coverImageUrl || undefined,
              published,
              categorySlugs,
              tagSlugs,
            });
          }}
        >
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Input placeholder="Slug (auto from title)" value={slug} onChange={(e) => setSlug(slugify(e.target.value))} />
          <Input placeholder="Cover Image URL" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} />
          <Textarea placeholder="Excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
          <Textarea placeholder="Content (HTML)" className="min-h-56" value={content} onChange={(e) => setContent(e.target.value)} required />
          <div className="flex gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
              Published
            </label>
          </div>
          <Input placeholder="Categories (comma-separated)" value={categories} onChange={(e) => setCategories(e.target.value)} />
          <Input placeholder="Tags (comma-separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
          <div className="flex gap-2">
            <Button type="submit" disabled={upsert.isPending}>{upsert.isPending ? "Saving..." : "Save Post"}</Button>
            <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

