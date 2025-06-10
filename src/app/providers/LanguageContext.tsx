import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "ru";

type Translations = {
  [key: string]: {
    en: string;
    ru: string;
  };
};

// Define translations
const translations: Translations = {
  // Common
  "app.name": {
    en: "FrontendMaster",
    ru: "ФронтендМастер",
  },
  "common.loading": {
    en: "Loading...",
    ru: "Загрузка...",
  },
  "common.error": {
    en: "Error",
    ru: "Ошибка",
  },
  "common.success": {
    en: "Success",
    ru: "Успех",
  },
  "common.save": {
    en: "Save",
    ru: "Сохранить",
  },
  "common.cancel": {
    en: "Cancel",
    ru: "Отмена",
  },
  "common.edit": {
    en: "Edit",
    ru: "Редактировать",
  },
  "common.delete": {
    en: "Delete",
    ru: "Удалить",
  },
  "common.view": {
    en: "View",
    ru: "Просмотреть",
  },
  "common.complete": {
    en: "Complete",
    ru: "Завершено",
  },
  "common.completed": {
    en: "Completed",
    ru: "Завершено",
  },
  "common.next": {
    en: "Next",
    ru: "Далее",
  },
  "common.previous": {
    en: "Previous",
    ru: "Назад",
  },
  "common.continue": {
    en: "Continue",
    ru: "Продолжить",
  },
  "common.back": {
    en: "Back",
    ru: "Назад",
  },
  "common.search": {
    en: "Search",
    ru: "Поиск",
  },
  "common.clearFilters": {
    en: "Clear Filters",
    ru: "Сбросить Фильтры",
  },
  "common.title": {
    en: "Title",
    ru: "Название",
  },
  "common.description": {
    en: "Description",
    ru: "Описание",
  },
  "common.start": {
    en: "Start",
    ru: "Начать",
  },
  "common.pause": {
    en: "Pause",
    ru: "Пауза",
  },
  "common.reset": {
    en: "Reset",
    ru: "Сбросить",
  },
  "common.skip": {
    en: "Skip",
    ru: "Пропустить",
  },
  "common.add": {
    en: "Add",
    ru: "Добавить",
  },
  "common.review": {
    en: "Review",
    ru: "Обзор",
  },
  "common.correct": {
    en: "correct",
    ru: "правильно",
  },
  
  // Auth
  "auth.login": {
    en: "Login",
    ru: "Войти",
  },
  "auth.register": {
    en: "Register",
    ru: "Регистрация",
  },
  "auth.logout": {
    en: "Logout",
    ru: "Выйти",
  },
  "auth.email": {
    en: "Email",
    ru: "Электронная почта",
  },
  "auth.password": {
    en: "Password",
    ru: "Пароль",
  },
  "auth.confirmPassword": {
    en: "Confirm password",
    ru: "Подтвердите пароль",
  },
  "auth.name": {
    en: "Name",
    ru: "Имя",
  },
  "auth.forgotPassword": {
    en: "Forgot password?",
    ru: "Забыли пароль?",
  },
  "auth.loginAsAdmin": {
    en: "Login as Admin",
    ru: "Войти как Администратор",
  },
  "auth.loginAsUser": {
    en: "Login as User",
    ru: "Войти как Пользователь",
  },
  
  // Dashboard
  "dashboard.title": {
    en: "Dashboard",
    ru: "Панель управления",
  },
  "dashboard.welcome": {
    en: "Welcome",
    ru: "Добро пожаловать",
  },
  "dashboard.yourCourses": {
    en: "Your Courses",
    ru: "Ваши курсы",
  },
  "dashboard.continuelearning": {
    en: "Continue Learning",
    ru: "Продолжить обучение",
  },
  "dashboard.achievements": {
    en: "Achievements",
    ru: "Достижения",
  },
  "dashboard.streak": {
    en: "Day streak",
    ru: "Дней подряд",
  },
  "dashboard.points": {
    en: "Points",
    ru: "Баллы",
  },
  "dashboard.level": {
    en: "Level",
    ru: "Уровень",
  },
  "dashboard.lessonsCompleted": {
    en: "Lessons completed",
    ru: "Уроков завершено",
  },
  "dashboard.streakDescription": {
    en: "You've been learning for {days} days in a row",
    ru: "Вы учитесь уже {days} дней подряд",
  },
  "dashboard.streakStarted": {
    en: "You've started your learning streak!",
    ru: "Вы начали свою серию обучения!",
  },
  "dashboard.noStreak": {
    en: "Start learning today to begin your streak",
    ru: "Начните обучение сегодня, чтобы начать серию",
  },
  "dashboard.levelDescription": {
    en: "Keep learning to level up",
    ru: "Продолжайте обучение, чтобы повысить уровень",
  },
  
  // Admin
  "admin.users": {
    en: "Users",
    ru: "Пользователи",
  },
  "admin.courses": {
    en: "Courses",
    ru: "Курсы",
  },
  "admin.analytics": {
    en: "Analytics",
    ru: "Аналитика",
  },
  "admin.notifications": {
    en: "Notifications",
    ru: "Уведомления",
  },
  "admin.createCourse": {
    en: "Create Course",
    ru: "Создать курс",
  },
  "admin.createLesson": {
    en: "Create Lesson",
    ru: "Создать урок",
  },
  "admin.createQuiz": {
    en: "Create Quiz",
    ru: "Создать тест",
  },
  "admin.sendNotification": {
    en: "Send Notification",
    ru: "Отправить уведомление",
  },
  
  // Courses
  "courses.all": {
    en: "All Courses",
    ru: "Все курсы",
  },
  "courses.beginner": {
    en: "Beginner",
    ru: "Начальный",
  },
  "courses.intermediate": {
    en: "Intermediate",
    ru: "Средний",
  },
  "courses.advanced": {
    en: "Advanced",
    ru: "Продвинутый",
  },
  "courses.lessons": {
    en: "Lessons",
    ru: "Уроки",
  },
  "courses.duration": {
    en: "Duration",
    ru: "Продолжительность",
  },
  "courses.overview": {
    en: "Overview",
    ru: "Обзор",
  },
  "courses.aboutCourse": {
    en: "About this course",
    ru: "Об этом курсе",
  },
  "courses.whatYouWillLearn": {
    en: "What you'll learn",
    ru: "Чему вы научитесь",
  },
  "courses.completed": {
    en: "Course completed",
    ru: "Курс завершен",
  },
  "courses.completedToast": {
    en: "Congratulations! You've completed the course!",
    ru: "Поздравляем! Вы завершили курс!",
  },
  "courses.notFound": {
    en: "Course not found",
    ru: "Курс не найден",
  },
  "courses.courseNotFoundDesc": {
    en: "The course you're looking for doesn't exist or has been removed.",
    ru: "Курс, который вы ищете, не существует или был удален.",
  },
  "courses.noLessons": {
    en: "This course has no lessons yet.",
    ru: "У этого курса пока нет уроков.",
  },
  "courses.noResults": {
    en: "No courses found",
    ru: "Курсы не найдены",
  },
  "courses.tryDifferent": {
    en: "Try different keywords or filters",
    ru: "Попробуйте другие ключевые слова или фильтры",
  },
  
  // Lessons
  "lesson.complete": {
    en: "Mark as completed",
    ru: "Отметить как выполненный",
  },
  "lesson.start": {
    en: "Start lesson",
    ru: "Начать урок",
  },
  "lesson.next": {
    en: "Next lesson",
    ru: "Следующий урок",
  },
  "lesson.previous": {
    en: "Previous lesson",
    ru: "Предыдущий урок",
  },
  "lesson.video": {
    en: "Video",
    ru: "Видео",
  },
  "lesson.article": {
    en: "Article",
    ru: "Статья",
  },
  "lesson.quiz": {
    en: "Quiz",
    ru: "Тест",
  },
  "lesson.lesson": {
    en: "Lesson",
    ru: "Урок",
  },
  "lesson.completedToast": {
    en: "Lesson marked as completed!",
    ru: "Урок отмечен как завершенный!",
  },
  
  // Quiz
  "quiz.start": {
    en: "Start Quiz",
    ru: "Начать тест",
  },
  "quiz.submit": {
    en: "Submit Answers",
    ru: "Отправить ответы",
  },
  "quiz.results": {
    en: "Results",
    ru: "Результаты",
  },
  "quiz.correct": {
    en: "Correct answers",
    ru: "Правильные ответы",
  },
  "quiz.incorrect": {
    en: "Incorrect answers",
    ru: "Неправильные ответы",
  },
  "quiz.passed": {
    en: "Quiz passed!",
    ru: "Тест пройден!",
  },
  "quiz.failed": {
    en: "Quiz failed",
    ru: "Тест не пройден",
  },
  "quiz.tryAgain": {
    en: "Try again",
    ru: "Попробовать снова",
  },
  "quiz.score": {
    en: "Score",
    ru: "Результат",
  },
  "quiz.timeUp": {
    en: "Time's up!",
    ru: "Время вышло!",
  },
  
  // Settings
  "settings.title": {
    en: "Settings",
    ru: "Настройки",
  },
  "settings.language": {
    en: "Language",
    ru: "Язык",
  },
  "settings.languageDesc": {
    en: "Change the language of the interface",
    ru: "Изменить язык интерфейса",
  },
  "settings.theme": {
    en: "Theme",
    ru: "Тема",
  },
  "settings.themeDesc": {
    en: "Choose between light and dark mode",
    ru: "Выберите между светлым и темным режимом",
  },
  "settings.light": {
    en: "Light",
    ru: "Светлая",
  },
  "settings.dark": {
    en: "Dark",
    ru: "Темная",
  },
  "settings.notifications": {
    en: "Notifications",
    ru: "Уведомления",
  },
  "settings.emailNotifs": {
    en: "Email notifications",
    ru: "Уведомления по электронной почте",
  },
  "settings.emailNotifsDesc": {
    en: "Receive notifications via email",
    ru: "Получать уведомления по электронной почте",
  },
  "settings.reminderNotifs": {
    en: "Learning reminders",
    ru: "Напоминания об обучении",
  },
  "settings.reminderNotifsDesc": {
    en: "Get reminders to continue your learning journey",
    ru: "Получать напоминания о продолжении обучения",
  },
  "settings.marketingNotifs": {
    en: "Marketing emails",
    ru: "Маркетинговые письма",
  },
  "settings.marketingNotifsDesc": {
    en: "Receive offers and updates",
    ru: "Получать предложения и обновления",
  },
  "settings.account": {
    en: "Account",
    ru: "Аккаунт",
  },
  "settings.profile": {
    en: "Profile",
    ru: "Профиль",
  },
  "settings.changePicture": {
    en: "Change picture",
    ru: "Изменить фото",
  },
  "settings.profileUpdated": {
    en: "Profile updated successfully",
    ru: "Профиль успешно обновлен",
  },
  "settings.preferences": {
    en: "Preferences",
    ru: "Предпочтения",
  },
  "settings.preferencesDesc": {
    en: "Manage your interface and notification preferences",
    ru: "Управление настройками интерфейса и уведомлений",
  },
  "settings.preferencesUpdated": {
    en: "Preferences updated successfully",
    ru: "Предпочтения успешно обновлены",
  },
  "settings.productivity": {
    en: "Productivity",
    ru: "Продуктивность",
  },
  "settings.productivityDesc": {
    en: "Tools to help you study more effectively",
    ru: "Инструменты для более эффективного обучения",
  },
  "settings.accountDesc": {
    en: "Manage your account settings and security",
    ru: "Управление настройками аккаунта и безопасностью",
  },
  "settings.profileDesc": {
    en: "Update your personal information",
    ru: "Обновите вашу личную информацию",
  },
  "settings.security": {
    en: "Security",
    ru: "Безопасность",
  },
  "settings.changePassword": {
    en: "Change password",
    ru: "Изменить пароль",
  },
  "settings.changePasswordDesc": {
    en: "Update your password for better security",
    ru: "Обновите свой пароль для лучшей безопасности",
  },
  "settings.change": {
    en: "Change",
    ru: "Изменить",
  },
  "settings.dangerZone": {
    en: "Danger Zone",
    ru: "Опасная зона",
  },
  "settings.deleteAccount": {
    en: "Delete account",
    ru: "Удалить аккаунт",
  },
  "settings.deleteAccountDesc": {
    en: "Delete your account and all of your data permanently",
    ru: "Удалить свой аккаунт и все ваши данные навсегда",
  },
  "settings.delete": {
    en: "Delete",
    ru: "Удалить",
  },
  
  // Productivity
  "productivity.pomodoro": {
    en: "Pomodoro Timer",
    ru: "Таймер Помидора",
  },
  "productivity.eisenhower": {
    en: "Eisenhower Matrix",
    ru: "Матрица Эйзенхауэра",
  },
  "productivity.settings": {
    en: "Timer Settings",
    ru: "Настройки таймера",
  },
  "productivity.settingsDesc": {
    en: "Customize your pomodoro timer",
    ru: "Настройте ваш таймер помидора",
  },
  "productivity.focusDuration": {
    en: "Focus duration",
    ru: "Продолжительность фокуса",
  },
  "productivity.shortBreakDuration": {
    en: "Short break duration",
    ru: "Продолжительность короткого перерыва",
  },
  "productivity.longBreakDuration": {
    en: "Long break duration",
    ru: "Продолжительность длинного перерыва",
  },
  "productivity.sessionsBeforeLongBreak": {
    en: "Sessions before long break",
    ru: "Сессий перед длинным перерывом",
  },
  "productivity.autoStartBreaks": {
    en: "Auto-start breaks",
    ru: "Автозапуск перерывов",
  },
  "productivity.autoStartBreaksDesc": {
    en: "Automatically start breaks after focus session",
    ru: "Автоматически начинать перерывы после фокусировки",
  },
  "productivity.autoStartPomodoros": {
    en: "Auto-start focus sessions",
    ru: "Автозапуск сессий фокусировки",
  },
  "productivity.autoStartPomodorosDesc": {
    en: "Automatically start focus sessions after breaks",
    ru: "Автоматически начинать фокусировку после перерывов",
  },
  "productivity.soundNotifications": {
    en: "Sound notifications",
    ru: "Звуковые уведомления",
  },
  "productivity.soundNotificationsDesc": {
    en: "Play a sound when timer completes",
    ru: "Воспроизводить звук по завершении таймера",
  },
  "productivity.focusTime": {
    en: "Focus Time",
    ru: "Время фокусировки",
  },
  "productivity.breakTime": {
    en: "Break Time",
    ru: "Время перерыва",
  },
  "productivity.noTask": {
    en: "No task specified",
    ru: "Задача не указана",
  },
  "productivity.focusing": {
    en: "Focusing",
    ru: "Фокусировка",
  },
  "productivity.onBreak": {
    en: "On break",
    ru: "На перерыве",
  },
  "productivity.paused": {
    en: "Paused",
    ru: "На паузе",
  },
  "productivity.ready": {
    en: "Ready to start",
    ru: "Готов к запуску",
  },
  "productivity.enterTask": {
    en: "What are you working on?",
    ru: "Над чем вы работаете?",
  },
  "productivity.sessionComplete": {
    en: "Focus session completed!",
    ru: "Сессия фокусировки завершена!",
  },
  "productivity.breakComplete": {
    en: "Break completed!",
    ru: "Перерыв завершен!",
  },
  "productivity.sessionStats": {
    en: "Session Statistics",
    ru: "Статистика сессий",
  },
  "productivity.sessionStatsDesc": {
    en: "Track your productivity over time",
    ru: "Отслеживайте вашу продуктивность со временем",
  },
  "productivity.completed": {
    en: "Sessions",
    ru: "Сессий",
  },
  "productivity.totalFocusTime": {
    en: "Total focus time",
    ru: "Общее время фокуса",
  },
  "productivity.cycles": {
    en: "Completed cycles",
    ru: "Завершенных циклов",
  },
  
  // Eisenhower Matrix
  "productivity.eisenhowerHelp": {
    en: "Prioritize your tasks",
    ru: "Приоритезируйте ваши задачи",
  },
  "productivity.eisenhowerDesc": {
    en: "The Eisenhower Matrix helps you decide which tasks to focus on. Sort tasks by urgency and importance.",
    ru: "Матрица Эйзенхауэра помогает решить, на каких задачах сосредоточиться. Сортируйте задачи по срочности и важности.",
  },
  "productivity.newTaskPlaceholder": {
    en: "Add a new task...",
    ru: "Добавить новую задачу...",
  },
  "productivity.quadrantDo": {
    en: "Do First",
    ru: "Сделать сейчас",
  },
  "productivity.quadrantSchedule": {
    en: "Schedule",
    ru: "Запланировать",
  },
  "productivity.quadrantDelegate": {
    en: "Delegate",
    ru: "Делегировать",
  },
  "productivity.quadrantEliminate": {
    en: "Eliminate",
    ru: "Исключить",
  },
  "productivity.quadrantDoDesc": {
    en: "Important & Urgent",
    ru: "Важно & Срочно",
  },
  "productivity.quadrantScheduleDesc": {
    en: "Important & Not Urgent",
    ru: "Важно & Не срочно",
  },
  "productivity.quadrantDelegateDesc": {
    en: "Not Important & Urgent",
    ru: "Не важно & Срочно",
  },
  "productivity.quadrantEliminateDesc": {
    en: "Not Important & Not Urgent",
    ru: "Не важно & Не срочно",
  },
  "productivity.noTasks": {
    en: "No tasks yet",
    ru: "Пока нет задач",
  },
  "productivity.editTask": {
    en: "Edit Task",
    ru: "Редактировать задачу",
  },
  "productivity.editTaskDesc": {
    en: "Update task details",
    ru: "Обновить детали задачи",
  },
  "productivity.taskAdded": {
    en: "Task added",
    ru: "Задача добавлена",
  },
  "productivity.taskUpdated": {
    en: "Task updated",
    ru: "Задача обновлена",
  },
  "productivity.taskDeleted": {
    en: "Task deleted",
    ru: "Задача удалена",
  },
  "productivity.taskMoved": {
    en: "Task moved",
    ru: "Задача перемещена",
  },
  "productivity.markComplete": {
    en: "Mark as complete",
    ru: "Отметить как выполнена",
  },
  "productivity.markIncomplete": {
    en: "Mark as incomplete",
    ru: "Отметить как невыполнена",
  },
  "productivity.moveTo": {
    en: "Move to",
    ru: "Переместить в",
  },
  "productivity.quadrant": {
    en: "Quadrant",
    ru: "Квадрант",
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Get language from localStorage or default to English
  const storedLanguage = typeof window !== 'undefined' 
    ? localStorage.getItem('language') as Language || 'en' 
    : 'en';
    
  const [language, setLanguage] = useState<Language>(storedLanguage);

  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const translate = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t: translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};