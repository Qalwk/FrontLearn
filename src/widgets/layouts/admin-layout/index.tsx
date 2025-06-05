import { useState } from "react";

import { SideNavigation } from "../../navigation/side-navigation";
import { TopNavigation } from "../../navigation/top-navigation";
import { AnalyticsManagement as AnalyticsManagementPage } from "../../../../components/admin/AnalyticsManagement";
import { CourseManagementPage } from "../../../pages/admin/courses";
import { AdminDashboard as AdminDashboardPage } from "../../../../components/AdminDashboard";
import { NotificationsManagement as NotificationsManagementPage } from "../../../../components/admin/NotificationsManagement";
import { UsersManagement as UsersManagementPage } from "../../../../components/admin/UsersManagement";
import { CourseView as CourseViewPage } from "../../../../components/CourseView";
import { Settings as SettingsPage } from "../../../../components/Settings";

interface AdminLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

/**
 * Layout component for admin users with specialized navigation and content routing
 */
export function AdminLayout({ currentPath, onNavigate }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavigate = (path: string) => {
    onNavigate(path);
    setIsSidebarOpen(false); // Close sidebar on navigation on mobile
  };

  return (
    <div className="flex min-h-screen bg-background">
      <SideNavigation 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        currentPath={currentPath} 
        onNavigate={handleNavigate} 
        isAdmin={true}
      />
      <div className="flex-1 flex flex-col">
        <TopNavigation toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto">
          {renderContent(currentPath, handleNavigate)}
        </main>
      </div>
    </div>
  );
}

/**
 * Renders the appropriate content based on the current path
 */
function renderContent(path: string, onNavigate: (path: string) => void) {
  switch (path) {
    case "/admin":
      return <AdminDashboardPage />;
    case "/admin/users":
      return <UsersManagementPage />;
    case "/admin/notifications":
      return <NotificationsManagementPage />;
    case "/admin/courses":
      return <CourseManagementPage onNavigate={onNavigate} />;
    case "/admin/analytics":
      return <AnalyticsManagementPage />;
    case "/admin/settings":
      return <SettingsPage />;
    default:
      if (path.startsWith("/course/")) {
        const courseId = path.split("/").pop() || "";
        return <CourseViewPage courseId={courseId} onNavigate={onNavigate} isAdmin={true} />;
      }
      return <AdminDashboardPage />;
  }
}