import { ReactNode } from "react";

interface NavItemProps {
  icon: ReactNode;
  title: string;
  path: string;
  currentPath: string;
  onClick: () => void;
}

/**
 * Navigation item component for sidebar
 */
export function NavItem({ icon, title, path, currentPath, onClick }: NavItemProps) {
  const isActive = currentPath === path || 
    (path !== "/" && path !== "/admin" && currentPath.startsWith(path));
  
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2 rounded-md text-left
        transition-colors duration-200
        ${isActive 
          ? "bg-sidebar-primary text-sidebar-primary-foreground" 
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        }
      `}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="truncate">{title}</span>
    </button>
  );
}