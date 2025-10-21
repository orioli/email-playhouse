import { useState, useEffect } from "react";
import { EmailSidebar } from "@/components/EmailSidebar";
import { EmailList } from "@/components/EmailList";
import { EmailDetail } from "@/components/EmailDetail";
import { EmailHeader } from "@/components/EmailHeader";
import { IntentLine } from "@/components/IntentLine";
import { KeyboardVisualization } from "@/components/KeyboardVisualization";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockEmails = [
  {
    id: "1",
    sender: "Jose Berengueres",
    subject: "👇 Try me!: press Q W together",
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
  const [isLoading, setIsLoading] = useState(false);
  const [sensitivity, setSensitivity] = useState(170);
  const [easeIn, setEaseIn] = useState(200);
  const [chordCount, setChordCount] = useState(0);
  const [sessionStartTime] = useState(new Date());
  const [unteraveledPixels, setUntraveledPixels] = useState(0);
  const [discardedSuggestions, setDiscardedSuggestions] = useState(0);
  const [actualClicks, setActualClicks] = useState(0);
  const [totalTraveledPixels, setTotalTraveledPixels] = useState(0);
  const [lastSampledPosition, setLastSampledPosition] = useState<{ x: number; y: number } | null>(null);
  const [isMinimized, setIsMinimized] = useState(true);
  const [position, setPosition] = useState({ x: 16, y: 450 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [spaceBarCount, setSpaceBarCount] = useState(0);
  const [mouseStrokeCount, setMouseStrokeCount] = useState(0);
  const [lastMouseMoveTime, setLastMouseMoveTime] = useState<number | null>(null);
  const [doubleClickCount, setDoubleClickCount] = useState(0);
  const [replyToSendTime, setReplyToSendTime] = useState<number>(-1);
  const [replyClickTime, setReplyClickTime] = useState<number | null>(null);
  const [spacesInInterval, setSpacesInInterval] = useState<number>(-1);
  const [cursorAtSend, setCursorAtSend] = useState<{x: number, y: number} | null>(null);
  const [sendButtonPos, setSendButtonPos] = useState<{x: number, y: number} | null>(null);
  const [intervalSpaceCount, setIntervalSpaceCount] = useState(0);

  const handleCompose = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsComposing(true);
      setSelectedEmail(null);
      setIsLoading(false);
    }, 1000);
  };

  const handleReplyClick = () => {
    setReplyClickTime(Date.now());
    setIntervalSpaceCount(0);
    handleCompose();
  };

  const handleSendClick = (cursorPos: {x: number, y: number}, buttonPos: {x: number, y: number}) => {
    if (replyClickTime !== null) {
      const timeDiff = Date.now() - replyClickTime;
      setReplyToSendTime(timeDiff);
      setSpacesInInterval(intervalSpaceCount);
      setCursorAtSend(cursorPos);
      setSendButtonPos(buttonPos);
    }
    setReplyClickTime(null);
  };

  const handleClose = () => {
    setIsComposing(false);
    if (!selectedEmail) {
      setSelectedEmail("1");
    }
  };

  // Track actual clicks, double clicks, and spacebar presses
  useEffect(() => {
    const handleClick = () => {
      setActualClicks(prev => prev + 1);
    };
    
    const handleDoubleClick = () => {
      setDoubleClickCount(prev => prev + 1);
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        setSpaceBarCount(prev => prev + 1);
        // If tracking interval, count spaces
        if (replyClickTime !== null) {
          setIntervalSpaceCount(prev => prev + 1);
        }
      }
    };
    
    window.addEventListener("click", handleClick);
    window.addEventListener("dblclick", handleDoubleClick);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("dblclick", handleDoubleClick);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [replyClickTime]);

  // Track total traveled pixels continuously and mouse strokes
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const currentPos = { x: e.clientX, y: e.clientY };
      const currentTime = Date.now();
      
      // Track strokes: movement after >100ms of no movement
      if (lastMouseMoveTime !== null && (currentTime - lastMouseMoveTime) > 100) {
        setMouseStrokeCount(prev => prev + 1);
      }
      
      if (lastSampledPosition) {
        const distance = Math.abs(currentPos.x - lastSampledPosition.x) + Math.abs(currentPos.y - lastSampledPosition.y);
        setTotalTraveledPixels(prev => prev + distance);
      }
      
      setLastSampledPosition(currentPos);
      setLastMouseMoveTime(currentTime);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [lastSampledPosition, lastMouseMoveTime]);

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
    <div className="h-screen flex flex-col relative">
      {/* Loading Spinner Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card rounded-lg p-8 shadow-lg flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium">Loading compose...</p>
          </div>
        </div>
      )}
      <div 
        data-exclude-from-chord="true"
        className="fixed z-50 bg-white border-2 border-gray-400 shadow-2xl transition-all"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isMinimized ? '200px' : '384px',
          cursor: isDragging ? 'grabbing' : 'default',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div 
          className="p-3 bg-gray-700 border-b-2 border-gray-400 flex items-center justify-between cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-white tracking-wide">Your Stats</span>
            <div className="w-16 h-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#ffffff" 
                    strokeWidth={1.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:text-gray-300 transition-colors font-bold"
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
              <label className="text-sm font-medium whitespace-nowrap">Ease Out: {easeIn}ms</label>
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
                <span className="text-muted-foreground">Double Clicks:</span>
                <span className="font-medium">{doubleClickCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Space Bar Presses:</span>
                <span className="font-medium">{spaceBarCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mouse Strokes:</span>
                <span className="font-medium">{mouseStrokeCount}</span>
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
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reply to Send Time:</span>
                <span className="font-medium">{replyToSendTime >= 0 ? `${replyToSendTime}ms` : '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Spaces (Reply-Send):</span>
                <span className="font-medium">{spacesInInterval >= 0 ? spacesInInterval : '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cursor at Send:</span>
                <span className="font-medium">{cursorAtSend ? `(${cursorAtSend.x}, ${cursorAtSend.y})` : '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Send Button Pos:</span>
                <span className="font-medium">{sendButtonPos ? `(${sendButtonPos.x}, ${sendButtonPos.y})` : '-'}</span>
              </div>
              <div className="text-right pt-1">
                <span className="text-xs text-muted-foreground">Pat. Pend.</span>
              </div>
            </div>
            <div className="pt-4 flex justify-center gap-2">
              <Button 
                size="lg" 
                variant="outline"
                className="border-black hover:bg-gray-100"
                onClick={() => {
                  const downloadTime = new Date().toISOString();
                  const lessTravel = (totalTraveledPixels + unteraveledPixels) > 0 ? Math.round((unteraveledPixels / (totalTraveledPixels + unteraveledPixels)) * 100) : 0;
                  const lessClicks = (actualClicks + chordCount) > 0 ? Math.round((chordCount / (actualClicks + chordCount)) * 100) : 0;
                  
                  const csvContent = [
                    ['Metric', 'Value'],
                    ['Session Start Time', sessionStartTime.toLocaleString()],
                    ['Sensitivity (ms)', sensitivity],
                    ['Ease Out (ms)', easeIn],
                    ['Clicks Saved', chordCount],
                    ['Untraveled Pixels', Math.round(unteraveledPixels)],
                    ['Discarded Suggestions', discardedSuggestions],
                    ['Total Clicks', actualClicks],
                    ['Double Clicks', doubleClickCount],
                    ['Space Bar Presses', spaceBarCount],
                    ['Mouse Strokes', mouseStrokeCount],
                    ['Physically Travelled Pixels', Math.round(totalTraveledPixels)],
                    ['Savings - Less Travel (%)', lessTravel],
                    ['Savings - Less Clicks (%)', lessClicks],
                    ['Reply to Send Time (ms)', replyToSendTime >= 0 ? replyToSendTime : '-'],
                    ['Spaces in Reply-Send Interval', spacesInInterval >= 0 ? spacesInInterval : '-'],
                    ['Cursor Position at Send (x)', cursorAtSend ? cursorAtSend.x : '-'],
                    ['Cursor Position at Send (y)', cursorAtSend ? cursorAtSend.y : '-'],
                    ['Send Button Center (x)', sendButtonPos ? sendButtonPos.x : '-'],
                    ['Send Button Center (y)', sendButtonPos ? sendButtonPos.y : '-'],
                    ['Download Time', downloadTime],
                  ].map(row => row.join(',')).join('\n');
                  
                  const blob = new Blob([csvContent], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `stats-${Date.now()}.csv`;
                  a.click();
                  window.URL.revokeObjectURL(url);
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </Button>
              <Button 
                size="lg" 
                className="bg-black hover:bg-gray-800 text-white"
                onClick={() => window.open('https://forms.gle/kuzxpQ5DNdd6PbTVA', '_blank')}
              >
                <Download className="mr-2 h-4 w-4" />
                Get Plug-In
              </Button>
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
        onActionConfirmed={(cursorPos) => {
          if (isComposing) {
            // Get Send button position
            const sendButton = document.querySelector('button:has(> svg.lucide-send)') as HTMLElement;
            let buttonPos = { x: 0, y: 0 };
            if (sendButton) {
              const rect = sendButton.getBoundingClientRect();
              buttonPos = {
                x: Math.round(rect.left + rect.width / 2),
                y: Math.round(rect.top + rect.height / 2)
              };
            }
            
            // Track metrics if Reply was clicked
            if (replyClickTime !== null) {
              const timeDiff = Date.now() - replyClickTime;
              setReplyToSendTime(timeDiff);
              setSpacesInInterval(intervalSpaceCount);
              setCursorAtSend(cursorPos);
              setSendButtonPos(buttonPos);
              setReplyClickTime(null);
            }
            
            // Show toast when sending from compose mode
            toast({
              title: "Email sent",
              description: "Your message has been sent successfully.",
              duration: 3000,
            });
            handleClose();
          } else {
            // From email view, open compose mode
            handleReplyClick();
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
          onReply={handleReplyClick}
          onSend={handleSendClick}
          clicksSaved={chordCount}
        />
      </div>
      <KeyboardVisualization />
    </div>
  );
};

export default Index;
