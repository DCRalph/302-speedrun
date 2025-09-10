import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const blogRouter = createTRPCRouter({
  listPosts: publicProcedure
    .input(
      z
        .object({
          limit: z.number().int().min(1).max(100).default(10),
          cursor: z.string().nullish(),
          publishedOnly: z.boolean().default(true),
          categorySlug: z.string().optional(),
          tagSlug: z.string().optional(),
        })
        .default({ limit: 10, publishedOnly: true }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, publishedOnly, categorySlug, tagSlug } = input;

      const posts = await ctx.db.blogPost.findMany({
        where: {
          published: publishedOnly ? true : undefined,
          categories: categorySlug
            ? {
                some: {
                  category: { slug: categorySlug },
                },
              }
            : undefined,
          tags: tagSlug
            ? {
                some: {
                  tag: { slug: tagSlug },
                },
              }
            : undefined,
        },
        orderBy: { publishedAt: "desc" },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        include: {
          author: true,
          categories: { include: { category: true } },
          tags: { include: { tag: true } },
          _count: { select: { comments: true } },
        },
      });

      let nextCursor: string | undefined = undefined;
      if (posts.length > limit) {
        const next = posts.pop();
        nextCursor = next?.id;
      }

      return { items: posts, nextCursor };
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.blogPost.findFirst({
        where: { slug: input.slug },
        include: {
          author: true,
          categories: { include: { category: true } },
          tags: { include: { tag: true } },
        },
      });
      return post;
    }),

  getApprovedComments: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.blogComment.findMany({
        where: { postId: input.postId, approved: true },
        orderBy: { createdAt: "desc" },
      });
    }),

  addComment: publicProcedure
    .input(
      z.object({
        postId: z.string(),
        authorName: z.string().min(1),
        authorEmail: z.string().email(),
        content: z.string().min(1).max(5_000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.blogPost.findUnique({
        where: { id: input.postId },
      });
      if (!post?.published) {
        throw new Error("Post not found or not accepting comments");
      }

      const created = await ctx.db.blogComment.create({
        data: {
          postId: input.postId,
          authorName: input.authorName,
          authorEmail: input.authorEmail,
          content: input.content,
          approved: false,
        },
      });
      return created;
    }),

  // For authenticated authors to preview their own drafts via slug
  getDraftBySlug: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.blogPost.findFirst({
        where: { slug: input.slug, authorId: ctx.session.user.id },
        include: {
          categories: { include: { category: true } },
          tags: { include: { tag: true } },
        },
      });
    }),
});

