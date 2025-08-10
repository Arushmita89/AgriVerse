import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { auth } from "../firebaseConfig"; // adjust path if needed
import { onAuthStateChanged, signOut, User } from "firebase/auth";

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

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleNotificationClick = () => {
    alert("No new notifications.");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      //alert("Logged out successfully.");
      navigate("/login");
    } catch (error) {
      //alert("Logout failed.");
      console.error(error);
    }
  };

  return (
    <nav className="w-full bg-green-900 text-white flex items-center justify-between px-16 py-3 space-x-10">
      {/* Left: Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img
          src="/assets/logo.jpg"
          alt="logo"
          className="w-10 h-10 rounded-full border border-green-300 object-cover"
        />
        <span className="text-2xl justify-center items-center font-thin font-dm-serif">
          AgriVerse
        </span>
      </Link>

      {/* Center: Routes */}
      <div className="flex gap-4 ml-6">
        {routes.map((route) => {
          const isActive = location.pathname === route.path;
          return (
            <Link
              key={route.path}
              to={route.path}
              className={cn(
                "flex items-center gap-1 px-3 py-2 rounded-md transition-colors",
                isActive ? "bg-green-700" : "hover:bg-green-800"
              )}
            >
              {route.icon("w-5 h-5")}
              <span>{route.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Right: Notifications + Auth Buttons */}
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
    </nav>
  );
};

export default Navbar;
