import Code from "./code/Code";

export function getMarkdownComponents() {
  return {
    // eslint-disable-next-line
    code({ children, className }: any) {
      const language = /language-(\w+)/.exec(className || "");

      return Code({
        code: String(children).replace(/\n$/, ""),
        language: language ? language[1] : "",
      });
    },
  };
}
