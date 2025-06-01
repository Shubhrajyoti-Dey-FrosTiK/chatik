import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getMarkdownComponents } from "./components/components";

export interface Props {
  markdown: string;
}

function Renderer(props: Props) {
  const { markdown } = props;

  return (
    <div className="w-full">
      <Markdown
        components={getMarkdownComponents()}
        remarkPlugins={[remarkGfm]}
      >
        {markdown}
      </Markdown>
    </div>
  );
}

export default Renderer;
