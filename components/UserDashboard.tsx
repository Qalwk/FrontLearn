import { BookOpen, Clock, Trophy, Flame, Star, ArrowRight, LucideIcon, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { mockCourses } from "../data/mockData";

interface UserDashboardProps {
  onNavigate: (path: string) => void;
}

export function UserDashboard({ onNavigate }: UserDashboardProps) {
  const { currentUser } = useAuth();
  const { language, t } = useLanguage();
  const [inProgressCourses, setInProgressCourses] = useState<any[]>([]);
  const [completedCourses, setCompletedCourses] = useState<any[]>([]);
  
  useEffect(() => {
    if (currentUser) {
      // Find courses where user has started lessons but not completed the course
      const inProgress = mockCourses.filter(course => 
        !currentUser.progress.completedCourses.includes(course.id) &&
        course.lessons.some(lesson => 
          currentUser.progress.completedLessons.includes(lesson.id)
        )
      );
      
      // Find completed courses
      const completed = mockCourses.filter(course => 
        currentUser.progress.completedCourses.includes(course.id)
      );
      
      setInProgressCourses(inProgress);
      setCompletedCourses(completed);
    }
  }, [currentUser]);
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="mb-1">
            {t("dashboard.welcome")}, {currentUser?.name}!
          </h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'ru-RU', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <StatsCard 
            icon={Trophy}
            value={currentUser?.progress.level || 0} 
            label={t("dashboard.level")} 
            colorClass="text-yellow-500" 
          />
          <StatsCard 
            icon={Star}
            value={currentUser?.progress.points || 0} 
            label={t("dashboard.points")} 
            colorClass="text-blue-500" 
          />
          <StatsCard 
            icon={Flame}
            value={currentUser?.progress.streak || 0} 
            label={t("dashboard.streak")} 
            colorClass="text-orange-500" 
          />
        </div>
      </div>
      
      {inProgressCourses.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2>{t("dashboard.continuelearning")}</h2>
            <Button variant="ghost" onClick={() => onNavigate("/courses")}>
              {t("courses.all")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressCourses.map(course => {
              const lessonsCompleted = course.lessons.filter((lesson: { id: string }) => 
                currentUser?.progress.completedLessons.includes(lesson.id)
              ).length;
              
              const totalLessons = course.lessons.length;
              const progressPercent = totalLessons > 0 ? Math.round((lessonsCompleted / totalLessons) * 100) : 0;
              
              return (
                <CourseCard
                  key={course.id}
                  course={course}
                  lessonsCompleted={lessonsCompleted}
                  totalLessons={totalLessons}
                  progressPercent={progressPercent}
                  isCompleted={false}
                  onNavigate={onNavigate}
                  language={language}
                  t={t}
                />
              );
            })}
          </div>
        </div>
      )}
      
      {/* Show recommended or all courses if no in-progress courses */}
      {inProgressCourses.length === 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2>{t("courses.all")}</h2>
            <Button variant="ghost" onClick={() => onNavigate("/courses")}>
              {t("courses.all")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCourses.slice(0, 3).map(course => {
              const lessonsCompleted = course.lessons.filter((lesson: { id: string }) => 
                currentUser?.progress.completedLessons.includes(lesson.id)
              ).length;
              
              const totalLessons = course.lessons.length;
              const progressPercent = totalLessons > 0 ? Math.round((lessonsCompleted / totalLessons) * 100) : 0;
              const isCompleted = currentUser?.progress.completedCourses.includes(course.id) || false;
              
              return (
                <CourseCard
                  key={course.id}
                  course={course}
                  lessonsCompleted={lessonsCompleted}
                  totalLessons={totalLessons}
                  progressPercent={progressPercent}
                  isCompleted={isCompleted}
                  onNavigate={onNavigate}
                  language={language}
                  t={t}
                />
              );
            })}
          </div>
        </div>
      )}
      
      {/* Completed courses section */}
      {completedCourses.length > 0 && (
        <div className="space-y-4">
          <h2>{t("courses.completed")}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                lessonsCompleted={course.lessons.length}
                totalLessons={course.lessons.length}
                progressPercent={100}
                isCompleted={true}
                onNavigate={onNavigate}
                language={language}
                t={t}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Achievements section */}
      <div className="space-y-4">
        <h2>{t("dashboard.achievements")}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <Achievement 
                icon={<Flame className="h-8 w-8 text-orange-500" />}
                title={`${currentUser?.progress.streak || 0} ${t("dashboard.streak")}`}
                description={
                  currentUser?.progress.streak 
                    ? currentUser.progress.streak > 1 
                      ? t("dashboard.streakDescription") 
                      : t("dashboard.streakStarted") 
                    : t("dashboard.noStreak")
                }
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <Achievement 
                icon={<BookOpen className="h-8 w-8 text-blue-500" />}
                title={`${currentUser?.progress.completedLessons.length || 0} ${t("courses.lessons")}`}
                description={t("dashboard.lessonsCompleted")}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <Achievement 
                icon={<Trophy className="h-8 w-8 text-yellow-500" />}
                title={`${currentUser?.progress.level || 0} ${t("dashboard.level")}`}
                description={t("dashboard.levelDescription")}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ icon: Icon, value, label, colorClass }: { 
  icon: LucideIcon; 
  value: number; 
  label: string; 
  colorClass: string;
}) {
  return (
    <div className="flex items-center gap-2 bg-card rounded-lg p-3 shadow-sm">
      <div className={`${colorClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-medium">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function Achievement({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="rounded-full bg-muted p-2 flex-shrink-0">
        {icon}
      </div>
      <div>
        <h4>{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function CourseCard({ 
  course, 
  lessonsCompleted, 
  totalLessons, 
  progressPercent,
  isCompleted,
  onNavigate,
  language,
  t
}: { 
  course: any; 
  lessonsCompleted: number; 
  totalLessons: number; 
  progressPercent: number;
  isCompleted: boolean;
  onNavigate: (path: string) => void;
  language: string;
  t: (key: string) => string;
}) {
  return (
    <Card className="overflow-hidden border-none shadow-md h-full flex flex-col">
      <div className="aspect-video w-full relative">
        <ImageWithFallback
          src={course.image}
          alt={course.title[language]}
          className="object-cover w-full h-full"
        />
        {isCompleted && (
          <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
            <CheckCircle className="h-4 w-4" />
          </div>
        )}
        <Badge 
          className="absolute bottom-2 left-2" 
          variant={
            course.difficulty === "beginner" ? "default" :
            course.difficulty === "intermediate" ? "secondary" : "outline"
          }
        >
          {t(`courses.${course.difficulty}`)}
        </Badge>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1">{course.title[language]}</CardTitle>
        <CardDescription className="line-clamp-2">
          {course.description[language]}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0 flex-grow">
        <div className="flex items-center text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4 mr-1" />
          <span className="mr-4">{totalLessons} {t("courses.lessons")}</span>
          <Clock className="h-4 w-4 mr-1" />
          <span>
            {course.lessons.reduce((acc: number, lesson: any) => acc + lesson.duration, 0)} min
          </span>
        </div>
        
        {lessonsCompleted > 0 && (
          <div className="mt-3">
            <Progress value={progressPercent} className="h-1.5" />
            <p className="text-xs text-muted-foreground mt-1">
              {progressPercent}% {t("common.complete")} • {lessonsCompleted}/{totalLessons} {t("courses.lessons")}
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 pb-4">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => onNavigate(`/course/${course.id}`)}
        >
          {isCompleted 
            ? t("common.view") 
            : lessonsCompleted > 0 
              ? t("dashboard.continuelearning") 
              : t("lesson.start")
          }
        </Button>
      </CardFooter>
    </Card>
  );
}