// db.ts
import { MessageSchema } from "@/convex/schema";
import { Infer } from "convex/values";
import Dexie, { type EntityTable } from "dexie";

const dexie = new Dexie("MessagesByChatIdDB") as Dexie & {
  messages: EntityTable<
    Infer<typeof MessageSchema>,
    "id" // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
dexie.version(1).stores({
  messages: "chatId",
});

export { dexie };
