import { 
  Play, 
  Pause, 
  SkipForward, 
  RefreshCcw,
  Clock, 
  Settings as SettingsIcon,
  Volume2,
  Trophy,
  Medal,
  Users,
  ChevronUp
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export function PomodoroTimer() {
  // Timer states
  const [activeTab, setActiveTab] = useState("timer");
  const [timeLeft, setTimeLeft] = useState(1500); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [currentMode, setCurrentMode] = useState<"focus" | "shortBreak" | "longBreak">("focus");
  const [currentTask, setCurrentTask] = useState("");
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [pomodorosUntilLongBreak, setPomodorosUntilLongBreak] = useState(4);

  // Settings
  const [settings, setSettings] = useState({
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    soundNotifications: true
  });

  // Stats
  const [stats, setStats] = useState({
    todayFocus: 0,
    weekFocus: 0,
    allTimeFocus: 0,
    todayPomodoros: 0,
    weekPomodoros: 0,
    allTimePomodoros: 0,
    streakDays: 3,
    completedCycles: 0
  });

  // Refs
  const timerInterval = useRef<number | null>(null);
  const alarmSound = useRef<HTMLAudioElement | null>(null);

  // Leaderboard data
  const leaderboardData = [
    {
      id: 1,
      name: "Alex Johnson",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&h=120",
      focusHours: 42.5,
      completedPomodoros: 102,
      streak: 14
    },
    {
      id: 2,
      name: "Emma Wilson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&h=120",
      focusHours: 38.2,
      completedPomodoros: 95,
      streak: 10
    },
    {
      id: 3,
      name: "David Chen",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&h=120", 
      focusHours: 36.7,
      completedPomodoros: 89,
      streak: 8
    },
    {
      id: 4,
      name: "Sarah Miller",
      avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&h=120",
      focusHours: 32.5,
      completedPomodoros: 78,
      streak: 6
    },
    {
      id: 5,
      name: "Michael Brown",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&h=120",
      focusHours: 30.8,
      completedPomodoros: 75,
      streak: 5
    }
  ];

  // Initialize audio on mount
  useEffect(() => {
    alarmSound.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, []);

  // Update timer based on mode
  useEffect(() => {
    let duration = 0;
    switch (currentMode) {
      case "focus":
        duration = settings.focusDuration * 60;
        break;
      case "shortBreak":
        duration = settings.shortBreakDuration * 60;
        break;
      case "longBreak":
        duration = settings.longBreakDuration * 60;
        break;
    }
    setTimeLeft(duration);
  }, [currentMode, settings]);

  // Timer countdown logic
  useEffect(() => {
    if (isRunning) {
      timerInterval.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerInterval.current!);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000) as unknown as number;
    } else if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [isRunning]);

  // Handle timer completion
  const handleTimerComplete = () => {
    if (settings.soundNotifications && alarmSound.current) {
      alarmSound.current.play().catch(error => console.error("Error playing sound:", error));
    }

    if (currentMode === "focus") {
      const newCompletedPomodoros = completedPomodoros + 1;
      setCompletedPomodoros(newCompletedPomodoros);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        todayFocus: prev.todayFocus + settings.focusDuration / 60,
        weekFocus: prev.weekFocus + settings.focusDuration / 60,
        allTimeFocus: prev.allTimeFocus + settings.focusDuration / 60,
        todayPomodoros: prev.todayPomodoros + 1,
        weekPomodoros: prev.weekPomodoros + 1,
        allTimePomodoros: prev.allTimePomodoros + 1
      }));

      // Check if it's time for a long break
      if (newCompletedPomodoros % settings.sessionsBeforeLongBreak === 0) {
        setCurrentMode("longBreak");
        setStats(prev => ({ ...prev, completedCycles: prev.completedCycles + 1 }));
      } else {
        setCurrentMode("shortBreak");
      }

      // Auto-start break if enabled
      setIsRunning(settings.autoStartBreaks);
    } else {
      // Break complete, switch to focus mode
      setCurrentMode("focus");
      // Auto-start pomodoro if enabled
      setIsRunning(settings.autoStartPomodoros);
    }
  };

  // Timer controls
  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    
    let duration = 0;
    switch (currentMode) {
      case "focus":
        duration = settings.focusDuration * 60;
        break;
      case "shortBreak":
        duration = settings.shortBreakDuration * 60;
        break;
      case "longBreak":
        duration = settings.longBreakDuration * 60;
        break;
    }
    setTimeLeft(duration);
  };
  
  const skipTimer = () => {
    setIsRunning(false);
    handleTimerComplete();
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Update settings
  const updateSetting = (key: keyof typeof settings, value: number | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Set timer mode
  const switchMode = (mode: "focus" | "shortBreak" | "longBreak") => {
    setIsRunning(false);
    setCurrentMode(mode);
  };
  
  // Calculate progress percentage
  const getProgressPercentage = () => {
    let total = 0;
    switch (currentMode) {
      case "focus":
        total = settings.focusDuration * 60;
        break;
      case "shortBreak":
        total = settings.shortBreakDuration * 60;
        break;
      case "longBreak":
        total = settings.longBreakDuration * 60;
        break;
    }
    
    return 100 - (timeLeft / total * 100);
  };

  // Style based on current mode
  const getModeColor = () => {
    switch (currentMode) {
      case "focus":
        return "text-red-500";
      case "shortBreak":
        return "text-green-500";
      case "longBreak":
        return "text-blue-500";
    }
  };

  const getModeProgressColor = () => {
    switch (currentMode) {
      case "focus":
        return "bg-red-500";
      case "shortBreak":
        return "bg-green-500";
      case "longBreak":
        return "bg-blue-500";
    }
  };

  const getModeName = () => {
    switch (currentMode) {
      case "focus":
        return "Focus Time";
      case "shortBreak":
        return "Short Break";
      case "longBreak":
        return "Long Break";
    }
  };

  const getStatusText = () => {
    if (!isRunning) {
      return currentTask ? `Ready to work on: ${currentTask}` : "Ready to focus";
    }

    switch (currentMode) {
      case "focus":
        return currentTask ? `Focusing on: ${currentTask}` : "Focusing";
      case "shortBreak":
      case "longBreak":
        return "On break";
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-2">Pomodoro Timer</h1>
      <p className="text-muted-foreground mb-6">Boost productivity with focused work sessions</p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="timer">
            <Clock className="h-4 w-4 mr-2" />
            Timer
          </TabsTrigger>
          <TabsTrigger value="stats">
            <ChevronUp className="h-4 w-4 mr-2" />
            Stats
          </TabsTrigger>
          <TabsTrigger value="settings">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="leaderboard">
            <Trophy className="h-4 w-4 mr-2" />
            Leaderboard
          </TabsTrigger>
        </TabsList>

        {/* Timer Tab */}
        <TabsContent value="timer" className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-6">
            <Card className="flex-1">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className={getModeColor()}>{getModeName()}</CardTitle>
                  <div className="flex space-x-2">
                    <Button 
                      variant={currentMode === "focus" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => switchMode("focus")}
                    >
                      Focus
                    </Button>
                    <Button 
                      variant={currentMode === "shortBreak" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => switchMode("shortBreak")}
                    >
                      Short Break
                    </Button>
                    <Button 
                      variant={currentMode === "longBreak" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => switchMode("longBreak")}
                    >
                      Long Break
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  {getStatusText()}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-center">
                  <div className="text-7xl font-semibold my-8 tabular-nums">
                    {formatTime(timeLeft)}
                  </div>
                  <Progress 
                    value={getProgressPercentage()} 
                    className={`h-2 mb-8 ${getModeProgressColor()}`} 
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-center space-x-4">
                {!isRunning ? (
                  <Button onClick={startTimer} size="lg">
                    <Play className="mr-2 h-4 w-4" />
                    Start
                  </Button>
                ) : (
                  <Button onClick={pauseTimer} variant="outline" size="lg">
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </Button>
                )}
                <Button onClick={resetTimer} variant="outline" size="lg">
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button onClick={skipTimer} variant="outline" size="lg">
                  <SkipForward className="mr-2 h-4 w-4" />
                  Skip
                </Button>
              </CardFooter>
            </Card>

            <div className="w-full lg:w-80 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Task</CardTitle>
                  <CardDescription>What are you working on?</CardDescription>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="Enter your task..."
                    value={currentTask}
                    onChange={(e) => setCurrentTask(e.target.value)}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Session Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completed today</span>
                    <span>{stats.todayPomodoros} pomodoros</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Focus time today</span>
                    <span>{stats.todayFocus.toFixed(1)} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current streak</span>
                    <span>{stats.streakDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Until long break</span>
                    <span>{settings.sessionsBeforeLongBreak - (completedPomodoros % settings.sessionsBeforeLongBreak)} sessions</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Today</CardTitle>
                  <div className="bg-muted p-2 rounded-full">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-muted-foreground">Focus time</span>
                  <span className="font-medium">{stats.todayFocus.toFixed(1)} hours</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-muted-foreground">Pomodoros</span>
                  <span className="font-medium">{stats.todayPomodoros}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Average per session</span>
                  <span className="font-medium">
                    {stats.todayPomodoros > 0 
                      ? `${(stats.todayFocus / stats.todayPomodoros).toFixed(1)} hours` 
                      : "0 hours"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>This Week</CardTitle>
                  <div className="bg-muted p-2 rounded-full">
                    <Clock className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-muted-foreground">Focus time</span>
                  <span className="font-medium">{stats.weekFocus.toFixed(1)} hours</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-muted-foreground">Pomodoros</span>
                  <span className="font-medium">{stats.weekPomodoros}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Daily average</span>
                  <span className="font-medium">
                    {(stats.weekFocus / 7).toFixed(1)} hours
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>All Time</CardTitle>
                  <div className="bg-muted p-2 rounded-full">
                    <Trophy className="h-5 w-5 text-amber-500" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-muted-foreground">Total focus time</span>
                  <span className="font-medium">{stats.allTimeFocus.toFixed(1)} hours</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-muted-foreground">Total pomodoros</span>
                  <span className="font-medium">{stats.allTimePomodoros}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Completed cycles</span>
                  <span className="font-medium">{stats.completedCycles}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your Pomodoro sessions from the past week</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Placeholder for a chart that would show activity per day */}
              <div className="h-64 w-full flex items-center justify-center bg-muted/30 rounded-md">
                <p className="text-muted-foreground">Activity chart will appear here as you complete more sessions</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Timer Settings</CardTitle>
              <CardDescription>Customize your Pomodoro timer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="focus-duration">Focus Duration</Label>
                    <span>{settings.focusDuration} minutes</span>
                  </div>
                  <Slider
                    id="focus-duration"
                    min={5}
                    max={60}
                    step={5}
                    value={[settings.focusDuration]}
                    onValueChange={(value: number[]) => updateSetting("focusDuration", value[0])}
                    className="mt-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="short-break">Short Break</Label>
                    <span>{settings.shortBreakDuration} minutes</span>
                  </div>
                  <Slider
                    id="short-break"
                    min={1}
                    max={15}
                    step={1}
                    value={[settings.shortBreakDuration]}
                    onValueChange={(value: number[]) => updateSetting("shortBreakDuration", value[0])}
                    className="mt-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="long-break">Long Break</Label>
                    <span>{settings.longBreakDuration} minutes</span>
                  </div>
                  <Slider
                    id="long-break"
                    min={5}
                    max={30}
                    step={5}
                    value={[settings.longBreakDuration]}
                    onValueChange={(value: number[]) => updateSetting("longBreakDuration", value[0])}
                    className="mt-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="sessions">Sessions Before Long Break</Label>
                    <span>{settings.sessionsBeforeLongBreak} sessions</span>
                  </div>
                  <Slider
                    id="sessions"
                    min={2}
                    max={8}
                    step={1}
                    value={[settings.sessionsBeforeLongBreak]}
                    onValueChange={(value: number[]) => updateSetting("sessionsBeforeLongBreak", value[0])}
                    className="mt-2"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-breaks" className="block">Auto-start Breaks</Label>
                    <p className="text-sm text-muted-foreground">Automatically start breaks after focus session</p>
                  </div>
                  <Switch 
                    id="auto-breaks" 
                    checked={settings.autoStartBreaks} 
                    onCheckedChange={(checked: boolean) => updateSetting("autoStartBreaks", checked)} 
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-pomodoros" className="block">Auto-start Pomodoros</Label>
                    <p className="text-sm text-muted-foreground">Automatically start focus sessions after breaks</p>
                  </div>
                  <Switch 
                    id="auto-pomodoros" 
                    checked={settings.autoStartPomodoros}
                    onCheckedChange={(checked: boolean) => updateSetting("autoStartPomodoros", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sound" className="block">Sound Notifications</Label>
                    <p className="text-sm text-muted-foreground">Play a sound when timer completes</p>
                  </div>
                  <Switch 
                    id="sound" 
                    checked={settings.soundNotifications}
                    onCheckedChange={(checked: boolean) => updateSetting("soundNotifications", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-full md:col-span-2">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      <Trophy className="h-5 w-5 text-amber-500 mr-2" /> Top Focus Champions
                    </CardTitle>
                    <CardDescription>Users with the most focus time this month</CardDescription>
                  </div>
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    May 2025
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboardData.map((user, index) => (
                    <div key={user.id} className="flex items-center p-3 rounded-lg bg-muted/30">
                      <div className="flex-shrink-0 w-6 text-center font-bold">
                        {index === 0 ? <Trophy className="h-5 w-5 text-yellow-500 mx-auto" /> : `${index + 1}`}
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="ml-4 flex-grow">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.completedPomodoros} sessions • {user.streak} day streak
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="font-bold">{user.focusHours} hrs</p>
                        <p className="text-sm text-muted-foreground">Total focus</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Ranking</CardTitle>
                <CardDescription>How you compare to others</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-6 bg-muted/30 rounded-lg text-center">
                  <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-2">
                    <Medal className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">12th</h3>
                  <p className="text-muted-foreground">of 128 users</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Your focus time</span>
                    <span className="font-medium">{stats.allTimeFocus.toFixed(1)} hrs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Top performer</span>
                    <span className="font-medium">{leaderboardData[0].focusHours} hrs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Your streak</span>
                    <span className="font-medium">{stats.streakDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Top streak</span>
                    <span className="font-medium">{leaderboardData[0].streak} days</span>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground text-center text-sm mt-4">
                    Keep up the good work! You need {(leaderboardData[4].focusHours - stats.allTimeFocus).toFixed(1)} more hours to reach top 5.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}