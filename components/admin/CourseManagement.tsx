import { 
  Search, 
  Edit, 
  Trash2, 
  Plus, 
  BookOpen, 
  Image, 
  Tag, 
  FileText, 
  CheckCircle2, 
  Calendar, 
  Users, 
  FileQuestion,
  Eye,
  ArrowUpDown,
  Filter,
  Archive
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { QuizManagement } from "./QuizManagement";
import { useLanguage } from "../../contexts/LanguageContext";
import { mockCourses } from "../../data/mockData";
import { Course, Quiz } from "../../types";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";


export function CourseManagement({ onNavigate }: { onNavigate: (path: string) => void }) {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("published");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [editableCourse, setEditableCourse] = useState<Course | null>(null);
  const [editorTab, setEditorTab] = useState("details");

  // Separate published and draft courses
  const publishedCourses = mockCourses.filter((course) => 
    course.lessons && course.lessons.length > 0
  );
  
  // Create draft courses - courses without lessons
  const draftCourses = mockCourses.filter((course) => 
    !course.lessons || course.lessons.length === 0
  );

  const filterCourses = (courses: Course[]) => {
    return courses
      .filter((course) => {
        // Apply search filter
        const matchesSearch = 
          course.title[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        
        // Apply difficulty filter
        const matchesDifficulty = difficultyFilter === "all" || course.difficulty === difficultyFilter;
        
        return matchesSearch && matchesDifficulty;
      })
      .sort((a, b) => {
        // Apply sorting
        if (sortBy === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortBy === "oldest") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else if (sortBy === "name") {
          return a.title[language].localeCompare(b.title[language]);
        }
        return 0;
      });
  };

  const filteredPublishedCourses = filterCourses(publishedCourses);
  const filteredDraftCourses = filterCourses(draftCourses);

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setEditableCourse(JSON.parse(JSON.stringify(course))); // Create a deep copy
    setEditorTab("details"); // Reset to details tab
    setDialogOpen(true);
  };

  const handleCreateCourse = () => {
    setSelectedCourse(null);
    setEditableCourse(null);
    setEditorTab("details"); // Reset to details tab
    setDialogOpen(true);
  };

  const handleQuizChange = (lessonId: string, quiz: Quiz | null) => {
    if (!editableCourse) return;
    
    const updatedLessons = editableCourse.lessons.map(lesson => {
      if (lesson.id === lessonId) {
        return { ...lesson, quiz };
      }
      return lesson;
    });
    
    setEditableCourse({ ...editableCourse, lessons: updatedLessons });
  };

  const handleSaveChanges = () => {
    // In a real app, this would save the course to the backend
    toast.success(selectedCourse ? "Course updated successfully" : "Course created successfully");
    setDialogOpen(false);
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Beginner</Badge>;
      case "intermediate":
        return <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Intermediate</Badge>;
      case "advanced":
        return <Badge variant="default" className="bg-purple-100 text-purple-800 hover:bg-purple-100">Advanced</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1>{t("admin.courses")}</h1>
        <Button onClick={handleCreateCourse} className="flex items-center gap-2 self-start">
          <Plus className="h-4 w-4" />
          Create New Course
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search courses..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8" 
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                <span>Sort By</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {showFilters && (
        <Card className="border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="space-y-2">
                <p className="text-sm font-medium">Difficulty</p>
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="published" className="relative">
            Published
            <Badge className="ml-2 absolute right-2 bg-primary">{publishedCourses.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="drafts" className="relative">
            Drafts
            <Badge className="ml-2 absolute right-2 bg-primary">{draftCourses.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="published">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Published Courses
              </CardTitle>
              <CardDescription>
                Manage your live courses that are available to students
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredPublishedCourses.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No published courses found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPublishedCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden border">
                      <div className="relative h-48">
                        <ImageWithFallback 
                          src={course.image} 
                          alt={course.title[language]}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                          <div>
                            <p className="text-white font-medium line-clamp-2">{course.title[language]}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {getDifficultyBadge(course.difficulty)}
                              <Badge variant="outline" className="bg-white/20 text-white">
                                {course.lessons.length} {course.lessons.length === 1 ? 'Lesson' : 'Lessons'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <p className="text-muted-foreground text-sm line-clamp-2">{course.description[language]}</p>
                        <div className="flex flex-wrap gap-1">
                          {course.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(course.updatedAt).toLocaleDateString()}
                        </div>
                      </CardContent>
                      <div className="border-t p-3 bg-muted/10 flex items-center justify-between">
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 px-2 text-muted-foreground"
                            onClick={() => onNavigate(`/course/${course.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 px-2 text-muted-foreground"
                            onClick={() => handleEditCourse(course)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 px-2 text-destructive"
                        >
                          <Archive className="h-4 w-4 mr-1" />
                          Archive
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drafts">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Draft Courses
              </CardTitle>
              <CardDescription>
                Courses that are in progress and not yet published to students
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredDraftCourses.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No draft courses found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDraftCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden border border-dashed">
                      <div className="relative h-48 bg-muted">
                        {course.image ? (
                          <ImageWithFallback 
                            src={course.image} 
                            alt={course.title[language]}
                            className="w-full h-full object-cover opacity-70"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Image className="h-12 w-12 text-muted-foreground/50" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <Badge variant="destructive">Draft</Badge>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                          <div>
                            <p className="text-white font-medium line-clamp-2">{course.title[language]}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {getDifficultyBadge(course.difficulty)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <p className="text-muted-foreground text-sm line-clamp-2">{course.description[language]}</p>
                        <div className="flex flex-wrap gap-1">
                          {course.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          Created: {new Date(course.createdAt).toLocaleDateString()}
                        </div>
                      </CardContent>
                      <div className="border-t p-3 bg-muted/10 flex items-center justify-between">
                        <Button 
                          size="sm" 
                          variant="default" 
                          className="h-8 w-full"
                          onClick={() => handleEditCourse(course)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Continue Editing
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Course Edit/Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[90vw] w-[1200px] max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>{selectedCourse ? 'Edit Course' : 'Create New Course'}</DialogTitle>
            <DialogDescription>
              {selectedCourse 
                ? 'Update the course details and content.' 
                : 'Fill in the details to create a new course.'}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={editorTab} onValueChange={setEditorTab} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-3 w-full flex-shrink-0">
              <TabsTrigger value="details">Course Details</TabsTrigger>
              <TabsTrigger value="content">Lessons & Content</TabsTrigger>
              <TabsTrigger value="tests">Tests & Quizzes</TabsTrigger>
            </TabsList>
            
            <div className="overflow-y-auto mt-4 flex-1 pr-1">
              <TabsContent value="details" className="space-y-4 min-h-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="title_en" className="text-sm font-medium">Title (English)</label>
                      <Input 
                        id="title_en" 
                        defaultValue={selectedCourse?.title.en || ""} 
                        placeholder="Enter course title in English"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="description_en" className="text-sm font-medium">Description (English)</label>
                      <Textarea 
                        id="description_en" 
                        defaultValue={selectedCourse?.description.en || ""} 
                        placeholder="Enter course description in English"
                        className="min-h-[120px]"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="title_ru" className="text-sm font-medium">Title (Russian)</label>
                      <Input 
                        id="title_ru" 
                        defaultValue={selectedCourse?.title.ru || ""} 
                        placeholder="Введите название курса на русском"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="description_ru" className="text-sm font-medium">Description (Russian)</label>
                      <Textarea 
                        id="description_ru" 
                        defaultValue={selectedCourse?.description.ru || ""} 
                        placeholder="Введите описание курса на русском"
                        className="min-h-[120px]"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="image" className="text-sm font-medium">Course Image URL</label>
                      <Input 
                        id="image" 
                        defaultValue={selectedCourse?.image || ""} 
                        placeholder="https://example.com/image.jpg"
                      />
                      {selectedCourse?.image && (
                        <div className="mt-2 relative h-40 rounded-md overflow-hidden">
                          <ImageWithFallback 
                            src={selectedCourse.image} 
                            alt="Course preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="difficulty" className="text-sm font-medium">Difficulty Level</label>
                      <Select defaultValue={selectedCourse?.difficulty || "beginner"}>
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
                      <label htmlFor="tags" className="text-sm font-medium">Tags (comma separated)</label>
                      <Input 
                        id="tags" 
                        defaultValue={selectedCourse?.tags.join(", ") || ""} 
                        placeholder="html, css, frontend, etc."
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="content" className="min-h-0">
                {editableCourse && editableCourse.lessons && editableCourse.lessons.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3>Course Lessons</h3>
                      <Button>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Lesson
                      </Button>
                    </div>
                    
                    <div className="overflow-x-auto rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[40%]">Lesson Title</TableHead>
                            <TableHead className="w-[15%]">Type</TableHead>
                            <TableHead className="w-[15%]">Duration</TableHead>
                            <TableHead className="w-[15%]">Has Quiz</TableHead>
                            <TableHead className="w-[15%] text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {editableCourse.lessons.map((lesson) => (
                            <TableRow key={lesson.id}>
                              <TableCell className="font-medium">{lesson.title[language]}</TableCell>
                              <TableCell>
                                <Badge variant={lesson.type === "video" ? "default" : "secondary"}>
                                  {lesson.type}
                                </Badge>
                              </TableCell>
                              <TableCell>{lesson.duration} min</TableCell>
                              <TableCell>
                                {lesson.quiz ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : (
                                  <span className="text-muted-foreground">None</span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-destructive h-8 w-8 p-0">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 border rounded-md">
                    <FileText className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
                    <h3 className="mb-1">No lessons yet</h3>
                    <p className="text-muted-foreground mb-4">Add your first lesson to this course</p>
                    <Button>
                      <Plus className="h-4 w-4 mr-1" />
                      Add First Lesson
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="tests" className="min-h-0">
                {editableCourse && editableCourse.lessons ? (
                  <QuizManagement 
                    lessons={editableCourse.lessons} 
                    onQuizChange={handleQuizChange}
                    language={language}
                  />
                ) : (
                  <div className="text-center py-10 border rounded-md">
                    <FileQuestion className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
                    <h3 className="mb-1">No lessons available</h3>
                    <p className="text-muted-foreground mb-4">Add lessons to create quizzes</p>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
          
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t flex-shrink-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveChanges}>
              {selectedCourse ? 'Save Changes' : 'Create Course'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}