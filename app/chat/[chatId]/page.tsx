import React from "react";
import SearchBox from "./SearchBox";

// interface Props {
//   params: Promise<{ chatId: string }>;
// }

async function Page() {
  // props: Props
  // const { chatId } = await props.params;

  return (
    <div className="relative w-full h-full">
      <SearchBox />
    </div>
  );
}

export default Page;
