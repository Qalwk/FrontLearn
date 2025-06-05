import { CourseManagement as CourseManagementUI } from "@components/admin/CourseManagement";
import { useLanguage } from "../../../entities/i18n/providers/language-provider";

interface CourseManagementProps {
  onNavigate: (path: string) => void;
}

/**
 * Course management feature that provides CRUD operations for courses
 * This is a feature-level component that wraps the UI component
 */
export function CourseManagement({ onNavigate }: CourseManagementProps) {
  const { language } = useLanguage();
  
  // In a real application, we would have business logic here:
  // - API calls to fetch courses
  // - State management for course data
  // - Functions for creating, updating, and deleting courses
  // - Error handling and loading states
  
  return (
    <CourseManagementUI 
      onNavigate={onNavigate} 
    />
  );
}