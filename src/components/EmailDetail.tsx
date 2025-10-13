import { X, Reply, ReplyAll, Forward, Trash2, Archive, MoreVertical, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface EmailDetailProps {
  isComposing: boolean;
  onClose: () => void;
}

export const EmailDetail = ({ isComposing, onClose }: EmailDetailProps) => {
  if (isComposing) {
    return (
      <div className="flex-1 flex flex-col bg-background">
        {/* Header with Close button */}
        <div className="border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">New Message</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Compose Form */}
        <div className="flex-1 flex flex-col p-6">
          <div className="space-y-4 mb-4">
            <Input placeholder="To" className="border-b rounded-none px-0 focus-visible:ring-0" />
            <Input placeholder="Subject" className="border-b rounded-none px-0 focus-visible:ring-0" />
          </div>
          
          <Textarea
            placeholder="Compose your message..."
            className="flex-1 resize-none border-0 focus-visible:ring-0 p-0"
          />
        </div>

        {/* Footer with Send button */}
        <div className="border-t border-border p-4 flex justify-end">
          <Button size="lg" className="min-w-32">
            <Send className="mr-2 h-4 w-4" />
            Send
          </Button>
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
          <h1 className="text-2xl font-semibold mb-4">Weekly Team Update</h1>
          
          <div className="flex items-start justify-between mb-6 pb-6 border-b border-border">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                JS
              </div>
              <div>
                <div className="font-semibold">John Smith</div>
                <div className="text-sm text-muted-foreground">john.smith@company.com</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              10:30 AM
            </div>
          </div>

          <div className="prose prose-sm max-w-none">
            <p className="mb-4">Hi team,</p>
            <p className="mb-4">
              I wanted to share a quick update on our progress this week. We've made significant strides in several key areas:
            </p>
            <ul className="mb-4 space-y-2">
              <li>Completed the frontend redesign for the dashboard</li>
              <li>Fixed critical bugs in the payment processing system</li>
              <li>Started work on the mobile app integration</li>
            </ul>
            <p className="mb-4">
              Looking ahead to next week, our priorities will be:
            </p>
            <ol className="mb-4 space-y-2">
              <li>Launch the new dashboard to beta users</li>
              <li>Complete security audit for the payment system</li>
              <li>Continue mobile app development</li>
            </ol>
            <p className="mb-4">
              Please let me know if you have any questions or concerns.
            </p>
            <p>Best regards,<br />John</p>
          </div>
        </div>
      </div>

      {/* Footer with action buttons */}
      <div className="border-t border-border p-4 flex justify-start gap-2">
        <Button variant="outline" size="sm">
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
