import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Bell, 
  Calendar, 
  Check, 
  Info, 
  MessageSquare, 
  Send, 
  User, 
  Clock,
  Filter,
  SearchIcon,
  RefreshCw,
  AlertTriangle,
  AlarmClock
} from "lucide-react";
import { useState } from "react";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useLanguage } from "../../contexts/LanguageContext";
import { mockNotifications } from "../../data/mockData";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";




const notificationSchema = z.object({
  title_en: z.string().min(3, { message: "Title must be at least 3 characters long" }),
  title_ru: z.string().min(3, { message: "Title must be at least 3 characters long" }),
  message_en: z.string().min(10, { message: "Message must be at least 10 characters long" }),
  message_ru: z.string().min(10, { message: "Message must be at least 10 characters long" }),
  type: z.enum(["info", "success", "warning", "error"]),
  recipient: z.string(),
  schedule: z.enum(["now", "scheduled", "recurring"]),
  scheduleDate: z.string().optional(),
  scheduleTime: z.string().optional(),
  recurringType: z.enum(["daily", "weekly", "monthly"]).optional(),
  recurringValue: z.string().optional(),
  reminderEnabled: z.boolean(),
});

type NotificationFormValues = z.infer<typeof notificationSchema>;

export function NotificationsManagement() {
  const { t, language } = useLanguage();
  const [selectedTab, setSelectedTab] = useState("create");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNotifications, setFilteredNotifications] = useState(mockNotifications);
  const [typeFilter, setTypeFilter] = useState("all");

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title_en: "",
      title_ru: "",
      message_en: "",
      message_ru: "",
      type: "info",
      recipient: "all",
      schedule: "now",
      reminderEnabled: false,
    },
  });

  const watchSchedule = form.watch("schedule");
  const watchRecurringType = form.watch("recurringType");
  const watchReminderEnabled = form.watch("reminderEnabled");

  const onSubmit = (data: NotificationFormValues) => {
    console.log("Notification data:", data);
    // In a real app, this would send the notification
    let successMessage = "Notification sent successfully!";
    
    if (data.schedule === "scheduled") {
      successMessage = `Notification scheduled for ${data.scheduleDate} at ${data.scheduleTime}`;
    } else if (data.schedule === "recurring") {
      successMessage = `Notification set to recur ${data.recurringType} (${data.recurringValue})`;
    }
    
    toast.success(successMessage);
    form.reset();
  };

  // Filter notifications
  const filterAndSearchNotifications = () => {
    return mockNotifications.filter(notification => {
      const matchesSearch = 
        notification.title[language].toLowerCase().includes(searchQuery.toLowerCase()) || 
        notification.message[language].toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = typeFilter === "all" || notification.type === typeFilter;
      
      return matchesSearch && matchesType;
    });
  };

  // Get the notification type icon
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "success":
        return <Check className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  // Get notification type badge variant
  const getNotificationBadgeVariant = (type: string) => {
    switch (type) {
      case "info":
        return "default";
      case "success":
        return "success";
      case "warning":
        return "warning";
      case "error":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1>{t("admin.notifications")}</h1>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full md:w-[600px] grid-cols-3">
          <TabsTrigger value="create">Create Notification</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t("admin.sendNotification")}
              </CardTitle>
              <CardDescription>
                Create and send notifications to users with scheduling options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3>English Content</h3>
                      <FormField
                        control={form.control}
                        name="title_en"
                        render={({ field }: { field: ControllerRenderProps<NotificationFormValues, "title_en"> }) => (
                          <FormItem>
                            <FormLabel>Title (EN)</FormLabel>
                            <FormControl>
                              <Input placeholder="Notification title in English" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message_en"
                        render={({ field }: { field: ControllerRenderProps<NotificationFormValues, "message_en"> }) => (
                          <FormItem>
                            <FormLabel>Message (EN)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Notification message in English" 
                                className="min-h-[120px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <h3>Russian Content</h3>
                      <FormField
                        control={form.control}
                        name="title_ru"
                        render={({ field }: { field: ControllerRenderProps<NotificationFormValues, "title_ru"> }) => (
                          <FormItem>
                            <FormLabel>Title (RU)</FormLabel>
                            <FormControl>
                              <Input placeholder="Заголовок уведомления на русском" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message_ru"
                        render={({ field }: { field: ControllerRenderProps<NotificationFormValues, "message_ru"> }) => (
                          <FormItem>
                            <FormLabel>Message (RU)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Сообщение уведомления на русском" 
                                className="min-h-[120px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }: { field: ControllerRenderProps<NotificationFormValues, "type"> }) => (
                        <FormItem>
                          <FormLabel>Notification Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a notification type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="info">Info</SelectItem>
                              <SelectItem value="success">Success</SelectItem>
                              <SelectItem value="warning">Warning</SelectItem>
                              <SelectItem value="error">Error</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="recipient"
                      render={({ field }: { field: ControllerRenderProps<NotificationFormValues, "recipient"> }) => (
                        <FormItem>
                          <FormLabel>Recipients</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select recipient" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="all">All Users</SelectItem>
                              <SelectItem value="active">Active Users Only</SelectItem>
                              <SelectItem value="inactive">Inactive Users</SelectItem>
                              <SelectItem value="beginners">Beginner Level Users</SelectItem>
                              <SelectItem value="intermediate">Intermediate Level Users</SelectItem>
                              <SelectItem value="advanced">Advanced Level Users</SelectItem>
                              <SelectItem value="user1">Alex Johnson</SelectItem>
                              <SelectItem value="user2">Maria Garcia</SelectItem>
                              <SelectItem value="user3">James Smith</SelectItem>
                              <SelectItem value="user4">Emma Wilson</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="schedule"
                      render={({ field }: { field: ControllerRenderProps<NotificationFormValues, "schedule"> }) => (
                        <FormItem>
                          <FormLabel>Schedule</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select schedule type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="now">Send Now</SelectItem>
                              <SelectItem value="scheduled">Schedule for Later</SelectItem>
                              <SelectItem value="recurring">Recurring Notification</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {watchSchedule === "scheduled" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="scheduleDate"
                        render={({ field }: { field: ControllerRenderProps<NotificationFormValues, "scheduleDate"> }) => (
                          <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="scheduleTime"
                        render={({ field }: { field: ControllerRenderProps<NotificationFormValues, "scheduleTime"> }) => (
                          <FormItem>
                            <FormLabel>Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {watchSchedule === "recurring" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="recurringType"
                        render={({ field }: { field: ControllerRenderProps<NotificationFormValues, "recurringType"> }) => (
                          <FormItem>
                            <FormLabel>Recurrence Type</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select recurrence type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {watchRecurringType === "daily" && (
                        <FormField
                          control={form.control}
                          name="recurringValue"
                          render={({ field }: { field: ControllerRenderProps<NotificationFormValues, "recurringValue"> }) => (
                            <FormItem>
                              <FormLabel>Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      
                      {watchRecurringType === "weekly" && (
                        <FormField
                          control={form.control}
                          name="recurringValue"
                          render={({ field }: { field: ControllerRenderProps<NotificationFormValues, "recurringValue"> }) => (
                            <FormItem>
                              <FormLabel>Day of Week</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select day of week" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="monday">Monday</SelectItem>
                                  <SelectItem value="tuesday">Tuesday</SelectItem>
                                  <SelectItem value="wednesday">Wednesday</SelectItem>
                                  <SelectItem value="thursday">Thursday</SelectItem>
                                  <SelectItem value="friday">Friday</SelectItem>
                                  <SelectItem value="saturday">Saturday</SelectItem>
                                  <SelectItem value="sunday">Sunday</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      
                      {watchRecurringType === "monthly" && (
                        <FormField
                          control={form.control}
                          name="recurringValue"
                          render={({ field }: { field: ControllerRenderProps<NotificationFormValues, "recurringValue"> }) => (
                            <FormItem>
                              <FormLabel>Day of Month</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select day of month" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                    <SelectItem key={day} value={day.toString()}>
                                      {day}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="reminderEnabled"
                    render={({ field }: { field: ControllerRenderProps<NotificationFormValues, "reminderEnabled"> }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Switch 
                            checked={field.value} 
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-0.5">
                          <FormLabel>Enable User Login Reminder</FormLabel>
                          <FormDescription>
                            Show this notification when user logs in
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit" className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      {watchSchedule === "now" 
                        ? "Send Notification" 
                        : watchSchedule === "scheduled" 
                          ? "Schedule Notification" 
                          : "Set Up Recurring Notification"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Scheduled Notifications
              </CardTitle>
              <CardDescription>
                Manage notifications scheduled for future delivery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <AlarmClock className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
                <h3 className="mb-1">No scheduled notifications</h3>
                <p className="text-muted-foreground mb-4">
                  Schedule notifications to be sent at specific times
                </p>
                <Button onClick={() => setSelectedTab("create")}>
                  Schedule a Notification
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Notification History
              </CardTitle>
              <CardDescription>
                View and manage previously sent notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <div className="relative w-full sm:w-80">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search notifications..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8" 
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[180px]">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <span>Filter Type</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="flex items-center gap-2" onClick={() => {
                    setSearchQuery("");
                    setTypeFilter("all");
                  }}>
                    <RefreshCw className="h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {filterAndSearchNotifications().length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No notifications found matching your criteria.</p>
                  </div>
                ) : (
                  filterAndSearchNotifications().map((notification) => (
                    <Card key={notification.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="p-4 border-l-4 flex flex-col md:flex-row justify-between gap-4"
                        style={{ borderLeftColor: 
                          notification.type === 'info' ? 'var(--color-primary)' : 
                          notification.type === 'success' ? 'var(--color-chart-1)' : 
                          notification.type === 'warning' ? 'var(--color-chart-4)' : 
                          'var(--color-destructive)'
                        }}
                      >
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-2">
                            {getNotificationIcon(notification.type)}
                            <h4 className="line-clamp-1">
                              {notification.title[language]}
                            </h4>
                          </div>
                          <p className="text-muted-foreground line-clamp-2">
                            {notification.message[language]}
                          </p>
                        </div>
                        <div className="flex flex-col md:items-end gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Badge variant={getNotificationBadgeVariant(notification.type) as any}>
                              {notification.type}
                            </Badge>
                            <Badge variant="outline">
                              {notification.userId === "all" ? "All users" : "Specific user"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {new Date(notification.createdAt).toLocaleTimeString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {notification.userId === "all" ? "All users" : notification.userId}
                          </div>
                        </div>
                      </div>
                      <div className="bg-muted/10 border-t p-2 flex justify-end">
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground">
                          Send Again
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}