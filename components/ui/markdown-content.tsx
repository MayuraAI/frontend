import React, { useState, useRef } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"
import { Button } from "./button"
import { IconCheck, IconCopy } from "@tabler/icons-react"
import { toast } from "sonner"
import { ThinkingBlock } from "./thinking-block"
import { parseThinkingResponse } from "@/lib/thinking-parser"

interface MarkdownContentProps {
  aiResponse: string
}

const PreWithCopy: React.FC<React.HTMLAttributes<HTMLPreElement>> = ({
  children,
  ...props
}) => {
  const [copied, setCopied] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)

  const handleCopy = () => {
    if (preRef.current?.innerText) {
      navigator.clipboard.writeText(preRef.current.innerText)
      setCopied(true)
      toast.success("Code copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="group relative my-4">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 z-10 size-8 border border-slate-600 bg-slate-800/90 text-slate-300 opacity-0 backdrop-blur transition-opacity duration-200 hover:bg-slate-700 group-hover:opacity-100"
        onClick={handleCopy}
      >
        {copied ? (
          <IconCheck className="size-4" />
        ) : (
          <IconCopy className="size-4" />
        )}
      </Button>
      <pre
        ref={preRef}
        {...props}
        className="overflow-x-auto rounded-md border border-slate-700 bg-slate-900 p-4 font-mono text-sm leading-relaxed text-slate-100"
      >
        {children}
      </pre>
    </div>
  )
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({ aiResponse }) => {
  if (!aiResponse) {
    return (
      <div className="flex items-center space-x-2 py-4 italic text-slate-400">
        <span className="loading-wave">Mayura is thinking</span>
        <span className="loading-dots">...</span>
        <style jsx>{`
          .loading-wave {
            display: inline-block;
            position: relative;
            background: linear-gradient(
              90deg,
              rgba(148, 163, 184, 0.4),
              rgba(148, 163, 184, 1),
              rgba(148, 163, 184, 0.4)
            );
            background-size: 200% 100%;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            color: transparent;
            animation: wave 2s infinite linear;
          }
          .loading-dots {
            display: inline-block;
            animation: dots 1.5s infinite;
            color: rgba(148, 163, 184, 0.8);
          }
          @keyframes wave {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
          @keyframes dots {
            0%,
            20% {
              opacity: 0.4;
            }
            40% {
              opacity: 0.8;
            }
            60%,
            100% {
              opacity: 1;
            }
          }
        `}</style>
      </div>
    )
  }

  // Parse the response to separate thinking from main content
  const { thinking, response } = parseThinkingResponse(aiResponse)

  return (
    <div className="github-markdown">
      {/* Show thinking block if thinking content exists */}
      {thinking && <ThinkingBlock thinking={thinking} />}

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          pre: PreWithCopy,
          p: ({ children, ...props }) => (
            <p className="mb-4 leading-6 text-white" {...props}>
              {children}
            </p>
          ),
          h1: ({ children, ...props }) => (
            <h1
              className="mb-4 mt-6 border-b border-slate-700 pb-2 text-3xl font-semibold leading-tight text-white"
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2
              className="mb-4 mt-6 border-b border-slate-700 pb-2 text-2xl font-semibold leading-tight text-white"
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3
              className="mb-3 mt-6 text-xl font-semibold leading-tight text-white"
              {...props}
            >
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4
              className="mb-3 mt-4 text-lg font-semibold leading-tight text-white"
              {...props}
            >
              {children}
            </h4>
          ),
          h5: ({ children, ...props }) => (
            <h5
              className="mb-3 mt-4 text-base font-semibold leading-tight text-white"
              {...props}
            >
              {children}
            </h5>
          ),
          h6: ({ children, ...props }) => (
            <h6
              className="mb-3 mt-4 text-sm font-semibold leading-tight text-slate-300"
              {...props}
            >
              {children}
            </h6>
          ),
          ul: ({ children, ...props }) => (
            <ul
              className="mb-4 ml-6 list-disc space-y-1 text-white"
              {...props}
            >
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol
              className="mb-4 ml-6 list-decimal space-y-1 text-white"
              {...props}
            >
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="leading-6" {...props}>
              {children}
            </li>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="mb-4 border-l-4 border-slate-600 bg-slate-800 py-2 pl-4 pr-2 text-slate-300"
              {...props}
            >
              {children}
            </blockquote>
          ),
          hr: ({ ...props }) => (
            <hr className="my-6 border-0 border-t border-slate-700" {...props} />
          ),
          table: ({ children, ...props }) => (
            <div className="mb-4 overflow-x-auto">
              <table
                className="min-w-full border-collapse border-spacing-0"
                {...props}
              >
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-slate-800" {...props}>
              {children}
            </thead>
          ),
          th: ({ children, ...props }) => (
            <th
              className="border border-slate-600 px-3 py-2 text-left text-sm font-semibold text-white"
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td
              className="border border-slate-600 px-3 py-2 text-sm text-white"
              {...props}
            >
              {children}
            </td>
          ),
          strong: ({ children, ...props }) => (
            <strong className="font-semibold text-white" {...props}>
              {children}
            </strong>
          ),
          em: ({ children, ...props }) => (
            <em className="italic text-white" {...props}>
              {children}
            </em>
          ),
          a: ({ children, href, ...props }) => (
            <a
              href={href}
              className="text-violet-400 hover:text-violet-300 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          ),
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "")
            if (!match) {
              return (
                <code
                  className="rounded border border-slate-600 bg-slate-800 px-1.5 py-0.5 font-mono text-sm text-slate-200"
                  {...props}
                >
                  {children}
                </code>
              )
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
          del: ({ children, ...props }) => (
            <del className="text-slate-400 line-through" {...props}>
              {children}
            </del>
          ),
          // GitHub-style task lists
          input: ({ type, checked, ...props }) => {
            if (type === "checkbox") {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  disabled
                  className="mr-2 accent-violet-500"
                  {...props}
                />
              )
            }
            return <input type={type} {...props} />
          }
        }}
      >
        {response}
      </ReactMarkdown>

      <style jsx>{`
        .github-markdown {
          font-family:
            -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans",
            Helvetica, Arial, sans-serif;
          line-height: 1.5;
          color: #ffffff;
          word-wrap: break-word;
        }

        .github-markdown > *:first-child {
          margin-top: 0 !important;
        }

        .github-markdown > *:last-child {
          margin-bottom: 0 !important;
        }

        /* Dark code blocks with proper highlighting */
        .github-markdown pre {
          background-color: #0f172a;
          border: 1px solid #475569;
          border-radius: 6px;
          font-size: 85%;
          line-height: 1.45;
          overflow: auto;
          padding: 16px;
        }

        .github-markdown pre code {
          background-color: transparent;
          border: 0;
          display: inline;
          line-height: inherit;
          margin: 0;
          overflow: visible;
          padding: 0;
          word-wrap: normal;
          color: #e2e8f0;
        }

        /* Dark tables */
        .github-markdown table tr {
          background-color: #1e293b;
          border-top: 1px solid #475569;
        }

        .github-markdown table tr:nth-child(2n) {
          background-color: #334155;
        }

        /* Dark blockquotes */
        .github-markdown blockquote {
          border-left: 0.25em solid #475569;
          color: #cbd5e1;
          padding: 0 1em;
        }

        /* Dark horizontal rules */
        .github-markdown hr {
          background-color: #475569;
          border: 0;
          height: 0.25em;
          margin: 24px 0;
          padding: 0;
        }
      `}</style>
    </div>
  )
}

export default MarkdownContent
