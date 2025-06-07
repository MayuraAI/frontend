import { Tables } from "@/supabase/types";
import { FC, useState, useContext } from "react";
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
        "message-enter mb-8 group",
        isUser ? "flex justify-end" : "flex justify-start"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {isUser ? (
        // User Message (right side)
        <div className="flex items-start gap-4 max-w-2xl">
          {isEditing ? (
            <div className="flex-1 bg-bg-tertiary border border-border-color rounded-2xl p-4">
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[100px] bg-transparent border-none focus-visible:ring-0 resize-none"
                placeholder="Edit your message..."
              />
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border-light">
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
            <div className="flex-1 bg-user-bg text-user-text px-4 py-3 rounded-2xl rounded-br-lg shadow-mayura-sm">
              <MarkdownContent aiResponse={message.content} />
            </div>
          )}

          <div className="w-8 h-8 rounded-full bg-interactive-active flex items-center justify-center flex-shrink-0">
            <IconUser size={20} className="text-brand-primary" />
          </div>
        </div>
      ) : (
        // Assistant Message (left side)
        <div className="max-w-4xl w-full">
          <div className="mb-3 flex items-center gap-2">
            {message.model_name && (
              <span className="text-xs text-text-muted bg-interactive-active px-2 py-1 rounded-full">
                {message.model_name}
              </span>
            )}
          </div>

          {isEditing ? (
            <div className="bg-bg-tertiary border border-border-color rounded-2xl p-4">
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[100px] bg-transparent border-none focus-visible:ring-0 resize-none"
                placeholder="Edit assistant response..."
              />
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border-light">
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
                "flex items-center gap-1 mt-3 transition-smooth",
                showActions ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 px-2 hover:bg-interactive-hover text-text-muted hover:text-text-secondary"
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
                    className="h-8 px-2 hover:bg-interactive-hover text-text-muted hover:text-text-secondary"
                  >
                    <IconEdit size={16} />
                    <span className="ml-1 text-xs">Edit</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSubmitEdit("", message.sequence_number)}
                    className="h-8 px-2 hover:bg-destructive/10 text-text-muted hover:text-destructive"
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
