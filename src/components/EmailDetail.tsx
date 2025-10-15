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
              defaultValue="Re: 🖱️ MousePilot – Quick Instructions"
            />
          </div>

          <Textarea
            placeholder="Compose your message..."
            className="flex-1 resize-none border-0 focus-visible:ring-0 p-0"
            defaultValue={
              "\n\n---\nOn 10:30 AM, Jose Berengueres wrote:\n> Welcome to the Keyboard Chord Interaction System - a revolutionary way to interact with your email client using intuitive keyboard shortcuts."
            }
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
          <h1 className="text-2xl font-semibold mb-4">🖱️ MousePilot – Quick Instructions</h1>

          <div className="flex items-start justify-between mb-6 pb-6 border-b border-border">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                JS
              </div>
              <div>
                <div className="font-semibold">Jose Berengueres</div>
                <div className="text-sm text-muted-foreground">jose.berengueres@nu.edu.kz</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">10:30 AM</div>
          </div>

          <div className="prose prose-sm max-w-none">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">💡 To Suggest</h3>

              <span className="text-sm text-muted-foreground">
                <kbd className="px-2 py-1 bg-muted rounded border text-lg">⤓Q</kbd> +{" "}
                <kbd className="px-2 py-1 bg-muted rounded border text-lg">⤓W</kbd> Hold Down both keys simultaneously
              </span>
            </div>

            {/* Chord Lasso Visual */}
            <div className="mb-6 relative">
              <div className="flex items-center gap-2">
                <span className="text-xl">🅰️</span>
                <svg width="200" height="20" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern
                      id="lassoStripes"
                      patternUnits="userSpaceOnUse"
                      width="20"
                      height="3"
                      patternTransform="rotate(0)"
                    >
                      <rect width="10" height="3" fill="#10b981" />
                      <rect x="10" width="10" height="3" fill="#059669" />
                      <animateTransform
                        attributeName="patternTransform"
                        type="translate"
                        from="0 0"
                        to="20 0"
                        dur="0.5s"
                        repeatCount="indefinite"
                      />
                    </pattern>
                  </defs>

                  {/* Glow line */}
                  <line
                    x1="0"
                    y1="10"
                    x2="200"
                    y2="10"
                    stroke="#10b981"
                    strokeWidth="5"
                    strokeLinecap="round"
                    opacity="0.3"
                    filter="blur(4px)"
                  />

                  {/* Main line */}
                  <line
                    x1="0"
                    y1="10"
                    x2="200"
                    y2="10"
                    stroke="url(#lassoStripes)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-xl">🅱️</span>
              </div>

              {/* Pencil arrow and text annotation */}
              <div className="absolute left-[140px] top-[25px] flex flex-col items-center">
                <svg width="40" height="40" viewBox="0 0 40 40" className="rotate-[-20deg]">
                  <path
                    d="M 20 5 L 20 30 M 20 30 L 15 25 M 20 30 L 25 25"
                    stroke="#e11d48"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <div
                  className="text-rose-600 font-bold text-sm whitespace-nowrap"
                  style={{
                    fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
                    transform: "rotate(-5deg)",
                    textShadow: "1px 1px 0px rgba(0,0,0,0.1)",
                  }}
                >
                  Let the AI move the mouse
                </div>
              </div>
            </div>

            <div className="mb-4 mt-12">
              <h3 className="text-lg font-semibold mb-2">✅ To Release</h3>
              <span className="text-sm text-muted-foreground">
                <kbd className="px-2 py-1 bg-muted rounded border text-lg">Q↑</kbd>{" "}
                <kbd className="px-2 py-1 bg-muted rounded border text-lg">W↑</kbd>{" "}
                Release both keys simultaneously
              </span>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">🙅‍♀️ To Discard</h3>
              <p className="mb-2">Either:</p>
              <ul className="list-disc ml-6">
                <li>Move the mouse, or</li>
                <li>
                  Release <kbd className="px-2 py-1 bg-muted rounded border text-lg">W</kbd> first
                </li>
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">🔄 Loop thru options:</h3>
              <p className="mb-2">
                While holding <kbd className="px-2 py-1 bg-muted rounded border text-lg">Q</kbd> +{" "}
                <kbd className="px-2 py-1 bg-muted rounded border text-lg">W</kbd>, press{" "}
                <kbd className="px-2 py-1 bg-muted rounded border">Space</kbd> to cycle through available actions:
              </p>
              <ul className="list-disc ml-6">
                <li>Reply → Reply All → Forward → Trash → Close</li>
              </ul>
              <hr className="mt-4 border-border" />
              <p className="mt-4">
                Read more about our research at:{" "}
                <a
                  href="https://dl.acm.org/doi/10.1145/3759241"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  https://dl.acm.org/doi/10.1145/3759241
                </a>
              </p>
            </div>
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
