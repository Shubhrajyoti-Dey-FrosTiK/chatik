import Chat from "./Chat";

interface Props {
  params: Promise<{ chatId: string }>;
}

async function Page(props: Props) {
  const { chatId } = await props.params;

  return (
    <div className="relative min-h-full">
      <div className="h-full w-full flex flex-row gap-2 justify-evenly">
        <Chat chatId={chatId} />
      </div>
    </div>
  );
}

export default Page;
