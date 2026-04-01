import { z } from "zod/v4-mini";

export const schema = z.object({
  COGNITO_CLIENT_ID: z.string().check(
    z.minLength(1, { message: "COGNITO_CLIENT_ID is required" }),
  ),
  COGNITO_CLIENT_SECRET: z.string().check(
    z.minLength(1, { message: "COGNITO_CLIENT_SECRET is required" }),
  ),
  MAIN_TABLE_NAME: z.string().check(
    z.minLength(1, { message: "MAIN_TABLE_NAME is required" }),
  ),
});

export type Env = z.infer<typeof schema>;
export const env = schema.parse(process.env);
