import { createMiddleware } from "@solidjs/start/middleware";
import { clerkMiddleware } from "clerk-solidjs/start/server";

export default createMiddleware({
  onRequest: [
    clerkMiddleware({
      publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
      secretKey: import.meta.env.CLERK_SECRET_KEY,
    }),
  ],
});
