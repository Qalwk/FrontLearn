import {
  LayoutDashboard,
  Route,
  Trophy,
  Settings,
  Users,
  BookOpen,
  BarChart2,
  BellDot,
  X,
  Timer,
  Grid2x2,
} from "lucide-react";

import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

interface SideNavigationProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function SideNavigation({
  isOpen,
  toggleSidebar,
  currentPath,
  onNavigate,
}: SideNavigationProps) {
  const { t: _t } = useLanguage();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";

  // Navigation items based on user role
  const navigationItems = isAdmin
    ? [
        {
          title: "Dashboard",
          icon: <LayoutDashboard className="h-5 w-5" />,
          path: "/admin",
        },
        {
          title: "Users",
          icon: <Users className="h-5 w-5" />,
          path: "/admin/users",
        },
        {
          title: "Courses",
          icon: <BookOpen className="h-5 w-5" />,
          path: "/admin/courses",
        },
        {
          title: "Analytics",
          icon: <BarChart2 className="h-5 w-5" />,
          path: "/admin/analytics",
        },
        {
          title: "Notifications",
          icon: <BellDot className="h-5 w-5" />,
          path: "/admin/notifications",
        },
      ]
    : [
        {
          title: "Dashboard",
          icon: <LayoutDashboard className="h-5 w-5" />,
          path: "/dashboard",
        },
        {
          title: "All Courses",
          icon: <BookOpen className="h-5 w-5" />,
          path: "/courses",
        },
        {
          title: "Learning Path",
          icon: <Route className="h-5 w-5" />,
          path: "/learning-path",
        },
        {
          title: "Pomodoro Timer",
          icon: <Timer className="h-5 w-5" />,
          path: "/pomodoro",
        },
        {
          title: "Eisenhower Matrix",
          icon: <Grid2x2 className="h-5 w-5" />,
          path: "/eisenhower",
        },
        {
          title: "Achievements",
          icon: <Trophy className="h-5 w-5" />,
          path: "/achievements",
        },
      ];

  // Common items for both roles
  const commonItems = [
    {
      title: "Settings",
      icon: <Settings className="h-5 w-5" />,
      path: isAdmin ? "/admin/settings" : "/settings",
    },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-muted/80 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border transition-transform md:relative md:z-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
          <h2 className="text-lg font-medium">FrontendMaster</h2>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 md:hidden"
            onClick={toggleSidebar}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation Links */}
        <ScrollArea className="flex-1 px-4 py-4">
          <nav className="flex flex-col gap-1">
            <div className="px-2 py-2">
              <h3 className="text-xs text-muted-foreground">Main Menu</h3>
            </div>

            {/* Main Navigation Items */}
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant={currentPath === item.path ? "sidebar" : "ghost"}
                className="justify-start"
                onClick={() => onNavigate(item.path)}
              >
                {item.icon}
                <span className="ml-2">{item.title}</span>
              </Button>
            ))}

            <Separator className="my-2" />

            {/* Common Items */}
            {commonItems.map((item) => (
              <Button
                key={item.path}
                variant={currentPath === item.path ? "sidebar" : "ghost"}
                className="justify-start"
                onClick={() => onNavigate(item.path)}
              >
                {item.icon}
                <span className="ml-2">{item.title}</span>
              </Button>
            ))}
          </nav>
        </ScrollArea>
      </aside>
    </>
  );
}