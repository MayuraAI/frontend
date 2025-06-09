import { Tables } from "@/supabase/types";
import { FC, useState, useContext, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { MayuraContext } from "@/context/context";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import {
  IconCheck,
  IconCopy,
  IconEdit,
  IconTrash,
  IconX,
  IconUser,
  IconRobot,
} from "@tabler/icons-react";
import { toast } from "sonner";
import MarkdownContent from "../ui/markdown-content";

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

  const userTextareaRef = useRef<HTMLTextAreaElement>(null);
  const assistantTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing) {
      const textareaRef = message.role === "user" ? userTextareaRef : assistantTextareaRef;
      if (textareaRef.current) {
        textareaRef.current.focus();
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
        "message-enter group mb-6 transition-all duration-200",
        isUser ? "flex justify-end" : "flex justify-start"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {isUser ? (
        // User Message (right side)
        <div className="flex max-w-2xl items-start gap-3">
          <div className="flex flex-col items-end space-y-2">
            {isEditing ? (
              <Card className="w-full">
                <CardContent className="p-4">
                  <Textarea
                    ref={userTextareaRef}
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="min-h-[100px] resize-none border-none bg-transparent p-0 focus-visible:ring-0"
                    placeholder="Edit your message..."
                  />
                  <div className="mt-4 flex items-center gap-2 border-t pt-4">
                    <Button
                      onClick={handleSubmit}
                      size="sm"
                      className="h-8"
                    >
                      <IconCheck size={14} className="mr-1" />
                      Save
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onCancelEdit} className="h-8">
                      <IconX size={14} className="mr-1" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="rounded-2xl rounded-br-md bg-primary px-4 py-3 text-primary-foreground shadow-sm">
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Assistant Message (left side)
        <div className="w-full max-w-4xl">
          <div className="flex items-start gap-3">

            <div className="flex-1 space-y-2">
              {/* Model Badge */}
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                {/* <span className="italic">via</span> */}
                {message.model_name && (
                  <span className="px-2 py-[1px] rounded-md bg-muted border border-border text-xs font-mono tracking-wide italic opacity-60 hover:opacity-100 transition-opacity duration-200">
                    {message.model_name}
                  </span>
                )}
              </div>

              {/* Message Content */}
              {isEditing ? (
                <Card>
                  <CardContent className="p-4">
                    <Textarea
                      ref={assistantTextareaRef}
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="min-h-[100px] resize-none border-none bg-transparent p-0 focus-visible:ring-0"
                      placeholder="Edit assistant response..."
                    />
                    <div className="mt-4 flex items-center gap-2 border-t pt-4">
                      <Button
                        onClick={handleSubmit}
                        size="sm"
                        className="h-8"
                      >
                        <IconCheck size={14} className="mr-1" />
                        Save
                      </Button>
                      <Button variant="ghost" size="sm" onClick={onCancelEdit} className="h-8">
                        <IconX size={14} className="mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <MarkdownContent aiResponse={message.content} />
                </div>
              )}

              {/* Message Actions */}
              {!isGenerating && !isEditing && (
                <div
                  className={cn(
                    "flex items-center gap-1 transition-opacity duration-200",
                    showActions ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-8 px-2 text-muted-foreground hover:text-foreground"
                  >
                    {isCopied ? (
                      <IconCheck size={14} className="mr-1" />
                    ) : (
                      <IconCopy size={14} className="mr-1" />
                    )}
                    {isCopied ? "Copied" : "Copy"}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleStartEdit}
                    className="h-8 px-2 text-muted-foreground hover:text-foreground"
                  >
                    <IconEdit size={14} className="mr-1" />
                    Edit
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
