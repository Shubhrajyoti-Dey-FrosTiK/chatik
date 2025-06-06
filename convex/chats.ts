import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { MessageAttachment, MessagePart } from "./schema/message";

export const getByUser = query({
  args: { user: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chats")
      .filter((q) => q.eq(q.field("user"), args.user))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("chats") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    user: v.id("user"),
    name: v.string(),
    parts: v.array(MessagePart),
    attachments: v.optional(v.array(MessageAttachment)),
  },
  handler: async (
    ctx,
    args,
  ): Promise<{ chatId: string; messageId: string }> => {
    let chatId = await ctx.db.insert("chats", {
      user: args.user,
      name: args.name,
      chainIds: [],
    });

    const messageId = await ctx.db.insert<"messages">("messages", {
      chatId,
      role: "user",
      parts: args.parts,
      attachments: args.attachments,
    });

    await ctx.db.patch(chatId, {
      chainIds: [messageId],
    });

    return { chatId, messageId };
  },
});

export const updateChatMessageChain = mutation({
  args: {
    id: v.id("chats"),
    chainIds: v.array(v.id("messages")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      chainIds: args.chainIds,
    });
  },
});
