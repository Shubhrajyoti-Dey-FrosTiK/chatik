// db.ts
import { MessageSchema } from "@/convex/schema";
import { Infer } from "convex/values";
import Dexie, { type EntityTable } from "dexie";

const dexie = new Dexie("MessagesByChatIdDB") as Dexie & {
  messages: EntityTable<
    Infer<typeof MessageSchema>,
    "_id" // primary key "id" (for the typings only)
  >;

  chainIds: EntityTable<
    {
      chatId: string;
      chainIds: string[];
    },
    "chatId"
  >;
};

// Schema declaration:
dexie.version(1).stores({
  messages: "++_id, chatId",
  chainIds: "++chatId",
});

export { dexie };
