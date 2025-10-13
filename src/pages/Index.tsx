import { useState } from "react";
import { EmailSidebar } from "@/components/EmailSidebar";
import { EmailList } from "@/components/EmailList";
import { EmailDetail } from "@/components/EmailDetail";
import { EmailHeader } from "@/components/EmailHeader";
import { IntentLine } from "@/components/IntentLine";

const mockEmails = [
  {
    id: "1",
    sender: "John Smith",
    subject: "Weekly Team Update",
    preview: "Hi team, I wanted to share a quick update on our progress this week...",
    time: "10:30 AM",
    isUnread: true,
    isStarred: true,
    hasAttachment: false,
  },
  {
    id: "2",
    sender: "Sarah Johnson",
    subject: "Q4 Budget Review",
    preview: "Please find attached the budget report for Q4. Let's schedule a meeting...",
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
  const [selectedFolder, setSelectedFolder] = useState("inbox");
  const [selectedEmail, setSelectedEmail] = useState<string | null>("1");
  const [isComposing, setIsComposing] = useState(false);

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

  return (
    <div className="h-screen flex flex-col">
      <IntentLine />
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
        />
      </div>
    </div>
  );
};

export default Index;
