
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { toast } from "@/hooks/use-toast";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Show welcome toast when layout mounts - just for demonstration
  useEffect(() => {
    toast({
      title: "Welcome to AgriVerse",
      description: "Your crop disease management dashboard is ready",
    });
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
        
        <footer className="border-t p-4 text-center text-sm text-gray-500">
          © 2025 AgriVerse. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Layout;
