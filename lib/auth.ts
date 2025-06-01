import { betterAuth } from "better-auth";
import { convexAdapter } from "@better-auth-kit/convex";
import { ConvexHttpClient } from "convex/browser";
import { nextCookies } from "better-auth/next-js";
import { oneTap } from "better-auth/plugins";

const convexClient = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL ?? "",
);

export const auth = betterAuth({
  database: convexAdapter(convexClient),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [oneTap(), nextCookies()],
  //... other options
});
