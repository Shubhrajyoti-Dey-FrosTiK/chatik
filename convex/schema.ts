import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const MessageSchema = v.object({
  chatId: v.id("chats"),
  id: v.string(),
  role: v.string(),
  parts: v.array(
    v.union(
      v.object({
        type: v.literal("text"),
        text: v.string(),
      }),
      v.object({
        type: v.literal("reasoning"),
        text: v.string(),
        providerMetadata: v.optional(v.any()),
      }),
      v.object({
        type: v.literal("tool-invocation"),
        toolInvocation: v.any(),
      }),
      v.object({
        type: v.literal("source-url"),
        sourceId: v.string(),
        url: v.string(),
        title: v.optional(v.string()),
        providerMetadata: v.optional(v.any()),
      }),
      v.object({
        type: v.literal("file"),
        mediaType: v.string(),
        filename: v.optional(v.string()),
        url: v.string(),
      }),
    ),
  ),
});

const schema = defineSchema({
  account: defineTable({
    accessToken: v.optional(v.string()),
    accessTokenExpiresAt: v.optional(v.string()),
    accountId: v.string(),
    idToken: v.optional(v.string()),
    password: v.optional(v.string()),
    providerId: v.string(),
    scope: v.optional(v.string()),
    updatedAt: v.string(),
    userId: v.id("user"),
  }),
  chats: defineTable({
    name: v.string(),
    user: v.id("user"),
  }),
  messages: defineTable(MessageSchema),
  session: defineTable({
    expiresAt: v.string(),
    ipAddress: v.string(),
    token: v.string(),
    updatedAt: v.string(),
    userAgent: v.string(),
    userId: v.id("user"),
  }),
  tasks: defineTable({
    isCompleted: v.boolean(),
    text: v.string(),
  }),
  user: defineTable({
    email: v.string(),
    emailVerified: v.boolean(),
    name: v.string(),
    updatedAt: v.string(),
  }),
});

export default schema;
