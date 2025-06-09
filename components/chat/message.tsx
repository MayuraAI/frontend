import { Tables } from "@/supabase/types";
import { FC, useState, useContext, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { MayuraContext } from "@/context/context";
import { cn } from "@/lib/utils";
import {
  IconCheck,
  IconCopy,
  IconEdit,
  IconTrash,
  IconX,
  IconUser,
} from "@tabler/icons-react";
import { toast } from "sonner";
import MarkdownContent from "../ui/markdown-content"; // Make sure this path is correct

interface MessageProps {
  message: Tables<"messages">;
  isEditing: boolean;
  isLast: boolean;
  onStartEdit: (message: Tables<"messages">) => void;
  onCancelEdit: () => void;
  onSubmitEdit: (content: string, sequenceNumber: number) => void;
}

export const Message: FC<MessageProps> = ({
  message,
  isEditing,
  isLast,
  onStartEdit,
  onCancelEdit,
  onSubmitEdit,
}) => {
  const { profile, isGenerating } = useContext(MayuraContext);

  const [editedContent, setEditedContent] = useState(message.content);
  const [isCopied, setIsCopied] = useState(false);
  const [showActions, setShowActions] = useState(false);
  
  // Add refs for textarea elements to ensure proper focus management
  const userTextareaRef = useRef<HTMLTextAreaElement>(null);
  const assistantTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing) {
      const textareaRef = message.role === "user" ? userTextareaRef : assistantTextareaRef;
      if (textareaRef.current) {
        textareaRef.current.focus();
        // Set cursor to end of text
        textareaRef.current.setSelectionRange(
          textareaRef.current.value.length,
          textareaRef.current.value.length
        );
      }
    }
  }, [isEditing, message.role]);

  const handleCopy = () => {
    if (!message.content) return;

    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    toast.success("Copied to clipboard");

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleStartEdit = () => {
    onStartEdit(message);
    setEditedContent(message.content);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!editedContent || editedContent === message.content) {
      onCancelEdit();
      return;
    }

    onSubmitEdit(editedContent, message.sequence_number);
    onCancelEdit();
  };

  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={cn(
        "message-enter group mb-8",
        isUser ? "flex justify-end" : "flex justify-start"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {isUser ? (
        // User Message (right side)
        <div className="flex max-w-2xl items-start gap-4">
          {isEditing ? (
            <div className="bg-bg-tertiary border-border-color flex-1 rounded-2xl border p-4">
              <Textarea
                ref={userTextareaRef}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[100px] resize-none border-none bg-transparent focus-visible:ring-0"
                placeholder="Edit your message..."
              />
              <div className="border-border-light mt-3 flex items-center gap-2 border-t pt-3">
                <Button
                  onClick={handleSubmit}
                  size="sm"
                  className="bg-brand-primary hover:bg-brand-primary/90"
                >
                  <IconCheck size={16} className="mr-1" />
                  Save
                </Button>
                <Button variant="ghost" size="sm" onClick={onCancelEdit}>
                  <IconX size={16} className="mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-user-bg text-user-text shadow-mayura-sm flex-1 rounded-2xl rounded-br-lg px-4 py-3">
              {message.content}
            </div>
          )}
        </div>
      ) : (
        // Assistant Message (left side)
        <div className="w-full max-w-4xl">
          <div className="mb-3 flex items-center gap-2">
            {message.model_name && (
              <div>
                <span className="mr-2 text-xs font-normal" style={{ color: '#888888' }}>
                  Mayura AI
                </span>
                <span className="rounded-full px-2 py-1 text-xs font-normal" style={{ color: '#aaaaaa', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                  {message.model_name}
                </span>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="bg-bg-tertiary border-border-color rounded-2xl border p-4">
              <Textarea
                ref={assistantTextareaRef}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[100px] resize-none border-none bg-transparent focus-visible:ring-0"
                placeholder="Edit assistant response..."
              />
              <div className="border-border-light mt-3 flex items-center gap-2 border-t pt-3">
                <Button
                  onClick={handleSubmit}
                  size="sm"
                  className="bg-brand-primary hover:bg-brand-primary/90"
                >
                  <IconCheck size={16} className="mr-1" />
                  Save
                </Button>
                <Button variant="ghost" size="sm" onClick={onCancelEdit}>
                  <IconX size={16} className="mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <MarkdownContent aiResponse={message.content} />
            </div>
          )}

          {/* Message Actions */}
          {!isGenerating && !isEditing && (
            <div
              className={cn(
                "transition-smooth mt-3 flex items-center gap-1",
                showActions ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="hover:bg-interactive-hover text-text-muted hover:text-text-secondary h-8 px-2"
              >
                {isCopied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                <span className="ml-1 text-xs">{isCopied ? "Copied" : "Copy"}</span>
              </Button>

              {message.role === "user" && isLast && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleStartEdit}
                    className="hover:bg-interactive-hover text-text-muted hover:text-text-secondary h-8 px-2"
                  >
                    <IconEdit size={16} />
                    <span className="ml-1 text-xs">Edit</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSubmitEdit("", message.sequence_number)}
                    className="hover:bg-destructive/10 text-text-muted hover:text-destructive h-8 px-2"
                  >
                    <IconTrash size={16} />
                    <span className="ml-1 text-xs">Delete</span>
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
