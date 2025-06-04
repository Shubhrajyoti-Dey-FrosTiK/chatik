import { MessageSchema } from "@/convex/schema";
import { Infer } from "convex/values";

export type MessageGraph = Record<string, Array<Infer<typeof MessageSchema>>>;

export function createMessageGraph(
  messages: Array<Infer<typeof MessageSchema>>,
): MessageGraph {
  const messageGraph: MessageGraph = { ROOT: [] };
  messages.forEach((message) => {
    if (!message._id) return;

    if (!messageGraph[message._id]) {
      messageGraph[message._id] = [];
    }

    if (!message.prevMessage) {
      messageGraph.ROOT.push(message);
    } else {
      messageGraph[message.prevMessage].push(message);
    }
  });
  return messageGraph;
}
