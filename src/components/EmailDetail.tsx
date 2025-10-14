import { X, Reply, ReplyAll, Forward, Trash2, Archive, MoreVertical, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface EmailDetailProps {
  isComposing: boolean;
  onClose: () => void;
  onSend?: () => void;
  onReply?: () => void;
}

export const EmailDetail = ({ isComposing, onClose, onSend, onReply }: EmailDetailProps) => {
  const { toast } = useToast();

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
        {/* Header with Close button */}
        <div className="border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Reply to: John Smith</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Compose Form */}
        <div className="flex-1 flex flex-col p-6">
          <div className="space-y-4 mb-4">
            <Input placeholder="To" className="border-b rounded-none px-0 focus-visible:ring-0" defaultValue="john.smith@company.com" />
            <Input placeholder="Subject" className="border-b rounded-none px-0 focus-visible:ring-0" defaultValue="Re: Press Q + W at same time" />
          </div>
          
          <Textarea
            placeholder="Compose your message..."
            className="flex-1 resize-none border-0 focus-visible:ring-0 p-0"
            defaultValue={"\n\n---\nOn 10:30 AM, John Smith wrote:\n> Welcome to the Keyboard Chord Interaction System - a revolutionary way to interact with your email client using intuitive keyboard shortcuts."}
          />
        </div>

        {/* Footer with Send button */}
        <div className="border-t border-border p-4 flex justify-end">
          <Button size="lg" className="min-w-32" onClick={handleSend}>
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
          <h1 className="text-2xl font-semibold mb-4">Press Q + W at same time</h1>
          
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
            <p className="mb-4">Hello!</p>
            <p className="mb-4">
              Welcome to the Keyboard Chord Interaction System - a revolutionary way to interact with your email client using intuitive keyboard shortcuts.
            </p>
            
            <h3 className="text-lg font-semibold mt-6 mb-3">How It Works</h3>
            <p className="mb-4">
              Simply press Q and W keys together to activate an intent line that connects your cursor to the Reply button. This visual feedback system helps you understand exactly what action you're about to perform.
            </p>
            
            <h3 className="text-lg font-semibold mt-6 mb-3">Key Features</h3>
            <ul className="mb-4 space-y-2">
              <li><strong>Visual Intent Line:</strong> A beautiful animated line appears connecting your cursor to the target action</li>
              <li><strong>Precise Timing Control:</strong> Release both keys within the sensitivity window (default 70ms) to confirm the action</li>
              <li><strong>Motion Cancellation:</strong> Move your mouse to cancel the action if you change your mind</li>
              <li><strong>Smooth Animations:</strong> Elegant ease-in animations (200ms) make every interaction feel polished</li>
              <li><strong>Activity Tracking:</strong> A counter at the top tracks how many successful chord activations you've made</li>
            </ul>
            
            <h3 className="text-lg font-semibold mt-6 mb-3">Benefits</h3>
            <ol className="mb-4 space-y-2">
              <li><strong>Speed:</strong> Execute actions faster than traditional clicking</li>
              <li><strong>Precision:</strong> Built-in confirmation mechanism prevents accidental actions</li>
              <li><strong>Ergonomics:</strong> Keep your hands on the keyboard for a seamless workflow</li>
              <li><strong>Visual Feedback:</strong> Always know what action you're about to perform before committing</li>
              <li><strong>Customizable:</strong> Adjust sensitivity and animation timing to match your preferences</li>
            </ol>
            
            <p className="mb-4">
              Try it now! Press Q + W together while reading this email, then release both keys at the same time to send a reply.
            </p>
            <p>Happy emailing!<br />John</p>
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
