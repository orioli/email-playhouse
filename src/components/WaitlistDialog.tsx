import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Download, X } from "lucide-react";
import dogezaGif from "@/assets/dogeza.gif";

interface WaitlistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stats: {
    sessionStart: Date;
    clicksSaved: number;
    untraveledPixels: number;
    discardedSuggestions: number;
    totalClicks: number;
    spaceBarPresses: number;
    physicallyTraveledPixels: number;
    savingsTravelPercent: number;
    savingsClicksPercent: number;
  };
}

export const WaitlistDialog = ({ open, onOpenChange, stats }: WaitlistDialogProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.functions.invoke('join-waitlist', {
        body: { 
          email,
          stats: {
            sessionStart: stats.sessionStart.toISOString(),
            clicksSaved: stats.clicksSaved,
            untraveledPixels: Math.round(stats.untraveledPixels),
            discardedSuggestions: stats.discardedSuggestions,
            totalClicks: stats.totalClicks,
            spaceBarPresses: stats.spaceBarPresses,
            physicallyTraveledPixels: Math.round(stats.physicallyTraveledPixels),
            savingsTravelPercent: stats.savingsTravelPercent,
            savingsClicksPercent: stats.savingsClicksPercent,
          }
        }
      });

      if (error) throw error;

      setIsSuccess(true);
      setEmail("");
    } catch (error) {
      console.error('Error joining waitlist:', error);
      toast({
        title: "Error",
        description: "Failed to join waitlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setEmail("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Join the Waitlist
          </DialogTitle>
        </DialogHeader>
        
        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Get early access to the plug-in. We'll notify you when it's available.
              </p>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "Joining..." : "Join Waitlist"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-4">
              <img src={dogezaGif} alt="Thank you" className="w-32 h-32 mx-auto mb-4 object-contain" />
              <p className="text-lg font-medium mb-2">Thank you!</p>
              <p className="text-sm text-muted-foreground">
                We'll notify you when the plug-in is available.
              </p>
            </div>
            <Button
              onClick={handleClose}
              className="w-full"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};