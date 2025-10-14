import { useState, useEffect } from "react";
import { EmailSidebar } from "@/components/EmailSidebar";
import { EmailList } from "@/components/EmailList";
import { EmailDetail } from "@/components/EmailDetail";
import { EmailHeader } from "@/components/EmailHeader";
import { IntentLine } from "@/components/IntentLine";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

const mockEmails = [
  {
    id: "1",
    sender: "🖱️ MousePilot – Quick Instructions  jsoeberengueres",
    subject: "Press Q + W at same time",
    preview: "Discover the powerful keyboard chord interaction system that revolutionizes how you interact with your email...",
    time: "10:30 AM",
    isUnread: true,
    isStarred: true,
    hasAttachment: false,
  },
  {
    id: "2",
    sender: "Sarah Johnson",
    subject: "Q4 Wedding",
    preview: "Dear, find attached my huge engagement ring",
    time: "9:15 AM",
    isUnread: true,
    isStarred: false,
    hasAttachment: true,
  },
  {
    id: "3",
    sender: "Marketing Team",
    subject: "Campaign Performance Report",
    preview: "Our latest campaign has exceeded expectations with a 45% increase...",
    time: "Yesterday",
    isUnread: false,
    isStarred: true,
    hasAttachment: true,
  },
  {
    id: "4",
    sender: "David Chen",
    subject: "Project Deadline Extension",
    preview: "Good news! We've secured an extension for the project deadline...",
    time: "Yesterday",
    isUnread: false,
    isStarred: false,
    hasAttachment: false,
  },
  {
    id: "5",
    sender: "HR Department",
    subject: "Annual Performance Review",
    preview: "It's time for your annual performance review. Please schedule...",
    time: "2 days ago",
    isUnread: true,
    isStarred: false,
    hasAttachment: false,
  },
  {
    id: "6",
    sender: "Tech Support",
    subject: "System Maintenance Notice",
    preview: "Scheduled maintenance will occur this Saturday from 2 AM to 6 AM...",
    time: "3 days ago",
    isUnread: false,
    isStarred: false,
    hasAttachment: false,
  },
  {
    id: "7",
    sender: "Emily Rodriguez",
    subject: "Client Meeting Notes",
    preview: "Here are the notes from yesterday's client meeting. Key takeaways...",
    time: "3 days ago",
    isUnread: false,
    isStarred: true,
    hasAttachment: true,
  },
  {
    id: "8",
    sender: "Finance Team",
    subject: "Expense Report Approval",
    preview: "Your expense report for March has been approved and processed...",
    time: "4 days ago",
    isUnread: false,
    isStarred: false,
    hasAttachment: false,
  },
];

const Index = () => {
  const { toast } = useToast();
  const [selectedFolder, setSelectedFolder] = useState("inbox");
  const [selectedEmail, setSelectedEmail] = useState<string | null>("1");
  const [isComposing, setIsComposing] = useState(false);
  const [sensitivity, setSensitivity] = useState(70);
  const [easeIn, setEaseIn] = useState(200);
  const [chordCount, setChordCount] = useState(0);
  const [sessionStartTime] = useState(new Date());
  const [unteraveledPixels, setUntraveledPixels] = useState(0);
  const [discardedSuggestions, setDiscardedSuggestions] = useState(0);
  const [actualClicks, setActualClicks] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 16, y: 340 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleCompose = () => {
    setIsComposing(true);
    setSelectedEmail(null);
  };

  const handleClose = () => {
    setIsComposing(false);
    if (!selectedEmail) {
      setSelectedEmail("1");
    }
  };

  // Track actual clicks
  useEffect(() => {
    const handleClick = () => {
      setActualClicks(prev => prev + 1);
    };
    
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  // Handle dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
  };

  return (
    <div className="h-screen flex flex-col">
      <div 
        className="fixed z-50 bg-background/80 backdrop-blur-sm border rounded-lg shadow-lg transition-all"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isMinimized ? '200px' : '384px',
          cursor: isDragging ? 'grabbing' : 'default',
        }}
      >
        <div 
          className="p-3 border-b flex items-center justify-between cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">MousePilot™</span>
            <span className="text-xl font-bold text-primary">{chordCount}</span>
          </div>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {isMinimized ? "+" : "−"}
          </button>
        </div>
        
        {!isMinimized && (
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium whitespace-nowrap">Sensitivity: {sensitivity}ms</label>
              <Slider
                value={[sensitivity]}
                onValueChange={(value) => setSensitivity(value[0])}
                min={0}
                max={560}
                step={10}
                className="flex-1"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium whitespace-nowrap">Ease In: {easeIn}ms</label>
              <Slider
                value={[easeIn]}
                onValueChange={(value) => setEaseIn(value[0])}
                min={0}
                max={500}
                step={10}
                className="flex-1"
              />
            </div>
            <div className="pt-2 border-t space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Session Start:</span>
                <span className="font-medium">{sessionStartTime.toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Clicks Saved:</span>
                <span className="font-medium text-primary">{chordCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Untraveled Pixels:</span>
                <span className="font-medium text-primary">{Math.round(unteraveledPixels)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discarded Suggestions:</span>
                <span className="font-medium text-amber-500">{discardedSuggestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Actual Clicks:</span>
                <span className="font-medium">{actualClicks}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <IntentLine 
        sensitivity={sensitivity} 
        easeIn={easeIn} 
        onChordActivated={() => setChordCount(prev => prev + 1)}
        onLineCreated={(distance) => setUntraveledPixels(prev => prev + distance)}
        onSuggestionDiscarded={() => setDiscardedSuggestions(prev => prev + 1)}
        onActionConfirmed={() => {
          if (isComposing) {
            // Show toast when sending from compose mode
            toast({
              title: "Email sent",
              description: "Your message has been sent successfully.",
              duration: 3000,
            });
            handleClose();
          } else {
            // From email view, open compose mode
            handleCompose();
          }
        }}
      />
      <EmailHeader />
      <div className="flex-1 flex overflow-hidden">
        <EmailSidebar
          selectedFolder={selectedFolder}
          onFolderChange={setSelectedFolder}
          onCompose={handleCompose}
        />
        <EmailList
          emails={mockEmails}
          selectedEmail={selectedEmail}
          onEmailSelect={(id) => {
            setSelectedEmail(id);
            setIsComposing(false);
          }}
        />
        <EmailDetail
          isComposing={isComposing}
          onClose={handleClose}
          onReply={handleCompose}
        />
      </div>
    </div>
  );
};

export default Index;
