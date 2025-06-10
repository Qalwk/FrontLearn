import { BookOpen, Clock, Trophy, Flame, Star, ArrowRight, LucideIcon, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { useAuth } from "@/app/providers/AuthContext";
import { useLanguage } from "@/app/providers/LanguageContext";
import { ImageWithFallback } from "@/shared/ui/figma/ImageWithFallback";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";
import { mockCourses } from "@/shared/api/mockData";

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
        course.lessons.some((lesson: any) => 
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
    <div className="flex items-start gap-3">
      {icon}
      <div className="space-y-1">
        <h4 className="text-sm font-semibold">{title}</h4>
        <p className="text-muted-foreground text-sm">{description}</p>
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
  t,
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
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onNavigate(`/courses/${course.id}`)}
    >
      <CardContent className="p-0 pt-6">
        <ImageWithFallback
          src={course.image}
          alt={course.title[language]}
          width={400}
          height={200}
          className="h-40 w-full object-cover rounded-t-lg"
        />
        <div className="p-6 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {course.title[language]}
            </h3>
            {isCompleted && (
              <Badge variant="default" className="bg-green-500 text-white">
                <CheckCircle className="h-3 w-3 mr-1" />
                {t("courses.completed")}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {course.description[language]}
          </p>
          <div className="flex items-center text-muted-foreground text-sm gap-4">
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{totalLessons} {t("courses.lessons") as string}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
          </div>
          <Progress value={progressPercent} className="w-full" />
          <p className="text-sm text-muted-foreground">
            {lessonsCompleted} / {totalLessons} {t("courses.lessonsCompleted")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}