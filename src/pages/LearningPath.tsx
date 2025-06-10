import { BookOpen } from "lucide-react";

import { Button } from "@/shared/ui/button";

interface LearningPathProps {
  onNavigate: (path: string) => void;
}

export function LearningPath({ onNavigate }: LearningPathProps) {
  return (
    <div className="container mx-auto py-6">
      <h1>Learning Path</h1>
      <p className="text-muted-foreground">Your personalized learning journey</p>
      <div className="mt-8 grid gap-6">
        <div className="bg-card p-6 rounded-lg shadow">
          <h2>Recommended Path</h2>
          <p className="text-muted-foreground mt-2">Based on your interests and progress</p>
          <div className="mt-4 space-y-4">
            <div className="flex items-center p-3 border rounded-lg">
              <div className="bg-primary/10 p-2 rounded-full mr-4">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4>HTML Fundamentals</h4>
                <p className="text-sm text-muted-foreground">Start here to build your foundation</p>
              </div>
              <Button className="ml-auto" onClick={() => onNavigate("/course/html-fundamentals")}>
                Begin
              </Button>
            </div>
            <div className="flex items-center p-3 border rounded-lg">
              <div className="bg-primary/10 p-2 rounded-full mr-4">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4>CSS Mastery</h4>
                <p className="text-sm text-muted-foreground">Master styling with advanced techniques</p>
              </div>
              <Button className="ml-auto" onClick={() => onNavigate("/course/css-mastery")}>
                Begin
              </Button>
            </div>
            <div className="flex items-center p-3 border rounded-lg">
              <div className="bg-primary/10 p-2 rounded-full mr-4">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4>JavaScript Fundamentals</h4>
                <p className="text-sm text-muted-foreground">Add interactivity to your websites</p>
              </div>
              <Button className="ml-auto" onClick={() => onNavigate("/course/javascript-fundamentals")}>
                Begin
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 