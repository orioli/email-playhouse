import { useState, useEffect } from "react";
import { EmailSidebar } from "@/components/EmailSidebar";
import { EmailList } from "@/components/EmailList";
import { EmailDetail } from "@/components/EmailDetail";
import { EmailHeader } from "@/components/EmailHeader";
import { IntentLine } from "@/components/IntentLine";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const mockEmails = [
  {
    id: "1",
    sender: "Jose Berengueres",
    subject: "👇 Try me!",
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
    sender: "Jack Lo",
    subject: "Campaign Performance Report",
    preview: "Our latest campaign has exceeded expectations with a 45% increase...",
    time: "Yesterday",
    isUnread: false,
    isStarred: true,
    hasAttachment: true,
  },
  {
    id: "4",
    sender: "Jim Jefferies",
    subject: "Project Deadline Extension",
    preview: "Good news! We've secured an extension for the project deadline...",
    time: "Yesterday",
    isUnread: false,
    isStarred: false,
    hasAttachment: false,
  },
  {
    id: "5",
    sender: "Hannah Gadsby",
    subject: "Annual Performance Review",
    preview: "It's time for your annual performance review. Please schedule...",
    time: "2 days ago",
    isUnread: true,
    isStarred: false,
    hasAttachment: false,
  },
  {
    id: "6",
    sender: "Chris Lilley",
    subject: "System Maintenance Notice",
    preview: "Scheduled maintenance will occur this Saturday from 2 AM to 6 AM...",
    time: "3 days ago",
    isUnread: false,
    isStarred: false,
    hasAttachment: false,
  },
  {
    id: "7",
    sender: "Tim Minchin",
    subject: "Client Meeting Notes",
    preview: "Here are the notes from yesterday's client meeting. Key takeaways...",
    time: "3 days ago",
    isUnread: false,
    isStarred: true,
    hasAttachment: true,
  },
  {
    id: "8",
    sender: "Hamish Blake",
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
  const [totalTraveledPixels, setTotalTraveledPixels] = useState(0);
  const [lastSampledPosition, setLastSampledPosition] = useState<{ x: number; y: number } | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 16, y: 340 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [spaceBarCount, setSpaceBarCount] = useState(0);

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

  // Track actual clicks and spacebar presses
  useEffect(() => {
    const handleClick = () => {
      setActualClicks(prev => prev + 1);
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        setSpaceBarCount(prev => prev + 1);
      }
    };
    
    window.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Track total traveled pixels continuously
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const currentPos = { x: e.clientX, y: e.clientY };
      
      if (lastSampledPosition) {
        const distance = Math.abs(currentPos.x - lastSampledPosition.x) + Math.abs(currentPos.y - lastSampledPosition.y);
        setTotalTraveledPixels(prev => prev + distance);
      }
      
      setLastSampledPosition(currentPos);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [lastSampledPosition]);

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

  // Generate fake Bloomberg-style chart data
  const chartData = [
    { value: 45 },
    { value: 52 },
    { value: 48 },
    { value: 61 },
    { value: 55 },
    { value: 67 },
    { value: 72 },
    { value: 68 },
    { value: 74 },
    { value: 82 },
    { value: 78 },
    { value: 85 },
  ];

  return (
    <div className="h-screen flex flex-col">
      <div 
        className="fixed z-50 bg-muted/80 backdrop-blur-md border-2 border-border rounded-xl shadow-2xl transition-all"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isMinimized ? '200px' : '384px',
          cursor: isDragging ? 'grabbing' : 'default',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      >
        <div 
          className="p-3 border-b border-border/60 flex items-center justify-between cursor-grab active:cursor-grabbing bg-background/40"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold">Your Stats</span>
            <div className="w-16 h-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={1.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
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
              <label className="text-sm font-medium whitespace-nowrap">Discard Sensitivity: {sensitivity}ms</label>
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
              <div className="flex-1 relative">
                <Slider
                  value={[easeIn]}
                  onValueChange={(value) => setEaseIn(value[0])}
                  min={0}
                  max={500}
                  step={10}
                  className="w-full"
                />
              </div>
            </div>
            <div className="pt-4 border-t space-y-1 text-sm">
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
                <span className="text-muted-foreground">Total Clicks:</span>
                <span className="font-medium">{actualClicks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Space Bar Presses:</span>
                <span className="font-medium">{spaceBarCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Physically Travelled pixels:</span>
                <span className="font-medium">{Math.round(totalTraveledPixels)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Savings:</span>
                <span className="font-medium">
                  <span className="text-red-500">{(totalTraveledPixels + unteraveledPixels) > 0 ? Math.round((unteraveledPixels / (totalTraveledPixels + unteraveledPixels)) * 100) : 0}%</span> less travel · 
                  <span className="text-red-500">{(actualClicks + chordCount) > 0 ? Math.round((chordCount / (actualClicks + chordCount)) * 100) : 0}%</span> less clicks
                </span>
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
