import Navbar from "~/components/Navbar";
import { api } from "~/trpc/server";
import { CommentForm } from "~/components/blog/CommentForm";
import { CommentList } from "~/components/blog/CommentList";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await api.blog.getBySlug({ slug });
  if (!post) return <div className="min-h-screen"><Navbar /><div className="container mx-auto px-4 py-10">Post not found</div></div>;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <article className="container mx-auto px-4 py-10 prose max-w-3xl">
        <h1>{post.title}</h1>
        {post.publishedAt && (
          <p className="text-sm text-gray-500">
            {new Date(post.publishedAt).toLocaleDateString()} • {post.author?.name ?? "Unknown"}
          </p>
        )}
        {post.coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.coverImageUrl} alt="Cover" className="rounded-lg shadow-md my-4" />
        )}
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>

      <section className="container mx-auto px-4 max-w-3xl pb-12">
        <h2 className="text-xl font-semibold mb-3">Comments</h2>
        <CommentForm postId={post.id} />
        <div className="mt-6">
          <CommentList postId={post.id} />
        </div>
      </section>
    </div>
  );
}

