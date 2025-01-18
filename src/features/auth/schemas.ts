import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .trim()
    .min(1, "Required")
    .max(256, "Maximum 256 characters are allowed"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  email: z.string().email(),
  password: z
    .string()
    .trim()
    .min(8, "Minimum 8 characters are required")
    .max(256, "Maximum 256 characters are allowed"),
});
