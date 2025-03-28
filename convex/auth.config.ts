import { z } from "zod";

const envSchema = z.object({
  CLERK_ISSUER_URL: z.string().url(),
});

const env = envSchema.parse(process.env);

const authConfig = {
  providers: [
    {
      domain: env.CLERK_ISSUER_URL,
      applicationID: "convex",
    },
  ],
};

export default authConfig;
