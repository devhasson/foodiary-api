import { z } from "zod/v4-mini";

export const signInSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().check(
    z.minLength(8, { message: "Password must be at least 8 characters long" }),
    z.maxLength(32, { message: "Password must be less than 32 characters long" }),
  ),
});

export type SignInBody = z.infer<typeof signInSchema>;
