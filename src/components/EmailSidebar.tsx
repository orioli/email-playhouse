import { Inbox, Send, FileText, Trash2, Star, Archive, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmailSidebarProps {
  selectedFolder: string;
  onFolderChange: (folder: string) => void;
  onCompose: () => void;
}

const folders = [
  { id: "inbox", label: "Inbox", icon: Inbox, count: 12 },
  { id: "starred", label: "Starred", icon: Star, count: 3 },
  { id: "sent", label: "Sent", icon: Send, count: 0 },
  { id: "drafts", label: "Drafts", icon: FileText, count: 2 },
  { id: "archive", label: "Archive", icon: Archive, count: 0 },
  { id: "trash", label: "Trash", icon: Trash2, count: 5 },
];

export const EmailSidebar = ({ selectedFolder, onFolderChange, onCompose }: EmailSidebarProps) => {
  return (
    <div className="w-64 border-r border-border bg-sidebar flex flex-col">
      <div className="p-4">
        <Button onClick={onCompose} className="w-full" size="lg">
          <Edit className="mr-2 h-4 w-4" />
          Compose
        </Button>
      </div>
      
      <nav className="flex-1 px-2 py-2 space-y-1">
        {folders.map((folder) => (
          <button
            key={folder.id}
            onClick={() => onFolderChange(folder.id)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors",
              selectedFolder === folder.id
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            )}
          >
            <div className="flex items-center gap-3">
              <folder.icon className="h-4 w-4" />
              {folder.id === 'inbox' ? (
                <span>{folder.label}</span>
              ) : (
                <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
              )}
            </div>
            {folder.count > 0 && (
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                selectedFolder === folder.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {folder.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};
