import { Star, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface Email {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  time: string;
  isUnread: boolean;
  isStarred: boolean;
  hasAttachment: boolean;
}

interface EmailListProps {
  emails: Email[];
  selectedEmail: string | null;
  onEmailSelect: (id: string) => void;
}

export const EmailList = ({ emails, selectedEmail, onEmailSelect }: EmailListProps) => {
  return (
    <div className="w-96 border-r border-border bg-background overflow-y-auto">
      {emails.map((email) => (
        <div
          key={email.id}
          onClick={() => onEmailSelect(email.id)}
          className={cn(
            "border-b border-border p-4 cursor-pointer transition-colors",
            selectedEmail === email.id
              ? "bg-email-selected"
              : "hover:bg-email-hover"
          )}
        >
          <div className="flex items-start justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">{email.sender}</span>
            <div className="flex items-center gap-2 ml-2">
              <span className="text-xs text-muted-foreground">{email.time}</span>
              <Star
                className={cn(
                  "h-4 w-4",
                  email.isStarred ? "fill-primary text-primary" : "text-muted-foreground"
                )}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-muted-foreground">{email.subject}</span>
            {email.hasAttachment && (
              <Paperclip className="h-3 w-3 text-muted-foreground" />
            )}
          </div>
          
          <p className="text-xs text-muted-foreground truncate">{email.preview}</p>
        </div>
      ))}
    </div>
  );
};
