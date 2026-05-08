import { z } from 'zod';

export const RegisterBody = z.object({
  email: z.string().email().max(254),
  username: z
    .string()
    .min(3)
    .max(24)
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'username may only contain letters, digits, "_" and "-"',
    ),
  password: z.string().min(4).max(128),
});
export type RegisterBody = z.infer<typeof RegisterBody>;

export const LoginBody = z.object({
  // Accept either email or username as the identifier.
  identifier: z.string().min(3).max(254),
  password: z.string().min(1).max(128),
});
export type LoginBody = z.infer<typeof LoginBody>;
