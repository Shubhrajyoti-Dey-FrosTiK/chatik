"use client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useClipboard } from "@mantine/hooks";
import { Check, Copy } from "lucide-react";

interface Props {
  code: string;
  language: string;
}

function Code(props: Props) {
  const { code, language } = props;
  const clipboard = useClipboard({ timeout: 2000 });

  return (
    <div>
      <div className="[&>*]:!m-0">
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
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default Code;
