export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  progress: UserProgress;
  joinedAt: Date;
  lastLogin: Date;
  preferences: {
    language: string;
    theme: string;
    emailNotifications: boolean;
    reminderNotifications?: boolean;
    marketingNotifications?: boolean;
  };
}

export interface UserProgress {
  completedCourses: string[];
  completedLessons: string[];
  completedQuizzes: string[];
  points: number;
  streak: number;
  level: number;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  completedCourses: number;
  completedLessons: number;
  averageScore: number;
}

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
  lessons: Lesson[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

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
  content: {
    en: string;
    ru: string;
  };
  type: 'video' | 'article';
  videoUrl?: string;
  duration: number;
  quiz: Quiz | null;
  createdAt: Date;
  updatedAt: Date;
}

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

export interface Notification {
  id: string;
  title: {
    en: string;
    ru: string;
  };
  message: {
    en: string;
    ru: string;
  };
  type: 'info' | 'success' | 'warning' | 'error';
  userId: string;
  read: boolean;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  userId: string;
  createdAt: Date;
}