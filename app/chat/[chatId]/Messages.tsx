import { UIMessage } from "ai";
import Message, { MessageLoading } from "./Message";

interface Props {
  messages: Array<UIMessage>;
}

function Messages(props: Props) {
  const { messages } = props;

  return (
    <div className="w-full">
      {messages.map((message) => (
        <div key={`Message_${message.id}`} className="w-full my-5">
          {message.role == "user" && (
            <div className="flex w-full justify-end">
              <div className="bg-gray-800 max-w-[80%] px-4 py-2 rounded-sm">
                <Message message={message as UIMessage} />
              </div>
            </div>
          )}

          {message.role == "assistant" && (
            <div>
              <Message message={message as UIMessage} />
            </div>
          )}
        </div>
      ))}

      {messages.length && messages[messages.length - 1].role == "user" && (
        <MessageLoading />
      )}
    </div>
  );
}

export default Messages;
