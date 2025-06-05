import { defineSchema, defineTable } from "convex/server";
import { AccountSchema, SessionSchema, UserSchema } from "./schema/account";
import { ChatSchema } from "./schema/chats";
import { MessageSchema } from "./schema/message";

const schema = defineSchema({
  account: defineTable(AccountSchema),
  chats: defineTable(ChatSchema),
  messages: defineTable(MessageSchema),
  session: defineTable(SessionSchema),
  user: defineTable(UserSchema),
});

export default schema;
