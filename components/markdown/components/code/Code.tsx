"use client";
import { useClipboard } from "@mantine/hooks";
import { Check, Copy } from "lucide-react";
import { memo, useMemo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface Props {
  code: string;
  language: string;
  isInline: boolean;
}

const Code = memo(
  (props: Props) => {
    const { code, language, isInline } = props;
    const highlightedCode = useMemo(() => code, [code]);
    const clipboard = useClipboard({ timeout: 2000 });

    if (isInline) {
      return (
        <span
          style={{
            background: "#2d2d2d",
            color: "#f8f8f2",
            padding: "0.2em 0.4em",
            borderRadius: "4px",
            fontFamily: "monospace",
            fontSize: "0.95em",
            whiteSpace: "pre-wrap",
          }}
        >
          {highlightedCode}
        </span>
      );
    }
    return (
      <div className="[&>*]:!m-0 my-4">
        <div className="flex justify-between items-center p-2 bg-gray-700">
          <p>{language}</p>
          {clipboard.copied ? (
            <Check color="green" />
          ) : (
            <Copy
              size={20}
              onClick={() => {
                clipboard.copy(code);
              }}
            />
          )}
        </div>
        <SyntaxHighlighter
          customStyle={{
            width: "100%",
          }}
          language={language}
          style={dracula}
        >
          {highlightedCode}
        </SyntaxHighlighter>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.code === nextProps.code &&
      prevProps.language === nextProps.language
    );
  },
);

Code.displayName = "Code";

export default Code;
