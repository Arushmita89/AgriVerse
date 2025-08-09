import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation();

  const routes = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: (className: string) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M9 9h.01" />
          <path d="M15 9h.01" />
          <path d="M9 15h.01" />
          <path d="M15 15h.01" />
        </svg>
      ),
    },
    {
      name: "Disease Detection",
      path: "/detection",
      icon: (className: string) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m4.93 4.93 14.14 14.14" />
        </svg>
      ),
    },
    {
      name: "Disease Prediction",
      path: "/prediction",
      icon: (className: string) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="m2 12 5.25 5 2.625-5H8c0-3.75 3-7.5 7.5-7.5 3.75 0 5.625 1.875 5.625 1.875" />
          <path d="M22 12c-1.5 3.75-5.25 7.5-11.25 7.5-3.75 0-5.625-1.875-5.625-1.875" />
          <circle cx="12" cy="12" r="0.75" />
        </svg>
      ),
    },
    {
      name: "Disease Library",
      path: "/library",
      icon: (className: string) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:relative inset-y-0 left-0 z-50 w-64 bg-white border-r transition-transform duration-300 ease-in-out transform",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 border-green-900">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
                <img
                  src="logo.jpg"
                  alt="logo"
                  className="w-full h-full justify-center object-center border border-green-900 rounded-full object-fill"
                />
              </div>
              <span className="font-bold text-lg border-1 text-green-900">
                AgriVerse
              </span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden"
              aria-label="Toggle sidebar"
            >
              <ArrowLeft size={16} />
            </Button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-auto">
            {routes.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  location.pathname === route.path
                    ? "bg-green-100 text-green-900"
                    : "hover:bg-gray-100"
                )}
              >
                {route.icon("h-5 w-5")}
                <span>{route.name}</span>
              </Link>
            ))}
          </nav>

          {/* <div className="p-4 border-t hidden md:block">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <span>{isOpen ? "Collapse" : "Expand"}</span>
              {isOpen ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </Button>
          </div> */}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
