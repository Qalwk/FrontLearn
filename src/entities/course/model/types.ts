/**
 * Lesson type definition
 */
export type LessonType = "video" | "article" | "interactive";

/**
 * Quiz question model
 */
export interface QuizQuestion {
  id: string;
  question: {
    en: string;
    ru: string;
  };
  options: {
    en: string[];
    ru: string[];
  };
  correctOptionIndex: number;
}

/**
 * Quiz model
 */
export interface Quiz {
  id: string;
  title: {
    en: string;
    ru: string;
  };
  questions: QuizQuestion[];
  pointsReward: number;
  timeLimit: number;
  passingScore: number;
}

/**
 * Lesson model
 */
export interface Lesson {
  id: string;
  title: {
    en: string;
    ru: string;
  };
  description: {
    en: string;
    ru: string;
  };
  type: LessonType;
  content: {
    en: string;
    ru: string;
  };
  duration: number; // in minutes
  quiz: Quiz | null;
  order: number;
}

/**
 * Course model
 */
export interface Course {
  id: string;
  title: {
    en: string;
    ru: string;
  };
  description: {
    en: string;
    ru: string;
  };
  image: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  lessons: Lesson[];
  createdAt: string;
  updatedAt: string;
  authorId: string;
  totalStudents: number;
  averageRating: number;
  totalDuration: number; // in minutes
  progress?: number; // percentage completed (0-100)
}

/**
 * Course progress model
 */
export interface CourseProgress {
  userId: string;
  courseId: string;
  completedLessons: string[]; // lesson IDs
  quizResults: {
    quizId: string;
    score: number;
    completed: boolean;
  }[];
  lastAccessedAt: string;
  progress: number; // percentage (0-100)
}