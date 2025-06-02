import Chat from "./Chat";

interface Props {
  params: Promise<{ chatId: string }>;
}

async function Page(props: Props) {
  const { chatId } = await props.params;

  return (
    <div className="relative min-h-full">
      <Chat chatId={chatId} />
    </div>
  );
}

export default Page;
