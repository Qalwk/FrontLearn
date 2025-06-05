import { createContext, useContext, useState, ReactNode, useCallback } from "react";

// Language context types
type Language = "en" | "ru";
type TranslationRecord = Record<string, string>;
type Translations = Record<Language, TranslationRecord>;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  translations: Translations;
}

// Mock translations - in a real app, these would be loaded from files or an API
// This would be migrated from your existing translations
const translations: Translations = {
  en: {
    "app.title": "Frontend Master",
    "auth.login": "Login",
    "auth.register": "Register",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.name": "Full Name",
    "admin.dashboard": "Admin Dashboard",
    "admin.users": "Users Management",
    "admin.courses": "Courses Management",
    "admin.notifications": "Notifications",
    "admin.analytics": "Analytics",
    "user.dashboard": "Dashboard",
    "user.courses": "All Courses",
    "user.learning_path": "Learning Path",
    "user.achievements": "Achievements",
    "common.settings": "Settings",
    "common.logout": "Logout",
    "nav.productivity": "Productivity Tools",
    "nav.pomodoro": "Pomodoro Timer",
    "nav.eisenhower": "Eisenhower Matrix",
  },
  ru: {
    "app.title": "Фронтенд Мастер",
    "auth.login": "Вход",
    "auth.register": "Регистрация",
    "auth.email": "Эл. почта",
    "auth.password": "Пароль",
    "auth.name": "Полное имя",
    "admin.dashboard": "Панель администратора",
    "admin.users": "Управление пользователями",
    "admin.courses": "Управление курсами",
    "admin.notifications": "Уведомления",
    "admin.analytics": "Аналитика",
    "user.dashboard": "Панель управления",
    "user.courses": "Все курсы",
    "user.learning_path": "Путь обучения",
    "user.achievements": "Достижения",
    "common.settings": "Настройки",
    "common.logout": "Выход",
    "nav.productivity": "Инструменты продуктивности",
    "nav.pomodoro": "Таймер Помодоро",
    "nav.eisenhower": "Матрица Эйзенхауэра",
  },
};

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: () => "",
  translations,
});

interface LanguageProviderProps {
  children: ReactNode;
}

/**
 * Provider component for language and translations
 * Migrated from the original LanguageContext.tsx
 */
export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>("en");

  // Translation function
  const t = useCallback(
    (key: string) => {
      return translations[language][key] || key;
    },
    [language]
  );

  const value = {
    language,
    setLanguage,
    t,
    translations,
  };

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

/**
 * Hook for accessing the language context
 */
export function useLanguage() {
  return useContext(LanguageContext);
}