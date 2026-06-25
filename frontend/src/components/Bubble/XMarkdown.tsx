import { CodeHighlighter } from "@ant-design/x";
import { Think } from "@ant-design/x";
import type { ComponentProps } from "@ant-design/x-markdown";
import AntXMarkdown from "@ant-design/x-markdown";
import React from "react";
import locale from "../../_utils/local";
import "./styles/markdown-pc-special-class.css";

const MARKDOWN_PC_CLASS = "markdown-pc-special-class";

const Code: React.FC<ComponentProps> = (props) => {
  const { className, children } = props;
  const lang = className?.match(/language-(\w+)/)?.[1] || "";

  if (typeof children !== "string") return null;
  return <CodeHighlighter lang={lang}>{children}</CodeHighlighter>;
};

const ThinkComponent = React.memo((props: ComponentProps) => {
  const [title, setTitle] = React.useState(`${locale.deepThinking}...`);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (props.streamStatus === "done") {
      setTitle(locale.completeThinking);
      setLoading(false);
    }
  }, [props.streamStatus]);

  return (
    <Think title={title} loading={loading}>
      {props.children}
    </Think>
  );
});

export type BubbleXMarkdownProps = {
  className: string;
  content: string;
  status?: string;
};

const BubbleXMarkdown: React.FC<BubbleXMarkdownProps> = ({
  className,
  content,
  status,
}) => {
  return (
    <div style={{ width: "100%" }}>
      <AntXMarkdown
        paragraphTag="div"
        components={{
          think: ThinkComponent,
          code: Code,
        }}
        className={`${className} ${MARKDOWN_PC_CLASS}`}
        streaming={{
          hasNextChunk: status === "updating",
          enableAnimation: true,
        }}
      >
        {content}
      </AntXMarkdown>
    </div>
  );
};

export default BubbleXMarkdown;
