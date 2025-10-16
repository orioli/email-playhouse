import { Search, HelpCircle, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const EmailHeader = () => {
  return (
    <header className="border-b border-border bg-background px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <h1 className="text-xl font-semibold text-primary">MailBox</h1>
        
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search in mail"
            className="pl-10 bg-muted border-0"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm ml-2">
          ME
        </div>
      </div>
    </header>
  );
};
