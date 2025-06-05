import { useState, useEffect } from "react";

import { useAuth } from "../../entities/session/providers/auth-provider";
import { AuthPage } from "../../pages/auth";
import { AdminLayout } from "../../widgets/layouts/admin-layout";
import { UserLayout } from "../../widgets/layouts/user-layout";

/**
 * Application router that handles navigation
 * Migrated from the renderContent function in the original App.tsx
 */
export function AppRouter() {
  const { currentUser, loading } = useAuth();
  const [currentPath, setCurrentPath] = useState("/dashboard");
  
  useEffect(() => {
    // Set initial path based on user role
    if (currentUser) {
      setCurrentPath(currentUser.role === "admin" ? "/admin" : "/dashboard");
    }
  }, [currentUser]);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
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
    return <AuthPage />;
  }

  // Render the appropriate layout based on user role
  return currentUser.role === "admin" ? (
    <AdminLayout currentPath={currentPath} onNavigate={handleNavigate} />
  ) : (
    <UserLayout currentPath={currentPath} onNavigate={handleNavigate} />
  );
}