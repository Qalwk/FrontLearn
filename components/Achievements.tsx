import { 
  Trophy,
  Award,
  Star,
  Clock,
  BookOpen,
  Zap,
  Calendar,
  Target,
  Flame,
  Coffee,
  CheckCircle,
  Lightbulb,
  GraduationCap
} from "lucide-react";

import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function Achievements() {
  // Organize achievements into categories
  const achievementCategories = [
    {
      id: "learning",
      name: "Learning",
      achievements: [
        {
          id: "first-lesson",
          title: "First Step",
          description: "Complete your first lesson",
          icon: <BookOpen className="h-8 w-8 text-emerald-500" />,
          progress: 100,
          unlocked: true,
          date: "May 15, 2025"
        },
        {
          id: "course-complete",
          title: "Course Graduate",
          description: "Complete an entire course",
          icon: <GraduationCap className="h-8 w-8 text-blue-500" />,
          progress: 100,
          unlocked: true,
          date: "May 20, 2025"
        },
        {
          id: "quiz-master",
          title: "Quiz Master",
          description: "Score 100% on 5 quizzes",
          icon: <CheckCircle className="h-8 w-8 text-purple-500" />,
          progress: 80,
          unlocked: false,
          date: null
        },
        {
          id: "study-marathon",
          title: "Study Marathon",
          description: "Complete 10 lessons in a single day",
          icon: <Zap className="h-8 w-8 text-amber-500" />,
          progress: 50,
          unlocked: false,
          date: null
        },
        {
          id: "knowledge-explorer",
          title: "Knowledge Explorer",
          description: "Try lessons from 5 different courses",
          icon: <Lightbulb className="h-8 w-8 text-yellow-500" />,
          progress: 60,
          unlocked: false,
          date: null
        }
      ]
    },
    {
      id: "productivity",
      name: "Productivity",
      achievements: [
        {
          id: "pomodoro-starter",
          title: "Focus Initiate",
          description: "Complete your first Pomodoro session",
          icon: <Clock className="h-8 w-8 text-red-500" />,
          progress: 100,
          unlocked: true,
          date: "May 22, 2025"
        },
        {
          id: "pomodoro-master",
          title: "Concentration Master",
          description: "Complete 25 Pomodoro sessions",
          icon: <Target className="h-8 w-8 text-red-600" />,
          progress: 40,
          unlocked: false,
          date: null
        },
        {
          id: "eisenhower-organizer",
          title: "Task Organizer",
          description: "Add tasks to all four quadrants in Eisenhower Matrix",
          icon: <CheckCircle className="h-8 w-8 text-blue-500" />,
          progress: 75,
          unlocked: false,
          date: null
        },
        {
          id: "completed-todos",
          title: "Goal Crusher",
          description: "Complete 50 tasks in Eisenhower Matrix",
          icon: <Target className="h-8 w-8 text-green-500" />,
          progress: 30,
          unlocked: false,
          date: null
        }
      ]
    },
    {
      id: "engagement",
      name: "Engagement",
      achievements: [
        {
          id: "streak-7",
          title: "Week Warrior",
          description: "Maintain a 7-day learning streak",
          icon: <Flame className="h-8 w-8 text-orange-500" />,
          progress: 100,
          unlocked: true,
          date: "May 25, 2025"
        },
        {
          id: "streak-30",
          title: "Monthly Master",
          description: "Maintain a 30-day learning streak",
          icon: <Flame className="h-8 w-8 text-orange-600" />,
          progress: 20,
          unlocked: false,
          date: null
        },
        {
          id: "night-owl",
          title: "Night Owl",
          description: "Study after midnight for 5 days",
          icon: <Coffee className="h-8 w-8 text-amber-700" />,
          progress: 60,
          unlocked: false,
          date: null
        },
        {
          id: "weekend-warrior",
          title: "Weekend Warrior",
          description: "Study for 4 hours during a weekend",
          icon: <Calendar className="h-8 w-8 text-indigo-500" />,
          progress: 100,
          unlocked: true,
          date: "May 18, 2025"
        }
      ]
    },
    {
      id: "mastery",
      name: "Mastery",
      achievements: [
        {
          id: "html-master",
          title: "HTML Master",
          description: "Complete all HTML courses",
          icon: <Award className="h-8 w-8 text-orange-500" />,
          progress: 50,
          unlocked: false,
          date: null
        },
        {
          id: "css-master",
          title: "CSS Stylist",
          description: "Complete all CSS courses",
          icon: <Award className="h-8 w-8 text-blue-500" />,
          progress: 25,
          unlocked: false,
          date: null
        },
        {
          id: "js-master",
          title: "JavaScript Wizard",
          description: "Complete all JavaScript courses",
          icon: <Award className="h-8 w-8 text-yellow-500" />,
          progress: 10,
          unlocked: false,
          date: null
        },
        {
          id: "frontend-master",
          title: "Frontend Master",
          description: "Complete all courses on the platform",
          icon: <Trophy className="h-8 w-8 text-amber-500" />,
          progress: 15,
          unlocked: false,
          date: null
        }
      ]
    }
  ];
  
  // Calculate overall stats
  const totalAchievements = achievementCategories.reduce(
    (acc, category) => acc + category.achievements.length, 
    0
  );
  
  const unlockedAchievements = achievementCategories.reduce(
    (acc, category) => acc + category.achievements.filter(a => a.unlocked).length, 
    0
  );
  
  const completionPercentage = Math.round((unlockedAchievements / totalAchievements) * 100);

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1>Achievements</h1>
          <p className="text-muted-foreground">Track your learning milestones</p>
        </div>
        <Card className="w-full md:w-auto">
          <CardContent className="flex gap-4 items-center py-3">
            <div className="bg-primary/10 p-3 rounded-full">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-medium">
                {unlockedAchievements} / {totalAchievements} Unlocked
              </h4>
              <Progress value={completionPercentage} className="h-2 mt-1" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main achievements dashboard */}
      <Tabs defaultValue="learning" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
          {achievementCategories.map(category => (
            <TabsTrigger key={category.id} value={category.id}>{category.name}</TabsTrigger>
          ))}
        </TabsList>
        
        {achievementCategories.map(category => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.achievements.map(achievement => (
                <Card key={achievement.id} className={achievement.unlocked ? "border-primary/30" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="bg-muted rounded-full p-3">{achievement.icon}</div>
                      {achievement.unlocked && (
                        <Badge variant="outline" className="border-primary text-primary">
                          <Star className="h-3 w-3 mr-1 fill-primary" /> Unlocked
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="mt-3">{achievement.title}</CardTitle>
                    <CardDescription>{achievement.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{achievement.progress}%</span>
                      </div>
                      <Progress value={achievement.progress} className="h-2" />
                      
                      {achievement.unlocked && achievement.date && (
                        <div className="flex items-center justify-end mt-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" /> Unlocked on {achievement.date}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}