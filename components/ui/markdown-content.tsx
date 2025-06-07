import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // or any theme you want

interface MarkdownContentProps {
  aiResponse: string;
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({ aiResponse }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeHighlight]}
    >
      {aiResponse}
    </ReactMarkdown>
  );
};

export default MarkdownContent;
