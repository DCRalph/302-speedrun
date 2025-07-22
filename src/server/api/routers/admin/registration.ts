import { z } from "zod";

import {
  createTRPCRouter,
  adminProcedure,
} from "~/server/api/trpc";


export const adminRegistrationRouter = createTRPCRouter({

  // Get all registrations (protected - admin only)
  getAll: adminProcedure.query(async ({ ctx }) => {
    const registrations = await ctx.db.registration.findMany({
      orderBy: { createdAt: "desc" },
    });

    return registrations;
  }),

  // Get registration statistics
  getStats: adminProcedure.query(async ({ ctx }) => {
    const [totalRegistrations, totalUsers, byType, byStatus] = await Promise.all([
      // Total registrations
      ctx.db.registration.count(),

      // Total users
      ctx.db.user.count(),

      // Count by registration type
      ctx.db.registration.groupBy({
        by: ["registrationType"],
        _count: {
          registrationType: true,
        },
      }),

      // Count by status
      ctx.db.registration.groupBy({
        by: ["status"],
        _count: {
          status: true,
        },
      }),
    ]);

    return {
      totalRegistrations,
      totalUsers,
      byType: byType.reduce((acc, item) => {
        acc[item.registrationType] = item._count.registrationType;
        return acc;
      }, {} as Record<string, number>),
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {} as Record<string, number>),
    };
  }),

  // Update registration status
  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["pending", "confirmed", "cancelled"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const registration = await ctx.db.registration.update({
        where: { id: input.id },
        data: { status: input.status },
      });

      return registration;
    }),
}); 