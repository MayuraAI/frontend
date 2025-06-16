import React, { useState, useRef } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css" // or any theme you want
import { Button } from "./button" // Assuming button is in the same ui folder
import { IconCheck, IconCopy } from "@tabler/icons-react"
import { toast } from "sonner"

interface MarkdownContentProps {
  aiResponse: string
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({ aiResponse }) => {
  if (!aiResponse) {
    return (
      <div className="text-muted-foreground italic">
        <span className="loading-wave">Mayura is thinking</span>
        <span className="loading-dots">...</span>
        <style>
          {`
            .loading-wave {
              display: inline-block;
              position: relative;
              background: linear-gradient(90deg, 
                rgba(107, 114, 128, 0.2),
                rgba(107, 114, 128, 0.8),
                rgba(107, 114, 128, 0.2)
              );
              background-size: 200% 100%;
              background-clip: text;
              -webkit-background-clip: text;
              color: transparent;
              animation: wave 2s infinite linear;
            }
            .loading-dots {
              display: inline-block;
              animation: dots 1.5s infinite;
            }
            @keyframes wave {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
            @keyframes dots {
              0%, 20% { content: '.'; }
              40% { content: '..'; }
              60%, 100% { content: '...'; }
            }
          `}
        </style>
      </div>
    )
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeHighlight]}
      components={{
        pre: ({ children, ...props }) => {
          const [copied, setCopied] = useState(false);
          const preRef = useRef<HTMLPreElement>(null);

          // This function now correctly handles copying the full text content of the <pre> block
          const handleCopy = () => {
            if (preRef.current?.innerText) {
              navigator.clipboard.writeText(preRef.current.innerText);
              setCopied(true);
              toast.success("Code copied to clipboard");
              setTimeout(() => setCopied(false), 2000);
            }
          };

          return (
            <div className="group relative">
              <Button
                variant="ghost"
                size="icon"
                className="bg-background/80 hover:bg-background absolute right-2 top-2 z-10 size-7 opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100"
                onClick={handleCopy}
              >
                {copied ? <IconCheck className="size-4" /> : <IconCopy className="size-4" />}
              </Button>
              <pre ref={preRef} {...props} className="my-4 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm">
                {children}
              </pre>
            </div>
          );
        },
        code: ({ className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '');
          // Style for inline code
          if (!match) {
            return <code className={`${className} rounded bg-gray-200 px-1 py-0.5 font-mono text-red-600`} {...props}>{children}</code>
          }
          // Style for code blocks (handled by rehype-highlight)
          return <code className={className} {...props}>{children}</code>
        }
      }}
    >
      {aiResponse}
    </ReactMarkdown>
  )
}

export default MarkdownContent