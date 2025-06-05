import { Infer, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { MessageSchema } from "./schema/message";
import schema from "./schema";

export const getByChatId = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args): Promise<Array<Infer<typeof MessageSchema>>> => {
    return await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("chatId"), args.chatId))
      .collect();
  },
});

export const create = mutation({
  args: schema.tables.messages.validator,
  handler: async (ctx, args): Promise<string> => {
    return await ctx.db.insert("messages", args);
  },
});
