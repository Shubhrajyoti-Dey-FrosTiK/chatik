import { ConvexHttpClient } from "convex/browser";

// Replace with your dev or production URL
const CONVEX_URL =
  process.env.NEXT_PUBLIC_CONVEX_URL || "http://localhost:6790";

let client: ConvexHttpClient | null = null;

export function getConvexClient(): ConvexHttpClient {
  if (!client) {
    client = new ConvexHttpClient(CONVEX_URL);
    console.log("--CONVEX CONNECTED--");
  } else {
    console.log("--CONVEX CONNECTED (Cached) --");
  }
  return client;
}
