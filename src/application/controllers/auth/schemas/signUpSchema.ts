import { z } from "zod/v4-mini";

export const signUpSchema = z.object({
  account: z.object({
    password: z.string().check(
      z.minLength(8, { message: "Password must be at least 8 characters long" }),
      z.maxLength(32, { message: "Password must be less than 32 characters long" }),
    ),
    email: z.email({ message: "Invalid email address" }),
  }),
});

export type SignUpBody = z.infer<typeof signUpSchema>;
