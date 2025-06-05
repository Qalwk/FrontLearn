import { BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { Toaster } from "sonner";

import { Achievements } from "./components/Achievements";
import { AnalyticsManagement } from "./components/admin/AnalyticsManagement";
import { CourseManagement } from "./components/admin/CourseManagement";
import { NotificationsManagement } from "./components/admin/NotificationsManagement";
import { UsersManagement } from "./components/admin/UsersManagement";
import { AdminDashboard } from "./components/AdminDashboard";
import { AllCourses } from "./components/AllCourses";
import { AuthScreen } from "./components/AuthScreen";
import { CourseView } from "./components/CourseView";
import { EisenhowerMatrix } from "./components/productivity/EisenhowerMatrix";
import { PomodoroTimer } from "./components/productivity/PomodoroTimer";
import { Settings } from "./components/Settings";
import { SideNavigation } from "./components/SideNavigation";
import { TopNavigation } from "./components/TopNavigation";
import { Button } from "./components/ui/button";
import { UserDashboard } from "./components/UserDashboard";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";


// Main App wrapper with providers
export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <FrontendMasterApp />
        <Toaster />
      </AuthProvider>
    </LanguageProvider>
  );
}

// Main application component
function FrontendMasterApp() {
  const { currentUser, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("/dashboard");
  
  useEffect(() => {
    // Set initial path based on user role
    if (currentUser) {
      setCurrentPath(currentUser.role === "admin" ? "/admin" : "/dashboard");
    }
  }, [currentUser]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    setIsSidebarOpen(false); // Close sidebar on navigation on mobile
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  // Show auth screen if not logged in
  if (!currentUser) {
    return <AuthScreen />;
  }

  // Render app content with navigation
  return (
    <div className="flex min-h-screen bg-background">
      <SideNavigation 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        currentPath={currentPath} 
        onNavigate={handleNavigate} 
      />
      <div className="flex-1 flex flex-col">
        <TopNavigation toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto">
          {/* Render content based on current path and user role */}
          {renderContent(currentPath, currentUser.role, handleNavigate)}
        </main>
      </div>
    </div>
  );
}

// Helper function to render content based on path and role
function renderContent(path: string, role: string, onNavigate: (path: string) => void) {
  // Admin routes
  if (role === "admin") {
    switch (path) {
      case "/admin":
        return <AdminDashboard />;
      case "/admin/users":
        return <UsersManagement />;
      case "/admin/notifications":
        return <NotificationsManagement />;
      case "/admin/courses":
        return <CourseManagement onNavigate={onNavigate} />;
      case "/admin/analytics":
        return <AnalyticsManagement />;
      case "/admin/settings":
        return <Settings />;
      default:
        if (path.startsWith("/course/")) {
          const courseId = path.split("/").pop() || "";
          return <CourseView courseId={courseId} onNavigate={onNavigate} isAdmin={true} />;
        }
        return <AdminDashboard />;
    }
  }
  
  // User routes
  switch (path) {
    case "/dashboard":
      return <UserDashboard onNavigate={onNavigate} />;
    case "/courses":
      return <AllCourses onNavigate={onNavigate} />;
    case "/learning-path":
      return (
        <div className="container mx-auto py-6">
          <h1>Learning Path</h1>
          <p className="text-muted-foreground">Your personalized learning journey</p>
          <div className="mt-8 grid gap-6">
            <div className="bg-card p-6 rounded-lg shadow">
              <h2>Recommended Path</h2>
              <p className="text-muted-foreground mt-2">Based on your interests and progress</p>
              <div className="mt-4 space-y-4">
                <div className="flex items-center p-3 border rounded-lg">
                  <div className="bg-primary/10 p-2 rounded-full mr-4">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4>HTML Fundamentals</h4>
                    <p className="text-sm text-muted-foreground">Start here to build your foundation</p>
                  </div>
                  <Button className="ml-auto" onClick={() => onNavigate("/course/html-fundamentals")}>
                    Begin
                  </Button>
                </div>
                <div className="flex items-center p-3 border rounded-lg">
                  <div className="bg-primary/10 p-2 rounded-full mr-4">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4>CSS Mastery</h4>
                    <p className="text-sm text-muted-foreground">Master styling with advanced techniques</p>
                  </div>
                  <Button className="ml-auto" onClick={() => onNavigate("/course/css-mastery")}>
                    Begin
                  </Button>
                </div>
                <div className="flex items-center p-3 border rounded-lg">
                  <div className="bg-primary/10 p-2 rounded-full mr-4">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4>JavaScript Fundamentals</h4>
                    <p className="text-sm text-muted-foreground">Add interactivity to your websites</p>
                  </div>
                  <Button className="ml-auto" onClick={() => onNavigate("/course/javascript-fundamentals")}>
                    Begin
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    case "/pomodoro":
      return <PomodoroTimer />;
    case "/eisenhower":
      return <EisenhowerMatrix />;
    case "/achievements":
      return <Achievements />;
    case "/settings":
      return <Settings />;
    default:
      if (path.startsWith("/course/")) {
        const courseId = path.split("/").pop() || "";
        return <CourseView courseId={courseId} onNavigate={onNavigate} isAdmin={false} />;
      }
      return <UserDashboard onNavigate={onNavigate} />;
  }
}