import { ArrowLeft, CheckCircle, PlayCircle, FileText } from "lucide-react";

import { useLanguage } from "../contexts/LanguageContext";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";

interface LessonViewProps {
  lesson: any;
  courseName: string;
  isCompleted: boolean;
  isAdmin: boolean;
  onBack: () => void;
  onComplete: () => void;
  onStartQuiz: () => void;
  hasQuiz: boolean;
  onEdit: () => void;
}

export function LessonView({
  lesson,
  courseName,
  isCompleted,
  onBack,
  onComplete,
  onStartQuiz,
  hasQuiz,
  onEdit
}: LessonViewProps) {
  const { language, t } = useLanguage();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center mb-2">
        <Button variant="ghost" onClick={onBack} className="p-0 mr-2">
          <ArrowLeft className="h-4 w-4 mr-1" /> {t("common.back")}
        </Button>
      </div>

      <div>
        <div className="text-sm text-muted-foreground mb-2">{courseName}</div>
        <h1 className="text-2xl md:text-3xl mb-4">{lesson.title[language]}</h1>
        
        <div className="flex items-center space-x-2 mb-6">
          {lesson.type === "video" && (
            <div className="flex items-center">
              <PlayCircle className="h-4 w-4 mr-1" />
              <span>{t("lesson.video")}</span>
            </div>
          )}
          {lesson.type === "article" && (
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              <span>{t("lesson.article")}</span>
            </div>
          )}
          
          {isCompleted && (
            <div className="flex items-center text-green-500 ml-auto">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span>{t("common.completed")}</span>
            </div>
          )}
        </div>
      </div>

      <Card className="p-6">
        {lesson.type === "video" && lesson.videoUrl && (
          <div className="relative pb-[56.25%] h-0 mb-6">
            <iframe
              src={lesson.videoUrl}
              className="absolute top-0 left-0 w-full h-full rounded-md"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
        
        <div className="prose max-w-none">
          <p className="whitespace-pre-line">
            {lesson.content[language]}
          </p>
        </div>
      </Card>

      <Separator />
      
      <div className="flex justify-between">
        <Button 
          variant={isCompleted ? "outline" : "default"} 
          onClick={onComplete}
        >
          {isCompleted ? t("common.completed") : t("lesson.complete")}
        </Button>
        
        {hasQuiz && (
          <Button onClick={onStartQuiz}>
            {t("quiz.start")}
          </Button>
        )}
      </div>
    </div>
  );
}