"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Eye, Pencil, Plus, Trash2, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
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

  useEffect(() => {
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

  const computedSlug = useMemo(() => slug || slugify(title), [slug, title]);
  const titleCount = title.length;
  const excerptCount = excerpt.length;
  const contentCount = content.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left: List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Manage Posts</h1>
          <Button onClick={() => setEditing({ id: "", title: "", slug: "", excerpt: "", content: "", published: false })}>
            <Plus className="w-4 h-4 mr-2" /> New Post
          </Button>
        </div>
        <div className="space-y-3">
          {list?.items?.map((p) => (
            <Card key={p.id} className="">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{p.title}</p>
                    {p.published ? (
                      <Badge className="bg-green-100 text-green-800">Published</Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span>{p.slug}</span>
                    <span>•</span>
                    <span>{((p as unknown as { _count?: { comments?: number } })._count?.comments) ?? 0} comments</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {p.slug && p.published ? (
                    <Link href={`/blog/${p.slug}`} target="_blank">
                      <Button variant="outline">
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Button>
                    </Link>
                  ) : null}
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
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button variant="destructive" onClick={() => del.mutate({ id: p.id })}>
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Right: Form + Preview */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{editing?.id ? "Edit Post" : "New Post"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
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
                  id: editing?.id ?? undefined,
                  title,
                  slug: computedSlug,
                  excerpt,
                  content,
                  coverImageUrl: coverImageUrl || undefined,
                  published,
                  categorySlugs,
                  tagSlugs,
                });
              }}
            >
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input placeholder="Post title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <div className="mt-1 text-xs text-gray-500">{titleCount} characters</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <Input placeholder="Auto-generates from title" value={slug} onChange={(e) => setSlug(slugify(e.target.value))} />
                <div className="mt-1 text-xs text-gray-500 flex items-center gap-2">
                  <LinkIcon className="w-3 h-3" />
                  <span>Resulting slug: </span>
                  <code className="bg-gray-100 px-1 rounded">{computedSlug || "(empty)"}</code>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Cover Image URL</label>
                <Input placeholder="https://..." value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} />
                <div className="mt-1 text-xs text-gray-500 flex items-center gap-2">
                  <ImageIcon className="w-3 h-3" /> Optional
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Excerpt</label>
                <Textarea placeholder="Short summary" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
                <div className="mt-1 text-xs text-gray-500">{excerptCount} characters</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Content (HTML)</label>
                <Textarea placeholder="Write your content in HTML" className="min-h-56" value={content} onChange={(e) => setContent(e.target.value)} required />
                <div className="mt-1 text-xs text-gray-500">{contentCount} characters</div>
              </div>

              <div className="flex gap-3 items-center">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
                  Publish immediately
                </label>
                {published ? <Badge className="bg-green-100 text-green-800">Will publish</Badge> : <Badge className="bg-yellow-100 text-yellow-800">Save as draft</Badge>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Categories</label>
                <Input placeholder="Comma-separated (e.g. News, Updates)" value={categories} onChange={(e) => setCategories(e.target.value)} />
                <div className="mt-2 flex flex-wrap gap-2">
                  {categories
                    .split(",")
                    .map((s) => slugify(s))
                    .filter(Boolean)
                    .map((s) => (
                      <Badge key={s}>{s}</Badge>
                    ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tags</label>
                <Input placeholder="Comma-separated (e.g. react, nextjs)" value={tags} onChange={(e) => setTags(e.target.value)} />
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags
                    .split(",")
                    .map((s) => slugify(s))
                    .filter(Boolean)
                    .map((s) => (
                      <Badge key={s} variant="secondary">{s}</Badge>
                    ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={upsert.isPending || !title || !content}>
                  {upsert.isPending ? "Saving..." : "Save Post"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverImageUrl} alt="Cover" className="w-full h-48 object-cover rounded mb-3" />
            ) : (
              <div className="w-full h-32 rounded bg-gray-100 text-gray-400 flex items-center justify-center mb-3">
                <ImageIcon className="w-6 h-6 mr-2" /> No cover image
              </div>
            )}
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold">{title || "Untitled Post"}</h3>
              {published ? (
                <Badge className="bg-green-100 text-green-800">Published</Badge>
              ) : (
                <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>
              )}
            </div>
            <p className="text-gray-600 mb-3">{excerpt || "No excerpt"}</p>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content || "<p>(Content will appear here)</p>" }} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

