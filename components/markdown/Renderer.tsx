import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Code from "./components/code/Code";

export interface Props {
  markdown: string;
  id: string;
}

function Renderer(props: Props) {
  const { markdown } = props;

  return (
    <div className="w-full">
      <Markdown
        components={{
          // eslint-disable-next-line
          code({ children, className }: any) {
            const isInline = className ? false : true;
            const language = /language-(\w+)/.exec(className || "");
            return (
              <Code
                code={String(children).replace(/\n$/, "")}
                language={language ? language[1] : ""}
                isInline={isInline}
              />
            );
          },
        }}
        remarkPlugins={[remarkGfm]}
      >
        {markdown}
      </Markdown>
    </div>
  );
}

export default Renderer;
