import { useState } from "react";

import { CourseView as CourseViewPage } from "../../../../components/CourseView";
import { EisenhowerMatrix as EisenhowerMatrixPage } from "../../../../components/productivity/EisenhowerMatrix";
import { PomodoroTimer as PomodoroTimerPage } from "../../../../components/productivity/PomodoroTimer";
import { Settings as SettingsPage } from "../../../../components/Settings";
import { Achievements as AchievementsPage } from "../../../../components/Achievements";
import { AllCourses as AllCoursesPage } from "../../../../components/AllCourses";
import { UserDashboard as UserDashboardPage } from "../../../../components/UserDashboard";
import { LearningPath as LearningPathPage } from "../../../../components/LearningPath";
import { SideNavigation } from "@/widgets/navigation/side-navigation";
import { TopNavigation } from "@/widgets/navigation/top-navigation";

interface UserLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

/**
 * Layout component for regular users with specialized navigation and content routing
 */
export function UserLayout({ currentPath, onNavigate }: UserLayoutProps) {
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
        isAdmin={false}
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
    case "/dashboard":
      return <UserDashboardPage onNavigate={onNavigate} />;
    case "/courses":
      return <AllCoursesPage onNavigate={onNavigate} />;
    case "/learning-path":
      return <LearningPathPage onNavigate={onNavigate} />;
    case "/pomodoro":
      return <PomodoroTimerPage />;
    case "/eisenhower":
      return <EisenhowerMatrixPage />;
    case "/achievements":
      return <AchievementsPage />;
    case "/settings":
      return <SettingsPage />;
    default:
      if (path.startsWith("/course/")) {
        const courseId = path.split("/").pop() || "";
        return <CourseViewPage courseId={courseId} onNavigate={onNavigate} isAdmin={false} />;
      }
      return <UserDashboardPage onNavigate={onNavigate} />;
  }
}