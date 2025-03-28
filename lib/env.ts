// lib/env.ts (SERVER-SIDE VALIDATION)
import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_CONVEX_URL: z.string().url(),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
});
