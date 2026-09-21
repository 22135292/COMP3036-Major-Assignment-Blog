import * as z from "zod";

export const SignInSchema = z.object({
  // gmail: z.email(),
  password: z.string().min(1, "Password must not be blank"),
});

export type SignInSchemaType = z.infer<typeof SignInSchema>;
