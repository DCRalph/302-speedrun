import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

const registrationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  school: z.string().min(1, "School is required"),
  position: z.string().min(1, "Position is required"),
  experience: z.string().min(1, "Experience is required"),
  dietary: z.string().optional(),
  accommodation: z.string().optional(),
  message: z.string().optional(),
  registrationType: z.enum(["early-bird", "standard", "student"], {
    errorMap: () => ({ message: "Please select a valid registration type" }),
  }),
});

export const registrationRouter = createTRPCRouter({
  // Submit a new registration
  create: publicProcedure
    .input(registrationSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if email already exists
      const existingRegistration = await ctx.db.registration.findFirst({
        where: { email: input.email },
      });

      if (existingRegistration) {
        throw new Error("Email already registered. Please use a different email address.");
      }

      const registration = await ctx.db.registration.create({
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone,
          school: input.school,
          position: input.position,
          experience: input.experience,
          dietary: input.dietary ?? null,
          accommodation: input.accommodation ?? null,
          message: input.message ?? null,
          registrationType: input.registrationType,
        },
      });

      return registration;
    }),

  // Get registration by email (for checking status)
  getByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ ctx, input }) => {
      const registration = await ctx.db.registration.findFirst({
        where: { email: input.email },
      });

      return registration;
    }),



}); 