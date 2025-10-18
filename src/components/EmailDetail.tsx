import { X, Reply, ReplyAll, Forward, Trash2, Archive, MoreVertical, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface EmailDetailProps {
  isComposing: boolean;
  onClose: () => void;
  onSend?: () => void;
  onReply?: () => void;
}

export const EmailDetail = ({ isComposing, onClose, onSend, onReply }: EmailDetailProps) => {
  const { toast } = useToast();

  const handleVideoEnd = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const playCount = parseInt(video.dataset.playCount || "0");
    
    if (playCount < 0) {
      video.dataset.playCount = String(playCount + 1);
      video.play();
    } else {
      video.dataset.playCount = "1";
      video.removeAttribute("autoplay");
    }
  };

  const handleVideoClick = (e: React.MouseEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const handleSend = () => {
    toast({
      title: "Email sent",
      description: "Your message has been sent successfully.",
      duration: 3000,
    });
    onSend?.();
    onClose();
  };
  if (isComposing) {
    return (
      <div className="flex-1 flex flex-col bg-background">
        {/* Header with Send and Close buttons */}
        <div className="border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Reply to: Jose Berengueres</h2>
          <div className="flex items-center gap-2">
            <Button size="lg" className="min-w-32" onClick={handleSend}>
              <Send className="mr-2 h-4 w-4" />
              Send
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Compose Form */}
        <div className="flex-1 flex flex-col p-6">
          <div className="space-y-4 mb-4">
            <Input
              placeholder="To"
              className="border-b rounded-none px-0 focus-visible:ring-0"
              defaultValue="jose.berengueres@nu.edu.kz"
            />
            <Input
              placeholder="Subject"
              className="border-b rounded-none px-0 focus-visible:ring-0"
              defaultValue="Re: 🖱️ Quick Instructions"
            />
          </div>

          <Textarea
            placeholder="Compose your message..."
            className="flex-1 resize-none border-0 focus-visible:ring-0 p-0"
            defaultValue="\n\n\n---\nOn xxx Jose wrote...."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header with Close button */}
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon">
              <Archive className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-8 w-48 mb-4" />

          <div className="flex items-start justify-between mb-6 pb-6 border-b border-border">
            <div className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-4 w-52" />
              </div>
            </div>
            <Skeleton className="h-4 w-16" />
          </div>

          <div className="prose prose-sm max-w-none">
            {/* Email body content removed */}
          </div>
        </div>
      </div>

      {/* Footer with action buttons */}
      <div className="border-t border-border p-4 flex justify-start gap-2">
        <Button variant="outline" size="sm" onClick={onReply}>
          <Reply className="mr-2 h-4 w-4" />
          Reply
        </Button>
        <Button variant="outline" size="sm">
          <ReplyAll className="mr-2 h-4 w-4" />
          Reply All
        </Button>
        <Button variant="outline" size="sm">
          <Forward className="mr-2 h-4 w-4" />
          Forward
        </Button>
      </div>
    </div>
  );
};
