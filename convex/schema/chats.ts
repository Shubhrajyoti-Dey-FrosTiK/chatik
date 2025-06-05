import { v } from "convex/values";

export const ChatSchema = v.object({
  name: v.string(),
  user: v.id("user"),
  chainIds: v.array(v.id("messages")),
});
