import { Users, GraduationCap, BookOpen, CheckCircle, BarChart3 } from "lucide-react";
import { useState } from "react";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

import { useLanguage } from "../contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { mockUserStats } from "../data/mockData";

const monthlyUserData = [
  { name: "Jan", users: 150 },
  { name: "Feb", users: 250 },
  { name: "Mar", users: 320 },
  { name: "Apr", users: 380 },
  { name: "May", users: 450 },
  { name: "Jun", users: 580 },
  { name: "Jul", users: 670 },
  { name: "Aug", users: 790 },
  { name: "Sep", users: 920 },
  { name: "Oct", users: 1050 },
  { name: "Nov", users: 1180 },
  { name: "Dec", users: 1256 },
];

const courseCompletionData = [
  { name: "HTML", completed: 680 },
  { name: "CSS", completed: 520 },
  { name: "JavaScript", completed: 420 },
  { name: "React", completed: 320 },
  { name: "TypeScript", completed: 280 },
];

const quizScoreDistribution = [
  { name: "90-100%", value: 32 },
  { name: "80-90%", value: 26 },
  { name: "70-80%", value: 20 },
  { name: "60-70%", value: 14 },
  { name: "Below 60%", value: 8 },
];

const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

export function AdminDashboard() {
  const { t } = useLanguage();
  const [_timeRange, _setTimeRange] = useState("month");

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1>{t("dashboard.title")}</h1>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              {t("admin.users")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{mockUserStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {mockUserStats.activeUsers} active users
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-green-500" />
              {t("courses.all")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{courseCompletionData.length}</div>
            <p className="text-xs text-muted-foreground">
              {mockUserStats.completedCourses} courses completed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-500" />
              {t("courses.lessons")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl">24</div>
            <p className="text-xs text-muted-foreground">
              {mockUserStats.completedLessons} lessons completed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-amber-500" />
              Avg. Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{mockUserStats.averageScore}%</div>
            <p className="text-xs text-muted-foreground">
              Across all quizzes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users Growth</TabsTrigger>
          <TabsTrigger value="courses">Course Completions</TabsTrigger>
          <TabsTrigger value="quiz">Quiz Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                User Growth
              </CardTitle>
              <CardDescription>
                Monthly user registration statistics over time
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[400px] px-4 pb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyUserData}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }} 
                    />
                    <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-500" />
                Course Completions
              </CardTitle>
              <CardDescription>
                Number of completions per course
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[400px] px-4 pb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={courseCompletionData}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="completed" fill="#22c55e" name="Completions" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quiz" className="space-y-4">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-amber-500" />
                Quiz Score Distribution
              </CardTitle>
              <CardDescription>
                Percentage of users by score range
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[400px] px-4 pb-4 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}
                      formatter={(value, name) => [`${value}%`, name]} 
                    />
                    <Legend />
                    <Pie
                      data={quizScoreDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={140}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {quizScoreDistribution.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}