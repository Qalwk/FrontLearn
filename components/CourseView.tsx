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

import { LessonView } from "./LessonView";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { QuizView } from "./QuizView";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { mockCourses } from "../data/mockData";
import type { User } from "../contexts/AuthContext";


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
  const [selectedLessonForEdit, setSelectedLessonForEdit] = useState<any | null>(null);
  
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
  
  const lessonsCompleted = course.lessons.filter(lesson => 
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
          const updatedLessonsCompleted = course.lessons.filter(lesson => 
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
    const lesson = course.lessons.find(l => l.id === lessonId);
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
  const handleEditLesson = (lesson: any) => {
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
    const lesson = course.lessons.find(l => l.id === selectedLessonId);
    
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
      </div>
      
      <div className="flex flex-wrap gap-2 mt-16">
        {course.tags.map(tag => (
          <Badge key={tag} variant="outline">
            #{tag}
          </Badge>
        ))}
      </div>
      
      <p className="text-lg">{course.description[language]}</p>
      
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center text-muted-foreground">
          <BookOpen className="h-5 w-5 mr-2" />
          <span>{course.lessons.length} {t("courses.lessons")}</span>
        </div>
        
        <div className="flex items-center text-muted-foreground">
          <Clock className="h-5 w-5 mr-2" />
          <span>
            {course.lessons.reduce((acc, lesson) => acc + lesson.duration, 0)} min
          </span>
        </div>
        
        {lessonsCompleted > 0 && !isAdmin && (
          <div className="flex items-center text-muted-foreground">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            <span>{lessonsCompleted}/{totalLessons} {t("common.complete")}</span>
          </div>
        )}
      </div>
      
      {lessonsCompleted > 0 && !isCourseCompleted && !isAdmin && (
        <div>
          <Progress value={progressPercent} className="mb-1" />
          <p className="text-sm text-muted-foreground">{progressPercent}% {t("common.complete")}</p>
        </div>
      )}
      
      {isCourseCompleted && !isAdmin && (
        <div className="flex items-center text-green-600">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>{t("courses.completed")}</span>
        </div>
      )}
      
      {!lessonsCompleted && !isAdmin && (
        <Button className="mt-4" onClick={handleStartCourse}>
          {t("lesson.start")}
        </Button>
      )}
      
      {lessonsCompleted > 0 && lessonsCompleted < totalLessons && !isAdmin && (
        <Button className="mt-4" onClick={() => {
          // Find the first uncompleted lesson
          const uncompletedLesson = course.lessons.find(
            lesson => !userProgress.completedLessons.includes(lesson.id)
          );
          
          if (uncompletedLesson) {
            setSelectedLessonId(uncompletedLesson.id);
          } else {
            setSelectedLessonId(course.lessons[0].id);
          }
        }}>
          {t("dashboard.continuelearning")}
        </Button>
      )}
      
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">{t("courses.overview")}</TabsTrigger>
          <TabsTrigger value="lessons">{t("courses.lessons")}</TabsTrigger>
          {isAdmin && <TabsTrigger value="edit">Edit Course</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("courses.aboutCourse")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3>{t("courses.whatYouWillLearn")}</h3>
              <ul className="list-disc pl-5 space-y-2">
                {course.lessons.map(lesson => (
                  <li key={lesson.id}>{lesson.title[language]}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="lessons" className="space-y-4 mt-4">
          {course.lessons.map((lesson, index) => {
            const isCompleted = userProgress.completedLessons.includes(lesson.id);
            
            return (
              <Card 
                key={lesson.id} 
                className={`transition-colors ${
                  isCompleted && !isAdmin ? "border-l-4 border-l-green-500" : ""
                }`}
              >
                <CardContent className="flex items-center p-4">
                  <div className="mr-4">
                    {isCompleted && !isAdmin ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-2">
                        {index + 1} {t("lesson.lesson")}
                      </Badge>
                      {lesson.type === "video" && (
                        <Badge variant="secondary" className="mr-2">
                          <PlayCircle className="h-3 w-3 mr-1" />
                          {t("lesson.video")}
                        </Badge>
                      )}
                      {lesson.type === "article" && (
                        <Badge variant="secondary">
                          <FileText className="h-3 w-3 mr-1" />
                          {t("lesson.article")}
                        </Badge>
                      )}
                      <span className="ml-auto text-sm text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {lesson.duration} min
                      </span>
                    </div>
                    <h4 className="mt-1">{lesson.title[language]}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {lesson.description[language]}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    {isAdmin && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditLesson(lesson)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      onClick={() => handleLessonClick(lesson.id)}
                    >
                      {isCompleted && !isAdmin ? t("common.review") : t("lesson.start")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {isAdmin && (
            <div className="flex justify-center mt-4">
              <Button onClick={handleCreateLesson} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Lesson
              </Button>
            </div>
          )}
        </TabsContent>
        
        {isAdmin && (
          <TabsContent value="edit" className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3>Basic Information</h3>
                    <div className="space-y-2">
                      <label htmlFor="title_en" className="text-sm font-medium">Title (English)</label>
                      <Input id="title_en" defaultValue={course.title.en} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="title_ru" className="text-sm font-medium">Title (Russian)</label>
                      <Input id="title_ru" defaultValue={course.title.ru} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="difficulty" className="text-sm font-medium">Difficulty</label>
                      <Select defaultValue={course.difficulty}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="tags" className="text-sm font-medium">Tags (comma-separated)</label>
                      <Input id="tags" defaultValue={course.tags.join(", ")} />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3>Course Image</h3>
                    <div className="space-y-2">
                      <label htmlFor="image_url" className="text-sm font-medium">Image URL</label>
                      <Input id="image_url" defaultValue={course.image} />
                    </div>
                    <div className="relative aspect-video rounded-md overflow-hidden border">
                      <ImageWithFallback 
                        src={course.image} 
                        alt={course.title[language]} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <Button variant="outline" className="w-full flex items-center gap-2 mt-2">
                      <Image className="h-4 w-4" />
                      Change Image
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="description_en" className="text-sm font-medium">Description (English)</label>
                    <Textarea 
                      id="description_en" 
                      defaultValue={course.description.en} 
                      className="min-h-[150px]" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="description_ru" className="text-sm font-medium">Description (Russian)</label>
                    <Textarea 
                      id="description_ru" 
                      defaultValue={course.description.ru} 
                      className="min-h-[150px]" 
                    />
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="mb-4">Lessons</h3>
                  <div className="space-y-4">
                    {course.lessons.map((lesson, index) => (
                      <Card key={lesson.id} className="border overflow-hidden">
                        <div className="p-4 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">{index + 1}</Badge>
                            <div>
                              <h4>{lesson.title[language]}</h4>
                              <p className="text-sm text-muted-foreground">{lesson.type}, {lesson.duration} min</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditLesson(lesson)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                  
                  <Button 
                    className="mt-4 flex items-center gap-2"
                    onClick={handleCreateLesson}
                  >
                    <Plus className="h-4 w-4" />
                    Add New Lesson
                  </Button>
                </div>
                
                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline">
                    Cancel
                  </Button>
                  <Button className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Course
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
      
      {/* Lesson Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedLessonForEdit ? 'Edit Lesson' : 'Create New Lesson'}</DialogTitle>
            <DialogDescription>
              {selectedLessonForEdit 
                ? 'Update the lesson details and content.' 
                : 'Fill in the details to create a new lesson.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="edit_title_en" className="text-sm font-medium">Title (English)</label>
                <Input 
                  id="edit_title_en" 
                  defaultValue={selectedLessonForEdit?.title?.en || ""} 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit_description_en" className="text-sm font-medium">Description (English)</label>
                <Textarea 
                  id="edit_description_en" 
                  defaultValue={selectedLessonForEdit?.description?.en || ""} 
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit_content_en" className="text-sm font-medium">Content (English)</label>
                <Textarea 
                  id="edit_content_en" 
                  defaultValue={selectedLessonForEdit?.content?.en || ""} 
                  className="min-h-[200px]"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="edit_title_ru" className="text-sm font-medium">Title (Russian)</label>
                <Input 
                  id="edit_title_ru" 
                  defaultValue={selectedLessonForEdit?.title?.ru || ""} 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit_description_ru" className="text-sm font-medium">Description (Russian)</label>
                <Textarea 
                  id="edit_description_ru" 
                  defaultValue={selectedLessonForEdit?.description?.ru || ""} 
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit_content_ru" className="text-sm font-medium">Content (Russian)</label>
                <Textarea 
                  id="edit_content_ru" 
                  defaultValue={selectedLessonForEdit?.content?.ru || ""} 
                  className="min-h-[200px]"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="edit_type" className="text-sm font-medium">Lesson Type</label>
              <Select defaultValue={selectedLessonForEdit?.type || "article"}>
                <SelectTrigger id="edit_type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit_duration" className="text-sm font-medium">Duration (minutes)</label>
              <Input 
                id="edit_duration" 
                type="number" 
                defaultValue={selectedLessonForEdit?.duration || "15"} 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit_quiz" className="text-sm font-medium">Has Quiz</label>
              <Select defaultValue={selectedLessonForEdit?.quiz ? "yes" : "no"}>
                <SelectTrigger id="edit_quiz">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveLesson}>
              {selectedLessonForEdit ? 'Save Changes' : 'Create Lesson'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}