import { Skeleton } from "@/components/ui/skeleton";
import { Props } from "./Renderer";
import dynamic from "next/dynamic";

const Renderer = dynamic(() => import("@/components/markdown/Renderer"), {
  ssr: false,
  loading: () => <Skeleton className="h-10 py-2 w-full" />,
});

function Markdown(props: Props) {
  return <Renderer {...props} />;
}

export default Markdown;
