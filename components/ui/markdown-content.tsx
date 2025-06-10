import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css" // or any theme you want

interface MarkdownContentProps {
  aiResponse: string
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({ aiResponse }) => {
  if (!aiResponse) {
    return (
      <div className="italic text-gray-500">
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
    >
      {aiResponse}
    </ReactMarkdown>
  )
}

export default MarkdownContent
