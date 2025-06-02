import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { v4 } from "uuid";
import { UIMessage } from "ai";
import schema from "./schema";

export const getByUser = query({
  args: { user: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chats")
      .filter((q) => q.eq(q.field("user"), args.user))
      .collect();
  },
});

export const create = mutation({
  args: {
    user: v.id("user"),
    input: v.string(),
  },
  handler: async (ctx, args): Promise<string> => {
    const newMessageId = v4();

    let chatId = await ctx.db.insert("chats", {
      user: args.user,
      name: args.input,
    });

    await ctx.db.insert<"messages">("messages", {
      id: newMessageId,
      chatId,
      role: "user",
      parts: [
        {
          type: "text",
          text: args.input,
        },
      ],
    });

    return chatId;
  },
});
