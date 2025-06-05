import { CourseManagement } from "@/features/admin/course-management";

interface CourseManagementPageProps {
  onNavigate: (path: string) => void;
}

/**
 * Course management page for admin
 */
export function CourseManagementPage({ onNavigate }: CourseManagementPageProps) {
  return (
    <CourseManagement onNavigate={onNavigate} />
  );
}