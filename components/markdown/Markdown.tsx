import { marked } from "marked";
import dynamic from "next/dynamic";
import { memo, Suspense, useMemo } from "react";
import { Props } from "./Renderer";

const Renderer = dynamic(() => import("@/components/markdown/Renderer"), {
  ssr: false,
  // loading: () => <Skeleton className="h-10 py-2 w-full" />,
});

function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown);
  return tokens.map((token) => token.raw);
}

const MemoizedMarkdownBlock = memo(
  (props: Props) => {
    return (
      <Suspense fallback={<div>{props.markdown}</div>}>
        <Renderer {...props} />
      </Suspense>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.markdown !== nextProps.markdown) return false;
    return true;
  },
);

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock";

export const MemoizedMarkdown = memo((props: Props) => {
  const blocks = useMemo(
    () => parseMarkdownIntoBlocks(props.markdown),
    [props.markdown],
  );

  return blocks.map((block, index) => (
    <MemoizedMarkdownBlock
      id={props.id}
      markdown={block}
      key={`${props.id}-block_${index}`}
    />
  ));
});

MemoizedMarkdown.displayName = "MemoizedMarkdown";

export default MemoizedMarkdown;
