import {
  BookOpen,
  ArrowLeft,
  Clock,
  CheckCircle,
  Circle,
  PlayCircle,
  FileText,
  Edit,
  Plus,
  Trash2,
  Image,
  Save
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { LessonView, Lesson } from "@/pages/LessonView";
import { useAuth } from "@/app/providers/AuthContext";
import { useLanguage } from "@/app/providers/LanguageContext";
import { ImageWithFallback } from "@/shared/ui/figma/ImageWithFallback";
import { QuizView, Quiz, Question } from "@/pages/QuizView";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Progress } from "@/shared/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Textarea } from "@/shared/ui/textarea";
import { mockCourses } from "@/shared/api/mockData";
import type { User } from "@/app/providers/AuthContext";


interface CourseViewProps {
  courseId: string;
  onNavigate: (path: string) => void;
  isAdmin?: boolean;
}

export function CourseView({ courseId, onNavigate, isAdmin = false }: CourseViewProps) {
  const { t, language } = useLanguage();
  const { currentUser, updateUserProgress } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "lessons" | "edit">(isAdmin ? "edit" : "overview");
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [selectedLessonForEdit, setSelectedLessonForEdit] = useState<Lesson | null>(null);
  
  const course = mockCourses.find(c => c.id === courseId);
  const userProgress = currentUser?.progress || {
    completedCourses: [],
    completedLessons: [],
    level: 1,
    points: 0,
    streak: 0
  };
  
  useEffect(() => {
    // Reset selected lesson when changing courses
    setSelectedLessonId(null);
    setShowQuiz(false);
    setActiveTab(isAdmin ? "edit" : "overview");
  }, [courseId, isAdmin]);
  
  if (!course) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => onNavigate("/courses")} className="p-0 mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> {t("common.back")}
          </Button>
        </div>
        <h1>{t("courses.notFound")}</h1>
        <p className="text-muted-foreground">{t("courses.courseNotFoundDesc")}</p>
      </div>
    );
  }
  
  const lessonsCompleted = course.lessons.filter((lesson: Lesson) => 
    userProgress.completedLessons.includes(lesson.id)
  ).length;
  
  const totalLessons = course.lessons.length;
  const progressPercent = Math.round((lessonsCompleted / totalLessons) * 100);
  const isCourseCompleted = userProgress.completedCourses.includes(course.id);
  
  const handleStartCourse = () => {
    if (course.lessons.length > 0) {
      setSelectedLessonId(course.lessons[0].id);
      setActiveTab("lessons");
    } else {
      toast.error(t("courses.noLessons"));
    }
  };
  
  const handleLessonClick = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setShowQuiz(false);
  };
  
  const handleLessonComplete = async (lessonId: string) => {
    if (currentUser) {
      // Add to completed lessons if not already completed
      if (!userProgress.completedLessons.includes(lessonId)) {
        const updatedProgress: User['progress'] = {
          ...userProgress,
          completedLessons: [...userProgress.completedLessons, lessonId],
          points: userProgress.points + 10,
          level: Math.floor((userProgress.points + 10) / 100),
          streak: userProgress.streak + 1
        };
        
        try {
          await updateUserProgress(updatedProgress);
          toast.success(t("lesson.completedToast"));
          
          // Check if this completes the course
          const updatedLessonsCompleted = course.lessons.filter((lesson: Lesson) => 
            [...userProgress.completedLessons, lessonId].includes(lesson.id)
          ).length;
          
          if (updatedLessonsCompleted === course.lessons.length) {
            // All lessons completed, mark course as completed
            await updateUserProgress({
              ...updatedProgress,
              completedCourses: [...updatedProgress.completedCourses, course.id],
              points: updatedProgress.points + 50, // Extra points for course completion
              streak: updatedProgress.streak + 1,
              level: Math.floor((updatedProgress.points + 60) / 100) // Simple level calculation
            });
            
            toast.success(t("courses.completedToast"));
          }
        } catch (error) {
          console.error("Failed to update progress:", error);
          toast.error(t("common.error"));
        }
      }
    }
  };
  
  const handleStartQuiz = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setShowQuiz(true);
  };
  
  const handleQuizComplete = (score: number, lessonId: string) => {
    // Handle quiz completion logic
    const lesson = course.lessons.find((l: Lesson) => l.id === lessonId);
    const quiz = lesson?.quiz;
    
    if (quiz && score >= quiz.passingScore) {
      toast.success(`${t("quiz.passed")} ${score}/${quiz.questions.length} ${t("quiz.correct")}`);
      handleLessonComplete(lessonId);
    } else {
      toast.error(t("quiz.failed"));
    }
    
    setShowQuiz(false);
  };

  // Edit lesson functionality (for admin)
  const handleEditLesson = (lesson: Lesson) => {
    setSelectedLessonForEdit(lesson);
    setEditDialogOpen(true);
  };

  const handleCreateLesson = () => {
    setSelectedLessonForEdit(null);
    setEditDialogOpen(true);
  };

  const handleSaveLesson = () => {
    // In a real app, this would save the lesson to the backend
    toast.success(selectedLessonForEdit ? "Lesson updated successfully" : "New lesson created successfully");
    setEditDialogOpen(false);
  };

  // If a lesson is selected, show lesson content
  if (selectedLessonId) {
    const lesson = course.lessons.find((l: Lesson) => l.id === selectedLessonId);
    
    if (!lesson) {
      return <div>Lesson not found</div>;
    }
    
    // Show quiz if requested
    if (showQuiz && lesson.quiz) {
      return (
        <QuizView 
          quiz={lesson.quiz} 
          onComplete={(score) => handleQuizComplete(score, lesson.id)} 
          onCancel={() => setShowQuiz(false)}
        />
      );
    }
    
    // Show lesson content
    return (
      <LessonView 
        lesson={lesson} 
        courseName={course.title[language]} 
        isCompleted={userProgress.completedLessons.includes(lesson.id)}
        isAdmin={isAdmin}
        onBack={() => {
          setSelectedLessonId(null);
          setActiveTab(isAdmin ? "edit" : "lessons");
        }}
        onComplete={() => handleLessonComplete(lesson.id)}
        onStartQuiz={() => handleStartQuiz(lesson.id)}
        hasQuiz={!!lesson.quiz}
        onEdit={() => handleEditLesson(lesson)}
      />
    );
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center mb-2">
        <Button variant="ghost" onClick={() => onNavigate("/courses")} className="p-0 mr-2">
          <ArrowLeft className="h-4 w-4 mr-1" /> {t("common.back")}
        </Button>
      </div>
      
      {/* Course header */}
      <div className="relative">
        <div className="aspect-[3/1] w-full overflow-hidden rounded-lg">
          <ImageWithFallback 
            src={course.image}
            alt={course.title[language]}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
        
        <div className="absolute bottom-0 left-0 p-6 w-full">
          <Badge className="mb-2">{t(`courses.${course.difficulty}`)}</Badge>
          <h1 className="text-3xl md:text-4xl">{course.title[language]}</h1>
        </div>

        {isAdmin && (
          <div className="absolute top-4 right-4">
            <Button variant="secondary" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Course Details
            </Button>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "overview" | "lessons" | "edit")}>
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
            <TabsTrigger value="overview">{t("courses.overview")}</TabsTrigger>
            <TabsTrigger value="lessons">{t("courses.lessons")}</TabsTrigger>
            {isAdmin && <TabsTrigger value="edit">Edit Course</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="overview" className="mt-6 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl mb-4">{t("common.description")}:</h2>
                <p className="text-muted-foreground whitespace-pre-line mb-6">{course.description[language]}</p>
                
                <h3 className="text-lg mb-2">{t("courses.whatYouWillLearn")}:</h3>
                <ul className="list-disc list-inside space-y-1 mb-6">
                  {course.learningObjectives[language].map((objective: string, index: number) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>
                
                <div className="flex items-center space-x-4 mb-6">
                  <div className="text-sm text-muted-foreground">
                    <Clock className="inline-block h-4 w-4 mr-1 align-text-bottom" />
                    <span>{course.duration} {t("common.minutes")}.</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <BookOpen className="inline-block h-4 w-4 mr-1 align-text-bottom" />
                    <span>{course.lessons.length} {t("common.lessons")}.</span>
                  </div>
                </div>
                
                {isCourseCompleted ? (
                  <Badge className="mb-2">{t("courses.completed")}</Badge>
                ) : (
                  <Button onClick={handleStartCourse} className="w-full">
                    {t("courses.startCourse")}
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="lessons" className="mt-6 space-y-6">
            <h2 className="text-xl mb-4">{t("courses.courseContent")}</h2>
            <div className="space-y-4">
              {course.lessons.map((lesson: Lesson, index: number) => (
                <Card 
                  key={lesson.id} 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleLessonClick(lesson.id)}
                >
                  <CardContent className="flex items-center p-4">
                    <div className="flex-shrink-0 mr-4">
                      {lesson.type === "video" ? (
                        <PlayCircle className="h-6 w-6 text-primary" />
                      ) : (
                        <FileText className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">{index + 1}. {lesson.title[language]}</p>
                      <p className="text-sm text-muted-foreground">
                        {lesson.duration} {t("common.minutes")}
                        {lesson.quiz && ` • ${t("common.quiz")}`}
                      </p>
                    </div>
                    {userProgress.completedLessons.includes(lesson.id) && (
                      <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="edit" className="mt-6 space-y-6">
              <Button onClick={handleCreateLesson} className="mb-4">
                <Plus className="h-4 w-4 mr-2" /> Create New Lesson
              </Button>
              <div className="space-y-4">
                {course.lessons.map((lesson: Lesson, index: number) => (
                  <Card key={lesson.id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">{index + 1}. {lesson.title[language]}</p>
                      <p className="text-sm text-muted-foreground">{lesson.type}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditLesson(lesson)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{selectedLessonForEdit ? "Edit Lesson" : "Create New Lesson"}</DialogTitle>
                    <DialogDescription>
                      {selectedLessonForEdit ? "Edit the details of the lesson." : "Create a new lesson for this course."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title-en" className="text-right">Title (English)</Label>
                      <Input id="title-en" value={selectedLessonForEdit?.title.en || ''} onChange={(e) => setSelectedLessonForEdit(prev => prev ? { ...prev, title: { ...prev.title, en: e.target.value } } : null)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title-ru" className="text-right">Title (Russian)</Label>
                      <Input id="title-ru" value={selectedLessonForEdit?.title.ru || ''} onChange={(e) => setSelectedLessonForEdit(prev => prev ? { ...prev, title: { ...prev.title, ru: e.target.value } } : null)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">Type</Label>
                      <Select value={selectedLessonForEdit?.type || 'video'} onValueChange={(value: "video" | "article") => setSelectedLessonForEdit(prev => prev ? { ...prev, type: value } : null)}>
                        <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="article">Article</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {selectedLessonForEdit?.type === "video" && (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="videoUrl" className="text-right">Video URL</Label>
                        <Input id="videoUrl" value={selectedLessonForEdit?.videoUrl || ''} onChange={(e) => setSelectedLessonForEdit(prev => prev ? { ...prev, videoUrl: e.target.value } : null)} className="col-span-3" />
                      </div>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="content-en" className="text-right">Content (English)</Label>
                      <Textarea id="content-en" value={selectedLessonForEdit?.content.en || ''} onChange={(e) => setSelectedLessonForEdit(prev => prev ? { ...prev, content: { ...prev.content, en: e.target.value } } : null)} className="col-span-3" rows={5} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="content-ru" className="text-right">Content (Russian)</Label>
                      <Textarea id="content-ru" value={selectedLessonForEdit?.content.ru || ''} onChange={(e) => setSelectedLessonForEdit(prev => prev ? { ...prev, content: { ...prev.content, ru: e.target.value } } : null)} className="col-span-3" rows={5} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="duration" className="text-right">Duration (minutes)</Label>
                      <Input id="duration" type="number" value={selectedLessonForEdit?.duration || 0} onChange={(e) => setSelectedLessonForEdit(prev => prev ? { ...prev, duration: parseInt(e.target.value) || 0 } : null)} className="col-span-3" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleSaveLesson} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save Lesson
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}