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

export enum AttachmentClassification {
  PDF = "PDF",
  IMAGE = "IMAGE",
  YOUTUBE = "YOUTUBE",
  NONE = "NONE",
}

export const MessageAttachment = v.object({
  attachmentId: v.string(),
  fileName: v.string(),
  contentType: v.string(),
  url: v.string(),
  attachmentClassification: v.union(
    ...Object.keys(AttachmentClassification).map((classification) =>
      v.literal(classification),
    ),
  ),
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
  attachments: v.optional(v.array(MessageAttachment)),
});
