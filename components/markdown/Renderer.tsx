import { marked } from "marked";
import { memo, useId, useMemo } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import Code from "../markdown/components/code/Code";

export interface Props {
  markdown: string;
  id: string;
}

function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown);
  return tokens.map((token) => token.raw);
}

function extractLanguage(className?: string): string {
  if (!className) return "plaintext";
  const match = className.match(/language-(\w+)/);
  return match ? match[1] : "plaintext";
}

const CUSTOM_COMPONENTS: Partial<Components> = {
  code: function CodeComponent({ className, children, ...props }) {
    const isInline =
      !props.node?.position?.start.line ||
      props.node?.position?.start.line === props.node?.position?.end.line;

    const language = extractLanguage(className);

    return (
      <Code
        code={String(children).replace(/\n$/, "")}
        language={language}
        isInline={isInline}
      />
    );
  },
  pre: function PreComponent({ children }) {
    return <>{children}</>;
  },
};

const MemoizedMarkdownBlock = memo(
  function MarkdownBlock({ content }: { content: string }) {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={CUSTOM_COMPONENTS}
      >
        {content}
      </ReactMarkdown>
    );
  },
  function propsAreEqual(prevProps, nextProps) {
    return prevProps.content === nextProps.content;
  },
);

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock";

function MarkdownComponent({ markdown, id }: Props) {
  const generatedId = useId();
  const blockId = id ?? generatedId;
  const blocks = useMemo(() => parseMarkdownIntoBlocks(markdown), [markdown]);

  return (
    <div>
      {blocks.map((block, index) => (
        <MemoizedMarkdownBlock
          key={`${blockId}-block-${index}`}
          content={block}
        />
      ))}
    </div>
  );
}

const Markdown = memo(MarkdownComponent);
Markdown.displayName = "Markdown";

export { Markdown };
