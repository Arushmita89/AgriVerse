import { Bell, Menu, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {
  const navigate = useNavigate();

  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "You have no new notifications",
    });
  };

  return (
    <header className="border-b bg-white p-4 flex items-center justify-between">
      <div className="flex items-center">
        {/* Sidebar toggle button */}
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? <ArrowRight className="rotate-180" /> : <Menu />}
        </Button>

        <h1 className="text-lg font-semibold text-green-900 font-dm-serif">AgriVerse</h1>
      </div>

      <div className="flex items-center space-x-2">
        {/* Notification button */}
        <Button variant="ghost" size="icon" onClick={handleNotificationClick}>
          <Bell className="h-5 w-5" />
        </Button>

        {/* User icon button navigates to login page */}
        <Button variant="ghost" size="icon" onClick={() => navigate("/login")}>
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
