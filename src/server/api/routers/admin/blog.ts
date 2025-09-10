import { z } from "zod";

import { createTRPCRouter, adminProcedure } from "~/server/api/trpc";

const upsertPostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  coverImageUrl: z.string().url().optional(),
  published: z.boolean().default(false),
  categorySlugs: z.array(z.string()).optional(),
  tagSlugs: z.array(z.string()).optional(),
});

export const adminBlogRouter = createTRPCRouter({
  listAll: adminProcedure
    .input(z.object({ limit: z.number().int().min(1).max(100).default(20), cursor: z.string().nullish() }).default({ limit: 20 }))
    .query(async ({ ctx, input }) => {
      const posts = await ctx.db.blogPost.findMany({
        orderBy: { createdAt: "desc" },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        include: { _count: { select: { comments: true } } },
      });
      let nextCursor: string | undefined;
      if (posts.length > input.limit) {
        const next = posts.pop();
        nextCursor = next?.id;
      }
      return { items: posts, nextCursor };
    }),

  upsertPost: adminProcedure.input(upsertPostSchema).mutation(async ({ ctx, input }) => {
    const { id, categorySlugs, tagSlugs, ...postData } = input;

    const post = await ctx.db.$transaction(async (tx) => {
      const upserted = await tx.blogPost.upsert({
        where: { id: id ?? "" },
        update: { ...postData },
        create: {
          ...postData,
          authorId: ctx.session.user.id,
          publishedAt: postData.published ? new Date() : null,
        },
      });

      if (categorySlugs) {
        // Clear and recreate
        await tx.blogPostCategory.deleteMany({ where: { postId: upserted.id } });
        for (const slug of categorySlugs) {
          const category = await tx.blogCategory.upsert({
            where: { slug },
            update: { name: slug.replace(/-/g, " ") },
            create: { slug, name: slug.replace(/-/g, " ") },
          });
          await tx.blogPostCategory.create({ data: { postId: upserted.id, categoryId: category.id } });
        }
      }

      if (tagSlugs) {
        await tx.blogPostTag.deleteMany({ where: { postId: upserted.id } });
        for (const slug of tagSlugs) {
          const tag = await tx.blogTag.upsert({
            where: { slug },
            update: { name: slug.replace(/-/g, " ") },
            create: { slug, name: slug.replace(/-/g, " ") },
          });
          await tx.blogPostTag.create({ data: { postId: upserted.id, tagId: tag.id } });
        }
      }

      return upserted;
    });

    return post;
  }),

  deletePost: adminProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    await ctx.db.blogPost.delete({ where: { id: input.id } });
    return { success: true };
  }),

  approveComment: adminProcedure
    .input(z.object({ commentId: z.string(), approved: z.boolean().default(true) }))
    .mutation(async ({ ctx, input }) => {
      const updated = await ctx.db.blogComment.update({
        where: { id: input.commentId },
        data: { approved: input.approved },
      });
      return updated;
    }),

  listPendingComments: adminProcedure
    .input(z.object({ limit: z.number().int().min(1).max(100).default(50), cursor: z.string().nullish() }).default({ limit: 50 }))
    .query(async ({ ctx, input }) => {
      const comments = await ctx.db.blogComment.findMany({
        where: { approved: false },
        orderBy: { createdAt: "desc" },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        include: { post: { select: { title: true, slug: true } } },
      });
      let nextCursor: string | undefined;
      if (comments.length > input.limit) {
        const next = comments.pop();
        nextCursor = next?.id;
      }
      return { items: comments, nextCursor };
    }),
});

