import { 
  Edit, 
  Trash2, 
  Plus, 
  FileQuestion,
  Save,
  CheckCircle
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";


interface Quiz {
  id: string;
  title: {
    en: string;
    ru: string;
  };
  questions: {
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
  }[];
  pointsReward: number;
  timeLimit: number;
  passingScore: number;
}

interface Lesson {
  id: string;
  title: {
    en: string;
    ru: string;
  };
  quiz: Quiz | null;
}

interface QuizManagementProps {
  lessons: Lesson[];
  onQuizChange: (lessonId: string, quiz: Quiz | null) => void;
  language: string;
}

export function QuizManagement({ lessons, onQuizChange, language }: QuizManagementProps) {
  const [quizDialogOpen, setQuizDialogOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [activeQuestionTab, setActiveQuestionTab] = useState("en");
  
  // State for editing quiz
  const [quizTitle, setQuizTitle] = useState({ en: "", ru: "" });
  const [quizPoints, setQuizPoints] = useState(10);
  const [quizTimeLimit, setQuizTimeLimit] = useState(300);
  const [quizPassingScore, setQuizPassingScore] = useState(2);
  const [quizQuestions, setQuizQuestions] = useState<Quiz["questions"]>([]);

  const handleAddQuiz = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    if (lesson.quiz) {
      setSelectedQuiz(lesson.quiz);
      setQuizTitle(lesson.quiz.title);
      setQuizPoints(lesson.quiz.pointsReward);
      setQuizTimeLimit(lesson.quiz.timeLimit);
      setQuizPassingScore(lesson.quiz.passingScore);
      setQuizQuestions(lesson.quiz.questions);
    } else {
      // Initialize with empty quiz
      setSelectedQuiz(null);
      setQuizTitle({ en: "", ru: "" });
      setQuizPoints(10);
      setQuizTimeLimit(300);
      setQuizPassingScore(2);
      setQuizQuestions([]);
    }
    setQuizDialogOpen(true);
  };

  const handleSaveQuiz = () => {
    if (!selectedLesson) return;
    
    // Validate quiz data
    if (!quizTitle.en || !quizTitle.ru) {
      toast.error("Quiz title is required in both languages");
      return;
    }
    
    if (quizQuestions.length === 0) {
      toast.error("Quiz must have at least one question");
      return;
    }
    
    // Create new quiz object
    const newQuiz: Quiz = {
      id: selectedQuiz?.id || `quiz-${Date.now()}`,
      title: quizTitle,
      questions: quizQuestions,
      pointsReward: quizPoints,
      timeLimit: quizTimeLimit,
      passingScore: quizPassingScore
    };
    
    // Save quiz
    onQuizChange(selectedLesson.id, newQuiz);
    setQuizDialogOpen(false);
    toast.success(selectedQuiz ? "Quiz updated successfully" : "Quiz added successfully");
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      id: `q-${Date.now()}`,
      question: { en: "", ru: "" },
      options: { en: ["", "", "", ""], ru: ["", "", "", ""] },
      correctOptionIndex: 0
    };
    setQuizQuestions([...quizQuestions, newQuestion]);
  };

  const handleUpdateQuestion = (
    index: number, 
    field: 'question' | 'options' | 'correctOptionIndex', 
    value: string | number, 
    language?: 'en' | 'ru'
  ) => {
    const updatedQuestions = [...quizQuestions];
    if (language) {
      (updatedQuestions[index][field] as Record<string, string>)[language] = value as string;
    } else {
      (updatedQuestions[index][field] as number) = value as number;
    }
    setQuizQuestions(updatedQuestions);
  };

  const handleUpdateOption = (questionIndex: number, optionIndex: number, value: string, language: 'en' | 'ru') => {
    const updatedQuestions = [...quizQuestions];
    updatedQuestions[questionIndex].options[language][optionIndex] = value;
    setQuizQuestions(updatedQuestions);
  };

  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = [...quizQuestions];
    updatedQuestions.splice(index, 1);
    setQuizQuestions(updatedQuestions);
  };

  const handleDeleteQuiz = (lesson: Lesson) => {
    if (confirm("Are you sure you want to delete this quiz?")) {
      onQuizChange(lesson.id, null);
      toast.success("Quiz deleted successfully");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3>Lesson Quizzes</h3>
        <Button onClick={() => lessons.length > 0 && handleAddQuiz(lessons[0])} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Quiz
        </Button>
      </div>
      
      {lessons.length === 0 ? (
        <div className="text-center py-10 border rounded-md">
          <FileQuestion className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
          <h3 className="mb-1">No lessons available</h3>
          <p className="text-muted-foreground mb-4">Add lessons to your course before creating quizzes</p>
        </div>
      ) : (
        <>
          {lessons.filter(lesson => lesson.quiz).length === 0 ? (
            <div className="text-center py-10 border rounded-md">
              <FileQuestion className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
              <h3 className="mb-1">No quizzes yet</h3>
              <p className="text-muted-foreground mb-4">Create quizzes to test student knowledge</p>
              <Button onClick={() => handleAddQuiz(lessons[0])} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Quiz
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[35%]">Lesson</TableHead>
                    <TableHead className="w-[35%]">Quiz Title</TableHead>
                    <TableHead className="w-[10%] text-center">Questions</TableHead>
                    <TableHead className="w-[10%] text-center">Points</TableHead>
                    <TableHead className="w-[10%] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lessons.map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell className="font-medium">
                        {lesson.title[language as keyof typeof lesson.title]}
                      </TableCell>
                      <TableCell>
                        {lesson.quiz ? (
                          lesson.quiz.title[language as keyof typeof lesson.quiz.title]
                        ) : (
                          <span className="text-muted-foreground italic">No quiz</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {lesson.quiz ? (
                          <Badge>{lesson.quiz.questions.length}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {lesson.quiz ? (
                          <Badge variant="outline">{lesson.quiz.pointsReward} pts</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleAddQuiz(lesson)}
                            className="h-8 w-8 p-0"
                          >
                            {lesson.quiz ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                          </Button>
                          {lesson.quiz && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-destructive h-8 w-8 p-0"
                              onClick={() => handleDeleteQuiz(lesson)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}

      {/* Quiz Edit Dialog */}
      <Dialog open={quizDialogOpen} onOpenChange={setQuizDialogOpen}>
        <DialogContent className="max-w-[90vw] w-[1200px] max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>
              {selectedQuiz ? 'Edit Quiz' : 'Create New Quiz'}
              {selectedLesson && (
                <span className="text-muted-foreground ml-2 text-base font-normal">
                  for {selectedLesson.title[language as keyof typeof selectedLesson.title]}
                </span>
              )}
            </DialogTitle>
            <DialogDescription>
              Create a quiz to test student knowledge and understanding
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-y-auto flex-1 pr-1 space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3>English Content</h3>
                <div className="space-y-2">
                  <label htmlFor="title_en" className="text-sm font-medium">Quiz Title (English)</label>
                  <Input 
                    id="title_en" 
                    value={quizTitle.en} 
                    onChange={(e) => setQuizTitle({...quizTitle, en: e.target.value})}
                    placeholder="Enter quiz title in English"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3>Russian Content</h3>
                <div className="space-y-2">
                  <label htmlFor="title_ru" className="text-sm font-medium">Quiz Title (Russian)</label>
                  <Input 
                    id="title_ru" 
                    value={quizTitle.ru} 
                    onChange={(e) => setQuizTitle({...quizTitle, ru: e.target.value})}
                    placeholder="Enter quiz title in Russian"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="points" className="text-sm font-medium">Points Reward</label>
                <Input 
                  id="points" 
                  type="number" 
                  value={quizPoints} 
                  onChange={(e) => setQuizPoints(parseInt(e.target.value))}
                  min="1"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="time_limit" className="text-sm font-medium">Time Limit (seconds)</label>
                <Input 
                  id="time_limit" 
                  type="number" 
                  value={quizTimeLimit} 
                  onChange={(e) => setQuizTimeLimit(parseInt(e.target.value))}
                  min="60"
                  step="60"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="passing_score" className="text-sm font-medium">Passing Score</label>
                <Input 
                  id="passing_score" 
                  type="number" 
                  value={quizPassingScore} 
                  onChange={(e) => setQuizPassingScore(parseInt(e.target.value))}
                  min="1"
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3>Questions</h3>
                <Button 
                  onClick={handleAddQuestion}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Question
                </Button>
              </div>
              
              {quizQuestions.length === 0 ? (
                <div className="text-center border rounded-md p-6">
                  <p className="text-muted-foreground">No questions added yet</p>
                  <Button 
                    onClick={handleAddQuestion}
                    variant="outline"
                    className="mt-2"
                  >
                    Add Your First Question
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {quizQuestions.map((question, qIndex) => (
                    <Card key={question.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium flex items-center">
                            <Badge variant="outline" className="mr-2">Q{qIndex + 1}</Badge>
                            Question
                          </h4>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive h-8 w-8 p-0"
                            onClick={() => handleDeleteQuestion(qIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <Tabs 
                          value={activeQuestionTab} 
                          onValueChange={setActiveQuestionTab}
                          className="space-y-4"
                        >
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="en">English</TabsTrigger>
                            <TabsTrigger value="ru">Russian</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="en" className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Question (English)</label>
                              <Textarea 
                                value={question.question.en}
                                onChange={(e) => handleUpdateQuestion(qIndex, 'question', e.target.value, 'en')}
                                placeholder="Enter your question in English"
                                className="min-h-[100px]"
                              />
                            </div>
                            
                            <div className="space-y-4">
                              <label className="text-sm font-medium">Options (English)</label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {question.options.en.map((option, oIndex) => (
                                  <div key={`opt-en-${oIndex}`} className="flex gap-2 items-center">
                                    <div className="flex-shrink-0">
                                      <Button
                                        type="button"
                                        variant={question.correctOptionIndex === oIndex ? "default" : "outline"}
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() => handleUpdateQuestion(qIndex, 'correctOptionIndex', oIndex)}
                                      >
                                        {question.correctOptionIndex === oIndex ? (
                                          <CheckCircle className="h-4 w-4" />
                                        ) : (
                                          <span>{String.fromCharCode(65 + oIndex)}</span>
                                        )}
                                      </Button>
                                    </div>
                                    <Input 
                                      value={option}
                                      onChange={(e) => handleUpdateOption(qIndex, oIndex, e.target.value, 'en')}
                                      placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                                      className="flex-grow"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="ru" className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Question (Russian)</label>
                              <Textarea 
                                value={question.question.ru}
                                onChange={(e) => handleUpdateQuestion(qIndex, 'question', e.target.value, 'ru')}
                                placeholder="Enter your question in Russian"
                                className="min-h-[100px]"
                              />
                            </div>
                            
                            <div className="space-y-4">
                              <label className="text-sm font-medium">Options (Russian)</label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {question.options.ru.map((option, oIndex) => (
                                  <div key={`opt-ru-${oIndex}`} className="flex gap-2 items-center">
                                    <div className="flex-shrink-0">
                                      <Button
                                        type="button"
                                        variant={question.correctOptionIndex === oIndex ? "default" : "outline"}
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() => handleUpdateQuestion(qIndex, 'correctOptionIndex', oIndex)}
                                      >
                                        {question.correctOptionIndex === oIndex ? (
                                          <CheckCircle className="h-4 w-4" />
                                        ) : (
                                          <span>{String.fromCharCode(65 + oIndex)}</span>
                                        )}
                                      </Button>
                                    </div>
                                    <Input 
                                      value={option}
                                      onChange={(e) => handleUpdateOption(qIndex, oIndex, e.target.value, 'ru')}
                                      placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                                      className="flex-grow"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t flex-shrink-0">
            <Button 
              variant="outline" 
              onClick={() => setQuizDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveQuiz}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Quiz
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}