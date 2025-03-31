// This is a convex file to use across the application

import { ConvexHttpClient } from "convex/browser";

// This creates a Singleton instance of the Convex HTTP Client
export const getConvexClient = () => {
  return new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
};
