import { Bell, Menu, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../firebaseConfig"; // adjust path if needed
import { onAuthStateChanged, signOut, User } from "firebase/auth";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "You have no new notifications",
    });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged out",
        description: "You have successfully logged out.",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "An error occurred during logout.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="border-b bg-white p-4 flex items-center justify-between">
      {/* Left: Sidebar */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? <ArrowRight className="rotate-180" /> : <Menu />}
        </Button>

        <h1 className="text-lg font-semibold text-green-900 font-dm-serif">
          AgriVerse
        </h1>
      </div>

      {/* Right: Notifications + Auth buttons */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon" onClick={handleNotificationClick}>
          <Bell className="h-5 w-5" />
        </Button>

        {user ? (
          <>
            <Button
              variant="outline"
              className="text-green-600 border-green-600 cursor-default"
              disabled
            >
              {user.displayName || user.email}
            </Button>
            <Button
              variant="default"
              onClick={handleLogout}
              className="bg-green-600 hover:bg-green-700"
            >
              Log Out
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={() => navigate("/login")}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              Login
            </Button>

            <Button
              variant="default"
              onClick={() => navigate("/signup")}
              className="bg-green-600 hover:bg-green-700"
            >
              Sign Up
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
