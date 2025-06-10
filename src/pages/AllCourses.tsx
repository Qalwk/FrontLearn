import { BookOpen, Clock, Search, Check, FilterX } from "lucide-react";
import { useState } from "react";

import { useAuth } from "@/app/providers/AuthContext";
import { useLanguage } from "@/app/providers/LanguageContext";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { mockCourses } from "@/shared/api/mockData";
import { ImageWithFallback } from "@/shared/ui/figma/ImageWithFallback";

interface AllCoursesProps {
  onNavigate: (path: string) => void;
}

export function AllCourses({ onNavigate }: AllCoursesProps) {
  const { t, language } = useLanguage();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  
  // Filter courses based on search query and difficulty filter
  const filteredCourses = mockCourses.filter((course) => {
    const matchesQuery = 
      course.title[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesDifficulty = 
      activeFilter === "all" || course.difficulty === activeFilter;
      
    return matchesQuery && matchesDifficulty;
  });

  const userProgress = currentUser?.progress || { 
    completedCourses: [], 
    completedLessons: [] 
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1>{t("courses.all")}</h1>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={`${t("common.search")} ${t("courses.all").toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8" 
          />
        </div>
        <Tabs 
          value={activeFilter} 
          onValueChange={setActiveFilter}
          className="w-full md:w-auto"
        >
          <TabsList className="grid grid-cols-4 w-full md:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="beginner">{t("courses.beginner")}</TabsTrigger>
            <TabsTrigger value="intermediate">{t("courses.intermediate")}</TabsTrigger>
            <TabsTrigger value="advanced">{t("courses.advanced")}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Course grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isCompleted = userProgress.completedCourses.includes(course.id as never);
            const lessonsCompleted = course.lessons.filter((lesson: { id: string }) => 
              userProgress.completedLessons.includes(lesson.id as never)
            ).length;
            const totalLessons = course.lessons.length;
            const progressPercent = totalLessons > 0 
              ? Math.round((lessonsCompleted / totalLessons) * 100) 
              : 0;
            
            return (
              <Card 
                key={course.id} 
                className="overflow-hidden border-none shadow-md h-full flex flex-col"
              >
                <div className="aspect-video w-full relative">
                  <ImageWithFallback
                    src={course.image}
                    alt={course.title[language]}
                    className="object-cover w-full h-full"
                  />
                  {isCompleted && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                      <Check className="h-4 w-4" />
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
                    <span className="mr-4">{course.lessons.length} {t("courses.lessons")}</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>
                      {course.lessons.reduce((acc: number, lesson: { duration: number }) => acc + lesson.duration, 0)} min
                    </span>
                  </div>
                  
                  {lessonsCompleted > 0 && (
                    <div className="mt-3">
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
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
                    {isCompleted ? t("common.view") : lessonsCompleted > 0 ? t("dashboard.continuelearning") : t("lesson.start")}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FilterX className="h-12 w-12 text-muted-foreground mb-4" />
          <h2>{t("courses.noResults")}</h2>
          <p className="text-muted-foreground max-w-md">
            {t("courses.tryDifferent")}
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSearchQuery("");
              setActiveFilter("all");
            }}
          >
            {t("common.clearFilters")}
          </Button>
        </div>
      )}
    </div>
  );
}