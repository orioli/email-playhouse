import { X, Reply, ReplyAll, Forward, Trash2, Archive, MoreVertical, Send, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

interface EmailDetailProps {
  isComposing: boolean;
  onClose: () => void;
  onSend?: () => void;
  onReply?: () => void;
  clicksSaved?: number;
}

export const EmailDetail = ({ isComposing, onClose, onSend, onReply, clicksSaved = 0 }: EmailDetailProps) => {
  const { toast } = useToast();
  const [showArrow, setShowArrow] = useState(false);
  const [onboardingStarted, setOnboardingStarted] = useState(false);
  const [keysPressed, setKeysPressed] = useState(new Set<string>());
  const [firstZXPressTime, setFirstZXPressTime] = useState<number | null>(null);
  const [showReleaseMessage, setShowReleaseMessage] = useState(false);
  const [simultaneousReleaseDetected, setSimultaneousReleaseDetected] = useState(false);
  const [simulationTimeouts, setSimulationTimeouts] = useState<number[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cancel simulation if user touches keyboard during animation
      if (simulationTimeouts.length > 0) {
        simulationTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
        setSimulationTimeouts([]);
      }

      const newKeys = new Set(keysPressed);
      newKeys.add(e.key.toLowerCase());
      setKeysPressed(newKeys);

      // Check if both Z and X are pressed
      if (newKeys.has('z') && newKeys.has('x')) {
        setShowArrow(false);
        
        // Record first time Z and X are pressed together
        if (firstZXPressTime === null && !simultaneousReleaseDetected) {
          setFirstZXPressTime(Date.now());
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const wasZPressed = keysPressed.has('z');
      const wasXPressed = keysPressed.has('x');
      const releasedKey = e.key.toLowerCase();
      
      const newKeys = new Set(keysPressed);
      newKeys.delete(releasedKey);
      setKeysPressed(newKeys);
      
      // Check if Z and X were both pressed and are being released simultaneously
      if (wasZPressed && wasXPressed && (releasedKey === 'z' || releasedKey === 'x')) {
        // Check if the other key is released within a short time frame (100ms)
        setTimeout(() => {
          if (!newKeys.has('z') && !newKeys.has('x')) {
            setSimultaneousReleaseDetected(true);
            setShowReleaseMessage(false);
          }
        }, 100);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keysPressed, firstZXPressTime, simultaneousReleaseDetected, simulationTimeouts]);

  // Timer for 15 seconds after first Z+X press
  useEffect(() => {
    // Don't show the message if user has already saved clicks
    if (clicksSaved > 0) {
      return;
    }
    
    if (firstZXPressTime !== null && !simultaneousReleaseDetected && !showReleaseMessage) {
      const timer = setTimeout(() => {
        if (!simultaneousReleaseDetected) {
          setShowReleaseMessage(true);
        }
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, [firstZXPressTime, simultaneousReleaseDetected, showReleaseMessage, clicksSaved]);

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

  const handleStartHere = () => {
    setShowArrow(true);
    setOnboardingStarted(true);
    
    const timeouts: number[] = [];
    
    // Simulate Z and X key presses for 5 seconds
    const simulateKeyPress = (key: string, code: string, duration: number) => {
      const keyDownEvent = new KeyboardEvent('keydown', {
        key: key,
        code: code,
        bubbles: true,
      });
      const keyUpEvent = new KeyboardEvent('keyup', {
        key: key,
        code: code,
        bubbles: true,
      });
      
      window.dispatchEvent(keyDownEvent);
      
      const timeout = window.setTimeout(() => {
        window.dispatchEvent(keyUpEvent);
      }, duration);
      timeouts.push(timeout);
    };
    
    // Toggle space bar 5 cycles (0.5s on, 0.5s off) over 5 seconds
    const toggleSpaceBar = () => {
      for (let i = 0; i < 5; i++) {
        const timeout1 = window.setTimeout(() => {
          // Press
          window.dispatchEvent(new KeyboardEvent('keydown', {
            key: ' ',
            code: 'Space',
            bubbles: true,
          }));
          
          // Release after 0.5s
          const timeout2 = window.setTimeout(() => {
            window.dispatchEvent(new KeyboardEvent('keyup', {
              key: ' ',
              code: 'Space',
              bubbles: true,
            }));
          }, 500);
          timeouts.push(timeout2);
        }, i * 1000); // Each cycle starts 1s apart (0.5s on + 0.5s off)
        timeouts.push(timeout1);
      }
    };
    
    simulateKeyPress('z', 'KeyZ', 5000);
    simulateKeyPress('x', 'KeyX', 5000);
    toggleSpaceBar();
    
    setSimulationTimeouts(timeouts);
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
              defaultValue="TO: email"
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
            defaultValue={`


---
Wed, Oct 18, 2025 at 10:30 AM.... wrote...`}
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
          <Skeleton className="h-8 w-48 mb-4 animate-none" />

          <div className="flex items-start justify-between mb-6 pb-6 border-b border-border">
            <div className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-full animate-none" />
              <div>
                <Skeleton className="h-5 w-40 mb-2 animate-none" />
                <Skeleton className="h-4 w-52 animate-none" />
              </div>
            </div>
            <Skeleton className="h-4 w-16 animate-none" />
          </div>

          <div className="prose prose-sm max-w-none relative">
            {/* Start Here Button */}
            {!onboardingStarted && (
              <div className="flex justify-center my-8">
                <Button
                  onClick={handleStartHere}
                  className="bg-rose-400 hover:bg-rose-500 text-white w-32 h-32 animate-pulse"
                >
                  start here
                </Button>
              </div>
            )}
            
            {/* Press Z X text in middle of keyboard */}
            {showArrow && (
              <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 opacity-80">
                <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold text-center">
                  HOLD DOWN Z X, while toggling SPACE BAR
                </div>
              </div>
            )}
            
            {/* Release message after 15 seconds */}
            {showReleaseMessage && !simultaneousReleaseDetected && (
              <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 opacity-80">
                <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold text-center">
                  TO ACCEPT a suggestion RELEASE Z X at same time
                </div>
              </div>
            )}
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
