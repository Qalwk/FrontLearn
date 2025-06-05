import {
  ChevronLeft,
  LayoutDashboard,
  BookOpen,
  Route,
  Settings,
  Trophy,
  Users,
  Bell,
  BarChart3,
  Timer,
  ListTodo,
} from "lucide-react";

import { NavItem } from "./nav-item";
import { UserSection } from "./user-section";

import { useLanguage } from "@/entities/i18n/providers/language-provider";
import { useAuth } from "@/entities/session/providers/auth-provider";


interface SideNavigationProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
  isAdmin: boolean;
}

/**
 * Side navigation component with responsive behavior
 */
export function SideNavigation({ 
  isOpen, 
  toggleSidebar, 
  currentPath, 
  onNavigate,
  isAdmin
}: SideNavigationProps) {
  const { t } = useLanguage();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:sticky top-0 left-0 z-50 lg:z-0 h-full
          w-[280px] bg-sidebar text-sidebar-foreground shadow-xl lg:shadow-none
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <h2 className="font-semibold text-xl">Frontend Master</h2>
            <button 
              onClick={toggleSidebar} 
              className="lg:hidden p-2 rounded-full hover:bg-sidebar-accent"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
          
          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-3 space-y-1">
              {isAdmin ? (
                /* Admin Navigation */
                <>
                  <NavItem 
                    icon={<LayoutDashboard size={20} />} 
                    title={t("admin.dashboard")} 
                    path="/admin" 
                    currentPath={currentPath} 
                    onClick={() => onNavigate("/admin")}
                  />
                  <NavItem 
                    icon={<Users size={20} />} 
                    title={t("admin.users")} 
                    path="/admin/users" 
                    currentPath={currentPath} 
                    onClick={() => onNavigate("/admin/users")}
                  />
                  <NavItem 
                    icon={<BookOpen size={20} />} 
                    title={t("admin.courses")} 
                    path="/admin/courses" 
                    currentPath={currentPath} 
                    onClick={() => onNavigate("/admin/courses")}
                  />
                  <NavItem 
                    icon={<Bell size={20} />} 
                    title={t("admin.notifications")} 
                    path="/admin/notifications" 
                    currentPath={currentPath} 
                    onClick={() => onNavigate("/admin/notifications")}
                  />
                  <NavItem 
                    icon={<BarChart3 size={20} />} 
                    title={t("admin.analytics")} 
                    path="/admin/analytics" 
                    currentPath={currentPath} 
                    onClick={() => onNavigate("/admin/analytics")}
                  />
                </>
              ) : (
                /* User Navigation */
                <>
                  <NavItem 
                    icon={<LayoutDashboard size={20} />} 
                    title={t("user.dashboard")} 
                    path="/dashboard" 
                    currentPath={currentPath} 
                    onClick={() => onNavigate("/dashboard")}
                  />
                  <NavItem 
                    icon={<BookOpen size={20} />} 
                    title={t("user.courses")} 
                    path="/courses" 
                    currentPath={currentPath} 
                    onClick={() => onNavigate("/courses")}
                  />
                  <NavItem 
                    icon={<Route size={20} />} 
                    title={t("user.learning_path")} 
                    path="/learning-path" 
                    currentPath={currentPath} 
                    onClick={() => onNavigate("/learning-path")}
                  />
                  <NavItem 
                    icon={<Trophy size={20} />} 
                    title={t("user.achievements")} 
                    path="/achievements" 
                    currentPath={currentPath} 
                    onClick={() => onNavigate("/achievements")}
                  />
                  
                  <div className="pt-4 pb-2">
                    <div className="px-3 text-xs font-medium text-sidebar-foreground/60">
                      {t("nav.productivity")}
                    </div>
                  </div>
                  
                  <NavItem 
                    icon={<Timer size={20} />} 
                    title={t("nav.pomodoro")} 
                    path="/pomodoro" 
                    currentPath={currentPath} 
                    onClick={() => onNavigate("/pomodoro")}
                  />
                  <NavItem 
                    icon={<ListTodo size={20} />} 
                    title={t("nav.eisenhower")} 
                    path="/eisenhower" 
                    currentPath={currentPath} 
                    onClick={() => onNavigate("/eisenhower")}
                  />
                </>
              )}
              
              {/* Common navigation items */}
              <div className="pt-4 mt-4 border-t border-sidebar-border">
                <NavItem 
                  icon={<Settings size={20} />} 
                  title={t("common.settings")} 
                  path={isAdmin ? "/admin/settings" : "/settings"} 
                  currentPath={currentPath} 
                  onClick={() => onNavigate(isAdmin ? "/admin/settings" : "/settings")}
                />
              </div>
            </div>
          </nav>
          
          {/* User Section */}
          {currentUser && (
            <UserSection 
              user={currentUser} 
              onLogout={handleLogout}
            />
          )}
        </div>
      </aside>
    </>
  );
}