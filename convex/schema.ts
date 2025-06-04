import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const MessagePart = v.union(
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
);

export const MessageSource = v.object({
  type: v.literal("source"),
  sourceType: v.literal("url"),
  id: v.string(),
  url: v.string(),
  title: v.optional(v.string()),
  providerMetadata: v.optional(v.any()),
});

export const MessageUsage = v.object({
  inputTokens: v.optional(v.number()),
  outputTokens: v.optional(v.number()),
  totalTokens: v.optional(v.number()),
  reasoningTokens: v.optional(v.number()),
  cachedInputTokens: v.optional(v.number()),
});

export const MessageSchema = v.object({
  _id: v.optional(v.id("messages")), // Just for type safety
  _creationTime: v.optional(v.number()), // Just for type safety
  chatId: v.id("chats"),
  role: v.string(),
  parts: v.array(MessagePart),
  sources: v.optional(v.array(MessageSource)),
  usage: v.optional(MessageUsage),
  time: v.optional(v.number()),
  prevMessage: v.optional(v.id("messages")),
});

export const ChatSchema = v.object({
  name: v.string(),
  user: v.id("user"),
  chainIds: v.array(v.id("messages")),
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
  chats: defineTable(ChatSchema),
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
